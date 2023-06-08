/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IdentifierExpression,
  ImportDeclaration,
  ImportStatement,
} from 'assemblyscript/dist/assemblyscript.js';
import { Update, GlobalUpdates } from './interfaces/Update.js';
// import { IExpressionTransformer } from './interfaces/IExpressionTransformer';

/**
 * The MassaExportImports is a specific transformer that works by replacing a any massa exported function imports
 * by their transformed version.
 */
export class MassaExportImports {
  isMatching(expression: string): boolean {
    const calls = GlobalUpdates.get()
      .filter((update: Update) => update.from === 'MassaExport')
      .map((update: Update) =>
        update.data.get('funcToPrivate')
          ? update.data.get('funcToPrivate')![0]
          : '',
      );
    return calls.includes(expression);
  }

  /**
   * This method takes a {@link ImportStatement} and replaces imports of massaExported functions with their
   * transformed version ('func' to '_ms_func_')
   *
   * @privateRemarks
   * The transformation process involves updating the AST. The new node retains the attributes of the
   * original node, with only the content being updated.
   *
   * @param node - A {@link ImportStatement}
   *
   * @returns The updated node as an {@link ImportStatement} that represents the updated imports.
   */
  transform(node: ImportStatement): ImportStatement {
    console.log('MassaExport Imports: updating exported imports ...');
    let declarations: ImportDeclaration[] = [];

    for (let decl of node.declarations!) {
      if (
        this.isMatching(decl.name.text) ||
        this.isMatching(decl.foreignName.text)
      ) {
        declarations.push(this.getDeclaration(decl));
      } else {
        declarations.push(decl);
      }
    }
    node.declarations = declarations;
    // node.internalPath = node.internalPath.replace('assembly/contracts/', 'build/');
    return node;
  }

  getDeclaration(node: ImportDeclaration): ImportDeclaration {
    let id = new IdentifierExpression(
      '_ms_' + node.name.text + '_',
      false,
      node.range,
    );
    console.log(
      "MassaExport Imports: from '" + node.name.text + "' to '" + id.text + "'",
    );
    return ImportDeclaration.createImportDeclaration(id, id, node.range);
  }
}
