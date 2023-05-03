import { Argument } from '../../src/helpers/protobuf';
import {
  generateWrapper,
  generateImports,
} from '../../src/transformers/massaExport';

describe('generateWrapper', () => {
  it('should generate a void wrapper function', () => {
    const name = 'SayHello';
    const args: Argument[] = [];
    const returnedType = '';
    let wrapper = `@external("massa", "assembly_script_generate_event")\n`;
    wrapper += `declare function generateEvent(event: string): void;\n\n`;

    wrapper += `export function ${name}(_args: StaticArray<u8>): void {\n`;
    wrapper += `}`;
    const actualWrapper = generateWrapper(name, args, returnedType);

    expect(actualWrapper).toStrictEqual(wrapper);
  });

  it('should generate a non-void wrapper function with args', () => {
    const name = 'SayHello';
    const args: Argument[] = [
      { name: 'language', type: 'string' },
      { name: 'name', type: 'string' },
    ];
    const returnedType = 'string';

    let wrapper = `@external("massa", "assembly_script_generate_event")\n`;
    wrapper += `declare function generateEvent(event: string): void;\n\n`;

    wrapper += `export function ${name}(_args: StaticArray<u8>): StaticArray<u8> {\n`;
    wrapper += `  const args = decode${name}(Uint8Array.wrap(changetype<ArrayBuffer>(_args)));\n`;
    wrapper += `  const response = encode${name}Response(new ${name}Response(_${name}(args.language, args.name)));\n\n`;

    wrapper += `  generateEvent(\`${name}Response: \${response}\`)\n`;
    wrapper += `  return changetype<StaticArray<u8>>(response.buffer);\n`;
    wrapper += '}';

    const actualWrapper = generateWrapper(name, args, returnedType);

    expect(actualWrapper).toStrictEqual(wrapper);
  });

  it('should generate a non-void wrapper function without args', () => {
    const name = 'SayHello';
    const args: Argument[] = [];
    const returnedType = 'string';

    let wrapper = `@external("massa", "assembly_script_generate_event")\n`;
    wrapper += `declare function generateEvent(event: string): void;\n\n`;

    wrapper += `export function ${name}(_args: StaticArray<u8>): StaticArray<u8> {\n`;
    wrapper += `  const response = encode${name}Response(new ${name}Response(_${name}()));\n\n`;

    wrapper += `  generateEvent(\`${name}Response: \${response}\`)\n`;
    wrapper += `  return changetype<StaticArray<u8>>(response.buffer);\n`;
    wrapper += '}';

    const actualWrapper = generateWrapper(name, args, returnedType);

    expect(actualWrapper).toStrictEqual(wrapper);
  });
});

describe('generateImports', () => {
  it('should return an empty array when args and returnedType are empty', () => {
    const name = 'SayHello';
    const args: Argument[] = [];
    const returnedType = '';

    const expectedImports: string[] = [];
    const actualImports = generateImports(name, args, returnedType);

    expect(actualImports).toStrictEqual(expectedImports);
  });

  it('should return only deserializing helper when args is not an empty and returnedType is', () => {
    const name = 'SayHello';
    const args = [
      { name: 'language', type: 'string' },
      { name: 'name', type: 'string' },
    ];
    const returnedType = '';

    const expectedImports = [
      `import { decode${name} } from "./build/${name}";`,
    ];
    const actualImports = generateImports(name, args, returnedType);

    expect(actualImports).toEqual(expectedImports);
  });

  it('should return (de)serializing helpers and generatedEvent when args is empty and returnedType is not', () => {
    const name = 'SayHello';
    const args: Argument[] = [];
    const returnedType = 'string';

    const expectedImports = [
      `import { ${name}Response, encode${name}Response } from "./${name}Response";`,
      `import { generateEvent } from '@massalabs/massa-as-sdk';`,
    ];
    const actualImports = generateImports(name, args, returnedType);

    expect(actualImports).toEqual(expectedImports);
  });

  it('should return everything when args and returnedType are not empty', () => {
    const name = 'SayHello';
    const args: Argument[] = [
      { name: 'language', type: 'string' },
      { name: 'name', type: 'string' },
    ];
    const returnedType = 'string';

    const expectedImports = [
      `import { decode${name} } from "./${name}";`,
      `import { ${name}Response, encode${name}Response } from "./${name}Response";`,
      `import { generateEvent } from '@massalabs/massa-as-sdk';`,
    ];
    const actualImports = generateImports(name, args, returnedType);

    expect(actualImports).toEqual(expectedImports);
  });
});
