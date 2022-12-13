import {
  CallExpression,
  Expression,
  StringLiteralExpression,
} from 'assemblyscript/dist/assemblyscript.js';
import {SimpleParser} from 'visitor-as';
import {RangeTransform} from 'visitor-as/dist/transformRange.js';

import * as fs from 'fs';

export class File2ByteArray {
  static strPattern = 'fileToByteArray';

  static transform(node: CallExpression): Expression {
    let arg0 = node.args[0] as StringLiteralExpression;
    const bytes = JSON.stringify(fs.readFileSync(arg0.value).toJSON().data);
    let res = SimpleParser.parseExpression(bytes);
    res.range = node.range; // same range
    // We need RangeTransform here to keep the attributes of the original node only updating its content
    return RangeTransform.visit(res, node); // replace node
  }
}
