// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";
import { UninterpretedOption } from "./UninterpretedOption";

export class OneofOptions {
  static encode(message: OneofOptions, writer: Writer): void {
    const uninterpretedOption = message.uninterpretedOption;
    for (let i: i32 = 0; i < uninterpretedOption.length; ++i) {
      writer.uint32(7994);
      writer.fork();
      UninterpretedOption.encode(uninterpretedOption[i], writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): OneofOptions {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new OneofOptions();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 999:
          message.uninterpretedOption.push(
            UninterpretedOption.decode(reader, reader.uint32())
          );
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  uninterpretedOption: Array<UninterpretedOption>;

  constructor(uninterpretedOption: Array<UninterpretedOption> = []) {
    this.uninterpretedOption = uninterpretedOption;
  }
}

export function encodeOneofOptions(message: OneofOptions): Uint8Array {
  return Protobuf.encode(message, OneofOptions.encode);
}

export function decodeOneofOptions(buffer: Uint8Array): OneofOptions {
  return Protobuf.decode<OneofOptions>(buffer, OneofOptions.decode);
}
