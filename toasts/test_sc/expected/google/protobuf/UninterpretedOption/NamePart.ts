// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";

export class NamePart {
  static encode(message: NamePart, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.namePart);

    writer.uint32(16);
    writer.bool(message.isExtension);
  }

  static decode(reader: Reader, length: i32): NamePart {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new NamePart();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.namePart = reader.string();
          break;

        case 2:
          message.isExtension = reader.bool();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  namePart: string;
  isExtension: bool;

  constructor(namePart = "", isExtension: bool = false) {
    this.namePart = namePart;
    this.isExtension = isExtension;
  }
}

export function encodeNamePart(message: NamePart): Uint8Array {
  return Protobuf.encode(message, NamePart.encode);
}

export function decodeNamePart(buffer: Uint8Array): NamePart {
  return Protobuf.decode<NamePart>(buffer, NamePart.decode);
}
