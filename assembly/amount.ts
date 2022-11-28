import {Currency} from './currency';
import {Result} from './result';
import {Args} from './argument';

/**
 * Value in currency to express an amount.
 *
 * For instance $10.34 will be instanciate as the following:
 *
 * const dollar = new Currency("dollar", 2);
 * const price = new Amount(1034, dollar);
 *
 */
export class Amount {
  /**
   * Creates a new Amount;
   *
   * @param {u64} value - Amount value.
   * @param {Currency} currency - Amount currency.
   */
  constructor(
    public value: u64 = 0,
    public currency: Currency = new Currency(),
  ) {}

  /**
   * Adds two amounts and return results in a new one.
   *
   * @param {Amount} a - Amout to add.
   *
   * @return {Amount}
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
   * @param {Amount} a - Amount to substract.
   *
   * @return {Amount}
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
   * @param {Amount} a - Amount to check against.
   *
   * @return {bool}
   */
  @operator('<')
  lessThan(a: Amount): bool {
    return this.value < a.value;
  }

  /**
   * Creates a Result Amount from given argument
   *
   * @param {Args} args
   * @return {Result<Amount>}
   */
  static fromArgs(args: Args): Result<Amount> {
    const value = args.nextU64();
    if (!value.isOk()) {
      return new Result(new Amount(), 'deserializing Amount: ' + value.error!);
    }

    const currency = Currency.fromArgs(args);
    if (!currency.isOk()) {
      return new Result(
        new Amount(),
        'deserializing Amount: ' + currency.error!,
      );
    }

    return new Result(new Amount(value.value, currency.value));
  }

  /**
   * Updates Args with current currency serialized.
   */
  addArgs(args: Args): void {
    args.add(this.value);
    this.currency.addArgs(args);
  }

  /**
   * Returns a new Args containing current currency serialized.
   *
   * @return {Args}
   */
  toArgs(): Args {
    const args = new Args();

    this.addArgs(args);

    return args;
  }

  /**
   * Tests if two amounts are identical.
   *
   * @param {Amount} other
   * @return {boolean}
   */
  @operator('==')
  equals(other: Amount): boolean {
    return this.currency == other.currency && this.value == other.value;
  }

  /**
   * Tests if two amounts are different.
   *
   * @param {Amount} other
   * @return {boolean}
   */
  @operator('!=')
  notEqual(other: Amount): boolean {
    return !(this == other);
  }
}
