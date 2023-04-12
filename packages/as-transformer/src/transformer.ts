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

export class Transformer extends TransformVisitor {
  visitCallExpression(node: CallExpression): Expression {
    const inputText = (node.expression as IdentifierExpression)?.text;

    for (let transformer of callTransformers) {
      if (inputText == transformer.strPattern) {
        return transformer.transform(node);
      }
    }

    return super.visitCallExpression(node);
  }

  visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
    if (utils.hasDecorator(node, 'exportAs')) {
      console.log(node);
      // console.log(node.signature.returnType.kind);
      // console.log("nom", node.signature.parameters[0].name.text);
      // console.log("type", node.signature.parameters[0].type.kind);
      // node.signature.parameters[0].is
    }

    return super.visitFunctionDeclaration(node);
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
