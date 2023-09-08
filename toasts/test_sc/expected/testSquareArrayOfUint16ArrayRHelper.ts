// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";

export class testSquareArrayOfUint16ArrayRHelper {
  static encode(
    message: testSquareArrayOfUint16ArrayRHelper,
    writer: Writer
  ): void {
    const value = message.value;
    if (value.length !== 0) {
      for (let i: i32 = 0; i < value.length; ++i) {
        writer.uint32(8);
        writer.uint32(value[i]);
      }
    }
  }

  static decode(
    reader: Reader,
    length: i32
  ): testSquareArrayOfUint16ArrayRHelper {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new testSquareArrayOfUint16ArrayRHelper();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value.push(reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  value: Array<u32>;

  constructor(value: Array<u32> = []) {
    this.value = value;
  }
}

export function encodetestSquareArrayOfUint16ArrayRHelper(
  message: testSquareArrayOfUint16ArrayRHelper
): Uint8Array {
  return Protobuf.encode(message, testSquareArrayOfUint16ArrayRHelper.encode);
}

export function decodetestSquareArrayOfUint16ArrayRHelper(
  buffer: Uint8Array
): testSquareArrayOfUint16ArrayRHelper {
  return Protobuf.decode<testSquareArrayOfUint16ArrayRHelper>(
    buffer,
    testSquareArrayOfUint16ArrayRHelper.decode
  );
}
