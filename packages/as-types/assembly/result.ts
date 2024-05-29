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
   * Gets the value of the Result or returns the generic type default value.
   *
   * @returns The value of the Result if it is successful, otherwise returns the default value of the generic type.
   */
  unwrapOrDefault(): NonNullable<T> {
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
