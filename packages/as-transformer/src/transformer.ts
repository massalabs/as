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
import {
  getUpdates,
  resetUpdates,
  transform,
} from './transformers/massaExport.js';
import { writeFileSync } from 'fs';
import { getDependencies } from './helpers/typescript.js';
import { hasDecorator, parseFile } from './helpers/node.js';

const callTransformers = [File2ByteArray, TestTable];

const protobufTransformerDecorator = 'massaExport';

/**
 * The `Transformer` class extends the `TransformVisitor` class from visitor-as and overrides its methods to perform
 * custom transformations on the AST during the compilation process.
 * It looks for specific function calls or decorators and replaces them with new expressions
 * or functions as needed.
 */
export class Transformer extends TransformVisitor {
  visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
    if (hasDecorator(node, protobufTransformerDecorator)) {
      return transform(node);
    }

    return super.visitFunctionDeclaration(node);
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
      if (inputText == transformer.strPattern) {
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

    let additionalImports = new Map<string, boolean>();

    sources.forEach((source) => {
      resetUpdates();
      this.visit(source);

      let content = source.text;
      let neededImports = new Map<string, boolean>();

      const updates = getUpdates();

      if (updates.length > 0) {
        updates.forEach((update) => {
          const token = 'export function ';
          const index = content.indexOf(token, update.begin) + token.length;

          assert(
            index >= token.length,
            `exported function not found in file ${source.internalPath}` +
              `, but decorator ${protobufTransformerDecorator} was.`,
          );

          content =
            content.substring(0, update.begin) +
            'function _' +
            content.substring(index, update.end) +
            '\n\n' +
            update.content +
            content.substring(update.end);

          update.imports.forEach((i) => {
            neededImports.set(i, true);
            additionalImports.set(i, true);
          });
        });

        content = '\n' + content;

        Array.from(neededImports.keys()).forEach(
          (i) => (content = i + '\n' + content),
        );
        const depsFilter = Array.from(
          Array.from(neededImports.keys()).map((elem) => {
            let splitted = elem.split('from ".');
            if (splitted.length > 1 && splitted[1])
              return 'build' + splitted[1].replace('";', '');
            return elem;
          }),
        );

        writeFileSync(`./build/${source.simplePath}.ts`, content);

        const dependencies = getDependencies(`./build/${source.simplePath}.ts`);

        // console.log(dependencies);

        dependencies
          .filter(
            (dep) =>
              dep.includes('as-proto') ||
              depsFilter.some((filter) => dep.includes(filter)),
          )
          .map((dep) =>
            parseFile(
              dep,
              new Parser(parser.diagnostics),
              source.internalPath.replace(source.simplePath, ''),
            ),
          )
          .forEach((source) => this.program.sources.push(source));

        let newParser = new Parser(parser.diagnostics);
        newParser.parseFile(content, source.internalPath + '.ts', true);

        let newSource = newParser.sources.pop()!;
        utils.updateSource(this.program, newSource);
      }
      // this.program.sources.forEach(source =>
      //   console.log(source.internalPath, source.simplePath, source.normalizedPath))
    });
  }
}
