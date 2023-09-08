// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0
//   protoc        v4.23.2

import { Writer, Reader, Protobuf } from "as-proto/assembly";
import { NamePart } from "./UninterpretedOption/NamePart";

export class UninterpretedOption {
  static encode(message: UninterpretedOption, writer: Writer): void {
    const name = message.name;
    for (let i: i32 = 0; i < name.length; ++i) {
      writer.uint32(18);
      writer.fork();
      NamePart.encode(name[i], writer);
      writer.ldelim();
    }

    writer.uint32(26);
    writer.string(message.identifierValue);

    writer.uint32(32);
    writer.uint64(message.positiveIntValue);

    writer.uint32(40);
    writer.int64(message.negativeIntValue);

    writer.uint32(49);
    writer.double(message.doubleValue);

    writer.uint32(58);
    writer.bytes(message.stringValue);

    writer.uint32(66);
    writer.string(message.aggregateValue);
  }

  static decode(reader: Reader, length: i32): UninterpretedOption {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new UninterpretedOption();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.name.push(NamePart.decode(reader, reader.uint32()));
          break;

        case 3:
          message.identifierValue = reader.string();
          break;

        case 4:
          message.positiveIntValue = reader.uint64();
          break;

        case 5:
          message.negativeIntValue = reader.int64();
          break;

        case 6:
          message.doubleValue = reader.double();
          break;

        case 7:
          message.stringValue = reader.bytes();
          break;

        case 8:
          message.aggregateValue = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  name: Array<NamePart>;
  identifierValue: string;
  positiveIntValue: u64;
  negativeIntValue: i64;
  doubleValue: f64;
  stringValue: Uint8Array;
  aggregateValue: string;

  constructor(
    name: Array<NamePart> = [],
    identifierValue = "",
    positiveIntValue: u64 = 0,
    negativeIntValue: i64 = 0,
    doubleValue: f64 = 0.0,
    stringValue: Uint8Array = new Uint8Array(0),
    aggregateValue = ""
  ) {
    this.name = name;
    this.identifierValue = identifierValue;
    this.positiveIntValue = positiveIntValue;
    this.negativeIntValue = negativeIntValue;
    this.doubleValue = doubleValue;
    this.stringValue = stringValue;
    this.aggregateValue = aggregateValue;
  }
}

export function encodeUninterpretedOption(
  message: UninterpretedOption
): Uint8Array {
  return Protobuf.encode(message, UninterpretedOption.encode);
}

export function decodeUninterpretedOption(
  buffer: Uint8Array
): UninterpretedOption {
  return Protobuf.decode<UninterpretedOption>(
    buffer,
    UninterpretedOption.decode
  );
}
