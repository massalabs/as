// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";

export class testArrayU64RHelper {
  static encode(message: testArrayU64RHelper, writer: Writer): void {
    const value = message.value;
    if (value.length !== 0) {
      for (let i: i32 = 0; i < value.length; ++i) {
        writer.uint32(8);
        writer.uint64(value[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): testArrayU64RHelper {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new testArrayU64RHelper();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value.push(reader.uint64());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  value: Array<u64>;

  constructor(value: Array<u64> = []) {
    this.value = value;
  }
}

export function encodetestArrayU64RHelper(
  message: testArrayU64RHelper
): Uint8Array {
  return Protobuf.encode(message, testArrayU64RHelper.encode);
}

export function decodetestArrayU64RHelper(
  buffer: Uint8Array
): testArrayU64RHelper {
  return Protobuf.decode<testArrayU64RHelper>(
    buffer,
    testArrayU64RHelper.decode
  );
}
