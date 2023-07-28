import { generateProtoFile, Argument } from '../../src/helpers/protobuf';
import { MassaExport } from '../../src/transformers/massaExport';

let massaExportTransformer = new MassaExport();

const protoStart = `syntax = "proto3";

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
      { name: 'arg1', type: 'i32' },
      { name: 'arg2', type: 'string' },
      { name: 'arg3', type: 'bool' },
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
      { name: 'arg1', type: 'i32' },
      { name: 'arg2', type: 'string' },
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
      { name: 'arg1', type: 'Int32Array' },
      { name: 'arg2', type: 'Array<string>' },
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
    const args: Argument[] = [{ name: 'arg1', type: 'v64' }];
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
});
