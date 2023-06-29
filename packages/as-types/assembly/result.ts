import { Args } from './argument';
import { Serializable } from './serializable';

/**
 * This module contains the 'Result' class, which represents wrapper for a value that can be either
 * a success or an error.
 *
 * The 'Result' class provides methods to {@link unwrap} the value, {@link expect} a value
 * or {@link isOk} or {@link isErr} to check if the result is successful.
 *
 */

export class Result<T extends Serializable> implements Serializable {
  /**
   * Initializes a Result object.
   *
   * @param value - expected value for passing case
   * @param error - error message for non-passing case
   *
   */
  constructor(private value: T, public error: string | null = null) {}

  /**
   * Serializes a Result into an 'array of bytes'.
   *
   * @see {@link Serializable}
   *
   * @returns the serialized data as a 'StaticArray<u8>'.
   *
   */
  serialize(): StaticArray<u8> {
    let errorString: string = this.error !== null ? this.error : '';
    return new Args()
      .add<bool>(this.isOk())
      .add<T>(this.value)
      .add<string>(errorString)
      .serialize();
  }

  /**
   * Deserializes a Result from an 'array of bytes'.
   *
   * @see {@link Serializable}
   *
   * @param data - The 'array of bytes' to deserialize.
   * @param offset - The position in the 'array of bytes' to start reading from.
   *
   * @returns Result containing either an the new offset of the byte array or an Error.
   */
  deserialize(data: StaticArray<u8>, offset: i32): Result<i32> {
    let args = new Args(data, offset);
    const resultOk = args.nextBool();

    if (resultOk.isErr()) {
      return new Result(0, "Can't deserialize Result.");
    }

    const resultValue = args.nextSerializable<T>();

    if (resultValue.isErr()) {
      return new Result(0, "Can't deserialize Value.");
    }

    const resultError = args.nextString();

    if (resultError.isErr()) {
      return new Result(0, "Can't deserialize Error.");
    }

    this.value = resultValue.unwrap();
    this.error = resultError.unwrap();

    return new Result(args.offset);
  }

  /**
   * Determines if the `Result` represents a successful outcome.
   *
   * @returns true if the Result is okay, false otherwise.
   */
  @inline
  isOk(): bool {
    return !this.error;
  }

  /**
   * Determines if the `Result` represents a failed outcome.
   *
   * @returns true if the Result is not okay, false otherwise.
   */
  @inline
  isErr(): bool {
    return !this.isOk();
  }

  /**
   * Returns the value if the `Result` is successful. Throws an assertion error if not.
   *
   * @param msg - The message to be displayed if the `Result` has failed.
   *
   * @returns The value if the `Result` is successful.
   *
   * @throws If there is an error in the result, it throws an assertion error with the given message.
   */
  @inline
  expect(msg: string): NonNullable<T> {
    if (this.isErr()) {
      assert(false, `${msg}: ${this.error!}`);
    }

    return this.getValue();
  }

  /**
   * Get the value of the Result.
   *
   * @remarks This method panics if the Result is an error.
   *
   * @returns The value of the `Result` if successful.
   *
   * @throws If there is an error in the result, it throws an assertion error with the given message.
   */
  @inline
  unwrap(): NonNullable<T> {
    if (!this.isOk()) {
      assert(false, this.error!);
    }

    return this.getValue();
  }

  /**
   * Get the value of the Result
   *
   * @remarks This method retrieves the value of the Result and also handles nullable types.
   *
   * @returns the value of the Result
   */
  @inline
  private getValue(): NonNullable<T> {
    if (isNullable<T>()) {
      return this.value!;
    } else {
      // @ts-ignore: not nullable
      return this.value;
    }
  }
}
