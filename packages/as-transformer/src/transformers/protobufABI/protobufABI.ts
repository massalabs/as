import { DeclarationStatement, FunctionDeclaration, LiteralKind, NamedTypeNode, StringLiteralExpression } from 'assemblyscript/dist/assemblyscript';
import { utils } from 'visitor-as';
import { generateProtoFile } from './generateProtoFile.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { spawnSync } from 'child_process';
import { join } from 'path';

export interface Argument {
  name: string;
  type: string;
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getName(node: DeclarationStatement): string {
    let decorator = utils.getDecorator(node, "exportAs");
    if (decorator.args == null) {
      throw Error("exportAs expects a string argument but got null.");
    }
    if (decorator.args.length != 1) {
      throw Error(`exportAs expects 1 argument but got ${decorator.args.length}`);
    }
    if (!decorator.args[0]?.isLiteralKind(LiteralKind.String)) {
      throw Error("exportAs expects a string argument");
    }
    return (decorator.args[0] as StringLiteralExpression).value;
  }

/**
 * ExportAs transformer
 */
export class ExportAs {
    /**
     *
     * @param node -
     */
    static transformFunction(node: FunctionDeclaration): FunctionDeclaration {

        const newName = getName(node);
        //const currentName = node.name.text;
        const returnedValueType = (node.signature.returnType as NamedTypeNode).name.identifier.text;
        const functionArguments = node.signature.parameters.map((arg) => {
            return {"name": arg.name.text, "type": (arg.type as NamedTypeNode).name.identifier.text};
    }) as Argument[];

    const protoFileContent = generateProtoFile(newName, functionArguments, returnedValueType);

    console.log(protoFileContent);

    const protoDirectoryPath = join(process.cwd(), 'proto');
    const protoFilePath = join(protoDirectoryPath, `${newName}.proto`);

    if (!existsSync(protoDirectoryPath)) {
      mkdirSync(protoDirectoryPath, { recursive: true });
    }

    // Write the Proto file to disk
    writeFileSync(protoFilePath, protoFileContent);
  
    // Execute the command to generate code
    const protocProcess = spawnSync("protoc", [
      `--plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen`,
      `--as_out=./packages/as-transformer/assembly/__tests__`,
      `--as_opt=gen-helper-methods`,
      `--proto_path=${protoDirectoryPath}`,
      `${newName}.proto`
    ]);
    if (protocProcess.status !== 0) {
      console.error(`Failed to generate code for ${newName}`);
      console.error(protocProcess.stderr.toString());
    }

        
        return node;
    }
  }
  