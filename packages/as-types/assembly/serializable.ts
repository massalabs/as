import { Result } from './result';

/**
 * Implement this interface so that you can use `Args` to serialize/de-serialize your objects.
 *
 * The constructor of the class implementing this interface must have default value for each argument.
 *
 * @example
 * ```typescript
 * const args = new Args().add(new Address(input)); // serialize
 * const address = args.nextSerializable(new Address()).unwrap();
 * ```
 */
export interface Serializable {
  /**
   * @returns the bytes
   */
  serialize(): StaticArray<u8>;

  /**
   * @remarks it must modify the current object
   * @param data - the serialized data
   * @param offset - current offset
   * @returns the new offset wrapped in a `Result`
   * @see {@link Args.nextSerializable}
   */
  deserialize(data: StaticArray<u8>, offset: i32): Result<i32>;
}
