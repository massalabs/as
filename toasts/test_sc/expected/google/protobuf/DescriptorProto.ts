// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";
import { FieldDescriptorProto } from "./FieldDescriptorProto";
import { EnumDescriptorProto } from "./EnumDescriptorProto";
import { ExtensionRange } from "./DescriptorProto/ExtensionRange";
import { OneofDescriptorProto } from "./OneofDescriptorProto";
import { MessageOptions } from "./MessageOptions";
import { ReservedRange } from "./DescriptorProto/ReservedRange";

export class DescriptorProto {
  static encode(message: DescriptorProto, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.name);

    const field = message.field;
    for (let i: i32 = 0; i < field.length; ++i) {
      writer.uint32(18);
      writer.fork();
      FieldDescriptorProto.encode(field[i], writer);
      writer.ldelim();
    }

    const extension = message.extension;
    for (let i: i32 = 0; i < extension.length; ++i) {
      writer.uint32(50);
      writer.fork();
      FieldDescriptorProto.encode(extension[i], writer);
      writer.ldelim();
    }

    const nestedType = message.nestedType;
    for (let i: i32 = 0; i < nestedType.length; ++i) {
      writer.uint32(26);
      writer.fork();
      DescriptorProto.encode(nestedType[i], writer);
      writer.ldelim();
    }

    const enumType = message.enumType;
    for (let i: i32 = 0; i < enumType.length; ++i) {
      writer.uint32(34);
      writer.fork();
      EnumDescriptorProto.encode(enumType[i], writer);
      writer.ldelim();
    }

    const extensionRange = message.extensionRange;
    for (let i: i32 = 0; i < extensionRange.length; ++i) {
      writer.uint32(42);
      writer.fork();
      ExtensionRange.encode(extensionRange[i], writer);
      writer.ldelim();
    }

    const oneofDecl = message.oneofDecl;
    for (let i: i32 = 0; i < oneofDecl.length; ++i) {
      writer.uint32(66);
      writer.fork();
      OneofDescriptorProto.encode(oneofDecl[i], writer);
      writer.ldelim();
    }

    const options = message.options;
    if (options !== null) {
      writer.uint32(58);
      writer.fork();
      MessageOptions.encode(options, writer);
      writer.ldelim();
    }

    const reservedRange = message.reservedRange;
    for (let i: i32 = 0; i < reservedRange.length; ++i) {
      writer.uint32(74);
      writer.fork();
      ReservedRange.encode(reservedRange[i], writer);
      writer.ldelim();
    }

    const reservedName = message.reservedName;
    if (reservedName.length !== 0) {
      for (let i: i32 = 0; i < reservedName.length; ++i) {
        writer.uint32(82);
        writer.string(reservedName[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): DescriptorProto {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new DescriptorProto();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;

        case 2:
          message.field.push(
            FieldDescriptorProto.decode(reader, reader.uint32())
          );
          break;

        case 6:
          message.extension.push(
            FieldDescriptorProto.decode(reader, reader.uint32())
          );
          break;

        case 3:
          message.nestedType.push(
            DescriptorProto.decode(reader, reader.uint32())
          );
          break;

        case 4:
          message.enumType.push(
            EnumDescriptorProto.decode(reader, reader.uint32())
          );
          break;

        case 5:
          message.extensionRange.push(
            ExtensionRange.decode(reader, reader.uint32())
          );
          break;

        case 8:
          message.oneofDecl.push(
            OneofDescriptorProto.decode(reader, reader.uint32())
          );
          break;

        case 7:
          message.options = MessageOptions.decode(reader, reader.uint32());
          break;

        case 9:
          message.reservedRange.push(
            ReservedRange.decode(reader, reader.uint32())
          );
          break;

        case 10:
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
  field: Array<FieldDescriptorProto>;
  extension: Array<FieldDescriptorProto>;
  nestedType: Array<DescriptorProto>;
  enumType: Array<EnumDescriptorProto>;
  extensionRange: Array<ExtensionRange>;
  oneofDecl: Array<OneofDescriptorProto>;
  options: MessageOptions | null;
  reservedRange: Array<ReservedRange>;
  reservedName: Array<string>;

  constructor(
    name = "",
    field: Array<FieldDescriptorProto> = [],
    extension: Array<FieldDescriptorProto> = [],
    nestedType: Array<DescriptorProto> = [],
    enumType: Array<EnumDescriptorProto> = [],
    extensionRange: Array<ExtensionRange> = [],
    oneofDecl: Array<OneofDescriptorProto> = [],
    options: MessageOptions | null = null,
    reservedRange: Array<ReservedRange> = [],
    reservedName: Array<string> = []
  ) {
    this.name = name;
    this.field = field;
    this.extension = extension;
    this.nestedType = nestedType;
    this.enumType = enumType;
    this.extensionRange = extensionRange;
    this.oneofDecl = oneofDecl;
    this.options = options;
    this.reservedRange = reservedRange;
    this.reservedName = reservedName;
  }
}

export function encodeDescriptorProto(message: DescriptorProto): Uint8Array {
  return Protobuf.encode(message, DescriptorProto.encode);
}

export function decodeDescriptorProto(buffer: Uint8Array): DescriptorProto {
  return Protobuf.decode<DescriptorProto>(buffer, DescriptorProto.decode);
}
