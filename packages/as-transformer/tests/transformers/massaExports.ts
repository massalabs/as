import { Argument } from '../../src/helpers/protobuf';
import { generateWrapper, generateImports } from '../../src/transformers/massaExport';

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

describe('generateImports', () => {
  it('should return an empty array when args and returnedType are empty', () => {
    const name = 'SayHello';
    const args: Argument[] = [];
    const returnedType = '';

    const expectedImports: string[] = [];
    const actualImports = generateImports(name, args, returnedType);

    expect(actualImports).toEqual(expectedImports);
  });

  it('should return only deserializing helper when args is not an empty and returnedType is', () => {
    const name = 'SayHello';
    const args = [{ name: 'language', type: 'string' }, { name: 'name', type: 'string' }];
    const returnedType = '';

    const expectedImports = [`import { decode${name} } from "./build/${name}";`];
    const actualImports = generateImports(name, args, returnedType);

    expect(actualImports).toEqual(expectedImports);
  });

  it('should return (de)serializing helpers and generatedEvent when args is empty and returnedType is not', () => {
    const name = 'SayHello';
    const args: Argument[] = [];
    const returnedType = 'string';

    const expectedImports = [
      `import { ${name}Response, encode${name}Response } from "./build/${name}Response";`,
      `import { generateEvent } from '@massalabs/massa-as-sdk';`,
    ];
    const actualImports = generateImports(name, args, returnedType);

    expect(actualImports).toEqual(expectedImports);
  });

  it('should return everything when args and returnedType are not empty', () => {
    const name = 'SayHello';
    const args: Argument[] = [{ name: 'language', type: 'string' }, { name: 'name', type: 'string' }];
    const returnedType = 'string';

    const expectedImports = [
      `import { decode${name} } from "./build/${name}";`,
      `import { ${name}Response, encode${name}Response } from "./build/${name}Response";`,
      `import { generateEvent } from '@massalabs/massa-as-sdk';`,
    ];
    const actualImports = generateImports(name, args, returnedType);

    expect(actualImports).toEqual(expectedImports);
  });
});

