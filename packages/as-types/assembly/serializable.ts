/**
 * Implement this interface so that you can use `Args` to serialize/de-serialize your objects.
 *
 * @example
 * ```typescript
 * const args = new Args().addObject(new Address(input));
 * const deserialized = args.nextObject<Address>(new Address());
 * ```
 */
export interface Serializable<T> {
  /**
   * @returns the bytes
   */
  serialize(): StaticArray<u8>;

  /**
   * @param data - the serialized data
   * @param offset - current offset
   * @returns the length of the deserialized object
   */
  deserialize(data: StaticArray<u8>, offset: i32): i32;
}
