// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";

export class testArrayI8RHelper {
  static encode(message: testArrayI8RHelper, writer: Writer): void {
    writer.uint32(10);
    writer.bytes(message.value);
  }

  static decode(reader: Reader, length: i32): testArrayI8RHelper {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new testArrayI8RHelper();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value = reader.bytes();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  value: Uint8Array;

  constructor(value: Uint8Array = new Uint8Array(0)) {
    this.value = value;
  }
}

export function encodetestArrayI8RHelper(
  message: testArrayI8RHelper
): Uint8Array {
  return Protobuf.encode(message, testArrayI8RHelper.encode);
}

export function decodetestArrayI8RHelper(
  buffer: Uint8Array
): testArrayI8RHelper {
  return Protobuf.decode<testArrayI8RHelper>(buffer, testArrayI8RHelper.decode);
}
