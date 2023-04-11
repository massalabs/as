import type { TypeKind } from 'assemblyscript/dist/assemblyscript';

export interface Argument {
  name: string;
  type: TypeKind;
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
