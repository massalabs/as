/**
 * Converts a StaticArray<u8> to boolean.
 *
 * @param {u8} val the number to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function byteToBool(arr: StaticArray<u8>): bool {
  return !!arr[0];
}

/**
 * Converts a boolean to StaticArray<u8>.
 *
 * @param {u8} val the number to convert
 *
 * @returns
 */
export function boolToByte(val: bool): StaticArray<u8> {
  const arr = new StaticArray<u8>(1);
  arr[0] = u8(val);
  return arr;
}
