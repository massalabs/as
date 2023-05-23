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
// import { IExpressionTransformer } from './interfaces/IExpressionTransformer';

/**
 * The MassaExportCalls is a specific transformer that works by replacing a any massa exported function calls
 * by their transformed version.
 */
export class MassaExportCalls {
  static calls: string[] = [];

  isMatching(expression: string): boolean {
    return MassaExportCalls.calls.includes(expression);
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
    const args = node.args.map(
      (arg) =>
        undefined !== (arg as IdentifierExpression).text
          ? (arg as IdentifierExpression).text // if argument is a variable
          : (arg as StringLiteralExpression).value, // if argument is a value
    );

    let expr = '_' + functionName + '(';
    expr += args.length > 0 ? args.join(', ') : '';
    expr += ');\n';

    let res = SimpleParser.parseExpression(expr);
    res.range = node.range;
    return RangeTransform.visit(res, node); // replace node
  }
}
