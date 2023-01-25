import { Currency } from './currency';
import { Result } from './result';
import { Args } from './argument';

/**
 * Value in currency to express an amount.
 *
 * For instance $10.34 will be instantiate as the following:
 *
 * @example
 * ```typescript
 * const dollar = new Currency("dollar", 2);
 * const price = new Amount(1034, dollar);
 * ```
 */
export class Amount {
  /**
   * Creates a new Amount;
   *
   * @param value - Amount value.
   * @param currency - Amount currency.
   */
  constructor(
    public value: u64 = 0,
    public currency: Currency = new Currency(),
  ) {}

  /**
   * Adds two amounts and return results in a new one.
   *
   * @param  a - Amount to add.
   */
  add(a: Amount): Result<Amount> {
    if (this.currency != a.currency) {
      return new Result(
        new Amount(),
        'the sum is impossible: the amounts have different currencies',
      );
    }

    if (a.value > u64.MAX_VALUE - this.value) {
      // tests overflow
      return new Result(new Amount(), 'the sum is impossible: overflow');
    }

    return new Result(new Amount(this.value + a.value, this.currency));
  }

  /**
   * Substracts two amounts and return results in a new one.
   *
   * @param  a - Amount to substract.
   */
  substract(a: Amount): Result<Amount> {
    if (this.currency != a.currency) {
      return new Result(
        new Amount(),
        'the difference is impossible: the amounts have different currencies',
      );
    }

    if (a.value > this.value) {
      // tests underflow
      return new Result(
        new Amount(),
        'the difference is impossible: underflow',
      );
    }

    return new Result(new Amount(this.value - a.value, this.currency));
  }

  /**
   * Check if existent amount is lower than given one.
   *
   * @param  a - Amount to check against.
   */
  @operator('<')
  lessThan(a: Amount): bool {
    return this.value < a.value;
  }

  /**
   * Creates a Result Amount from given argument
   *
   * @param args - Argument to deserialize.
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
   * Updates Args with current currency serialized.
   *
   * @param args -
   */
  addArgs(args: Args): void {
    args.add(this.value);
    this.currency.addArgs(args);
  }

  /**
   * Returns a new Args containing current currency serialized.
   */
  toArgs(): Args {
    const args = new Args();

    this.addArgs(args);

    return args;
  }

  /**
   * Tests if two amounts are identical.
   *
   *  @param other -
   */
  @operator('==')
  equals(other: Amount): boolean {
    return this.currency == other.currency && this.value == other.value;
  }

  /**
   * Tests if two amounts are different.
   *
   *  @param other -
   */
  @operator('!=')
  notEqual(other: Amount): boolean {
    return !(this == other);
  }
}
