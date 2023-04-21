/**
 * Converts a `StaticArray<u8>` to an `Uint8Array`.
 *
 * @param arr - The `StaticArray<u8>` to be converted.
 * @returns An `Uint8Array` representation of the input `StaticArray<u8>`.
 */
// @ts-ignore: decorator
@inline
export function wrapStaticArray(arr: StaticArray<u8>): Uint8Array {
  return Uint8Array.wrap(changetype<ArrayBuffer>(arr));
}

/**
 * Converts an `Uint8Array` to a `StaticArray<u8>`.
 *
 * @param arr - The `Uint8Array` to be converted.
 * @returns A `StaticArray<u8>` representation of the input `Uint8Array`.
 */
// @ts-ignore: decorator
@inline
export function unwrapStaticArray(arr: Uint8Array): StaticArray<u8> {
  return changetype<StaticArray<u8>>(arr.buffer);
}
