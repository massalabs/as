// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";

export class testInt64ArrayRHelper {
  static encode(message: testInt64ArrayRHelper, writer: Writer): void {
    const value = message.value;
    if (value.length !== 0) {
      for (let i: i32 = 0; i < value.length; ++i) {
        writer.uint32(8);
        writer.int64(value[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): testInt64ArrayRHelper {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new testInt64ArrayRHelper();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value.push(reader.int64());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  value: Array<i64>;

  constructor(value: Array<i64> = []) {
    this.value = value;
  }
}

export function encodetestInt64ArrayRHelper(
  message: testInt64ArrayRHelper
): Uint8Array {
  return Protobuf.encode(message, testInt64ArrayRHelper.encode);
}

export function decodetestInt64ArrayRHelper(
  buffer: Uint8Array
): testInt64ArrayRHelper {
  return Protobuf.decode<testInt64ArrayRHelper>(
    buffer,
    testInt64ArrayRHelper.decode
  );
}
