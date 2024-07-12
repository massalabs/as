import { u256 } from 'as-bignum/assembly';

/**
 * This class provides utility functions for basic arithmetic operations on **unsigned** real positive integers.
 * These functions perform overflow and underflow checks to prevent unwanted behavior
 * when dealing with **unsigned** 256-bit integers (u256). The SafeMath class should be used
 * when working with arithmetic operations that require increased safety and precision.
 *
 * @remarks
 * The SafeMath class is designed to be a drop-in replacement for standard arithmetic
 * operations on unsigned 256-bit integers. By using the methods provided by this class,
 * developers can avoid potential overflow and underflow issues and ensure that their
 * code behaves correctly even in edge cases.
 */
export class SafeMathU256 {
  /**
   * Safely adds two unsigned 256-bit integers (u256), reverting if an
   * overflow occurs.
   *
   * @remarks
   * This function is used to safely add two unsigned 256-bit integers without causing an overflow.
   *
   * @param a - The first operand for addition.
   * @param b - The second operand for addition.
   *
   * @returns The sum of a and b as an unsigned 256-bit integer (u256).
   *
   * @throws if the operation results in a number bigger than u256.Max.
   */
  static add(a: u256, b: u256): u256 {
    assert(b <= u256.Max - a, 'SafeMathU256: addition overflow');

    const c: u256 = a + b;

    return c;
  }

  /**
   * Safely subtracts two unsigned 256-bit integers (u256), reverting if an
   * underflow occurs.
   *
   * @remarks
   * This function is used to safely substract two unsigned 256-bit integers without causing an underflow.
   *
   * @param a - The first operand for subtraction (minuend).
   * @param b - The second operand for subtraction (subtrahend).
   *
   * @returns The difference between a and b as an unsigned 256-bit integer (u256).
   *
   * @throws if the operation results in a number lower than 0.
   */
  static sub(a: u256, b: u256): u256 {
    assert(b <= a, 'SafeMathU256: subtraction overflow');
    const c: u256 = a - b;

    return c;
  }

  /**
   * Safely multiplies two unsigned 256-bit integers (u256), reverting on
   * overflow.
   *
   * @remarks
   * This function is used to safely multiply two unsigned 256-bit integers without causing an overflow.
   *
   * @param a - The first operand for multiplication.
   * @param b - The second operand for multiplication.
   *
   * @returns The product of a and b as an unsigned 256-bit integer (u256).
   *
   * @throws if the operation results in a number bigger than u256.Max.
   */
  static mul(a: u256, b: u256): u256 {
    if (a == u256.Zero) {
      return u256.Zero;
    }
    assert(b <= u256.Max / a, 'SafeMathU256: multiplication overflow');

    const c = a * b;

    return c;
  }

  /**
   * Safely divides two unsigned 256-bit integers (u256), reverting on
   * division by zero. The result is rounded towards zero.
   *
   * @remarks
   * This function is used to safely divide two unsigned 256-bit integers without causing a division by zero error.
   * However, due to the rounding towards zero, there might be a loss of precision in the result, especially when
   * the dividend is not perfectly divisible by the divisor. For example, when dividing 4 by 3, the result will be 1,
   * and the remainder (1) will be lost.
   *
   * @param a - The dividend.
   * @param b - The divisor.
   *
   * @returns The quotient of `a` divided by `b` as an unsigned 256-bit integer (u256).
   *
   * @throws if the operation results in a division by zero.
   */
  static div(a: u256, b: u256): u256 {
    assert(b > u256.Zero, 'SafeMathU256: division by zero');
    const c = a / b;

    return c;
  }
}
