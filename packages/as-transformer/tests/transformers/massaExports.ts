import {
  MassaExport,
  generateWrapper,
  generateImports,
} from '../../src/transformers/massaExport';
import { parseFunction } from '../helpers/protobuf';
// eslint-disable-next-line
// @ts-ignore
import { debug } from 'console';

// import {
//   NamedTypeNode,
//   Range,
//   TypeName,
//   IdentifierExpression,
// } from 'assemblyscript';

let massaExportTransformer = new MassaExport();

describe('generateWrapper', () => {
  it('should generate a void wrapper function', () => {
    let wrapper = `export function SayHello(_args: ArrayBuffer): void {
  _ms_SayHello_();
}`;

    const node = parseFunction('export function SayHello(): void {}');
    massaExportTransformer.transform(node);
    const actualWrapper = massaExportTransformer.updates[0]?.getContent();

    expect(actualWrapper).toStrictEqual(wrapper);
  });

  it('should generate a non-void wrapper function with args', () => {
    let wrapper = `export function SayHello(_args: ArrayBuffer): ArrayBuffer {\n`;
    wrapper += `  const args = decodeSayHelloHelper(Uint8Array.wrap(_args));\n`;
    wrapper += `  const response = encodeSayHelloRHelper`;
    wrapper += `(new SayHelloRHelper(_ms_SayHello_(args.language, args.name)));\n\n`;
    wrapper +=
      "  generateEvent(`ResultSayHello:'${massa_transformer_base64_encode(response)}'`);\n";
    wrapper += `  return response.buffer;\n`;
    wrapper += '}';

    const node = parseFunction(
      'export function SayHello(language: string, name: string): string {}',
    );
    massaExportTransformer.transform(node);
    const w = generateWrapper(node, massaExportTransformer.updates);

    expect(w).toStrictEqual(wrapper);
  });

  it('should generate a non-void wrapper function without args', () => {
    let wrapper =
      `export function SayHello(_args: ArrayBuffer): ArrayBuffer {
  const response = encodeSayHelloRHelper(new SayHelloRHelper(_ms_SayHello_()));

  generateEvent(` +
      "`ResultSayHello:'${massa_transformer_base64_encode(response)}'`" +
      `);
  return response.buffer;
}`;

    const node = parseFunction('export function SayHello(): string {}');
    massaExportTransformer.transform(node);
    const w = generateWrapper(node, massaExportTransformer.updates);

    expect(w).toStrictEqual(wrapper);
  });
});
describe('generateImports', () => {
  it('should return an empty array when args and returnedType are empty', () => {
    const expectedImports: string[] = [];

    const node = parseFunction('export function SayHello(): void {}');
    massaExportTransformer.transform(node);
    const i = generateImports(node);

    expect(i).toStrictEqual(expectedImports);
  });

  it('should return only deserializing helper when args is not an empty and returnedType is', () => {
    const expectedImports = [
      `import { decodeSayHelloHelper } from "./SayHelloHelper";`,
    ];

    const node = parseFunction(
      'export function SayHello(language: string, name: string): void {}',
    );
    massaExportTransformer.transform(node);
    const i = generateImports(node);

    expect(i).toStrictEqual(expectedImports);
  });

  it('should return (de)serializing helpers and generatedEvent when args is empty and returnedType is not', () => {
    const expectedImports = [
      `import { SayHelloRHelper, encodeSayHelloRHelper } from "./SayHelloRHelper";`,
    ];

    const node = parseFunction('export function SayHello(): string {}');
    massaExportTransformer.transform(node);
    const i = generateImports(node);

    expect(i).toStrictEqual(expectedImports);
  });

  it('should return everything when args and returnedType are not empty', () => {
    const expectedImports = [
      `import { decodeSayHelloHelper } from "./SayHelloHelper";`,
      `import { SayHelloRHelper, encodeSayHelloRHelper } from "./SayHelloRHelper";`,
    ];

    const node = parseFunction(
      'export function SayHello(language: string, name: string): string {}',
    );
    massaExportTransformer.transform(node);
    const i = generateImports(node);

    expect(i).toStrictEqual(expectedImports);
  });
});
