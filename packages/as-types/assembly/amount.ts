import { Currency } from './currency';
import { Result } from './result';
import { Args } from './argument';

/**
 * This module contains the 'Amount' class, which is a useful representation of a {@link Currency} value.
 *
 * @remarks
 * The 'Amount' class provides the following methods {@link add} and {@link subtract}
 * to perform basic arithmetic operations between amounts of the same currency.
 *
 * It also provides the following comparison methods {@link lessThan},{@link equals} and {@link notEqual}.
 *
 * Best practice:
 * Before manipulating several `Amount` objects, you should always check if they use the same {@link Currency}.
 *
 * @example
 * ```typescript
 * const dollar = new Currency("dollar", 2);
 * const price = new Amount(1034, dollar);
 * ```
 */
export class Amount {
  /**
   * Creates a new Amount.
   *
   * @param value - The amount value.
   * @param currency - The currency (optional).
   */
  constructor(
    public value: u64 = 0,
    public currency: Currency = new Currency(),
  ) {}

  /**
   * Adds two amounts and return results in a new one.
   *
   * @param  other - The other Amount to add.
   *
   * @see {@link Result} for more information about the return type.
   *
   * @returns
   * A Result object containing:
   * - The new Amount if operation was successful.
   * - An error message if:
   *    - the Amount objects are not the same.
   *    - the addition would overflow of the 'u64.MAX_VALUE' limit.
   *
   */
  @operator('+')
  add(other: Amount): Result<Amount> {
    if (this.currency != other.currency) {
      return new Result(
        new Amount(),
        'the sum is impossible: the amounts have different currencies',
      );
    }

    if (other.value > u64.MAX_VALUE - this.value) {
      // tests overflow
      return new Result(new Amount(), 'the sum is impossible: overflow');
    }

    return new Result(new Amount(this.value + other.value, this.currency));
  }

  /**
   * Subtracts two amounts and return results in a new one.
   *
   * @see {@link Result} for more information about the return type.
   *
   * @param  other - Amount to subtract.
   *
   * @returns
   * A Result object containing:
   * - The new Amount if the operation was successful.
   * - An error message if:
   *    - the currency is not the same between the two amounts.
   *    - the subtraction would underflow .
   */
  @operator('-')
  subtract(other: Amount): Result<Amount> {
    if (this.currency != other.currency) {
      return new Result(
        new Amount(),
        'the difference is impossible: the amounts have different currencies',
      );
    }

    if (other.value > this.value) {
      // tests underflow
      return new Result(
        new Amount(),
        'the difference is impossible: underflow',
      );
    }

    return new Result(new Amount(this.value - other.value, this.currency));
  }

  /**
   * Check if existent amount is lower than given one.
   *
   * @remarks
   * Comparison between amounts with different {@link Currency} will result in returning false.
   *
   * @param  other - Amount to check against.
   *
   * @returns true if the amount is lower than the given one.
   */
  @operator('<')
  lessThan(other: Amount): bool {
    if (this.currency != other.currency) {
      return false;
    }
    return this.value < other.value;
  }

  /**
   * Deserializes an Amount from an {@link Args} 'array of bytes'.
   *
   * @see {@link Result} for more information about the return type.
   *
   * @param args - Argument to deserialize.
   *
   * @returns
   * A Result object containing:
   * - The deserialized Amount if succeeded.
   * - An error message if:
   *  - if there is an error with deserializing the 'value'.
   *  - if there is an error with deserializing the 'currency'.
   */
  static fromArgs(args: Args): Result<Amount> {
    const value = args.nextU64();
    if (value.isErr()) {
      return new Result(new Amount(), 'deserializing Amount: ' + value.error!);
    }

    const currency = Currency.fromArgs(args);
    if (currency.isErr()) {
      return new Result(
        new Amount(),
        'deserializing Currency: ' + currency.error!,
      );
    }

    return new Result(new Amount(value.unwrap(), currency.unwrap()));
  }

  /**
   * Serializes and adds the Amount to the given serialized {@link Args}.
   *
   * @param args -The arguments to add the serialized Amount to.
   */
  addArgs(args: Args): void {
    args.add(this.value);
    this.currency.addArgs(args);
  }

  /**
   * Serializes the Amount to a new {@link Args} object.
   *
   * @returns The serialized Amount as {@link Args}.
   */
  toArgs(): Args {
    const args = new Args();

    this.addArgs(args);

    return args;
  }

  /**
   * Tests if two amounts are identical.
   *
   * @remarks
   * Two amounts are identical if they have the same value as well as the same currency type!
   *
   * @param other - Amount to check against.
   *
   * @returns true if the amounts are identical.
   */
  @operator('==')
  equals(other: Amount): boolean {
    return this.currency == other.currency && this.value == other.value;
  }

  /**
   * Tests if two amounts are different.
   *
   * @remarks
   * Two amounts are different if they have the same currency type even if they have the same value!
   *
   * @param other - Amount to check against.
   *
   * @returns true if the amounts are different.
   */
  @operator('!=')
  notEqual(other: Amount): boolean {
    return !(this == other);
  }
}
