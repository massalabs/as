/**
 * Converts utf-16 string to a StaticArray<u8>.
 *
 * @param str - the string to convert
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
 * @param arr - the array to convert
 */
export function bytesToString(arr: StaticArray<u8>): string {
  if (!arr.length) {
    return '';
  }
  return String.UTF8.decode(changetype<ArrayBuffer>(arr));
}
