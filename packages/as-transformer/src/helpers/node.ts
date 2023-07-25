import {
  FunctionDeclaration,
  IdentifierExpression,
  NamedTypeNode,
} from 'assemblyscript/dist/assemblyscript.js';
import { Argument } from './protobuf.js';
import Debug from 'debug';

export class MassaFunctionNode {
  name: string;
  returnType: string;
  args: Argument[];
  node: FunctionDeclaration | undefined;

  static createFromASTNode(node: FunctionDeclaration) {
    Debug.log('Creating MassaFunctionNode from AST node: ' + node.name.text);
    const name = node.name.text;
    const returnType = (node.signature.returnType as NamedTypeNode).name
      .identifier.text;
    const args = node.signature.parameters.map((arg) => {
      return new Argument(
        arg.name.text,
        (arg.type as NamedTypeNode).name.identifier.text,
        name,
      );
    });

    let newNode = new MassaFunctionNode(name, returnType, args);
    newNode.node = node;
    return newNode;
  }

  constructor(name: string, returnType: string, args: Argument[]) {
    this.name = name;
    this.args = args;
    this.returnType = returnType;
  }
}

// inspired from https://github.com/as-pect/visitor-as/blob/master/src/utils.ts#L35
// TODO: check if it's still needed.
export function hasDecorator(node: FunctionDeclaration, name: string): bool {
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
