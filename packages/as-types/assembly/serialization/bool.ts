/**
 * Converts a StaticArray<u8> to boolean.
 *
 * @remarks
 * The conversion is performed by checking if the first byte of the
 * `StaticArray<u8>` is non-zero (i.e., it represents a `true` value)
 * or zero (i.e., it represents a `false` value).
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
 * @remarks
 * The conversion is performed by creating a StaticArray<u8> of length 1,
 * where the first byte represents the boolean value.
 * If the value is true, the byte is set to 1, otherwise, it is set to 0.
 *
 * @param val - the boolean value to convert
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
