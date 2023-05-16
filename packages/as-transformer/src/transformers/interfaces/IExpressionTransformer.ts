import {
  CallExpression,
  Expression,
} from 'assemblyscript/dist/assemblyscript.js';

/**
 * The interface to create Expression transformer.
 */
export interface IExpressionTransformer {
  /**
   * This function is the validator to pass the expression to the implemented transformer.
   *
   * @param expression - The string expression to validate
   *
   * @returns true if the expression is to be transformed.
   */
  isMatching(expression: string): boolean;

  /**
   * This method is used to transform {@link CallExpression} by manually setting its result {@link Expression}.
   *
   * @privateRemarks
   * The transformation process involves updating the AST. The new node retains the attributes of the
   * original node, with only the content being updated.
   *
   * @param node - A {@link CallExpression}
   *
   * @returns The updated node as an {@link Expression} that represents the transformed behavior.
   */
  transform(node: CallExpression): Expression;
}
