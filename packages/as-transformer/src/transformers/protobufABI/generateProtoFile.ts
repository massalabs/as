import { TypeKind } from 'assemblyscript/dist/assemblyscript';
import { Argument, capitalizeFirstLetter } from './protobufABI.js';

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

export function generateProtoFile(
  name: string,
  args: Argument[],
  returnedValue: TypeKind,
): string {
  const messageName = capitalizeFirstLetter(name);
  const argumentMessages = args.map((arg, index) =>
    generateArgumentMessage(arg, index + 1),
  );
  const fields = argumentMessages.join('\n');

  const response = generateResponseMessage(returnedValue);

  const protoFile = `syntax = "proto3";

message ${messageName} {
${fields}
}

message ${messageName}Response {
${response}
}`;

  return protoFile;
}

function generateArgumentMessage(arg: Argument, index: number): string {
  const fieldName = arg.name;
  const fieldType = getTypeName(arg.type);
  return `  ${fieldType} ${fieldName} = ${index};`;
}

function generateResponseMessage(returnedValue: TypeKind): string {
  const fieldType = getTypeName(returnedValue);
  return `  ${fieldType} value = 1;`;
}

function getTypeName(type: TypeKind): ProtoType {
  switch (type) {
    case TypeKind.Bool:
      return ProtoType.Bool;
    case TypeKind.I8:
    case TypeKind.I16:
    case TypeKind.I32:
      return ProtoType.Int32;
    case TypeKind.I64:
      return ProtoType.Int64;
    case TypeKind.U8:
    case TypeKind.U16:
    case TypeKind.U32:
      return ProtoType.UInt32;
    case TypeKind.U64:
      return ProtoType.UInt64;
    case TypeKind.F32:
      return ProtoType.Float;
    case TypeKind.F64:
      return ProtoType.Double;
    case TypeKind.Stringref:
      return ProtoType.String;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
