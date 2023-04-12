import { generateProtoFile } from '../src/transformers/protobufABI/generateProtoFile.js';
import { expect } from 'chai';

describe('generateProtoFile', () => {
  it('should generate a protocol buffer file', () => {
    const args = [
      { name: 'language', type: "string" },
      { name: 'name', type: "string" },
    ];

    const protoFile = generateProtoFile('sayHello', args, "string");

    const expectedProtoFile = `syntax = "proto3";

message SayHello {
  string language = 1;
  string name = 2;
}

message SayHelloResponse {
  string value = 1;
}`;

    expect(protoFile).to.equal(expectedProtoFile);
  });
});
