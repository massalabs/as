import {TransformVisitor, SimpleParser} from 'visitor-as';
import * as fs from 'fs';

class File2ByteArray extends TransformVisitor {
  visitArrayLiteralExpression(node) {
    if (node.expression.text == 'fileToByteArray') {
      // reads file and encodes it to byteArray
      // args is the argument of fileToByteArray function call.
      const data = fs.readFileSync(node.args[0].value);
      // removes the call to include_ByteArr and inserts encoded data.
      const res = SimpleParser.parseExpression(data);
      res.range = node.range;
      return res;
    }
    return super.visitArrayLiteralExpression(node);
  }
  afterParse(parser) {
    for (const source of parser.sources) {
      // Ignore all lib (std lib). Visit everything else.
      if (!source.isLibrary && !source.internalPath.startsWith(`~lib/`)) {
        this.visit(source);
      }
    }
  }
}

export default File2ByteArr;
