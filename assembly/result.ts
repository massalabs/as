/**
 * Create a Result object.
 * A result can be:
 * - expected Type if the treatment was executed as planed.
 * - an error if something went wrong.
 */
export class Result<T> {
  constructor(
    // expected value for passing case
    public value: T,
    // error unique id for non-passing case
    public errorUniqueId: string | null = null,
    // error message for non-passing case
    public errorDescription: string | null = null,
  ) {}

  /**
   * Checks that the result is okay.
   * @return {boolean}
   */
  isOk(): bool {
    return !this.errorUniqueId;
  }

  /**
   * Checks that the result is okay and panic if not.
   *
   * @param {string} msg - panic message that will prefix the error content.
   * @return {NonNullable<T>}
   */
  expect(msg: string | null = null): NonNullable<T> {
    if (!this.isOk()) {
      assert(
        false,
        msg ? `${msg}: ${this.errorDescription!}` : `${this.errorDescription!}`,
      );
    }

    if (isNullable<T>()) {
      return this.value!;
    } else {
      // @ts-ignore: not nullable
      return this.value;
    }
  }

  /**
   * Checks that error has the given id.
   * If no id is given, it will only check that Result is an error (i.e. any id are matched.)
   *
   * @param id error unique id
   * @returns
   */
  isError(id: string | null = null): bool {
    if (id === null) {
      return !this.isOk();
    }
    return id === this.errorUniqueId;
  }
}
