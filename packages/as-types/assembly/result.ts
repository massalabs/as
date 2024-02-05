/**
 * This module contains the 'Result' class, which represents wrapper for a value that can be either
 * a success or an error.
 *
 * The 'Result' class provides methods to {@link unwrap} the value, {@link expect} a value
 * or {@link isOk} or {@link isErr} to check if the result is successful.
 *
 */

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
