// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";
import { EnumValueDescriptorProto } from "./EnumValueDescriptorProto";
import { EnumOptions } from "./EnumOptions";
import { EnumReservedRange } from "./EnumDescriptorProto/EnumReservedRange";

export class EnumDescriptorProto {
  static encode(message: EnumDescriptorProto, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.name);

    const value = message.value;
    for (let i: i32 = 0; i < value.length; ++i) {
      writer.uint32(18);
      writer.fork();
      EnumValueDescriptorProto.encode(value[i], writer);
      writer.ldelim();
    }

    const options = message.options;
    if (options !== null) {
      writer.uint32(26);
      writer.fork();
      EnumOptions.encode(options, writer);
      writer.ldelim();
    }

    const reservedRange = message.reservedRange;
    for (let i: i32 = 0; i < reservedRange.length; ++i) {
      writer.uint32(34);
      writer.fork();
      EnumReservedRange.encode(reservedRange[i], writer);
      writer.ldelim();
    }

    const reservedName = message.reservedName;
    if (reservedName.length !== 0) {
      for (let i: i32 = 0; i < reservedName.length; ++i) {
        writer.uint32(42);
        writer.string(reservedName[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): EnumDescriptorProto {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new EnumDescriptorProto();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;

        case 2:
          message.value.push(
            EnumValueDescriptorProto.decode(reader, reader.uint32())
          );
          break;

        case 3:
          message.options = EnumOptions.decode(reader, reader.uint32());
          break;

        case 4:
          message.reservedRange.push(
            EnumReservedRange.decode(reader, reader.uint32())
          );
          break;

        case 5:
          message.reservedName.push(reader.string());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  name: string;
  value: Array<EnumValueDescriptorProto>;
  options: EnumOptions | null;
  reservedRange: Array<EnumReservedRange>;
  reservedName: Array<string>;

  constructor(
    name = "",
    value: Array<EnumValueDescriptorProto> = [],
    options: EnumOptions | null = null,
    reservedRange: Array<EnumReservedRange> = [],
    reservedName: Array<string> = []
  ) {
    this.name = name;
    this.value = value;
    this.options = options;
    this.reservedRange = reservedRange;
    this.reservedName = reservedName;
  }
}

export function encodeEnumDescriptorProto(
  message: EnumDescriptorProto
): Uint8Array {
  return Protobuf.encode(message, EnumDescriptorProto.encode);
}

export function decodeEnumDescriptorProto(
  buffer: Uint8Array
): EnumDescriptorProto {
  return Protobuf.decode<EnumDescriptorProto>(
    buffer,
    EnumDescriptorProto.decode
  );
}
