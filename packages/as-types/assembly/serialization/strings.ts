/**
 * Converts utf-16 string to a StaticArray<u8>.
 *
 * @remarks
 * If the string is empty, returns an empty array.
 *
 * @param str - the string to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function stringToBytes(str: string): StaticArray<u8> {
  if (!str.length) {
    return [];
  }
  return changetype<StaticArray<u8>>(String.UTF8.encode(str));
}

/**
 * Converts StaticArray<u8> to a string.
 *
 * @remarks
 * If the array is empty, returns an empty string.
 *
 * @param arr - the array to convert
 *
 * @returns the converted string
 */
export function bytesToString(arr: StaticArray<u8>): string {
  if (!arr.length) {
    return '';
  }
  return String.UTF8.decode(changetype<ArrayBuffer>(arr));
}
