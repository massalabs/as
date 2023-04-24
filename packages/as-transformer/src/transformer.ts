import { TransformVisitor, utils } from 'visitor-as';
import {
  Expression,
  Parser,
  CallExpression,
  IdentifierExpression,
  FunctionDeclaration,
} from 'assemblyscript/dist/assemblyscript.js';
import { File2ByteArray } from './transformers/file2ByteArray.js';
import { TestTable } from './transformers/testTable.js';

const callTransformers = [File2ByteArray, TestTable];

const protobufTransformerDecorator = 'exportUsingPB';

export class Transformer extends TransformVisitor {
  visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
    if (utils.hasDecorator(node, protobufTransformerDecorator)) {
      console.log(node.name.text);
      // generateProtoFile(); TODO: #109
      // generateProtoHelpers(); TODO: #164
      // generateWrappingFunction(); TODO: #114
    }

    return super.visitFunctionDeclaration(node);
  }

  visitCallExpression(node: CallExpression): Expression {
    const inputText = (node.expression as IdentifierExpression)?.text;

    for (let transformer of callTransformers) {
      if (inputText == transformer.strPattern) {
        return transformer.transform(node);
      }
    }

    return super.visitCallExpression(node);
  }

  afterParse(parser: Parser): void {
    let sources = parser.sources.filter(
      (source) =>
        !source.internalPath.startsWith(`node_modules/`) &&
        !utils.isLibrary(source),
    );

    // loadUdpatedSource(this.program); TODO: #132

    this.visit(sources);
  }
}
