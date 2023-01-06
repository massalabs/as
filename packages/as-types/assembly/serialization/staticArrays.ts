/**
 * Converts StaticArray<u8> to Uint8Array.
 *
 * @return {string} Uint8Array
 */
@inline
export function wrapStaticArray(arr: StaticArray<u8>): Uint8Array {
  return Uint8Array.wrap(changetype<ArrayBuffer>(arr));
}

/**
 * Converts a Uint8Array to StaticArray<u8>.
 *
 * @return StaticArray<u8>
 */
@inline
export function unwrapStaticArray(arr: Uint8Array): StaticArray<u8> {
  return changetype<StaticArray<u8>>(arr.buffer);
}
