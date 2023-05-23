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
import { Update } from './interfaces/Update.js';
import { MassaFunctionNode, hasDecorator } from '../helpers/node.js';
import { getDependencies } from '../helpers/typescript.js';
import { MassaExportCalls } from './massaExportCalls.js';

/**
 * The Massa Export transformer is responsible of exporting standard contract
 * function signature with a generic AS wrapper.
 *
 * @remarks
 * It allows by the usage of `@massaExport()` decorator, the writing of a simple function without having to care
 * about argument encoding and decoding.
 */
export class MassaExport {
  updateId = 'MassaExport';
  protoPath = './build';
  asHelpersPath = './build';

  updates: Update[] = [];
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

  resetUpdates(): void {
    this.updates = [];
  }

  hasUpdates(): bool {
    return this.updates.length > 0;
  }

  isMatching(node: MassaFunctionNode): boolean {
    return hasDecorator(node.node!, 'massaExport');
  }

  /**
   * This function is responsible of generating the wrapper for encoding/decoding of arguments of the passed function.
   *
   * @remarks
   * The wrapper is generated using protobuf and generated AS helpers.
   * It doesn't change the function AST, it rather stores the generated wrappers to apply them all at once in the file
   * after it as generated all the wrappers for the current file.
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

    this.updates.push({
      begin: node.node!.range.start,
      end: node.node!.range.end,
      content: wrapperContent,
      data: new Map([
        ['imports', imports],
        ['funcToPrivate', [node.name]],
      ]),
    });
    MassaExportCalls.calls.push(node.name);

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

  /**
   * Retrieves the additional sources needed for the generated wrappers.
   *
   * @param source - The original source file
   *
   * @returns A filepaths array of the additional sources.
   */
  getAdditionalSources(source: Source): string[] {
    const depsFilter: string[] = [];

    // Retrieving the generated functions
    for (const update of this.updates) {
      const scFunc = update.data.get('funcToPrivate');
      if (scFunc === undefined) {
        console.error(
          'There was an error with pushing generated code imports to compilation',
        );
        return [];
      }
      // Adding filters corresponding to the imports of the AS helpers used in the generated wrappers
      depsFilter.push('build/' + scFunc[0]!);
      depsFilter.push('build/' + scFunc[0]! + 'Response');
    }

    // Dynamically fetching additional import's dependencies
    const dependencies = getDependencies(`./build/${source.simplePath}.ts`);

    // Filtering fetched dependencies to avoid adding again dependencies
    // that where already imported by the original file.
    return dependencies.filter(
      (dep) =>
        dep.includes('as-proto') ||
        depsFilter.some((filter) => dep.includes(filter)),
    );
  }

  /**
   * This function is used to create a new file with the generated wrappers and imports based on the original contract.
   *
   * @remarks
   * It is done by applying previously generated updates to the original source.
   *
   * @param source - The original source of the contract file
   * @param updates - The previously generate updates made by {@link MassaExport}
   *
   * @returns The new raw file content of the file source.
   */
  updateSource(source: Source): string {
    let content = source.text;

    this.updates.forEach((update) => {
      content = this._updateSourceFile(update, content);
    });

    content = content.replaceAll('@massaExport()\n', '');
    // Writing the new file in the build directory to avoid overwriting the original contract produced by the sc dev.
    writeFileSync(`./build/${source.simplePath}.ts`, content);
    return content;
  }

  /**
   * Adds the given wrapper update and imports into the file content.
   *
   * @remarks
   * Since the wrapper will have the original function name
   * the original function is changed and marked as not exported.
   *
   * @param update - The update containing the wrapper and the imports
   * @param content - The file content of the contract to update.
   *
   * @returns The updated file content.
   */
  private _updateSourceFile(update: Update, content: string): string {
    const funcToPrivate = update.data.get('funcToPrivate');
    const imports = update.data.get('imports');

    if (funcToPrivate === undefined || imports === undefined) {
      console.error(
        'Failed to process a MassaExport decorated function: missing imports or function name',
      );
      return content;
    }

    // changing the signature of the original function to allow the addition of the wrapper.
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
}
