/**
 * This module provides utility functions for serializing and deserializing arrays of both native
 * types and objects implementing the {@link Serializable} interface. The serialization process
 * converts arrays into StaticArray<u8> and the deserialization process converts StaticArray<u8>
 * back to arrays of the original type. These utilities are helpful for working with data in a format
 * that can be easily stored or transmitted.
 *
 */

import { Result } from '../result';
import { Serializable } from '../serializable';

/**
 * Convert an array of type parameter to StaticArray<u8>
 *
 * @remarks
 * This will perform a deep copy only for native types.
 * inspired by https://github.com/AssemblyScript/assemblyscript/blob/main/std/assembly/array.ts#L69-L81
 *
 *
 * @privateRemarks
 * The length of the new array is calculated based on the length of the source array and the alignment
 * of the type parameter T.
 * A new StaticArray<u8> is allocated in memory and the content of the source buffer is copied to
 * the newly allocated array.
 * Note: the pointer to the data buffer for Typed Array is in dataStart.
 * There is no such thing for StaticArray.
 *
 *
 * @param source - the array to convert
 *
 * @returns The converted StaticArray<u8> (byte array) representation of the native type array.
 */
export function nativeTypeArrayToBytes<T>(source: T[]): StaticArray<u8> {
  const sourceLength = source.length;

  let targetLength = (<usize>sourceLength) << alignof<T>();

  let target = changetype<StaticArray<u8>>(
    // @ts-ignore: Cannot find name '__new'
    __new(targetLength, idof<StaticArray<u8>>()),
  );

  memory.copy(changetype<usize>(target), source.dataStart, targetLength);

  return target;
}

/**
 * Serialize a serializable objects array into a `StaticArray<u8>` (byte array).
 *
 * @remarks
 * This function performs a deep copy of serializable objects. It is inspired
 * by the AssemblyScript standard library array implementation.
 *
 * @see {@link https://github.com/AssemblyScript/assemblyscript/blob/main/std/assembly/array.ts#L69-L81
 * | AssemblyScript array implementation}
 *
 * @param source - The array of serializable objects to convert to bytes.
 *
 * @returns The converted StaticArray<u8> (byte array) representation of the serializable objects array.
 */
export function serializableObjectsArrayToBytes<T extends Serializable>(
  source: T[],
): StaticArray<u8> {
  const nbElements = source.length;
  const pointers = new Array<usize>(nbElements);
  const sizes = new Array<usize>(nbElements);
  let totalLength = 0;

  for (let i = 0; i < nbElements; i++) {
    const bytes: StaticArray<u8> = source[i].serialize();

    pointers[i] = changetype<usize>(bytes);
    sizes[i] = bytes.length;
    totalLength += bytes.length;
  }

  const target = changetype<StaticArray<u8>>(
    // @ts-ignore: Cannot find name '__new'
    __new(totalLength, idof<StaticArray<u8>>()),
  );

  let offset: usize = 0;
  for (let i = 0; i < nbElements; i++) {
    memory.copy(changetype<usize>(target) + offset, pointers[i], sizes[i]);
    offset += sizes[i];
  }

  return target;
}

/**
 * Deserialize a byte array into a native type array.
 *
 * @remarks
 * This function is inspired by the AssemblyScript standard library array implementation.
 *
 * @see {@link https://github.com/AssemblyScript/assemblyscript/blob/main/std/assembly/array.ts#L69-L81
 * | AssemblyScript array implementation}
 *
 * @param source - The byte array to convert into a native type array.
 *
 * @returns The converted native type array representation of the byte array.
 */
export function bytesToNativeTypeArray<T>(source: StaticArray<u8>): T[] {
  let bufferSize = source.length;
  const array = instantiate<T[]>(bufferSize >> alignof<T>());
  memory.copy(array.dataStart, changetype<usize>(source), bufferSize);

  return array;
}

/**
 * Deserialize a byte array into a serializable objects array.
 *
 * @remarks
 * This function takes a `StaticArray<u8>` and attempts to deserialize it into
 * an array of serializable objects. If deserialization is unsuccessful, a
 * `Result` object containing an error message is returned.
 *
 * @param source - The byte array to convert into a serializable objects array.
 *
 * @returns A `Result` object containing either the successfully deserialized
 * array of serializable objects or an error message.
 */
export function bytesToSerializableObjectArray<T extends Serializable>(
  source: StaticArray<u8>,
): Result<T[]> {
  const array = instantiate<T[]>(0);

  let offset = 0;

  while (offset < source.length) {
    const object = instantiate<T>();
    const result = object.deserialize(source, offset);
    if (result.isErr()) {
      return new Result(
        [],
        `Can't deserialize array of object ${typeof object}`,
      );
    }
    offset = result.unwrap();
    array.push(object);
  }

  return new Result(array);
}
