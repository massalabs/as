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
 * Convert an array of native numbers to StaticArray<u8>
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
 * Convert an array of object to StaticArray<u8>
 *
 * @remarks
 * This will perform a deep copy only for native types.
 * inspired by https://github.com/AssemblyScript/assemblyscript/blob/main/std/assembly/array.ts#L69-L81
 *
 *
 * @privateRemarks
 * A new StaticArray<u8> is allocated in memory and the content of every elements is copied to
 * the newly allocated array.
 *
 *
 * @param source - the array to convert
 * @param eltSize - The element size in bytes.
 *
 * @returns The converted StaticArray<u8> (byte array) representation of the array.
 */
export function fixedSizeArrayToBytes<T>(source: T[]): StaticArray<u8> {
  const eltSize = offsetof<T>();
  if (!eltSize) {
    ERROR('fixedSizeArrayToBytes: unsupported array type');
  }
  const sourceLength = <usize>source.length;
  const targetLength = sourceLength * eltSize;
  let target = changetype<StaticArray<u8>>(
    // @ts-ignore: Cannot find name '__new'
    __new(targetLength, idof<StaticArray<u8>>()),
  );
  for (let i = 0; i < <i32>sourceLength; i++) {
    const offset = <usize>i * eltSize;
    memory.copy(
      changetype<usize>(target) + offset,
      changetype<usize>(source[i]),
      eltSize,
    );
  }

  return target;
}

/**
 * Deserialize a byte array into a fixed size elements array.
 *
 * @param source - The byte array to convert into a fixed size elements array.
 * @param eltSize - The element size in bytes.
 *
 * @returns The converted type array representation of the byte array.
 */
export function bytesToFixedSizeArray<T>(source: StaticArray<u8>): T[] {
  const eltSize = offsetof<T>();
  if (!eltSize) {
    ERROR('bytesToFixedSizeArray: unsupported array type');
  }
  const bufferSize = source.length;
  const nbElements = bufferSize / <i32>eltSize;

  const array = instantiate<T[]>(nbElements);
  for (let i = 0; i < nbElements; i++) {
    const offset = <usize>i * eltSize;

    const elt = instantiate<T>();
    memory.copy(
      changetype<usize>(elt),
      changetype<usize>(source) + offset,
      eltSize,
    );
    array[i] = elt;
  }
  return array;
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
  let target: StaticArray<u8> = [];

  for (let i = 0; i < source.length; i++) {
    const bytes: StaticArray<u8> = source[i].serialize();
    target = target.concat(bytes);
  }

  return target;
}

/**
 * Deserialize a byte array into a serializable objects array.
 *
 * @remarks
 * This function takes a `StaticArray<u8>` and attempts to deserialize it into
 * an array of serializable objects @see {@link Serializable}. If deserialization is unsuccessful, a
 * `Result` object containing an error message is returned.
 *
 * @param source - The byte array to convert into an array of serializable objects.
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

/**
 * Convert a Uint8Array to a StaticArray<u8>
 *
 * @param arr - The Uint8Array to convert
 *
 * @returns The converted StaticArray<u8> representation of the Uint8Array.
 */
export function staticArrayToUint8Array(
  staticArray: StaticArray<u8>,
): Uint8Array {
  const arr = new Uint8Array(staticArray.length);
  memory.copy(
    changetype<usize>(arr.buffer),
    changetype<usize>(staticArray),
    arr.length,
  );
  return arr;
}
