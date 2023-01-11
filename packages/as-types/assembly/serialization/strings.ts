/**
 * Converts utf-16 string to a StaticArray<u8>.
 * @param str - the string to convert
 */
export function stringToBytes(str: string): StaticArray<u8> {
  if (!str.length) {
    return [];
  }
  const arr = new StaticArray<u8>(str.length << 1);
  memory.copy(changetype<usize>(arr), changetype<usize>(str), arr.length);
  return arr;
}

/**
 * Converts StaticArray<u8> to a string.
 * @param arr - the array to convert
 */
export function bytesToString(arr: StaticArray<u8>): string {
  if (!arr.length) {
    return '';
  }
  const str = changetype<string>(__new(arr.length, idof<string>()));
  memory.copy(changetype<usize>(str), changetype<usize>(arr), arr.length);
  return str;
}
