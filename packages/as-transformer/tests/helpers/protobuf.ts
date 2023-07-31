import { generateProtoFile, Argument } from '../../src/helpers/protobuf';
import { MassaExport } from '../../src/transformers/massaExport';
import * as fs from 'fs';

let massaExportTransformer = new MassaExport();

const protoStart = 'syntax = "proto3";';
protoStart.concat('\n');

const customTypeImports = `
import "google/protobuf/descriptor.proto";

extend google.protobuf.FieldOptions {
  optional string custom_type = 50002;
}`;
describe('generateProtoFile', () => {
  it('should generate a simple Protobuf file with no arguments or returned value', () => {
    const name = 'MyFunction';
    const args: Argument[] = [];
    const returnedType = '';

    const expectedOutput = `${protoStart}

message MyFunctionHelper {

}`;

    const result = generateProtoFile(
      name,
      args,
      returnedType,
      massaExportTransformer,
    );

    expect(result).toEqual(expectedOutput);
  });

  it('should generate a Protobuf file with multiple arguments', () => {
    const name = 'MyFunction';
    const args: Argument[] = [
      new Argument('arg1', 'i32', 'MyFunction'),
      new Argument('arg2', 'string', 'MyFunction'),
      new Argument('arg3', 'bool', 'MyFunction'),
    ];
    const returnedType = '';

    const expectedOutput = `${protoStart}

message MyFunctionHelper {
  int32 arg1 = 1;
  string arg2 = 2;
  bool arg3 = 3;
}`;

    const result = generateProtoFile(
      name,
      args,
      returnedType,
      massaExportTransformer,
    );

    expect(result).toEqual(expectedOutput);
  });

  it('should generate a Protobuf file with a returned value', () => {
    const name = 'MyFunction';
    const args: Argument[] = [
      new Argument('arg1', 'i32', 'MyFunction'),
      new Argument('arg2', 'string', 'MyFunction'),
    ];
    const returnedType = 'bool';

    const expectedOutput = `${protoStart}

message MyFunctionHelper {
  int32 arg1 = 1;
  string arg2 = 2;
}

message MyFunctionRHelper {
  bool value = 1;
}`;

    const result = generateProtoFile(
      name,
      args,
      returnedType,
      massaExportTransformer,
    );

    expect(result).toEqual(expectedOutput);
  });

  it('should generate a Protobuf file with repeated fields', () => {
    const name = 'MyFunction';
    const args: Argument[] = [
      new Argument('arg1', 'Int32Array', 'MyFunction'),
      new Argument('arg2', 'Array<string>', 'MyFunction'),
    ];
    const returnedType = 'bool';

    const expectedOutput = `${protoStart}

message MyFunctionHelper {
  repeated int32 arg1 = 1;
  repeated string arg2 = 2;
}

message MyFunctionRHelper {
  bool value = 1;
}`;

    const result = generateProtoFile(
      name,
      args,
      returnedType,
      massaExportTransformer,
    );

    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error for unsupported types', () => {
    const name = 'MyFunction';
    const args: Argument[] = [new Argument('arg1', 'v64', 'MyFunction')];
    const returnedType = '';

    expect(() =>
      generateProtoFile(name, args, returnedType, massaExportTransformer),
    ).toThrow('Unsupported type: v64');
  });

  it('should handle empty input values', () => {
    const name = '';
    const args: Argument[] = [];
    const returnedType = '';

    const expectedOutput = `${protoStart}

message Helper {

}`;

    const result = generateProtoFile(
      name,
      args,
      returnedType,
      massaExportTransformer,
    );

    expect(result).toEqual(expectedOutput);
  });

  it('should generate a simple Protobuf file with custom fields', () => {
    /* export function MyFunction(arg1: u256, arg2: u256): void {} */

    generateBignumYml();

    const name = 'MyFunction';
    const args: Argument[] = [
      new Argument('arg1', 'u256', 'MyFunction'),
      new Argument('arg2', 'u256', 'MyFunction'),
    ];
    const returnedType = 'void';
    const expectedOutput = `syntax = "proto3";
${customTypeImports}


message MyFunctionHelper {
  bytes arg1 = 1 [(custom_type) = "u256"];
  bytes arg2 = 2 [(custom_type) = "u256"];
}`;

    const result = generateProtoFile(
      name,
      args,
      returnedType,
      massaExportTransformer,
    );

    expect(result).toEqual(expectedOutput);
  });
});

function generateBignumYml() {
  const customTypeYml = `
- type:
  name: u256
  proto: bytes
  import: "as-bignum/assembly"
  serialize: "\\\\1.toStaticBytes()"
  deserialize: "u256.fromUint8ArrayLE(\\\\1)"
- type:
  name: u128
  proto: bytes
  import: "as-bignum/assembly"
  serialize: "\\\\1.toStaticBytes()"
  deserialize: "u128.fromUint8ArrayLE(\\\\1)"
`;

  fs.writeFileSync('./node_modules/' + 'bignum.massa-type.yml', customTypeYml);
}
