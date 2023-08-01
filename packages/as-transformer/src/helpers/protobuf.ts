import { spawnSync } from 'child_process';
import { MassaType, fetchCustomTypes } from './customTypeParser.js';
import { MassaExport } from '../transformers/massaExport.js';
import { Update, UpdateType } from '../transformers/interfaces/Update.js';
import dedent from 'ts-dedent';

type ASType = string;

function createRefTable(): Map<ASType, MassaType> {
  let table: Map<ASType, MassaType> = new Map([
    // bool
    ['bool', { name: 'bool' }],
    // int32
    ['i8', { name: 'int32' }],
    ['Int8Array', { name: 'int32', repeated: true }],
    ['i16', { name: 'int32' }],
    ['Int16Array', { name: 'int32', repeated: true }],
    ['i32', { name: 'int32' }],
    ['Int32Array', { name: 'int32', repeated: true }],
    // int64
    ['i64', { name: 'int64' }],
    ['Int64Array', { name: 'int64', repeated: true }],
    ['isize', { name: 'int64' }],
    // uint32
    ['u8', { name: 'uint32' }],
    ['Uint8Array', { name: 'uint32', repeated: true }],
    ['u16', { name: 'uint32' }],
    ['Uint16Array', { name: 'uint32', repeated: true }],
    ['u32', { name: 'uint32' }],
    ['Uint32Array', { name: 'uint32', repeated: true }],
    // uint64
    ['u64', { name: 'uint64' }],
    ['Uint64Array', { name: 'uint64', repeated: true }],
    ['usize', { name: 'uint64' }],
    // float
    ['f32', { name: 'float' }],
    ['Float32Array', { name: 'float', repeated: true }],
    // double
    ['f64', { name: 'double' }],
    ['Float64Array', { name: 'double', repeated: true }],
    // string
    ['string', { name: 'string' }],
    ['Array<string>', { name: 'string', repeated: true }],
  ]);
  let customs: MassaType[] = fetchCustomTypes();
  for (const custom of customs) {
    table.set(custom.name, custom);
  }
  return table;
}

export class Argument {
  private name: string;
  private type: string;
  private fnName: string;

  constructor(name: string, type: string, fnName: string) {
    this.name = name;
    this.type = type;
    this.fnName = fnName;
  }

  getName(): string {
    return this.name;
  }

  getType(): string {
    return this.type;
  }

  getFnName(): string {
    return this.fnName;
  }
}

/**
 * Generates the protobuf file data for the passed function signature.
 *
 * @remarks
 * The protobuf file is written with the proto3 syntax.
 *
 * @see [proto3](https://protobuf.dev/programming-guides/proto3/)
 *
 * @param name - The name of the function.
 * @param args - The arguments of the function.
 * @param returnedType - The return type of the function.
 *
 * @returns the protobuf file as a string.
 */
export function generateProtoFile(
  name: string,
  args: Argument[],
  returnedType: string | undefined,
  transformer: MassaExport,
): string {
  // TODO: call this only once
  let refTable = createRefTable();

  const argumentMessages = args.map((arg, index) => {
    let typeInfo = refTable.get(arg.getType())!;
    let fieldName = arg.getName();
    let message = generatePayload(fieldName, typeInfo, index + 1);
    if (typeInfo.metaData !== null && typeInfo.metaData !== undefined) {
      pushCustomTypeUpdate(transformer, arg.getFnName(), typeInfo);
    }
    return message;
  });
  const fields = argumentMessages.join('\n');

  // FIXME: Q'n D to unblock the cli:
  // if field contains a custom_type, add corresponding import to the generated proto file
  let imports = getImports();

  let protoFile = dedent`
  syntax = "proto3";
  ${imports}
  message ${name}Helper {
    ${fields}
  }`;

  if (returnedType && returnedType != 'void' && returnedType != 'null') {
    const argumentResponse: Argument = new Argument(
      'value',
      returnedType,
      name,
    );

    let typeInfo = refTable.get(argumentResponse.getType())!;
    let fieldName = argumentResponse.getName();
    const response = generatePayload(fieldName, typeInfo, 1);
    if (typeInfo.metaData !== null && typeInfo.metaData !== undefined) {
      pushCustomTypeUpdate(transformer, argumentResponse.getFnName(), typeInfo);
    }

    protoFile += dedent`

    message ${name}RHelper {
      ${response}
    }`;
  }

  return protoFile;

  function getImports(): string {
    let customImports = dedent`
    import "google/protobuf/descriptor.proto";

    extend google.protobuf.FieldOptions {
      optional string custom_type = 50002;
    }

    `;
    return fields.indexOf('custom_type') > -1 ? customImports : '';
  }
}

function pushCustomTypeUpdate(
  transformer: MassaExport,
  functionName: string,
  type: MassaType,
) {
  transformer.updates.push(
    new Update(
      UpdateType.Argument,
      type.name,
      new Map([
        ['type', [type.name]],
        ['ser', [type.metaData!.serialize]],
        ['deser', [type.metaData!.deserialize]],
        ['fnName', [functionName]],
      ]),
      'custom-proto',
    ),
  );
}

/**
 *
 * @remarks
 * The protobuf argument is written with the proto3 syntax.
 * @see [proto3](https://protobuf.dev/programming-guides/proto3/)
 *
 * @returns the protobuf argument as a string.
 */
function generatePayload(
  fieldName: string,
  typeInfo: MassaType,
  index: number,
): string {
  const fieldType = (typeInfo.repeated ? 'repeated ' : '') + typeInfo.name;
  const templateType =
    typeInfo.metaData !== null && typeInfo.metaData !== undefined
      ? ` [(custom_type) = "${typeInfo.name}"];`
      : ';';
  return `  ${fieldType} ${fieldName} = ${index}` + templateType;
}

/**
 * Generates the AS helpers functions for the passed protobuf file.
 *
 * @remarks
 * The AS helpers code is generated using the as-proto-gen plugin with protoc compiler.
 * These generated functions are used to call the smart contract functions without having to pre-serialize the data.
 *
 * @param protoFile - The data of the protobuf file.
 * @param outputPath - The path to write the generated code to.
 */
export function generateASHelpers(protoFile: string, outputPath: string): void {
  let protocProcess = spawnSync('protoc', [
    `--plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen`,
    `--as_out=${outputPath}`,
    `--as_opt=gen-helper-methods`,
    `--proto_path=./build`,
    protoFile,
  ]);

  if (protocProcess.status !== 0) {
    console.error(
      `Failed to generate AS helpers code for: \n${protoFile} \nwith error: ${protocProcess.stderr}`,
    );
  }
}
