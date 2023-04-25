import {
  FunctionDeclaration,
  NamedTypeNode,
} from 'assemblyscript/dist/assemblyscript';
import {
  Argument,
  generateASHelpers,
  generateProtoFile,
} from '../helpers/protobuf.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';

const protoPath = './build';
const asHelpersPath = './build';

export function transform(node: FunctionDeclaration): FunctionDeclaration {
  // extracting function signature from node
  const name = node.name.text;
  const returnType = (node.signature.returnType as NamedTypeNode).name
    .identifier.text;
  const args = node.signature.parameters.map((arg) => {
    return {
      name: arg.name.text,
      type: (arg.type as NamedTypeNode).name.identifier.text,
    };
  }) as Argument[];

  // generate proto file
  if (!existsSync(protoPath)) {
    mkdirSync(protoPath, { recursive: true });
  }

  const protoContent = generateProtoFile(name, args, returnType);

  const protoFile = path.join(protoPath, name);

  writeFileSync(protoFile, protoContent);

  // generate AS helpers
  if (!existsSync(protoPath)) {
    mkdirSync(protoPath, { recursive: true });
  }

  generateASHelpers(protoFile, asHelpersPath);

  return node;
}
