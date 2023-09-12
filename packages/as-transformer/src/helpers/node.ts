import {
  FunctionDeclaration,
  IdentifierExpression,
  TypeNode,
} from 'assemblyscript';

import { Argument } from './protobuf.js';
// eslint-disable-next-line
// @ts-ignore
import { debug } from 'console';

export class MassaFunctionNode {
  name: string;
  returnNode: TypeNode;
  args: Argument[];
  node: FunctionDeclaration | undefined;

  static createFromASTNode(node: FunctionDeclaration): MassaFunctionNode {
    if (!node) {
      throw new Error('Node FunctionDeclaration is undefined');
    }
    // debug('Creating MassaFunctionNode from AST node: ' + node.name.text);
    const name = node.name.text;
    const returnNode = node.signature.returnType;
    const args = node.signature.parameters.map((arg) => {
      return new Argument(arg.name.text, name, arg.type);
    });

    let newNode = new MassaFunctionNode(name, returnNode, args);
    newNode.node = node;
    return newNode;
  }

  constructor(name: string, returnNode: TypeNode, args: Argument[]) {
    this.name = name;
    this.args = args;
    this.returnNode = returnNode;
  }
}

// inspired from https://github.com/as-pect/visitor-as/blob/master/src/utils.ts#L35
// TODO: check if it's still needed.
export function hasDecorator(node: FunctionDeclaration, name: string): boolean {
  let decl = node;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((node as any)['declaration'] !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decl = (node as any).declaration;
  }

  return (
    decl.decorators?.some(
      (node) => (<IdentifierExpression>node.name).text === name,
    ) == true
  );
}
