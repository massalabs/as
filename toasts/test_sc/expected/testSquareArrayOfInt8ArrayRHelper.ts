// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";

export class testSquareArrayOfInt8ArrayRHelper {
  static encode(
    message: testSquareArrayOfInt8ArrayRHelper,
    writer: Writer
  ): void {
    const value = message.value;
    if (value.length !== 0) {
      for (let i: i32 = 0; i < value.length; ++i) {
        writer.uint32(10);
        writer.bytes(value[i]);
      }
    }
  }

  static decode(
    reader: Reader,
    length: i32
  ): testSquareArrayOfInt8ArrayRHelper {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new testSquareArrayOfInt8ArrayRHelper();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value.push(reader.bytes());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  value: Array<Uint8Array>;

  constructor(value: Array<Uint8Array> = []) {
    this.value = value;
  }
}

export function encodetestSquareArrayOfInt8ArrayRHelper(
  message: testSquareArrayOfInt8ArrayRHelper
): Uint8Array {
  return Protobuf.encode(message, testSquareArrayOfInt8ArrayRHelper.encode);
}

export function decodetestSquareArrayOfInt8ArrayRHelper(
  buffer: Uint8Array
): testSquareArrayOfInt8ArrayRHelper {
  return Protobuf.decode<testSquareArrayOfInt8ArrayRHelper>(
    buffer,
    testSquareArrayOfInt8ArrayRHelper.decode
  );
}
