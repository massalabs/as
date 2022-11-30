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
 * @example
 * ```typescript
 * const dollar = new Currency("dollar", 2);
 * ```
 */
export class Currency {
  /**
   * Creates a new instance of Currency.
   *
   * @param name - name of the currency.
   * @param minorUnit - minor unit of the currency.
   */
  constructor(public name: string = '', public minorUnit: u8 = 0) {}

  /**
   * Creates a Result Currency from given argument
   *
   * @param args -
   */
  static fromArgs(args: Args): Result<Currency> {
    const minorUnit = args.nextU8();
    if (minorUnit.isErr()) {
      return new Result(new Currency(), minorUnit.errorDescription); // #### Cleaner code here ####
    }

    const name = args.nextString();
    if (name.isErr()) {
      return new Result(new Currency(), name.errorDescription); // #### Cleaner code here ####
    }

    return new Result(new Currency(name.unwrap(), minorUnit.unwrap()));
  }

  /**
   * Updates Args with current currency serialized.
   *
   * @param args -
   */
  addArgs(args: Args): void {
    args.add(this.minorUnit);
    args.add(this.name);
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
   * Checks if both currencies are the same.
   *
   * @param other -
   */
  @operator('==')
  equals(other: Currency): boolean {
    return this.minorUnit == other.minorUnit && this.name == other.name;
  }

  /**
   * Checks if both currencies are different.
   *
   * @param other -
   */
  @operator('!=')
  notEqual(other: Currency): boolean {
    return !(this == other);
  }

  static errorDeserialization<U>(
    context: string,
    original: Result<U>,
  ): Result<Currency> {
    // #### Sentinel error here ####
    return new Result(
      new Currency(),
      'Currency-1',
      `while doing Currency deserialization ${context}: ${original.errorDescription!} (${original.errorUniqueId!})`,
    );
  }
}
