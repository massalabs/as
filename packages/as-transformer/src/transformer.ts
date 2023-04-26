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

const callTransformers = [File2ByteArray, TestTable];

const protobufTransformerDecorator = 'massaExport';

/**
 * The Transformer class allows you to parse the {@link CallExpression} to look for a specific method and
 * update it as you need.
 */
export class Transformer extends TransformVisitor {
  visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
    if (utils.hasDecorator(node, protobufTransformerDecorator)) {
      return transform(node);
    }

    return super.visitFunctionDeclaration(node);
  }

  /**
   * Looks for a given **call expression** in the AST Nodes and tries to replace it with the new
   * **expression** node with the registered custom transformers.
   *
   * @param node - A {@link CallExpression} containing a call to a function.
   * @returns The updated node as {@link Expression} if the method is found, otherwise the original node.
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
   * Visits the sources and replaces the {@link CallExpression} with the new expression.
   *
   * @privateRemarks
   * This is one of the three transformer hooks as defined
   * [here](https://www.assemblyscript.org/compiler.html#transforms). It is the first one,
   * called just after parsing the cod
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

          if (index < token.length)
            throw new Error(
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

        writeFileSync(`./build/${source.simplePath}.ts`, content);

        // loadUdpatedSource(this.program); TODO: #132
      }
    });
    // loadUdpatedSource(this.program); TODO: #132
  }
}
