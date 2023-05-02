/**
 * This class provides utility functions for basic arithmetic operations on **unsigned** real positive integers.
 * These functions perform overflow and underflow checks to prevent unwanted behavior
 * when dealing with **unsigned** 64-bit integers (u64). The SafeMath class should be used
 * when working with arithmetic operations that require increased safety and precision.
 *
 * @remarks
 * The SafeMath class is designed to be a drop-in replacement for standard arithmetic
 * operations on unsigned 64-bit integers. By using the methods provided by this class,
 * developers can avoid potential overflow and underflow issues and ensure that their
 * code behaves correctly even in edge cases.
 */
export class SafeMath {
  /**
   * Safely adds two unsigned 64-bit integers (u64), reverting if an
   * overflow occurs.
   *
   * @remarks
   * This function is used to safely add two unsigned 64-bit integers without causing an overflow.
   *
   * @param a - The first operand for addition.
   * @param b - The second operand for addition.
   *
   * @returns The sum of a and b as an unsigned 64-bit integer (u64).
   *
   * @throws if the operation results in a number bigger than u64.MAX_VALUE.
   */
  static add(a: u64, b: u64): u64 {
    assert(b <= u64.MAX_VALUE - a, 'SafeMath: addition overflow');

    const c: u64 = a + b;

    return c;
  }

  /**
   * Safely subtracts two unsigned 64-bit integers (u64), reverting if an
   * underflow occurs.
   *
   * @remarks
   * This function is used to safely substract two unsigned 64-bit integers without causing an underflow.
   *
   * @param a - The first operand for subtraction (minuend).
   * @param b - The second operand for subtraction (subtrahend).
   *
   * @returns The difference between a and b as an unsigned 64-bit integer (u64).
   *
   * @throws if the operation results in a number lower than 0.
   */
  static sub(a: u64, b: u64): u64 {
    assert(b <= a, 'SafeMath: subtraction overflow');
    const c: u64 = a - b;

    return c;
  }

  /**
   * Safely multiplies two unsigned 64-bit integers (u64), reverting on
   * overflow.
   *
   * @remarks
   * This function is used to safely mutilply two unsigned 64-bit integers without causing an overflow.
   *
   * @param a - The first operand for multiplication.
   * @param b - The second operand for multiplication.
   *
   * @returns The product of a and b as an unsigned 64-bit integer (u64).
   *
   * @throws if the operation results in a number bigger than u64.MAX_VALUE.
   */
  static mul(a: u64, b: u64): u64 {
    if (a == 0) {
      return 0;
    }
    assert(b <= u64.MAX_VALUE / a, 'SafeMath: multiplication overflow');

    const c = a * b;

    return c;
  }

  /**
   * Safely divides two unsigned 64-bit integers (u64), reverting on
   * division by zero. The result is rounded towards zero.
   *
   * @remarks
   * This function is used to safely divide two unsigned 64-bit integers without causing a division by zero error.
   * However, due to the rounding towards zero, there might be a loss of precision in the result, especially when
   * the dividend is not perfectly divisible by the divisor. For example, when dividing 4 by 3, the result will be 1,
   * and the remainder (1) will be lost.
   *
   * @param a - The dividend.
   * @param b - The divisor.
   *
   * @returns The quotient of `a` divided by `b` as an unsigned 64-bit integer (u64).
   *
   * @throws if the operation results in a division by zero.
   */
  static div(a: u64, b: u64): u64 {
    assert(b > 0, 'SafeMath: division by zero');
    const c = a / b;

    return c;
  }
}
