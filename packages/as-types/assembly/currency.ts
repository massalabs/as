/* eslint-disable max-len */
import { Args } from './argument';
import { Result } from './result';

/**
 * Monetary unit used to express a value.
 *
 * @remarks
 * The minor unit of a currency, as described in the ISO 4217 standard,
 * is the maximal size of the fractional part that can be used
 * to describe the value when in a decimal form.
 *
 * @example
 * For instance, US dollar has a minor unit of 2. This means that value
 * in US dollar must be express with two digits after the decimal separator
 * like in the following: 10.34
 *
 * This can be done with the following instantiation:
 *
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
   * Deserializes a Currency from an {@link Args} 'array of bytes'.
   *
   * @param args - the serialized arguments containing the currency data.
   *
   * @returns Result containing either a Currency or an Error.
   * - The deserialized Currency.
   * - An error message if there is an error with deserializing the 'minorUnit'.
   * - An error message if there is an error with deserializing the 'name'.
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
   * Serializes and adds the Currency to the given serialized {@link Args}.
   *
   * @param args -The arguments to add the serialized Currency to.
   */
  addArgs(args: Args): void {
    args.add(this.minorUnit);
    args.add(this.name);
  }

  /**
   * Serializes the Currency to a new {@link Args} object.
   *
   * @returns The serialized Currency as {@link Args}.
   */
  toArgs(): Args {
    const args = new Args();

    this.addArgs(args);

    return args;
  }

  /**
   * Tests if two currencies are identical.
   *
   * @remarks
   * Two currencies are identical if they have the same 'minorUnit' as well as the same 'name'!
   *
   * @param other - Currency to check against.
   *
   * @returns true if the currencies are identical.
   */
  @operator('==')
  equals(other: Currency): boolean {
    return this.minorUnit == other.minorUnit && this.name == other.name;
  }

  /**
   * Tests if two currencies are different.
   *
   * @remarks
   * Two currencies are different if they have the same 'name' but a different 'minorUnit' value!
   *
   * @param other - Currency to check against.
   *
   * @returns true if the currencies are different.
   */
  @operator('!=')
  notEqual(other: Currency): boolean {
    return !(this == other);
  }
}
