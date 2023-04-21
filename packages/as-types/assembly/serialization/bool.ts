/**
 * Converts a StaticArray<u8> to boolean.
 *
 * @remarks
 * This is done by checking if the first byte is 0 or not.
 *
 * @param arr - the StaticArray<u8> to convert
 *
 * @returns the boolean value
 */
// @ts-ignore: decorator
@inline
export function byteToBool(arr: StaticArray<u8>): bool {
  return !!arr[0];
}

/**
 * Converts a boolean to StaticArray<u8>.
 *
 * @param val - the boolean value to convert*
 *
 * @returns the serialized boolean as a byte in a StaticArray<u8> 'byte array'
 */
// @ts-ignore: decorator
@inline
export function boolToByte(val: bool): StaticArray<u8> {
  const arr = new StaticArray<u8>(1);
  arr[0] = u8(val);
  return arr;
}
