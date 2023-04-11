import { createWrapperFunction } from '../src/transformers/protobufABI/generateWrapper.js';
import { TypeKind } from 'assemblyscript/dist/assemblyscript';
import { expect } from 'chai';

describe('createWrapperFunction', () => {
  it('should generate a valid wrapper function', () => {
    const name = 'sayHello';
    const args = [
      { name: 'language', type: TypeKind.Stringref },
      { name: 'name', type: TypeKind.Stringref },
    ];

    const code = createWrapperFunction(name, args);

    const expectedCode = `export function sayHello(_args: StaticArray<u8>): StaticArray<u8> {
    const args = decodeSayHello(Uint8Array.wrap(changetype<ArrayBuffer>(_args)));
    const response = encodeSayHelloResponse(new SayHelloResponse(_sayHello(args.language, args.name)));

    generateEvent("SayHelloResponse: " + uint8ArrayToHexString(response));

    return changetype<StaticArray<u8>>(response.buffer);
}`;

    expect(code).to.equal(expectedCode);
  });
});
