/* eslint-disable max-len */
import { Args } from './argument';
import { Result } from './result';

/**
 * Monetary unit used to express a value.
 *
 * The minor unit of a currency, as described in the ISO 4217 standard,
 * is the maximal size of the fractional part that can be used
 * to describe the value when in a decimal form.
 *
 * For instance, US dollar has a minor unit of 2. This means that value
 * in US dollar must be express with two digits after the decimal separator
 * like in the following: 10.34
 * This can be done with the following instantiation:
 *
 * const dollar = new Currency("dollar", 2);
 */
export class Currency {
  /**
   * Creates a new instance of Currency.
   *
   * @param {string} name - name of the currency.
   * @param {u8} minorUnit - minor unit of the currency.
   */
  constructor(public name: string = '', public minorUnit: u8 = 0) {}

  /**
   * Creates a Result Currency from given argument
   *
   * @param {Args} args
   * @return {Result<Currency>}
   */
  static fromArgs(args: Args): Result<Currency> {
    const minorUnit = args.nextU8();
    if (minorUnit.isErr()) {
      return new Result(new Currency(), minorUnit.error);
    }

    const name = args.nextString();
    if (name.isErr()) {
      return new Result(new Currency(), name.error);
    }

    return new Result(new Currency(name.unwrap(), minorUnit.unwrap()));
  }

  /**
   * Updates Args with current currency serialized.
   */
  addArgs(args: Args): void {
    args.add(this.minorUnit);
    args.add(this.name);
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
   * Checks if both currencies are the same.
   *
   * @param {Currency} other
   * @return {boolean}
   */
  @operator('==')
  equals(other: Currency): boolean {
    return this.minorUnit == other.minorUnit && this.name == other.name;
  }

  /**
   * Checks if both currencies are different.
   *
   * @param {Currency} other
   * @return {boolean}
   */
  @operator('!=')
  notEqual(other: Currency): boolean {
    return !(this == other);
  }
}
