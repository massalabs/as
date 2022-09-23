/**
 *
 * A decimal having its value expressed as a 64-bit unsigned integer.
 *
 */
export class D64 {
  /**
   * Instanciates a 64-bit decimal.
   *
   * @param {u64} value - Decimal value.
   * @param  {u8} precision - Number of decimal after the separator.
   * @param {boolean} nan - Not A Number. If true, the decimal is not a number.
   */
  constructor(
    public value: u64 = 0,
    public precision: u8 = 0,
    private notANumber: boolean = false,
  ) {}

  /**
   * Instanciates a new D64 that is not a number.
   * @return {D64}
   */
  @inline
  static nan(): D64 {
    return new D64(0, 0, true);
  }

  /**
   * Checks if decimal is not a number.
   *
   * @return {bool}
   */
   @inline
  isNaN(): bool {
    return this.notANumber;
  }

   /**
   * Instanciates a new D64 from an existing one after changing its precision.
   *
   * If the conversion doesn't make sens (overflow or loss of information), NaN is returned.
   *
   * @param {u8} precision - Set the new desired precision.
   * @return {D64}
   */
   changePrecision(precision: u8): D64 {
     if (precision == this.precision) {
       return this;
     }

     if (precision > this.precision) {
       const by = u64(Math.pow(10, f64(precision - this.precision)));

       if (this.value != 0 && by > 18446744073709551615 / this.value) { // overflow
         return D64.nan();
       }

       const value = this.value * by;

       return new D64(value, precision);
     }

     if (this.value % 10 * (this.precision - precision) != 0 ) {
       return D64.nan();
     }

     return new D64(this.value / u64(Math.pow(10, f64(this.precision - precision))), precision);
   }

   /**
     * Compares (equality) two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64} - Compare a and b.
     */
     @operator('==')
   static equal(a: D64, b: D64): bool {
     if (a.notANumber || b.notANumber) {
       return false;
     }

     let updated = a.changePrecision(b.precision);
     let actual = b;

     if (updated.isNaN()) {
       updated = b.changePrecision(a.precision);
       actual = a;

       if (updated.isNaN()) {
         return false;
       }
     }

     return updated.value == actual.value;
   }

     /**
     * Compares (lower than) two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64} - Compare a and b.
     */
    @operator('<')
     static lt(a: D64, b: D64): bool {
       if (a.notANumber || b.notANumber) {
         return false;
       }

       let updated = a.changePrecision(b.precision);
       let actual = b;

       if (updated.isNaN()) {
         updated = b.changePrecision(a.precision);
         actual = a;

         if (updated.isNaN()) {
           return false;
         }
       }

       return updated.value < actual.value;
     }

    /**
     * Compares (lower than or equal) two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64} - Compare a and b.
     */
    @operator('<=')
    static lte(a: D64, b: D64): bool {
      if (a.notANumber || b.notANumber) {
        return false;
      }

      let updated = a.changePrecision(b.precision);
      let actual = b;

      if (updated.isNaN()) {
        updated = b.changePrecision(a.precision);
        actual = a;

        if (updated.isNaN()) {
          return false;
        }
      }

      return updated.value <= actual.value;
    }

    /**
     * Compares (greater than) two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64} - Compare a and b.
     */
    @operator('>')
    static gt(a: D64, b: D64): bool {
      if (a.notANumber || b.notANumber) {
        return false;
      }

      let updated = a.changePrecision(b.precision);
      let actual = b;

      if (updated.isNaN()) {
        updated = b.changePrecision(a.precision);
        actual = a;

        if (updated.isNaN()) {
          return false;
        }
      }

      return updated.value > actual.value;
    }

    /**
     * Compares (greater than or equal) two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64} - Compare a and b.
     */
    @operator('>=')
    static gte(a: D64, b: D64): bool {
      if (a.notANumber || b.notANumber) {
        return false;
      }

      let updated = a.changePrecision(b.precision);
      let actual = b;

      if (updated.isNaN()) {
        updated = b.changePrecision(a.precision);
        actual = a;

        if (updated.isNaN()) {
          return false;
        }
      }

      return updated.value >= actual.value;
    }

    /**
     * Instanciates a D64 adding two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64}
     */
    @operator('+')
    static add(a: D64, b: D64): D64 {
      if (a.notANumber || b.notANumber) {
        return D64.nan();
      }

      let updated = a.changePrecision(b.precision);
      let actual = b;

      if (updated.isNaN()) {
        updated = b.changePrecision(a.precision);
        actual = a;

        if (updated.isNaN()) {
          return D64.nan();
        }
      }

      const value = updated.value + actual.value;

      if (value < updated.value) {
        return D64.nan();
      }

      return new D64(value, actual.precision);
    }

    /**
     * Instanciates a D64 substracting two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64}
     */
    @operator('-')
    static sub(a: D64, b: D64): D64 {
      if (a.notANumber || b.notANumber) {
        return D64.nan();
      }

      let updated = a.changePrecision(b.precision);
      let actual = b;

      if (updated.isNaN()) {
        updated = b.changePrecision(a.precision);
        actual = a;

        if (updated.isNaN()) {
          return D64.nan();
        }
      }

      const value = updated.value - actual.value;

      if (value > updated.value) {
        return D64.nan();
      }

      return new D64(value, actual.precision);
    }

    /**
     * Instanciates a D64 multiplying two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64}
     */
    @operator('*')
    static mul(a: D64, b: D64): D64 {
      if (a.notANumber || b.notANumber) {
        return D64.nan();
      }

      let updated = a.changePrecision(b.precision);
      let actual = b;

      if (updated.isNaN()) {
        updated = b.changePrecision(a.precision);
        actual = a;

        if (updated.isNaN()) {
          return D64.nan();
        }
      }

      const value = updated.value * actual.value;

      if (value < updated.value || value < actual.value) {
        return D64.nan();
      }

      return new D64(value, 2*actual.precision);
    }

    /**
     * Instanciates a D64 dividing two D64.
     *
     * @param {D64} a
     * @param {D64} b
     * @return {D64}
     */
    @operator('/')
    static div(a: D64, b: D64): D64 {
      if (a.notANumber || b.notANumber) {
        return D64.nan();
      }

      let updated = a.changePrecision(b.precision);
      let actual = b;

      if (updated.isNaN()) {
        updated = b.changePrecision(a.precision);
        actual = a;

        if (updated.isNaN()) {
          return D64.nan();
        }
      }

      if (actual.value == 0) {
        return D64.nan();
      }

      const value = updated.value / actual.value;

      return new D64(value, actual.precision/2);
    }

    private removeTrailing0(): void {
      let str = this.value.toString();
      let prec = this.precision;

      if (str.length == 1 || prec == 0) {
        return;
      }

      while (str.slice(-1) == '0') {
        str = str.slice(0, -1);
        prec--;
      }

      this.value /= u64(Math.pow(10, f64(this.precision - prec)));
      this. precision = prec;
    }

    /**
     * Stringify decimal.
     *
     * @return string
     */
    toString(): string {
      if (this.notANumber) {
        return 'NaN';
      }

      this.removeTrailing0();

      const stringified = this.value.toString();

      if (this.precision == 0) {
        return stringified;
      }

      return stringified.slice(0, stringified.length - this.precision) + '.' + stringified.slice(stringified.length - this.precision);
    }
}
