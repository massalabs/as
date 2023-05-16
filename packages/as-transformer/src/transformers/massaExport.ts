/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  FunctionDeclaration,
  NamedTypeNode,
  Parser,
  Source,
} from 'assemblyscript/dist/assemblyscript.js';

import {
  Argument,
  generateASHelpers,
  generateProtoFile,
} from '../helpers/protobuf.js';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { IFunctionTransformer } from './interfaces/IFunctionTransformer.js';
import { TransformUpdates, Update } from './interfaces/Update.js';
import { hasDecorator, parseFile } from '../helpers/node.js';
import { getDependencies } from '../helpers/typescript.js';

const protoPath = './build';
const asHelpersPath = './build';

export class MassaExport implements IFunctionTransformer {
  functionName = '';
  returnType: string | undefined = undefined;
  args: Argument[] = [];

  private _setFunctionSignatureData(node: FunctionDeclaration) {
    this.functionName = node.name.text;
    this.returnType = (
      node.signature.returnType as NamedTypeNode
    ).name.identifier.text;
    this.args = node.signature.parameters.map((arg) => {
      return {
        name: arg.name.text,
        type: (arg.type as NamedTypeNode).name.identifier.text,
      };
    }) as Argument[];
  }

  private _resetFunctionSignatureData() {
    this.functionName = '';
    this.returnType = undefined;
    this.args = [];
  }

  isMatching(node: FunctionDeclaration): boolean {
    return hasDecorator(node, 'massaExport');
  }

  /**
   * The Massa Export transformer is responsible to export smart contract functions to make them usable
   * remotely using their signatures (instead of doing a massa-as-sdk 'call' manually).
   *
   * @remarks
   * It achieves this by parsing the smart contracts and generating the protobuf files and the AS helpers.
   * It allows specific contract interactions and automatic serialization/deserialization of the data.
   * It doesn't change the smart contract AST, it only generates the protobuf files and the AS helpers in
   * a build directory.
   *
   * @param node - The AST {@link FunctionDeclaration} node containing the function to export.
   *
   * @returns The unchanged node.
   */
  transform(node: FunctionDeclaration): FunctionDeclaration {
    // extracting function signature from node
    this._setFunctionSignatureData(node);
    // generate proto file
    if (!existsSync(protoPath)) {
      mkdirSync(protoPath, { recursive: true });
    }

    const protoContent = generateProtoFile(
      this.functionName,
      this.args,
      this.returnType,
    );

    const protoFile = path.join(protoPath, `${this.functionName}.proto`);

    writeFileSync(protoFile, protoContent);

    // generate AS helpers
    if (!existsSync(protoPath)) {
      mkdirSync(protoPath, { recursive: true });
    }

    generateASHelpers(protoFile, asHelpersPath);

    const wrapperContent = this._generateWrapper();

    const imports = this._generateImports();

    TransformUpdates.addUpdate({
      begin: node.range.start,
      end: node.range.end,
      content: wrapperContent,
      data: new Map([
        ['imports', imports],
        ['funcToPrivate', [node.name.text]],
      ]),
      transformerSource: 'MassaExport',
    });

    this._resetFunctionSignatureData();

    return node;
  }
  /**
   * Generates the wrapper function that will be exported by the smart contract.
   *
   * @remarks
   * The wrapper function will be exported by the smart contract and will be responsible to decode the
   * arguments, call the original function and encode the response.
   *
   * @param name - The name of the function.
   * @param args - The arguments of the function.
   * @param returnedType - The return type of the function.
   *
   * @returns - The wrapper function as a string.
   */
  private _generateWrapper(): string {
    const argDecodings = this.args.map((arg) => `args.${arg.name}`).join(', ');

    let wrapper = `export function ${
      this.functionName
    }(_args: StaticArray<u8>): ${
      this.returnType ? 'StaticArray<u8>' : 'void'
    } {\n`;

    if (this.args.length > 0) {
      wrapper += `  const args = decode${this.functionName}(Uint8Array.wrap(changetype<ArrayBuffer>(_args)));\n`;
    }

    if (this.returnType) {
      wrapper += `  const response = encode${this.functionName}Response(new ${
        this.functionName
      }Response(_${this.functionName}(${
        this.args.length > 0 ? argDecodings : ''
      })));\n\n`;
      wrapper += `  return changetype<StaticArray<u8>>(response.buffer);\n`;
    }

    wrapper += '}';

    return wrapper;
  }

  /**
   * Generates the imports for the wrapper AS Helpers functions.
   *
   * @param name - The name of the function.
   * @param args - The arguments of the function.
   * @param returnedType - The return type of the function.
   *
   * @returns - The imports as a string array.
   */
  private _generateImports(): string[] {
    let imports: string[] = [];
    let name = this.functionName;

    if (this.args.length > 0) {
      imports.push(`import { decode${name} } from "./${name}";`);
    }

    if (this.returnType) {
      imports.push(
        `import { ${name}Response, encode${name}Response } from "./${name}Response";`,
      );
    }

    return imports;
  }

  private _updateSourceFile(update: Update, content: string): string {
    const funcToPrivate = update.data.get('funcToPrivate');
    const imports = update.data.get('imports');

    if (funcToPrivate === undefined || imports === undefined) {
      console.error(
        'Failed to process a MassaExport decorated function: missing imports or function name',
      );
      return content;
    }

    const token = 'export function ';
    console.error('function to privatise: ' + funcToPrivate[0]);
    content = content.replace(
      token + funcToPrivate[0],
      'function _' + funcToPrivate[0],
    );
    content += '\n' + update.content + '\n';

    imports.forEach((i) => {
      content = '\n' + i + content;
    });
    return content;
  }

  getAdditionalSources(parser: Parser, source: Source): Source[] {
    let neededImports = new Map<string, boolean>();
    let foundUpdates = false;

    // Dynamically fetching additional import's dependencies
    for (const update of TransformUpdates.getUpdates()) {
      if (update.transformerSource !== 'massaExport') continue;
      foundUpdates = true;
      const imports = update.data.get('imports');
      if (imports === undefined) {
        console.error(
          'There was an error with pushing generated code imports to compilation',
        );
        return [];
      }
      imports.forEach((i: string) => {
        neededImports.set(i, true);
      });
    }
    if (foundUpdates == false) return [];
    const dependencies = getDependencies(`./build/${source.simplePath}.ts`);

    // Creating a filter list of generated dependencies to import
    const depsFilter = Array.from(neededImports.keys()).map((elem) =>
      elem.substring(
        elem.indexOf('from "./') + 'from "./'.length,
        elem.length - 2,
      ),
    );

    // Filtering fetched dependencies to match only the newly added ones
    return dependencies
      .filter(
        // Filtering dependencies to push for compilation
        (dep) =>
          dep.includes('as-proto') ||
          depsFilter.some((filter) => dep.includes(filter)),
      )
      .map(
        (
          dep, // Parsing dependencies sources
        ) =>
          parseFile(
            dep,
            new Parser(parser.diagnostics),
            source.internalPath.replace(source.simplePath, ''),
          ),
      );
  }

  updateSource(source: Source): string | undefined {
    let content = source.text;
    let foundUpdates = false;
    const updates = TransformUpdates.getUpdates();

    updates.forEach((update) => {
      if (update.transformerSource === 'MassaExport') {
        // Adding generated wrappers and new imports in file
        content = this._updateSourceFile(update, content);
        foundUpdates = true;
      }
    });

    if (foundUpdates) {
      content = content.replaceAll('@massaExport()', '');
      writeFileSync(`./build/${source.simplePath}.ts`, content);
      return content;
    }
    return content;
  }
}
