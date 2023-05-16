/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TransformVisitor, utils } from 'visitor-as';
import {
  Expression,
  Parser,
  CallExpression,
  IdentifierExpression,
  FunctionDeclaration,
} from 'assemblyscript/dist/assemblyscript.js';
import { File2ByteArray } from './transformers/file2ByteArray.js';
import { TestTable } from './transformers/testTable.js';
import { MassaExport } from './transformers/massaExport.js';

import { TransformUpdates } from './transformers/interfaces/Update.js';
import { MassaFunctionNode } from './helpers/node.js';

const callTransformers = [new File2ByteArray(), new TestTable()];
const functionTransformers = [new MassaExport()];

/**
 * The `Transformer` class extends the `TransformVisitor` class from visitor-as and overrides its methods to perform
 * custom transformations on the AST during the compilation process.
 * It looks for specific function calls or decorators and replaces them with new expressions
 * or functions as needed.
 */
export class Transformer extends TransformVisitor {
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
      (source) =>
        !source.internalPath.startsWith(`node_modules/`) &&
        !utils.isLibrary(source),
    );
    sources.forEach((source) => {
      TransformUpdates.resetUpdates();
      this.visit(source);
      let actualSource = source;

      for (let transformer of functionTransformers) {
        let content = transformer.updateSource(actualSource);
        if (content !== undefined) {
          let newSources = transformer.getAdditionalSources(
            parser,
            actualSource,
          );
          for (let newSource of newSources) {
            this.program.sources.push(newSource);
          }
          let newParser = new Parser(parser.diagnostics);
          newParser.parseFile(content, actualSource.internalPath + '.ts', true);

          actualSource = newParser.sources.pop()!;
          utils.updateSource(this.program, actualSource);
        }
      }
    });
  }
}
