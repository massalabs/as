import { spawnSync } from 'child_process';
import { MassaCustomType, fetchCustomTypes } from './customTypeParser.js';
import { MassaExport } from '../transformers/massaExport.js';
import { Update, UpdateType } from '../transformers/interfaces/Update.js';
import Debug from 'debug';

enum ProtoType {
  Double = 'double',
  Float = 'float',
  Int32 = 'int32',
  Int64 = 'int64',
  UInt32 = 'uint32',
  UInt64 = 'uint64',
  SInt32 = 'sint32',
  SInt64 = 'sint64',
  Fixed32 = 'fixed32',
  Fixed64 = 'fixed64',
  SFixed32 = 'sfixed32',
  SFixed64 = 'sfixed64',
  Bool = 'bool',
  String = 'string',
  Bytes = 'bytes',
}

interface FieldSpec {
  type?: ProtoType;
  repeated: boolean;
  cType?: MassaCustomType;
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
  const argumentMessages = args.map((arg, index) =>
    generateArgumentMessage(arg, index + 1, transformer),
  );
  const fields = argumentMessages.join('\n');

  // FIXME: Q'n D to unblock the cli:
  // if field contains a custom_type, add corresponding import to the generated proto file
  let customTypeImports = hasCustomTypes();

  let protoFile = `syntax = "proto3";
${customTypeImports}
message ${name}Helper {
${fields}
}`;

  if (returnedType && returnedType != 'void' && returnedType != 'null') {
    const argumentResponse: Argument = new Argument(
      'value',
      returnedType,
      name,
    );

    const response = generateArgumentMessage(argumentResponse, 1, transformer);

    protoFile += `

message ${name}RHelper {
${response}
}`;
  }

  return protoFile;

  function hasCustomTypes() {
    return fields.indexOf('custom_type') > -1
      ? `
import "google/protobuf/descriptor.proto";

extend google.protobuf.FieldOptions {
  optional string custom_type = 50002;
}

`
      : '';
  }
}

/**
 * Generates the function argument protobuf text.
 *
 * @remarks
 * The protobuf argument is written with the proto3 syntax.
 * @see [proto3](https://protobuf.dev/programming-guides/proto3/)
 *
 * @param arg - The argument to generate the protobuf for.
 * @param index - The index of the argument.
 *
 * @returns the protobuf argument as a string.
 */
function generateArgumentMessage(
  arg: Argument,
  index: number,
  transformer: MassaExport,
): string {
  const fieldName = arg.getName();
  const fieldSpec = getTypeName(arg.getType());
  const typeName = fieldSpec.type ?? fieldSpec.cType?.proto;
  const fieldType = (fieldSpec.repeated ? 'repeated ' : '') + typeName;
  const templateType =
    fieldSpec.cType !== null && fieldSpec.cType !== undefined
      ? ` [(custom_type) = "${fieldSpec.cType?.name}"];`
      : ';';
  if (fieldSpec.cType) {
    Debug.log('Adding custom type to transformer', fieldSpec.cType.name);
    transformer.updates.push(
      new Update(
        UpdateType.Argument,
        fieldName,
        new Map([
          ['type', [fieldSpec.cType.name]],
          ['ser', [fieldSpec.cType.serialize]],
          ['deser', [fieldSpec.cType.deserialize]],
          ['fnName', [arg.getFnName()]],
        ]),
        'custom-proto',
      ),
    );
  }

  return `  ${fieldType} ${fieldName} = ${index}` + templateType;
}

function getTypeName(type: string): FieldSpec {
  let spec: FieldSpec = {
    repeated: false,
  };
  let cType: MassaCustomType | null = null;

  switch (type) {
    case 'bool':
      spec.type = ProtoType.Bool;
      break;
    case 'i8':
    case 'Int8Array':
    case 'i16':
    case 'Int16Array':
    case 'i32':
    case 'Int32Array':
      spec.type = ProtoType.Int32;
      break;
    case 'i64':
    case 'Int64Array':
    case 'isize':
      spec.type = ProtoType.Int64;
      break;
    case 'u8':
    case 'Uint8Array':
    case 'u16':
    case 'Uint16Array':
    case 'u32':
    case 'Uint32Array':
      spec.type = ProtoType.UInt32;
      break;
    case 'u64':
    case 'Uint64Array':
    case 'usize':
      spec.type = ProtoType.UInt64;
      break;
    case 'f32':
    case 'Float32Array':
      spec.type = ProtoType.Float;
      break;
    case 'f64':
    case 'Float64Array':
      spec.type = ProtoType.Double;
      break;
    case 'string':
    case 'Array<string>':
      spec.type = ProtoType.String;
      break;
    default:
      cType = getCustomType(type);
      if (cType === null) {
        throw new Error(`Unsupported type: ${type}`);
      }
      spec.cType = cType;
  }

  spec.repeated = type.indexOf('Array') > -1;

  return spec;
}

function getCustomType(type: string): MassaCustomType | null {
  let types: MassaCustomType[] = fetchCustomTypes();

  for (const customType of types) {
    if (customType.name === type) {
      return customType;
    }
  }
  return null;
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
      `Failed to generate AS helpers code for ${protoFile} with error: ${protocProcess.stderr}`,
    );
  }
}
