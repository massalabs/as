import {
  CallExpression,
  Expression,
  StringLiteralExpression,
} from 'assemblyscript/dist/assemblyscript.js';
import { RangeTransform } from 'visitor-as/dist/transformRange.js';
import { SimpleParser } from 'visitor-as';

import * as fs from 'fs';

/**
 * The File2ByteArray is a specific transformer that works by replacing a 'fileToByteArray'
 * {@link CallExpression} with an {@link Expression} that represents the file content as a byte array.
 *
 */
export class File2ByteArray {
  static strPattern = 'fileToByteArray';

  /**
   * This method takes a {@link CallExpression} and transforms it by:
   *
   * - Replacing the node containing a call to the 'fileToByteArray' function, which has a file as an argument
   * - Inserting a new node that contains an array of bytes, which represents the content of the file given as argument
   *
   * @privateRemarks
   * The transformation process involves updating the AST. The new node retains the attributes of the
   * original node, with only the content being updated.
   *
   * @param node - A {@link CallExpression}
   *
   * @returns The updated node as an {@link Expression} that represents the file content as a byte array.
   */
  static transform(node: CallExpression): Expression {
    let arg0 = node.args[0] as StringLiteralExpression;
    const bytes = JSON.stringify(fs.readFileSync(arg0.value).toJSON().data);
    let res = SimpleParser.parseExpression(bytes);
    res.range = node.range; // same range
    // We need RangeTransform here to keep the attributes of the original node only updating its content
    return RangeTransform.visit(res, node); // replace node
  }
}
