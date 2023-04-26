import {
  CallExpression,
  Expression,
  StringLiteralExpression,
} from 'assemblyscript/dist/assemblyscript.js';
import { RangeTransform } from 'visitor-as/dist/transformRange.js';
import { SimpleParser } from 'visitor-as';

import * as fs from 'fs';

/**
 * The File2ByteArray transformer object allows to transform writes a function call which aims to transform
 * an ast into a byteArray.
 *
 */
export class File2ByteArray {
  static strPattern = 'fileToByteArray';

  /**
   * Transforms a 'fileToByteArray'  {@link CallExpression} into an {@link Expression} to
   * extract the file as a byte array.
   *
   * @privateRemarks
   * This transformer is updating the AST by:
   * - replacing the node containing a call to the fileToByteArray function having a file as argument
   * - a node containing an array of bytes corresponding to the content of the file given as argument.
   *
   * @param node - A {@link CallExpression}
   *
   * @returns the updated node as {@link Expression}
   *
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
