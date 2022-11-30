export function strToArrU8(str: string): StaticArray<u8> {
  const arr = new StaticArray<u8>(str.length << 1);
  memory.copy(changetype<usize>(arr), changetype<usize>(str), arr.length);
  return arr;
}

export function arrU8ToStr(arr: StaticArray<u8>): string {
  return String.UTF8.decode(new ArrayBuffer(arr.length), true);
}
