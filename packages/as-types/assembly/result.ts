/**
 * Create a Result object.
 * A result can be:
 * - expected Type if the treatment was executed as planed.
 * - an error if something went wrong.
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
   * Checks if the Result is okay or not.
   *
   * @returns true if the Result is okay, false otherwise.
   *
   */
  @inline
  isOk(): bool {
    return !this.error;
  }

  /**
   * Checks if the Result is okay or not.
   *
   * @returns true if the Result is not okay, false otherwise.
   *
   */
  @inline
  isErr(): bool {
    return !this.isOk();
  }

  /**
   * Returns the value if the Result is okay. If the Result is not okay, it throws an assertion
   *
   * @param msg - A string representing the message to be shown on error.
   * @returns
   * - Returns the value if the Result is okay.
   * - If the Result is not okay, it throws an assertion error with the given message.
   */
  @inline
  expect(msg: string): NonNullable<T> {
    if (this.isErr()) {
      assert(false, `${msg}: ${this.error!}`);
    }

    return this.getValue();
  }

  /**
   * Get the value of the Result. Panic if error.
   *
   * @returns
   * - The value of the Result if everything went well.
   * - If the Result is not okay, it throws an assertion error with the given message.
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
