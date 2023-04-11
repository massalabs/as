import { generateProtoFile } from '../src/transformers/protobufABI/generateProtoFile.js';
import { TypeKind } from 'assemblyscript/dist/assemblyscript';
import { expect } from 'chai';

describe('generateProtoFile', () => {
  it('should generate a protocol buffer file', () => {
    const args = [
      { name: 'language', type: TypeKind.Stringref },
      { name: 'name', type: TypeKind.Stringref },
    ];

    const protoFile = generateProtoFile('sayHello', args, TypeKind.Stringref);

    const expectedProtoFile = `syntax = "proto3";

message SayHello {
  string language = 1;
  string name = 2;
}

message SayHelloResponse {
  string value = 1;
}`;

    expect(protoFile).to.equal(expectedProtoFile);

    // Assert that the generated protoFile is correct
  });
});
