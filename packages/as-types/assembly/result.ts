/**
 * Create a Result object.
 * A result can be:
 * - expected Type if the treatment was executed as planed.
 * - an error if something went wrong.
 */
export class Result<T> {
  constructor(
    // expected value for passing case
    private value: T,
    // error message for non-passing case
    public error: string | null = null,
  ) {}

  /**
   * Checks that the result is okay.
   */
  @inline
  isOk(): bool {
    return !this.error;
  }

  /**
   * Checks that the result is okay.
   */
  @inline
  isErr(): bool {
    return !this.isOk();
  }

  /**
   * Checks that the result is okay and panic if not.
   *
   * @param msg - panic message that will prefix the error content.
   */
  @inline
  expect(msg: string): NonNullable<T> {
    if (this.isErr()) {
      assert(false, `${msg}: ${this.error!}`);
    }

    return this.getValue();
  }

  /**
   * Get the value. Panic if error.
   */
  @inline
  unwrap(): NonNullable<T> {
    if (!this.isOk()) {
      assert(false, this.error!);
    }

    return this.getValue();
  }

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
