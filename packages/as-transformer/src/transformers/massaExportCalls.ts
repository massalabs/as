/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CallExpression,
  Expression,
} from 'assemblyscript/dist/assemblyscript.js';
import { RangeTransform } from 'visitor-as/dist/transformRange.js';
import { SimpleParser } from 'visitor-as/dist/index.js';
import {
  IdentifierExpression,
  StringLiteralExpression,
} from 'types:assemblyscript/src/ast';
import { Update, GlobalUpdates } from './interfaces/Update.js';
import * as Debug from 'debug';

// import { IExpressionTransformer } from './interfaces/IExpressionTransformer';

/**
 * The MassaExportCalls is a specific transformer that works by replacing a any massa exported function calls
 * by their transformed version.
 */
export class MassaExportCalls {
  isMatching(expression: string): boolean {
    const calls = GlobalUpdates.get()
      .filter((update: Update) => update.getFrom() === 'MassaExport')
      .map((update: Update) =>
        update.getData().get('funcToPrivate') !== undefined
          ? update.getData().get('funcToPrivate')![0]
          : '',
      );
    return calls.includes(expression);
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
    const args = getArgs(node);
    const expr = `_ms_${functionName}_(${args})\n`;

    let res = SimpleParser.parseExpression(expr);
    res.range = node.range;
    Debug.log(
      "MassaExport Function Call: New call expression => '" + expr + "'",
    );
    return RangeTransform.visit(res, node); // replace node
  }
}

function getArgs(node: CallExpression): string {
  return node.args
    .map((arg) => {
      // if argument is a variable
      if ((arg as IdentifierExpression).text !== undefined)
        return (arg as IdentifierExpression).text;

      // if argument is a value
      let value = arg as StringLiteralExpression;

      // if argument value is a number
      if (value.isNumericLiteral) return value.value;

      // if argument value is a string
      return '"' + value.value + '"';
    })
    .join(', ');
}
