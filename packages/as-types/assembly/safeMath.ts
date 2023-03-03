export class SafeMath {
  /**
   *
   * @returns Returns the addition of two unsigned integers,
   * reverting on overflow.
   */
  static add(a: u64, b: u64): u64 {
    const c: u64 = a + b;
    assert(c >= a, 'SafeMath: addition overflow');

    return c;
  }

  /**
   *
   * @returns Returns the integer division of two unsigned integers. Reverts with custom message on
   * division by zero. The result is rounded towards zero.
   */
  static sub(a: u64, b: u64): u64 {
    assert(b <= a, 'SafeMath: subtraction overflow');
    const c: u64 = a - b;

    return c;
  }

  /**
   *
   * @returns Returns the multiplication of two unsigned integers, reverting on
   * overflow.
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
   *
   * @returns Returns the integer division of two unsigned integers. Reverts on
   * division by zero. The result is rounded towards zero.
   */
  static div(a: u64, b: u64): u64 {
    assert(b > 0, 'SafeMath: division by zero');
    const c = a / b;

    return c;
  }
}
