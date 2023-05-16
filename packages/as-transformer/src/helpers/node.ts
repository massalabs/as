import {
  FunctionDeclaration,
  IdentifierExpression,
  NamedTypeNode,
  Parser,
  Source,
} from 'assemblyscript/dist/assemblyscript.js';
import { readFileSync } from 'fs';
import { Argument } from './protobuf';

export class MassaFunctionNode {
  name: string;
  returnType: string;
  args: Argument[];
  node: FunctionDeclaration | undefined;

  static createFromASTNode(node: FunctionDeclaration) {
    const name = node.name.text;
    const returnType = (node.signature.returnType as NamedTypeNode).name
      .identifier.text;
    const args = node.signature.parameters.map((arg) => {
      return {
        name: arg.name.text,
        type: (arg.type as NamedTypeNode).name.identifier.text,
      };
    }) as Argument[];

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

export function parseFile(
  filePath: string,
  parser: Parser,
  subDir: string,
): Source {
  const nodeModulesIndex = filePath.indexOf('node_modules/');
  let newParser = new Parser(parser.diagnostics);

  if (nodeModulesIndex > -1) {
    const shortFilePath = filePath.replace(/.*node_modules/i, '~lib');
    newParser.parseFile(readFileSync(filePath, 'utf-8'), shortFilePath, false);
  } else {
    const shortFilePath = filePath.replace(process.cwd() + '/', '');
    newParser.parseFile(
      readFileSync(shortFilePath, 'utf-8'),
      shortFilePath.replace('build/', subDir),
      false,
    );
  }

  const src = newParser.sources.pop();

  assert(
    src !== undefined,
    `Source is undefined after parsing file ${filePath}`,
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return src!;
}
