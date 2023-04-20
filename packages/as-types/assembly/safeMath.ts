/**
 * The SafeMath class provides utility functions for basic arithmetic operations.
 * These functions perform overflow and underflow checks to prevent unwanted behavior
 * when dealing with unsigned 64-bit integers (u64). The SafeMath class should be used
 * when working with arithmetic operations that require increased safety and precision.
 */
export class SafeMath {
  /**
   * add - Returns the addition of two unsigned 64-bit integers (u64),
   *       reverting on overflow.
   *
   * @param a - The first operand for addition.
   * @param b - The second operand for addition.
   * @returns The sum of a and b as an unsigned 64-bit integer (u64).
   * @throws Throws an error if the operation results in an overflow.
   */
  static add(a: u64, b: u64): u64 {
    const c: u64 = a + b;
    assert(c >= a, 'SafeMath: addition overflow');

    return c;
  }

  /**
   * sub - Returns the subtraction of two unsigned 64-bit integers (u64),
   *       reverting on underflow.
   *
   * @param a - The first operand for subtraction (minuend).
   * @param b - The second operand for subtraction (subtrahend).
   * @returns The difference between a and b as an unsigned 64-bit integer (u64).
   * @throws Throws an error if the operation results in an underflow.
   */
  static sub(a: u64, b: u64): u64 {
    assert(b <= a, 'SafeMath: subtraction overflow');
    const c: u64 = a - b;

    return c;
  }

  /**
   * mul - Returns the multiplication of two unsigned 64-bit integers (u64),
   *       reverting on overflow.
   *
   * @param a - The first operand for multiplication.
   * @param b - The second operand for multiplication.
   * @returns The product of a and b as an unsigned 64-bit integer (u64).
   * @throws Throws an error if the operation results in an overflow.
   */
  static mul(a: u64, b: u64): u64 {
    if (a == 0) {
      return 0;
    }

    const c = a * b;
    assert(c / a == b, 'SafeMath: multiplication overflow');

    return c;
  }

  /**
   * div - Returns the integer division of two unsigned 64-bit integers (u64),
   *       Reverts on division by zero. The result is rounded towards zero
   *
   * @param a - The dividend,
   * @param b - The divisor,
   * @returns The quotient of a divided by b as an unsigned 64-bit integer (u64).
   * @throws Throws an error if the operation results in a division by zero.
   */
  static div(a: u64, b: u64): u64 {
    assert(b > 0, 'SafeMath: division by zero');
    const c = a / b;

    return c;
  }
}
