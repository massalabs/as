import {TransformVisitor, SimpleParser} from 'visitor-as';
import * as fs from 'fs';

class File2Base64 extends TransformVisitor {
  visitCallExpression(node) {
    if (node.expression.text == 'fileToBase64') {
      // reads file and encodes it in base64
      // args is the argument of fileToBase64 function call.
      const data = fs.readFileSync(node.args[0].value).toString('base64');
      // removes the call to include_base64 and inserts encoded data.
      const res = SimpleParser.parseExpression('"' + data + '"');
      res.range = node.range;
      return res;
    }
    return super.visitCallExpression(node);
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

export default File2Base64;
