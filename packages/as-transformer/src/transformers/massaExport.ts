/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  FunctionDeclaration,
  Source,
} from 'assemblyscript/dist/assemblyscript.js';

import * as Debug from 'debug';

import {
  Argument,
  generateASHelpers,
  generateProtoFile,
} from '../helpers/protobuf.js';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
// import { IFunctionTransformer } from './interfaces/IFunctionTransformer.js';
import { Update, GlobalUpdates } from './interfaces/Update.js';
import { MassaFunctionNode, hasDecorator } from '../helpers/node.js';
import { getDependencies } from '../helpers/typescript.js';

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
    const toMatch =
      this.updates.filter(
        (update) => update.data.get('funcToPrivate')![0] === node.name,
      ).length <= 0 && hasDecorator(node.node!, 'massaExport');
    const alreadyDone =
      GlobalUpdates.get().filter(
        (update) =>
          update.from === 'MassaExport' &&
          update.data.get('funcToPrivate')![0] === node.name,
      ).length > 0;
    return toMatch && !alreadyDone;
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

    // generate proto content
    const protoContent = generateProtoFile(
      this.functionName,
      this.args,
      this.returnType,
    );
    const wrapperContent = this._generateWrapper();
    const imports = this._generateImports();
    const update = {
      content: wrapperContent,
      data: new Map([
        ['imports', imports],
        ['funcToPrivate', [node.name]],
        ['protoContent', protoContent.split('\n')],
      ]),
      from: 'MassaExport',
    };
    this.updates.push(update);
    GlobalUpdates.add(update);
    this._resetFunctionSignatureData();
    Debug.log(
      "MassaExport Function: generated '" + node.name + "' function's wrapper",
    );
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
      this.returnType && this.returnType !== 'void' ? 'StaticArray<u8>' : 'void'
    } {\n`;

    if (this.args.length > 0) {
      wrapper += `  const args = decode${this.functionName}Helper(Uint8Array.wrap(changetype<ArrayBuffer>(_args)));\n`;
    }
    const call = `_ms_${this.functionName}_(${
      this.args.length > 0 ? argDecodings : ''
    })`;
    if (this.returnType && this.returnType !== 'void') {
      wrapper += `  const response = encode${this.functionName}RHelper(new ${this.functionName}RHelper(${call}));\n\n`;

      wrapper += "  generateEvent(`Result:'${response.buffer.toString()}'`);\n";
      wrapper += `  return changetype<StaticArray<u8>>(response.buffer);\n`;
    } else {
      wrapper += '  ' + call + ';\n';
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
      imports.push(`import { decode${name}Helper } from "./${name}Helper";`);
    }

    if (this.returnType && this.returnType !== 'void') {
      imports.push(
        `import { ${name}RHelper, encode${name}RHelper } from "./${name}RHelper";`,
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
  getAdditionalSources(source: Source, dir: string): string[] {
    const depsFilter: string[] = [];
    let dependencies: string[] = [];
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
      let path = 'build/' + dir.replace(source.simplePath, '') + scFunc[0]!;
      depsFilter.push(path);
    }

    // Dynamically fetching additional import's dependencies
    // Filtering fetched dependencies to avoid adding again dependencies
    // that where already imported by the original file.
    getDependencies(`./build/${dir}.ts`)
      .filter(
        (dep) =>
          dep.includes('as-proto') ||
          depsFilter.some((filter) => dep.includes(filter)),
      )
      .forEach((dep) => dependencies.push(dep));

    return dependencies;
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
  updateSource(source: Source, dir: string): string {
    let content = source.text;
    const newPath = './build/' + dir;

    this.updates.forEach((update) => {
      content = this._updateSourceFile(
        update,
        content,
        newPath.replace(source.simplePath, ''),
      );
    });

    content = content.replaceAll('@massaExport()', '');
    // Writing the new file in the build directory to avoid overwriting the original contract produced by the sc dev.

    if (!existsSync(newPath.replace(source.simplePath, '')))
      mkdirSync(newPath.replace(source.simplePath, ''), { recursive: true });
    writeFileSync(`${newPath}.ts`, content);
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
  private _updateSourceFile(
    update: Update,
    content: string,
    dir: string,
  ): string {
    const funcToPrivate = update.data.get('funcToPrivate');
    const imports = update.data.get('imports');

    if (funcToPrivate === undefined || imports === undefined) {
      console.error(
        'Failed to process a MassaExport decorated function: missing imports or function name',
      );
      return content;
    }

    this._generateHelpers(
      dir,
      funcToPrivate[0]!,
      update.data.get('protoContent')!.join('\n'),
    );

    // changing the signature of the original function to allow the addition of the wrapper.
    content = content.replace(
      'export function ' + funcToPrivate[0],
      'export function _ms_' + funcToPrivate[0] + '_',
    );

    // appending wrapper to end of file
    content += '\n' + update.content + '\n';

    return this.addImports(content, imports);
  }

  private addImports(content: string, imports: string[]): string {
    const regex =
      /(?:import\s*{.*generateEvent.*}\s*from\s*("|')@massalabs\/massa-as-sdk("|'))/gm;

    // checking if adding declare of generateEvent is needed or if its already imported by the contract
    if (regex.exec(content) === null) {
      imports.push('@external("massa", "assembly_script_generate_event")');
      imports.push(
        'export declare function generateEvent(event: string): void;',
      );
    }

    // adding corresponding asHelper imports for each added wrapper
    content = imports.join('\n') + '\n' + content;

    return content;
  }

  /**
   * This function writes the protobuf content and generates the AS helpers in a folder for the given update.
   *
   * @param dir - The build directory path of the file containing the function to generate the wrapper for.
   * @param func - The function name to generate wrapper for.
   * @param protoContent - The protobuf content.
   */
  private _generateHelpers(
    dir: string,
    func: string,
    protoContent: string,
  ): void {
    const wrapperPath = dir;
    const protoFile = wrapperPath + func + 'Helper' + '.proto';

    if (!existsSync(wrapperPath)) {
      mkdirSync(wrapperPath, {
        recursive: true,
      });
    }
    writeFileSync(protoFile, protoContent);
    generateASHelpers(protoFile, wrapperPath);
  }
}
