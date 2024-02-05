/**
 * Converts a UTF-16 string (AssemblyScript's default) to a UTF-8 encoded StaticArray<u8>.
 *
 * @remarks
 * If the string is empty, returns an empty array.
 *
 * @param str - the string to convert
 *
 * @returns A StaticArray<u8> representation of the input string.
 */
export function stringToBytes(str: string): StaticArray<u8> {
  if (!str.length) {
    return [];
  }
  return changetype<StaticArray<u8>>(
    String.UTF8.encode(str, false, String.UTF8.ErrorMode.ERROR),
  );
}

/**
 * Converts a StaticArray<u8> containing UTF-8 encoded data to a UTF-16 string (AssemblyScript's default).
 *
 * @remarks
 * If the array is empty, returns an empty string.
 *
 * @param arr - the array to convert
 *
 * @returns A UTF-16 string representation of the input array.
 */
export function bytesToString(arr: StaticArray<u8>): string {
  if (!arr.length) {
    return '';
  }
  return String.UTF8.decode(changetype<ArrayBuffer>(arr));
}
