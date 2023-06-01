/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CallExpression,
  Expression,
} from 'assemblyscript/dist/assemblyscript.js';
import { RangeTransform } from 'visitor-as/dist/transformRange.js';
import { SimpleParser } from 'visitor-as';
import {
  IdentifierExpression,
  StringLiteralExpression,
} from 'types:assemblyscript/src/ast';
import { Update, GlobalUpdates } from './interfaces/Update.js';
// import { IExpressionTransformer } from './interfaces/IExpressionTransformer';

/**
 * The MassaExportCalls is a specific transformer that works by replacing a any massa exported function calls
 * by their transformed version.
 */
export class MassaExportCalls {
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

  private _getArgs(node: CallExpression): string {
    return node.args
      .map((arg) => {
        if ((arg as IdentifierExpression).text !== undefined) {
          return (arg as IdentifierExpression).text; // if argument is a variable
        }
        let value = arg as StringLiteralExpression; // if argument is a value
        console.log(`Arg is: ${value.kind.toString()}, ${value.value}`);
        if (value.isNumericLiteral) return value.value; // if argument is a number
        return '"' + value.value + '"'; // if argument is a string
      })
      .join(', ');
  }

  /**
   * This method takes a {@link CallExpression} and transforms it by
   * replacing the node containing a call to the massa exported function found
   * with an underscored version.
   *
   * @privateRemarks
   * The transformation process involves updating the AST. The new node retains the attributes of the
   * original node, with only the content being updated.
   *
   * @param node - A {@link CallExpression}
   *
   * @returns The updated node as an {@link Expression} that represents the updated call.
   */
  transform(node: CallExpression): Expression {
    const functionName = (node.expression as IdentifierExpression).text;
    const args = this._getArgs(node);
    const expr = `_ms_${functionName}_(${args})\n`;

    let res = SimpleParser.parseExpression(expr);
    res.range = node.range;
    /*
    console.log(
      "MassaExport Function Call: New call expression => '" + expr + "'",
    );
    */
    return RangeTransform.visit(res, node); // replace node
  }
}
