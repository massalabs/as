import {
  CallExpression,
  Expression,
  StringLiteralExpression,
} from 'assemblyscript/dist/assemblyscript.js';
import {SimpleParser} from 'visitor-as';

import * as fs from 'fs';

export class File2ByteArray {
  static strPattern = 'fileToByteArray';

  static transform(node: CallExpression): Expression {
    let arg0 = node.args[0] as StringLiteralExpression;
    const bytes = JSON.stringify(fs.readFileSync(arg0.value).toJSON().data);
    let res = SimpleParser.parseExpression(bytes);
    res.range = node.range; // same range
    return res; // replace node
  }
}
