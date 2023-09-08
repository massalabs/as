// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";

export class testUint16ArrayHelper {
  static encode(message: testUint16ArrayHelper, writer: Writer): void {
    const arg1 = message.arg1;
    if (arg1.length !== 0) {
      for (let i: i32 = 0; i < arg1.length; ++i) {
        writer.uint32(8);
        writer.uint32(arg1[i]);
      }
    }
  }

  static decode(reader: Reader, length: i32): testUint16ArrayHelper {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new testUint16ArrayHelper();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.arg1.push(reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  arg1: Array<u32>;

  constructor(arg1: Array<u32> = []) {
    this.arg1 = arg1;
  }
}

export function encodetestUint16ArrayHelper(
  message: testUint16ArrayHelper
): Uint8Array {
  return Protobuf.encode(message, testUint16ArrayHelper.encode);
}

export function decodetestUint16ArrayHelper(
  buffer: Uint8Array
): testUint16ArrayHelper {
  return Protobuf.decode<testUint16ArrayHelper>(
    buffer,
    testUint16ArrayHelper.decode
  );
}
