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
  type: ProtoType;
  repeated: boolean;
}

export interface Argument {
  name: string;
  type: string;
}

export function generateProtoFile(
  name: string,
  args: Argument[],
  returnedType: string,
): string {
  const argumentMessages = args.map((arg, index) =>
    generateArgumentMessage(arg, index + 1),
  );
  const fields = argumentMessages.join('\n');

  let protoFile = `syntax = "proto3";

message ${name} {
${fields}
}`;

  if (returnedType && returnedType != 'void' && returnedType != 'null') {
    const argumentResponse: Argument = {
      name: 'value',
      type: returnedType,
    };

    const response = generateArgumentMessage(argumentResponse, 1);

    protoFile += `

message ${name}Response {
${response}
}`;
  }

  return protoFile;
}

function generateArgumentMessage(arg: Argument, index: number): string {
  const fieldName = arg.name;
  const fieldSpec = getTypeName(arg.type);
  const fieldType = (fieldSpec.repeated ? 'repeated ' : '') + fieldSpec.type;
  return `  ${fieldType} ${fieldName} = ${index};`;
}

function getTypeName(type: string): FieldSpec {
  let spec: FieldSpec = {
    type: ProtoType.Int32,
    repeated: false,
  };

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
      throw new Error(`Unsupported type: ${type}`);
  }

  spec.repeated = type.indexOf('Array') > -1;

  return spec;
}
