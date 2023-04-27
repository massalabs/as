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

  const protoFile = path.join(protoPath, `${name}.proto`);

  writeFileSync(protoFile, protoContent);

  // generate AS helpers
  if (!existsSync(protoPath)) {
    mkdirSync(protoPath, { recursive: true });
  }

  generateASHelpers(protoFile, asHelpersPath);

  const wrapperContent = generateWrapper(name, args, returnType);

  const imports = generateImports(name, args, returnType);

  Updates.push({
    begin: node.range.start,
    end: node.range.end,
    content: wrapperContent,
    imports: imports,
  });

  return node;
}

export function generateWrapper(
  name: string,
  args: Argument[],
  returnedType: string,
): string {
  const argDecodings = args.map((arg) => `args.${arg.name}`).join(', ');

  let wrapper = `@external("massa", "assembly_script_generate_event")
  declare function generateEvent(event: string): void;
  
  export function ${name}(_args: StaticArray<u8>): ${
    returnedType ? 'StaticArray<u8>' : 'void'
} {\n`;

  if (args.length > 0) {
    wrapper += `  const args = decode${name}(Uint8Array.wrap(changetype<ArrayBuffer>(_args)));\n`;
  }

  if (returnedType) {
    wrapper += `  const response = encode${name}Response(new ${name}Response(_${name}(${
      args.length > 0 ? argDecodings : ''
    })));
  generateEvent(\`${name}Response: \${response}\`);
  return changetype<StaticArray<u8>>(response.buffer);\n`;
  }

  wrapper += '}';

  return wrapper;
}

export function generateImports(
  name: string,
  args: Argument[],
  returnedType: string,
): string[] {
  let imports: string[] = [];

  if (args.length > 0) {
    imports.push(`import { decode${name} } from "./${name}";`);
  }

  if (returnedType) {
    imports.push(
      `import { ${name}Response, encode${name}Response } from "./${name}Response";`,
    );
  }

  return imports;
}

export interface Update {
  begin: number;
  end: number;
  content: string;
  imports: string[];
}

let Updates: Update[] = [];

export function resetUpdates() {
  Updates = [];
}

export function getUpdates(): Update[] {
  return Updates;
}
