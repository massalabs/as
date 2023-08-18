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
  constructor(private value: T, public error: string | null = null) {}

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

export class Result3<T> {
  protected data: T | null = null;
  protected error: string | null = null;

  constructor(data: T | null = null, error: string | null = null) {
    if (data) {
      this.data = data;
    } else if (error) {
      // Default (if data is null & error is null) is to create an Err variant
      this.error = error ? error : '';
    }
  }

  static toOk<T>(t: T): Result3<T> {
    return new Result3(t, null);
  }

  static toErr<T>(e: string): Result3<T> {
    return new Result3<T>(null, e);
  }

  isOk(): bool {
    return !this.error;
  }

  isErr(): bool {
    return !this.isOk();
  }

  unwrap(): T {
    if (!this.isOk()) {
      assert(false, this.error!);
    }

    return <T>this.data;
  }

  expect(msg: string): T {
    if (this.isErr()) {
      assert(false, `${msg}: ${this.error!}`);
    }

    return <T>this.data;
  }
}

export class SResult3<T extends Serializable>
  extends Result3<T>
  implements Serializable
{
  static fromResult<T extends Serializable>(arg: Result3<T>): SResult3<T> {
    if (arg.isOk()) {
      return new SResult3(arg.data, null);
    } else {
      return new SResult3<T>(null, arg.error);
    }
  }

  static toResult<T extends Serializable>(arg: SResult3<T>): Result3<T> {
    if (arg.isOk()) {
      return new Result3(arg.data, null);
    } else {
      return new Result3<T>(null, arg.error);
    }
  }

  static toOk<T extends Serializable>(t: T): SResult3<T> {
    return new SResult3(t, null);
  }

  static toErr<T extends Serializable>(e: string): SResult3<T> {
    return new SResult3(null, e);
  }

  serialize(): StaticArray<u8> {
    if (this.isOk()) {
      return new Args()
        .add<u8>(0)
        .add<T>(<T>this.data)
        .serialize();
    } else {
      // Note: do not ser error msg as it is unused
      return new Args().add<u8>(1).serialize();
    }
  }

  public deserialize(data: StaticArray<u8>, offset: i32 = 0): Result<i32> {
    const args = new Args(data, offset);
    let kind = args.nextU8().expect('Cannot get kind (u8)');
    if (kind == 0) {
      // Ok
      this.data = args.nextSerializable<T>().expect('Cannot get next ser. T');
    } else {
      // Err
      this.error = 'ERROR';
    }

    return new Result(args.offset);
  }
}
