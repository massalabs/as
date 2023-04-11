import { Argument, capitalizeFirstLetter } from './protobufABI.js';

export function createWrapperFunction(name: string, args: Argument[]): string {
  const argNames = args.map((arg) => `args.${arg.name}`).join(', ');
  const capitalizedName = capitalizeFirstLetter(name);
  const responseName = `${capitalizedName}Response`;

  return `export function ${name}(_args: StaticArray<u8>): StaticArray<u8> {
    const args = decode${capitalizedName}(Uint8Array.wrap(changetype<ArrayBuffer>(_args)));
    const response = encode${capitalizedName}Response(new ${responseName}(_${name}(${argNames})));

    generateEvent("${responseName}: " + uint8ArrayToHexString(response));

    return changetype<StaticArray<u8>>(response.buffer);
}`;
}
