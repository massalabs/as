/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TransformVisitor, utils } from 'visitor-as';
import {
  Expression,
  Parser,
  CallExpression,
  IdentifierExpression,
  FunctionDeclaration,
  Source,
  ImportStatement,
} from 'assemblyscript/dist/assemblyscript.js';
import { File2ByteArray } from './transformers/file2ByteArray.js';
import { TestTable } from './transformers/testTable.js';
import { MassaExport } from './transformers/massaExport.js';

import { MassaFunctionNode } from './helpers/node.js';
import { parseFile } from './helpers/source.js';
import { MassaExportCalls } from './transformers/massaExportCalls.js';
import { GlobalUpdates, Update } from './transformers/interfaces/Update.js';
import { MassaExportImports } from './transformers/massaExportImports.js';

const callTransformers = [
  new File2ByteArray(),
  new TestTable(),
  new MassaExportCalls(),
];
const functionTransformers = [new MassaExport()];

const importTransformers = [new MassaExportImports()];

/**
 * The `Transformer` class extends the `TransformVisitor` class from visitor-as and overrides its methods to perform
 * custom transformations on the AST during the compilation process.
 * It looks for specific function calls or decorators and replaces them with new expressions
 * or functions as needed.
 */
export class Transformer extends TransformVisitor {
  /*
   * TODO: implement import transformers
   */
  visitImportStatement(node: ImportStatement): ImportStatement {
    if (!node.declarations) return node;
    for (let transformer of importTransformers) {
      if (
        node.declarations!.filter(
          (decl) =>
            transformer.isMatching(decl.foreignName.text) ||
            transformer.isMatching(decl.name.text),
        ).length > 0
      ) {
        node = transformer.transform(node);
      }
    }
    return super.visitImportStatement(node);
  }

  /**
   * Visits function declarations and calls transformers if their matching patterns are passing on the node.
   *
   * @param node - A {@link FunctionDeclaration} node to visit.
   *
   * @returns The transformer node.
   */
  visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
    let massaNode = MassaFunctionNode.createFromASTNode(node);

