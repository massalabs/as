import {TransformVisitor, utils} from 'visitor-as';
import {
  Expression,
  Parser,
  CallExpression,
  IdentifierExpression,
} from 'assemblyscript/dist/assemblyscript.js';
import {File2ByteArray} from './file2ByteArray.js';
import {TestTable} from './testTable.js';

export class Transformer extends TransformVisitor {
  visitCallExpression(node: CallExpression): Expression {
    const inputText = (node.expression as IdentifierExpression)?.text;
    if (inputText == File2ByteArray.strPattern) {
      return File2ByteArray.transform(node);
    }
    if (inputText == TestTable.strPattern) {
      return TestTable.transform(node);
    }

    return super.visitCallExpression(node);
  }

  afterParse(parser: Parser): void {
    let sources = parser.sources.filter(
      (source) =>
        !source.internalPath.startsWith(`node_modules/`) &&
        !utils.isLibrary(source),
    );

    this.visit(sources);
  }
}
