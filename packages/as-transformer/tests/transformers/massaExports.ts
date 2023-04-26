import { Argument } from '../../src/helpers/protobuf';
import { generateWrapper } from '../../src/transformers/massaExport';

describe('generateWrapper', () => {
  it('should generate a void wrapper function', () => {
    const name = 'SayHello';
    const args: Argument[] = [];
    const returnedType = '';

    const expectedWrapper = `export function ${name}(_args: StaticArray<u8>): void {
}`;
    const actualWrapper = generateWrapper(name, args, returnedType);

    expect(actualWrapper).toEqual(expectedWrapper);
  });

  it('should generate a non-void wrapper function with args', () => {
    const name = 'SayHello';
    const args: Argument[] = [
      { name: 'language', type: 'string' },
      { name: 'name', type: 'string' },
    ];
    const returnedType = 'string';

    const expectedWrapper = `export function ${name}(_args: StaticArray<u8>): StaticArray<u8> {
  const args = decode${name}(Uint8Array.wrap(changetype<ArrayBuffer>(_args)));
  const response = encode${name}Response(new ${name}Response(_${name}(args.language, args.name)));
  generateEvent(\`${name}Response: \${response}\`);
  return changetype<StaticArray<u8>>(response.buffer);
}`;
    const actualWrapper = generateWrapper(name, args, returnedType);

    expect(actualWrapper).toEqual(expectedWrapper);
  });

  it('should generate a non-void wrapper function without args', () => {
    const name = 'SayHello';
    const args: Argument[] = [];
    const returnedType = 'string';

    const expectedWrapper = `export function ${name}(_args: StaticArray<u8>): StaticArray<u8> {
  const response = encode${name}Response(new ${name}Response(_${name}()));
  generateEvent(\`${name}Response: \${response}\`);
  return changetype<StaticArray<u8>>(response.buffer);
}`;
    const actualWrapper = generateWrapper(name, args, returnedType);

    expect(actualWrapper).toEqual(expectedWrapper);
  });
});