    for (let transformer of functionTransformers) {
      if (transformer.isMatching(massaNode))
        node = transformer.transform(massaNode);
      massaNode = MassaFunctionNode.createFromASTNode(node);
    }
    return super.visitFunctionDeclaration(massaNode.node!);
  }

  /**
   * Visits a call expression node, checks if it matches any registered transformer patterns
   * from {@link callTransformers}, and if so, transforms it.
   *
   * @param node - A {@link CallExpression} to visit.
   *
   * @returns The transformed node if its call expression matches a transformer pattern, otherwise
   * the original node.
   */
  visitCallExpression(node: CallExpression): Expression {
    const inputText = (node.expression as IdentifierExpression)?.text;

    for (let transformer of callTransformers) {
      if (transformer.isMatching(inputText)) {
        return transformer.transform(node);
      }
    }

    return super.visitCallExpression(node);
  }

  /**
   * Updates the given source file with the given new content content.
   *
   * @param oldSource - The old source file to be updates
   * @param newContent - The new file content for the source file
   * @param parser - The parser of the {@link afterParse} hook
   *
   * @returns The updated source.
   */
  private _updateSource(
    oldSource: Source,
    newContent: string,
    parser: Parser,
  ): Source {
    let newParser = new Parser(parser.diagnostics);
    for (let diag of newParser.diagnostics) {
      console.error('Massa Transform error: ' + diag.message);
    }
    assert(
      parser.diagnostics.length <= 0,
      'There were some errors with the parsing of new sources in as-transformer (see above).',
    );
    console.log('Updating source: ' + oldSource.internalPath);
    newParser.parseFile(newContent!, oldSource.internalPath + '.ts', true);

    let newSource = newParser.sources.pop()!;
    console.log('New source: ' + newSource.internalPath);
    utils.updateSource(this.program, newSource);
    // console.log("AS-TRM: updated source: '" + newSource.internalPath + "'");
    return newSource;
  }

  /**
   * Updates the whole program source dependencies added by the given transformer.
   *
   * @param transformer - The transformer that adds sources to the project.
   * @param source - The source file that requires new dependencies.
   * @param parser - The parser of the {@link afterParse} hook
   */
  private _addDependencies(
    transformer: MassaExport,
    source: Source,
    parser: Parser,
    dir: string,
  ) {
    // Fetching eventual additional sources
    let newSources = transformer.getAdditionalSources(source, dir);

    // Parsing and pushing additional sources for compilation
    for (let newSource of newSources) {
      if (
        GlobalUpdates.get().filter(
          (update) =>
            update.from === 'as-trm-deps' && update.content === newSource,
        ).length > 0
      )
        continue;
      console.log("Adding source: '" + newSource + "'");
      this.program.sources.push(
        parseFile(
          newSource,
          new Parser(parser.diagnostics),
          source.internalPath.replace(source.simplePath, ''),
        ),
      );
      GlobalUpdates.add({
        content: newSource,
        data: new Map(),
        from: 'as-trm-deps',
      });
    }
  }

  postVisiting(sources: Source[], updatedSources: Source[]) {
    sources = sources.filter(
      // Fetching only project parsed sources (AST Tree for each file)
      (source) =>
        !source.internalPath.startsWith(`node_modules/`) &&
        !utils.isLibrary(source) &&
        GlobalUpdates.get().filter(
          (update) =>
            update.from === 'MassaExport' &&
            source.internalPath.includes(
              update.data.get('funcToPrivate')![0] + 'Wrapper',
            ),
        ).length <= 0 &&
        !source.internalPath.includes('build/') &&
        updatedSources.filter((updated) =>
          source.internalPath.includes(updated.simplePath),
        ).length <= 0,
    );
    console.log('Post Update Transformations:\n');
    sources.forEach((subsource) => {
      console.log('Visiting: ' + subsource.internalPath);
      this.visit(subsource);
    });
    updatedSources.forEach((subsource) => {
      console.log('Visiting Updated source: ' + subsource.internalPath);
      this.visit(subsource);
    });
  }

  /**
   * Performs transformations on the AST after the parser completes.
   * It visits each source file, checks for updates, performs transformations, and writes the transformed code
   * to a new file in the build directory.
   *
   * @privateRemarks
   * This is one of the three transformer hooks as defined
   * [here](https://www.assemblyscript.org/compiler.html#transforms). It is the first one,
   * called just after parsing the code.
   *
   * @param parser - A {@link Parser} object.
   */
  afterParse(parser: Parser): void {
    let sources = parser.sources.filter(
      // Fetching only project parsed sources (AST Tree for each file)
      (source) => {
        return (
          !source.internalPath.startsWith(`node_modules/`) &&
          !utils.isLibrary(source) &&
          GlobalUpdates.get().filter(
            (update) =>
              (update.from === 'MassaExport' &&
                (source.internalPath.includes(
                  update.data.get('funcToPrivate')![0] + 'Helper',
                ) ||
                  source.internalPath.includes(
                    update.data.get('funcToPrivate')![0] + 'RHelper',
                  ))) ||
              (update.from === 'as-transformer' &&
                source.internalPath.includes(update.content)),
          ).length <= 0 &&
          !source.internalPath.includes('build/')
        );
      },
    );
    let updatedSources: Source[] = [];

    if (sources.length <= 0) return;
    sources.forEach((source) => {
      console.log(
        '---------------------------------------------------------------------------------',
      );
      console.log('Transforming source: ' + source.internalPath + '\n');
      this.visit(source); // visiting AST Tree nodes and calling transformers
      let actualSource = source;
      let dir = source.internalPath.replace('assembly/contracts/', '');

      // Post-transform sources updates
      for (let transformer of functionTransformers) {
        if (!transformer.hasUpdates()) continue;
        // Fetching eventual source update
        let newContent = transformer.updateSource(actualSource, dir);

        // Updating dependencies
        this._addDependencies(transformer, actualSource, parser, dir);

        // Updating original file source
        actualSource = this._updateSource(actualSource, newContent, parser);
        updatedSources.push(source);
        transformer.resetUpdates();
        // this.visit(actualSource);
      }
      const update: Update = {
        content: actualSource.simplePath,
        data: new Map(),
        from: 'as-transformer',
      };
      GlobalUpdates.add(update);

      console.log(
        '\nFinished transforming source: ' + actualSource.internalPath,
      );
      console.log(
        '---------------------------------------------------------------------------------\n\n',
      );
    });
    this.postVisiting(sources, updatedSources);
  }
}
