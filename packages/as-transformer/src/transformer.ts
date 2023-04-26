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
import { getUpdates, resetUpdates, transform } from './transformers/massaExport.js';
import { writeFileSync } from 'fs';

const callTransformers = [File2ByteArray, TestTable];

const protobufTransformerDecorator = 'massaExport';

export class Transformer extends TransformVisitor {
  visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
    if (utils.hasDecorator(node, protobufTransformerDecorator)) {
      return transform(node);
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

    sources.forEach(
      source => {

        resetUpdates();
        this.visit(source);

        let content = source.text;
    
        const updates = getUpdates();

        if(updates.length > 0) {
        //TODO: add additional imports

        updates.forEach(update => {
          content = content.substring(0, update.begin) + update.content + content.substring(update.end);
        })
        
        writeFileSync(`./build/${source.simplePath}.ts`, content);
        
         // loadUdpatedSource(this.program); TODO: #132
      }
        
    
      }
    )

    // loadUdpatedSource(this.program); TODO: #132
  }
}
