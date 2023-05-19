/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  FunctionDeclaration,
  Source,
} from 'assemblyscript/dist/assemblyscript.js';

import {
  Argument,
  generateASHelpers,
  generateProtoFile,
} from '../helpers/protobuf.js';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
// import { IFunctionTransformer } from './interfaces/IFunctionTransformer.js';
import { TransformUpdates, Update } from './interfaces/Update.js';
import { MassaFunctionNode, hasDecorator } from '../helpers/node.js';
import { getDependencies } from '../helpers/typescript.js';

export class MassaExport {
  updateId = 'MassaExport';
  protoPath = './build';
  asHelpersPath = './build';
  functionName = '';
  returnType: string | undefined = undefined;
  args: Argument[] = [];

  private _setFunctionSignatureData(node: MassaFunctionNode) {
    this.functionName = node.name;
    this.returnType = node.returnType;
    this.args = node.args;
  }

  private _resetFunctionSignatureData() {
    this.functionName = '';
    this.returnType = undefined;
    this.args = [];
  }

  isMatching(node: MassaFunctionNode): boolean {
    return hasDecorator(node.node!, 'massaExport');
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
  transform(node: MassaFunctionNode): FunctionDeclaration {
    // extracting function signature from node
    this._setFunctionSignatureData(node);

    // generate proto build directory
    if (!existsSync(this.protoPath)) {
      mkdirSync(this.protoPath, { recursive: true });
    }
    // generate AS helpers directory
    if (!existsSync(this.asHelpersPath)) {
      mkdirSync(this.asHelpersPath, { recursive: true });
    }

    // generate proto content
    const protoContent = generateProtoFile(
      this.functionName,
      this.args,
      this.returnType,
    );

    const protoFile = path.join(this.protoPath, `${this.functionName}.proto`);

    writeFileSync(protoFile, protoContent); // writing proto file content in filepath

    generateASHelpers(protoFile, this.asHelpersPath);

    const wrapperContent = this._generateWrapper();

    const imports = this._generateImports();

    TransformUpdates.addUpdate({
      begin: node.node!.range.start,
      end: node.node!.range.end,
      content: wrapperContent,
      data: new Map([
        ['imports', imports],
        ['funcToPrivate', [node.name]],
      ]),
      transformerSource: this.updateId,
    });

    this._resetFunctionSignatureData();

    return node.node!;
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

    // content = content.replace(funcToPrivate[0]!, '_'+funcToPrivate[0]);
    content = content.replace(
      'export function ' + funcToPrivate[0],
      'function _' + funcToPrivate[0],
    );
    // appending wrapper to end of file
    content += '\n' + update.content + '\n';

    // adding corresponding asHelper imports for each added wrapper
    imports.forEach((i) => {
      content = i + '\n' + content;
    });
    return content;
  }

  getAdditionalSources(source: Source, updates: Update[]): string[] {
    const depsFilter: string[] = [];

    // Dynamically fetching additional import's dependencies
    for (const update of updates) {
      const scFunc = update.data.get('funcToPrivate');
      if (scFunc === undefined) {
        console.error(
          'There was an error with pushing generated code imports to compilation',
        );
        return [];
      }
      depsFilter.push('build/' + scFunc[0]!);
      depsFilter.push('build/' + scFunc[0]! + 'Response');
    }

    const dependencies = getDependencies(`./build/${source.simplePath}.ts`);

    // Filtering fetched dependencies to match only the newly added ones
    return dependencies.filter(
      // Filtering dependencies to push for compilation
      (dep) =>
        dep.includes('as-proto') ||
        depsFilter.some((filter) => dep.includes(filter)),
    );
  }

  updateSource(source: Source, updates: Update[]): string {
    let content = source.text;
    updates.forEach((update) => {
      // Adding generated wrappers and new imports in file
      content = this._updateSourceFile(update, content);
    });
    content = content.replaceAll('@massaExport()\n', '');
    writeFileSync(`./build/${source.simplePath}.ts`, content);
    return content;
  }
}
