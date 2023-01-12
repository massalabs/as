/**
 * Converts a StaticArray<u8> to boolean.
 *
 * @param arr - the StaticArray<u8> to convert
 *
 * @returns
 */
@inline
export function byteToBool(arr: StaticArray<u8>): bool {
  return !!arr[0];
}

/**
 * Converts a boolean to StaticArray<u8>.
 *
 * @param val - the number to convert
 *
 * @returns
 */
@inline
export function boolToByte(val: bool): StaticArray<u8> {
  const arr = new StaticArray<u8>(1);
  arr[0] = u8(val);
  return arr;
}
