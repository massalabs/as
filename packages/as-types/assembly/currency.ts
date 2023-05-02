/* eslint-disable max-len */
import { Args } from './argument';
import { Result } from './result';
import { Serializable } from './serializable';

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
export class Currency implements Serializable {
  /**
   * Creates a new instance of Currency.
   *
   * @param name - name of the currency.
   * @param minorUnit - minor unit of the currency.
   */
  constructor(public name: string = '', public minorUnit: u8 = 0) {}

  /**
   * Serializes a Currency into an 'array of bytes'.
   *
   * @see {@link Serializable}
   *
   * @returns the serialized data as a 'StaticArray<u8>'.
   */
  serialize(): StaticArray<u8> {
    return new Args().add(this.name).add(this.minorUnit).serialize();
  }

  /**
   * Deserializes a Currency from an 'array of bytes'.
   *
   * @see {@link Serializable}
   *
   * @param data - The 'array of bytes' to deserialize.
   * @param offset - The position in the 'array of bytes' to start reading from.
   *
   * @returns Result containing either an the new offset of the byte array or an Error.
   */
  deserialize(data: StaticArray<u8>, offset: i32): Result<i32> {
    let args = new Args(data, offset);
    const resultName = args.nextString();

    if (resultName.isErr()) {
      return new Result(0, "Can't deserialize Name.");
    }

    const resultMinorUnit = args.nextU8();

    if (resultMinorUnit.isErr()) {
      return new Result(0, "Can't deserialize MinorUnit.");
    }

    this.name = resultName.unwrap();
    this.minorUnit = resultMinorUnit.unwrap();

    return new Result(args.offset);
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
