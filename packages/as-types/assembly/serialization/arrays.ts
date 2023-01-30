// inspired by https://github.com/AssemblyScript/assemblyscript/blob/main/std/assembly/array.ts#L69-L81

export function arrayToBytes<T>(source: T[]): StaticArray<u8> {
  const sourceLength = source.length;

  // ensures that the new array has the proper length.
  // u16 are encoded using 4 bytes, u64 uses 8
  // hence we need to multiple by 2 (swap bit) the right number of time (alignof<T>)
  let targetLength = (<usize>sourceLength) << alignof<T>();

  // allocates a new StaticArray<u8> in the memory
  let target = changetype<StaticArray<u8>>(
    // @ts-ignore: Cannot find name '__new'
    __new(targetLength, idof<StaticArray<u8>>()),
  );

  // copies the content of the source buffer to the newly allocated array.
  // Note: the pointer to the data buffer for Typed Array is in dataStart.
  // There is no such things for StaticArray.
  memory.copy(changetype<usize>(target), source.dataStart, targetLength);

  return target;
}

export function bytesToArray<T>(array: StaticArray<u8>): T[] {
  let bufferSize = array.length;
  const arr = instantiate<T[]>(bufferSize >> alignof<T>());
  memory.copy(arr.dataStart, changetype<usize>(array), bufferSize);

  return arr;
}
