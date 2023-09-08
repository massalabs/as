// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";

export class testArrayOfInt32ArrayRHelper {
  static encode(message: testArrayOfInt32ArrayRHelper, writer: Writer): void {
    const value = message.value;
    if (value.length !== 0) {
      for (let i: i32 = 0; i < value.length; ++i) {
        writer.uint32(8);
        writer.int32(value[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): testArrayOfInt32ArrayRHelper {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new testArrayOfInt32ArrayRHelper();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value.push(reader.int32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  value: Array<i32>;

  constructor(value: Array<i32> = []) {
    this.value = value;
  }
}

export function encodetestArrayOfInt32ArrayRHelper(
  message: testArrayOfInt32ArrayRHelper
): Uint8Array {
  return Protobuf.encode(message, testArrayOfInt32ArrayRHelper.encode);
}

export function decodetestArrayOfInt32ArrayRHelper(
  buffer: Uint8Array
): testArrayOfInt32ArrayRHelper {
  return Protobuf.decode<testArrayOfInt32ArrayRHelper>(
    buffer,
    testArrayOfInt32ArrayRHelper.decode
  );
}
