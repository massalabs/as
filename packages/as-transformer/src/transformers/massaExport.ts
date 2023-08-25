/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FunctionDeclaration, Source, TypeNode } from 'assemblyscript';

// eslint-disable-next-line
// @ts-ignore
import { debug } from 'console';

import {
  generateASHelpers,
  generateProtoFile,
  isArray,
  typeNodeToString,
  getArrayElementType,
} from '../helpers/protobuf.js';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Update, GlobalUpdates, UpdateType } from './interfaces/Update.js';
import { MassaFunctionNode, hasDecorator } from '../helpers/node.js';
import { getDependencies } from '../helpers/typescript.js';
import path from 'path';

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

  resetUpdates(): void {
    this.updates = [];
  }

  hasUpdates(): boolean {
    return this.updates.length > 0;
  }

  isMatching(node: MassaFunctionNode): boolean {
    const toMatch =
      this.updates.filter(
        (update) =>
          update.getContentType() == UpdateType.FunctionDeclaration &&
          update.getData().get('funcToPrivate')![0] === node.name,
      ).length <= 0 && hasDecorator(node.node!, 'massaExport');
    const alreadyDone =
      GlobalUpdates.get().filter(
        (update) =>
          update.getFrom() === 'MassaExport' &&
          update.getData().get('funcToPrivate')![0] === node.name,
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
   * @param massaFunction - The AST {@link FunctionDeclaration} node containing the function to export.
   *
   * @returns The unchanged node.
   */
  transform(massaFunction: MassaFunctionNode): FunctionDeclaration {
    // generate proto content
    const protoContent = generateProtoFile(massaFunction, this);
    const wrapperContent = generateWrapper(massaFunction, this.updates);
    const imports = generateImports(massaFunction);

    const update = new Update(
      UpdateType.FunctionDeclaration,
      wrapperContent,
      new Map([
        ['imports', imports],
        ['funcToPrivate', [massaFunction.name]],
        ['protoContent', protoContent.split('\n')],
      ]),
      'MassaExport',
    );

    // why push in 2 different places?
    this.updates.push(update);
    GlobalUpdates.add(update);
    // Debug.log(
    //   "MassaExport Function: generated '" + node.name + "' function's wrapper",
    // );
    return massaFunction.node!;
  }

  /**
   * Retrieves the additional sources needed for the generated wrappers.
   *
   * @param source - The original source file
   *
   * @returns A filepaths array of the additional sources.
   */
  getAdditionalSources(source: Source, dir: string): string[] {
    // Debug.log('** Getting additional sources for: ' + source.internalPath);

    const depsFilter: string[] = [];
    let dependencies: string[] = [];
    // Retrieving the generated functions
    for (const update of this.updates) {
      // Debug.log('** Update: ' + update.getContent());
      if (update.getContentType() !== UpdateType.FunctionDeclaration) {
        continue;
      }

      const scFunc = update.getData().get('funcToPrivate');
      if (scFunc === undefined) {
        // eslint-disable-next-line no-console
        console.error(
          'There was an error with pushing generated code imports to compilation. update:\n\t',
          update.getContent(),
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
          // dep.includes('as-types') ||
          // dep.includes('massa-as-sdk') ||
          dep.includes('base64.ts') ||
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
    // Debug.log('Updating source: ' + source.internalPath);

    let content = source.text;
    const newPath = './build/' + dir;
    const dirName = path.dirname(newPath);

    this.updates.forEach((update) => {
      content = updateSourceFile(update, content, dirName);
    });

    content = content.replaceAll('@massaExport()', '');
    // Writing the new file in the build directory to avoid overwriting the original contract produced by the sc dev.

    if (!existsSync(dirName)) {
      mkdirSync(dirName, { recursive: true });
    }

    writeFileSync(`${newPath}.ts`, content);
    return content;
  }
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
export function generateWrapper(
  massaFunction: MassaFunctionNode,
  updates: Update[],
): string {
  const { name, args, returnNode } = massaFunction;
  const returnType = typeNodeToString(returnNode);

  const customArgs = updates.filter(
    (update) =>
      update.getFrom().includes('custom-proto') &&
      update.getData().has('fnName') &&
      update.getData().get('fnName')?.includes(name),
  );

  const argDecodings = args
    .map((arg) => {
      let argument = `args.${arg.name}`;

      // checking if the argument is a custom type to use proper deserializer
      let carg = customArgs.find((carg) => carg.getContent() === arg.name);
      if (carg) {
        const deser = carg.getData().get('deser');

        // array of custom type
        if (isArray(arg.type)) {
          const cType = carg.getData().get('type');
          // apply deser to all elements of the array
          argument = `${argument}.map<${cType}>((el) => ${deser![0]!
            .toString()
            .replace('\\1', 'el')})`;
        } else {
          // single element of custom type
          argument = deser![0]!.toString().replace('\\1', argument);
        }
      }

      // casting back array if needed
      argument = castBackArgType(arg.type, argument);

      return argument;
    })
    .join(', ');

  let wrapper = `export function ${name}(_args: ArrayBuffer): ${
    returnType !== 'void' ? 'ArrayBuffer' : 'void'
  } {\n`;

  if (args.length > 0) {
    wrapper +=
      `  const args = decode${name}Helper(` + `Uint8Array.wrap(_args));\n`;
  }
  let call = `_ms_${name}_(${args.length > 0 ? argDecodings : ''})`;

  if (returnType !== 'void') {
    // casting back array if needed
    call = castBackFnRetType(returnNode, call);

    // checking if the return type is a custom type to use proper serializer
    let customArg = customArgs.find((carg) => carg.getContent() === 'value');
    if (customArg) {
      const ser = customArg.getData().get('ser');
      // array of custom type
      if (isArray(returnNode)) {
        // apply ser to all elements of the array
        // we assume that custom types are serialized to u8 arrays hence the
        // .map<Uint8Array>
        call = `${call}.map<Uint8Array>((el) => ${ser![0]!
          .toString()
          .replace('\\1', 'el')})`;
      } else {
        // single element of custom type
        call = ser![0]!.toString().replace('\\1', call);
      }
    }

    wrapper +=
      `  const response = encode${name}RHelper(` +
      `new ${name}RHelper(${call}));\n\n`;

    wrapper +=
      '  generateEvent(' +
      `\`Result${name}:` +
      "'${massa_transformer_base64_encode(response)}'`);\n";
    wrapper += `  return response.buffer;\n`;
  } else {
    wrapper += '  ' + call + ';\n';
  }

  wrapper += '}';

  return wrapper;
}

/**
 * Generates the imports for the wrapper AS Helpers functions
 *
 * @param name - The name of the function.
 * @param args - The arguments of the function.
 * @param returnedType - The return type of the function.
 *
 * @returns - The imports as a string array.
 */
export function generateImports(massaFunction: MassaFunctionNode): string[] {
  const { name, returnNode, args } = massaFunction;
  const returnType = typeNodeToString(returnNode);

  const imports: string[] = [];
  if (args.length > 0) {
    imports.push(`import { decode${name}Helper } from "./${name}Helper";`);
  }

  if (returnType !== 'void') {
    imports.push(
      `import { ${name}RHelper, encode${name}RHelper } from "./${name}RHelper";`,
    );
  }

  return imports;
}

// checking if the argument is an array to use proper deserializer
// TODO: check if the array is of number type (aka i16, i32, i64, u16, u32, u64)
// it is possible that the changetype is not needed / not wanted for types other than numbers
// TODO: check if the array is of custom type
function castBackArgType(type: TypeNode, argument: string): string {
  const typeStr = typeNodeToString(type);

  const typedArrayNames = [
    'Uint8Array',
    'Int8Array',
    'Uint16Array',
    'Int16Array',
    'Uint32Array',
    'Int32Array',
    'Uint64Array',
    'Int64Array',
  ];

  if (isArray(type) || typedArrayNames.includes(typeStr)) {
    return `changetype<${typeStr}>(${argument})`;
  }

  return argument;
}

function castBackFnRetType(retType: TypeNode, retVal: string): string {
  if (isArray(retType)) {
    const elmType = typeNodeToString(getArrayElementType(retType));
    switch (elmType) {
      case 'i8':
      case 'u8':
        return `changetype<Uint8Array>(${retVal})`;
      // needed because protobuf doesn't support i16 and u16
      case 'i16':
      case 'Int16Array':
      case 'Int32Array':
        return `changetype<Array<i32>>(${retVal})`;
      case 'u16':
      case 'Uint16Array':
      case 'Uint32Array':
        return `changetype<Array<u32>>(${retVal})`;

      case 'Int8Array': // WARNING protobuf treats u8 and i8 as byte (unsigned) so...
        return `changetype<Uint8Array[]>(${retVal})`;

      case 'Int64Array':
        return `changetype<Array<i64>>(${retVal})`;
      case 'Uint64Array':
        return `changetype<Array<u64>>(${retVal})`;

      default:
        // retVal = `changetype<${retType}>(${retVal})`;
        return retVal;
    }
  }

  // handle special case with Uint8Array and Int8Array
  switch (typeNodeToString(retType)) {
    case 'Uint8Array':
    case 'Int8Array': // WARNING protobuf treats u8 and i8 as byte (unsigned) so...
      return `changetype<Uint8Array>(${retVal})`;
    case 'Uint16Array':
      return `changetype<Array<u32>>(${retVal})`;
    case 'Int16Array':
      return `changetype<Array<i32>>(${retVal})`;
    case 'Uint32Array':
      return `changetype<Array<u32>>(${retVal})`;
    case 'Int32Array':
      return `changetype<Array<i32>>(${retVal})`;
    case 'Uint64Array':
      return `changetype<Array<u64>>(${retVal})`;
    case 'Int64Array':
      return `changetype<Array<i64>>(${retVal})`;

    default:
      break;
  }

  return retVal;
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
function updateSourceFile(
  update: Update,
  content: string,
  dir: string,
): string {
  const funcToPrivate = update.getData().get('funcToPrivate');
  const imports = update.getData().get('imports');

  // checking if the update has to be applied
  if (funcToPrivate === undefined || imports === undefined) {
    // console.log('Nothing to do for\n\tcontent:', content);
    return content;
  }

  generateHelpers(
    dir,
    funcToPrivate[0]!,
    update.getData().get('protoContent')!.join('\n'),
  );

  // changing the signature of the original function to allow the addition of the wrapper.
  content = content.replace(
    'export function ' + funcToPrivate[0],
    'export function _ms_' + funcToPrivate[0] + '_',
  );

  // appending wrapper to end of file
  content += '\n' + update.getContent() + '\n';

  return addImports(content, imports, dir) + '\n' + content;
}

/**
 * This functions generate the needed import list.
 *
 * @remarks It also adds the declaration of the generateEvent function if not imported.
 *
 * @param content - The file content of the contract being updated.
 * @param imports - The imports to add.
 *
 * @returns The import section.
 */
function addImports(content: string, imports: string[], dir: string): string {
  const generateEventImportRegex =
    /(?:import\s*{.*generateEvent.*}\s*from\s*("|')@massalabs\/massa-as-sdk("|'))/gm;

  // checking if adding declare of generateEvent is needed or if its already imported by the contract
  if (generateEventImportRegex.exec(content) === null) {
    imports.push('@external("massa", "assembly_script_generate_event")');
    imports.push('export declare function generateEvent(event: string): void;');
  }

  addBase64Import(content, imports, dir);

  return imports.join('\n');
}

function addBase64Import(content: string, imports: string[], dir: string) {
  // Matches: import { massa_transformer_base64_encode } from "./base64";
  const base64Rexex =
    /import\s+\{\s*massa_transformer_base64_encode\s*\}\s+from\s+("|')\.\/base64("|');/gm;

  // Already imported?
  if (base64Rexex.exec(content)) {
    return;
  }

  const base64File = dir + '/base64.ts';

  if (!existsSync(dir)) {
    throw new Error('Directory does not exist: ' + dir);
  }

  imports.push(`import { massa_transformer_base64_encode } from "./base64";`);

  const base64Code = `\n// adapted from https://gist.github.com/Juszczak/63e6d9e01decc850de03
      /**
       * base64 encoding/decoding
       */

      // @ts-ignore: decorator
      @lazy
        const PADCHAR = "=";
      // @ts-ignore: decorator
      @lazy
        const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

      // @ts-ignore: decorator
      @lazy
        const ALPHAVALUES = StaticArray.fromArray<u8>([
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          62,
          0,
          0,
          0,
          63,
          52,
          53,
          54,
          55,
          56,
          57,
          58,
          59,
          60,
          61,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          0,
          0,
          0,
          0,
          0,
          0,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          46,
          47,
          48,
          49,
          50,
          51,
          0,
          0,
          0,
          0,
          0,
        ]);

         /**
          * Encode Uint8Array as a base64 string.
          * @param bytes Byte array of type Uint8Array.
          * This function was taken from here https://github.com/near/as-base64
          * as import are not working in transformer for now
          */
         export function massa_transformer_base64_encode(bytes: Uint8Array): string {
           let i: i32, b10: u32;

           const extrabytes = (bytes.length % 3);
           let imax = bytes.length - extrabytes;
           const len = ((bytes.length / 3) as i32) * 4 + (extrabytes == 0 ? 0 : 4);
           let x = changetype<string>(__new(<usize>(len << 1), idof<string>()));

           if (bytes.length == 0) {
             return "";
           }

           let ptr = changetype<usize>(x) - 2;
           for (i = 0; i < imax; i += 3) {
             b10 =
               ((bytes[i] as u32) << 16) |
               ((bytes[i + 1] as u32) << 8) |
               (bytes[i + 2] as u32);
             store<u16>(ptr+=2, (ALPHA.charCodeAt(b10 >> 18) as u16));
             store<u16>(ptr+=2, (ALPHA.charCodeAt(((b10 >> 12) & 63)) as u16));
             store<u16>(ptr+=2, (ALPHA.charCodeAt(((b10 >> 6) & 63)) as u16));
             store<u16>(ptr+=2, (ALPHA.charCodeAt((b10 & 63)) as u16));
           }

           switch (bytes.length - imax) {
             case 1:
               b10 = (bytes[i] as u32) << 16;
               store<u16>(ptr+=2, ((ALPHA.charCodeAt(b10 >> 18)) as u16));
               store<u16>(ptr+=2, ((ALPHA.charCodeAt((b10 >> 12) & 63)) as u16));
               store<u16>(ptr+=2, ((PADCHAR.charCodeAt(0)) as u16));
               store<u16>(ptr+=2, ((PADCHAR.charCodeAt(0)) as u16));
               break;
             case 2:
               b10 = ((bytes[i] as u32) << 16) | ((bytes[i + 1] as u32) << 8);
               store<u16>(ptr+=2, ((ALPHA.charCodeAt(b10 >> 18)) as u16));
               store<u16>(ptr+=2, ((ALPHA.charCodeAt((b10 >> 12) & 63)) as u16));
               store<u16>(ptr+=2, ((ALPHA.charCodeAt((b10 >> 6) & 63)) as u16));
               store<u16>(ptr+=2, ((PADCHAR.charCodeAt(0)) as u16));
               break;
           }

           return x;
         }

        // @ts-ignore: decorator
         @inline
         function getByte64(s: string, i: u32): u32 {
           return ALPHAVALUES[s.charCodeAt(i)];
         }
      `;

  writeFileSync(base64File, base64Code);
}

/**
 * This function writes the protobuf content and generates the AS helpers in a folder for the given update.
 *
 * @param dir - The build directory path of the file containing the function to generate the wrapper for.
 * @param func - The function name to generate wrapper for.
 * @param protoContent - The protobuf content.
 */
function generateHelpers(
  dir: string,
  func: string,
  protoContent: string,
): void {
  const wrapperPath = dir;
  const protoFile = wrapperPath + '/' + func + 'Helper' + '.proto';

  if (!existsSync(wrapperPath)) {
    mkdirSync(wrapperPath, {
      recursive: true,
    });
  }
  writeFileSync(protoFile, protoContent);
  generateASHelpers(protoFile, wrapperPath);
}
