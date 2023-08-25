import * as fs from 'fs';
import { generateProtoFile } from '../../src/helpers/protobuf';
import { MassaExport } from '../../src/transformers/massaExport';
import { MassaFunctionNode } from '../../src/helpers/node';

import {
  Parser,
  FunctionDeclaration,
} from 'assemblyscript';

// eslint-disable-next-line
// @ts-ignore
import { assert, debug } from 'console';

let massaExportTransformer = new MassaExport();

const protoStart = `syntax = "proto3";

import "google/protobuf/descriptor.proto";

extend google.protobuf.FieldOptions {
  optional string custom_type = 50002;
}
`;
protoStart.concat('\n');

describe('generateProtoFile', () => {
  it('should generate a simple Protobuf file with no arguments or returned value', () => {
    const functionNode = parseFunction('export function MyFunction(): void {}');

    const expectedOutput = `syntax = "proto3";

message MyFunctionHelper {

}
`;

    const result = generateProtoFile(functionNode, massaExportTransformer);

    expect(result).toEqual(expectedOutput);
  });

  it('should generate a Protobuf file with multiple arguments', () => {
    const functionNode = parseFunction(
      'export function MyFunction(arg1: i32, arg2: string, arg3: bool): void {}',
    );

    const expectedOutput = `${protoStart}
message MyFunctionHelper {
  int32 arg1 = 1 [(custom_type) = "i32"];
  string arg2 = 2 [(custom_type) = "string"];
  bool arg3 = 3 [(custom_type) = "bool"];
}
`;

    const result = generateProtoFile(functionNode, massaExportTransformer);

    expect(result).toEqual(expectedOutput);
  });

  it('should generate a Protobuf file with a returned value', () => {
    const functionNode = parseFunction(
      'export function MyFunction(arg1: i32, arg2: string): bool {}',
    );

    const expectedOutput = `${protoStart}
message MyFunctionHelper {
  int32 arg1 = 1 [(custom_type) = "i32"];
  string arg2 = 2 [(custom_type) = "string"];
}

message MyFunctionRHelper {
  bool value = 1 [(custom_type) = "bool"];
}`;

    const result = generateProtoFile(
      functionNode,

      massaExportTransformer,
    );

    expect(result).toEqual(expectedOutput);
  });

  it('should generate a Protobuf file with repeated fields', () => {
    const functionNode = parseFunction(
      'export function MyFunction(arg1: Int32Array, arg2: Array<string>): bool {}',
    );

    const expectedOutput = `${protoStart}
message MyFunctionHelper {
  repeated int32 arg1 = 1 [(custom_type) = "Int32Array"];
  repeated string arg2 = 2 [(custom_type) = "Array<string>"];
}

message MyFunctionRHelper {
  bool value = 1 [(custom_type) = "bool"];
}`;

    const result = generateProtoFile(functionNode, massaExportTransformer);

    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error for unsupported types', () => {
    const functionNode = parseFunction(
      'export function MyFunction(arg1: v64, arg2: string): void {}',
    );

    expect(() =>
      generateProtoFile(functionNode, massaExportTransformer),
    ).toThrow('Unsupported type: v64');
  });

  it('should generate a simple Protobuf file with custom fields', () => {
    // export function MyFunction(arg1: u256, arg2: u256): void {}

    generateBignumYml();

    const functionNode = parseFunction(
      'export function MyFunction(arg1: u256, arg2: u256): void {}',
    );

    const expectedOutput = `${protoStart}
message MyFunctionHelper {
  bytes arg1 = 1 [(custom_type) = "u256"];
  bytes arg2 = 2 [(custom_type) = "u256"];
}
`;

    const result = generateProtoFile(functionNode, massaExportTransformer);

    expect(result).toEqual(expectedOutput);
  });

  it('should generate a simple Protobuf file from function returning array', () => {
    const functionNode = parseFunction(
      'export function test(arg1: i32, arg2: i32): Int32Array {}',
    );

    const expectedOutput = `${protoStart}
message testHelper {
  int32 arg1 = 1 [(custom_type) = "i32"];
  int32 arg2 = 2 [(custom_type) = "i32"];
}

message testRHelper {
  repeated int32 value = 1 [(custom_type) = "Int32Array"];
}`;

    const result = generateProtoFile(functionNode, massaExportTransformer);

    expect(result).toEqual(expectedOutput);
  });
});

export function parseFunction(testFn: string) {
  const parser = new Parser();
  parser.parseFile(testFn, 'virtualFile', true);
  const functionNode = MassaFunctionNode.createFromASTNode(
    <FunctionDeclaration>parser.currentSource?.statements[0],
  );
  return functionNode;
}

function generateBignumYml() {
  const customTypeYml = `
- type:
  name: u256
  proto: bytes
  import: "as-bignum/assembly"
  serialize: "\\\\1.toUint8Array()"
  deserialize: "u256.fromUint8ArrayLE(\\\\1)"
- type:
  name: u128
  proto: bytes
  import: "as-bignum/assembly"
  serialize: "\\\\1.toUint8Array()"
  deserialize: "u128.fromUint8ArrayLE(\\\\1)"
`;

  fs.writeFileSync('./node_modules/' + 'bignum.massa-type.yml', customTypeYml);
}
