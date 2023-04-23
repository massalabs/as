import {
  FunctionDeclaration,
  IdentifierExpression,
} from 'assemblyscript/dist/assemblyscript.js';

// inspired from https://github.com/as-pect/visitor-as/blob/master/src/utils.ts#L35
// TODO: open an issue on visitor-as and link it here.
export function hasDecorator(node: FunctionDeclaration, name: string): bool {
  let decl = node;

  if ((node as any)['declaration'] !== undefined) {
    decl = (node as any).declaration;
  }

  return (
    decl.decorators?.some(
      (node) => (<IdentifierExpression>node.name).text === name,
    ) == true
  );
}
