import { Currency } from './currency';
import { Result } from './result';
import { Args } from './argument';
import { Serializable } from './serializable';

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
export class Amount implements Serializable {
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
   * Serializes an Amount into an 'array of bytes'.
   *
   * @see {@link Serializable}
   *
   * @returns the serialized data as a 'StaticArray<u8>'.
   *
   */
  serialize(): StaticArray<u8> {
    return new Args()
      .add<u64>(this.value)
      .add<Currency>(this.currency)
      .serialize();
  }

  /**
   * Deserializes an Amount from an 'array of bytes'.
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
    const resultValue = args.nextU64();

    if (resultValue.isErr()) {
      return new Result(0, "Can't deserialize Value.");
    }

    const resultCurrency = args.nextSerializable<Currency>();

    if (resultCurrency.isErr()) {
      return new Result(0, "Can't deserialize Currency.");
    }

    this.value = resultValue.unwrap();
    this.currency = resultCurrency.unwrap();

    return new Result(args.offset);
  }

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
   * Check if existent amount is greater than given one.
   *
   * @remarks
   * Comparison between amounts with different {@link Currency} will result in returning false.
   *
   * @param  other - Amount to check against.
   *
   * @returns true if the amount is greater than the given one.
   */
  @operator('>')
  greaterThan(other: Amount): bool {
    if (this.currency != other.currency) {
      return false;
    }
    return this.value > other.value;
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
