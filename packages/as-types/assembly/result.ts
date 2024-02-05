/**
 * This module contains the 'Result' class, which represents wrapper for a value that can be either
 * a success or an error.
 *
 * The 'Result' class provides methods to {@link unwrap} the value, {@link expect} a value
 * or {@link isOk} or {@link isErr} to check if the result is successful.
 *
 */
import { Args } from './argument';
import { Serializable } from './serializable';

export class Result<T> {
  /**
   * Initializes a Result object.
   *
   * @param value - expected value for passing case
   * @param error - error message for non-passing case
   *
   */
  constructor(protected value: T, protected error: string | null = null) {}

  /**
   * Creates a new `Result` object with a successful outcome.
   * 
   * @param t - The value to be wrapped in a `Result` object.
   * @returns A new `Result` object with a successful outcome.
   * 
   */
  static fromOk<T>(t: T): Result<T> {
    return new Result<T>(t, null);
  }

  /**
   * Creates a new `Result` object with a failed outcome.
   * 
   * @param t - The value to be wrapped in a `Result` object.
   * @param e - The error message to be wrapped in a `Result` object.
   * @returns A new `Result` object with a failed outcome.
   * 
   */
  static fromErr<T>(t: T, e: string): Result<T> {
    return new Result<T>(t, e);
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

export class SerializableResult<T extends Serializable>
  extends Result<T>
  implements Serializable
{
  /**
   * Create a new `SerializableResult` object from a `Result` with a value type that implements `Serializable`.
   * @param arg - The `Result` object to be converted to a `SerializableResult` object.
   * @returns A new `SerializableResult` object.
   */
  static fromResult<T extends Serializable>(arg: Result<T>): SerializableResult<T> {
    if (arg.isOk()) {
      return new SerializableResult(arg.value, null);
    } else {
      return new SerializableResult<T>(arg.value, arg.error);
    }
  }

  /**
   * Create a new `Result` object from a `SerializableResult` object.
   * 
   * @param arg - The `SerializableResult` object to be converted to a `Result` object.
   * @returns A new `Result` object.
   * 
   */
  static toResult<T extends Serializable>(arg: SerializableResult<T>): Result<T> {
    if (arg.isOk()) {
      return new Result(arg.value, null);
    } else {
      return new Result<T>(arg.value, arg.error);
    }
  }

  /**
   * Initializes a `SerializableResult` object.
   * 
   * @param value - The value to be wrapped in a `SerializableResult` object.
   * @returns A new `SerializableResult` object with a successful outcome.
   * 
   */
  static fromOk<T extends Serializable>(t: T): SerializableResult<T> {
    return new SerializableResult<T>(t, null);
  }

  /**
   * Initializes a `SerializableResult` object.
   * 
   * @param t - The value to be wrapped in a `SerializableResult` object.
   * @param e - The error message to be wrapped in a `SerializableResult` object.
   * @returns A new `SerializableResult` object with a failed outcome.
   * 
   */
  static fromErr<T extends Serializable>(t: T, e: string): SerializableResult<T> {
    return new SerializableResult<T>(t, e);
  }

  /**
   * Serialize the `SerializableResult` object.
   * @returns Bytes array representation of the `SerializableResult` object.
   */
  serialize(): StaticArray<u8> {
    if (this.isOk()) {
      return new Args()
        .add<u8>(0)
        .add<T>(<T>this.value)
        .serialize();
    } else {
      // Note: do not ser error msg as it is unused
      return new Args().add<u8>(1).serialize();
    }
  }

  /**
   * Deserialize the `SerializableResult` object.
   * 
   * @param data - The bytes array to be deserialized.
   * @param offset - The position in the bytes array to start reading from.
   * @returns A `Result` object containing either the new offset of the byte array or an error.
   */
  public deserialize(data: StaticArray<u8>, offset: i32 = 0): Result<i32> {
    const args = new Args(data, offset);
    let kind = args.nextU8().expect('Cannot get kind (u8)');
    if (kind == 0) {
      // Ok
      this.value = args.nextSerializable<T>().expect('Cannot get next ser. T');
    } else {
      // Err
      this.error = 'ERROR';
    }

    return new Result(args.offset);
  }
}
