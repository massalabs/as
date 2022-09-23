import {D64} from '../index';
import Big from 'as-big';

function removeTrailing(str:string) :string {
  if (str.slice(-1) == '0' || str.slice(-1) == '.') {
    return removeTrailing(str.slice(0, -1));
  } else {
    return str;
  }
}
class UT {
  constructor(
    public decimal: D64,
    public wantedPrecision: u8,
    public want: D64,
  ) {}

  execute():void {
    const got = this.decimal.changePrecision(this.wantedPrecision);
    expect(got).toBe(this.want, 'expected: new D64(' + this.decimal.value.toString() + ',' + this.decimal.precision.toString() + ').changePrecision(' + this.wantedPrecision.toString() + ') = D64(' + this.want.value.toString() + ', ' + this.want.precision.toString() + ') got: D64(' + got.value.toString() + ', ' + got.precision.toString() + ')');
  }
}

class GT<T> {
  constructor(
    public fct: string,
    public tests: T,
  ) {}

  execute():void {
    for (let index = 0; index < this.tests.length; index++) {
      const t = this.tests[index];
      test('Testing ' + this.fct + ' - Test ' + index.toString(), () => {
        t.execute();
      });
    }
  }
}

const tests: Array<UT> = [
  new UT(new D64(10, 1), 1, new D64(10, 1)),
  new UT(new D64(10, 2), 1, new D64(101, 1)),
];

// testFunction('D64.changePrecision', tests);

/* function testFunction<T>(fct: string, tests: T):void {
  describe('Testing ' + fct, () => {
    for (let index = 0; index < tests.length; index++) {
      test('Test ' + index.toString(), () => {
        tests[i].execute();
      });
    }
  });
}*/

(new GT<Array<UT>>('D64.changePrecision', tests)).execute();

describe('Test tooling', () => {
  test('removeTrailing', () => {
    expect(removeTrailing('6503620210028975.936')).toBe('6503620210028975.936');
    expect(removeTrailing('6503620210028975.930')).toBe('6503620210028975.93');
    expect(removeTrailing('6503620210028975.900')).toBe('6503620210028975.9');
    expect(removeTrailing('6503620210028975.000')).toBe('6503620210028975');
  });
});

const testChangePrecision = new TestTable('changePrecision', UT2,
    (decimal, wantedPrecision, want) => {
      const got = decimal.changePrecision(wantedPrecision);
      expect(got).toBe(want, 'expected: new D64(' + decimal.value.toString() + ',' + decimal.precision.toString() + ').changePrecision(' + wantedPrecision.toString() + ') = D64(' + want.value.toString() + ', ' + want.precision.toString() + ') got: D64(' + got.value.toString() + ', ' + got.precision.toString() + ')');
    });

testChangePrecision([
  new UT2(new D64(10, 1), 1, new D64(10, 1)),
  new UT2(new D64(10, 2), 1, new D64(101, 1)),
]);

testTable<UT2>('fct', [
  new UT2(new D64(10, 1), 1, new D64(10, 1)),
  new UT2(new D64(10, 2), 1, new D64(101, 1)),
]);

describe('Blackbox tests', () => {
  test('stringify', () => {
    let a = new D64(10, 1);
    expect(a.toString()).toBe('1', 'D64(10, 1)');
    a = new D64(100, 2);
    expect(a.toString()).toBe('1', 'D64(100, 2)');
    a = new D64(101, 2);
    expect(a.toString()).toBe('1.01', 'D64(101, 2)');
    a = new D64(10, 0);
    expect(a.toString()).toBe('10', 'D64(10, 0)');
    a = new D64(443712358665183680, 0);
    expect(a.toString()).toBe('443712358665183680', 'D64(443712358665183680, 0)');
  });

  test('changePrecision', () => {
    const tests: Array<UT> = [
      new UT(new D64(10, 1), 1, new D64(10, 1)),
      new UT(new D64(10, 2), 1, new D64(101, 1)),
    ];

    tests.forEach((t) => {
      t.execute();
    });

    let a = new D64(10, 1);
    expect(a.changePrecision(1)).toBe(new D64(10, 1), 'with same precision');
    expect(a.changePrecision(2)).toBe(new D64(100, 2), 'with a greater precision');
    expect(a.changePrecision(0)).toBe(new D64(1, 0), 'with a lower precision');

    a = new D64(11, 1);
    expect(a.changePrecision(0).isNaN()).toBeTruthy('with loss in asked conversion');

    a = new D64(653833540623822080, 16);
    expect(a.changePrecision(4).isNaN()).toBeTruthy('with loss in asked conversion');

    a = new D64(18446744073709551615, 0);
    expect(a.changePrecision(1).isNaN()).toBeTruthy('with overflow');

    a = new D64(225992966659729408, 2);
    expect(a.changePrecision(7).isNaN()).toBeTruthy('other overflow');

    a = new D64(209731588453451168, 4);
    expect(a.changePrecision(16).isNaN()).toBeTruthy('other overflow');
  });

  test('equality', () => {
    let a = new D64(10, 1);
    expect(a).toBe(new D64(10, 1), 'between identical value with same precision');
    expect(a).toBe(new D64(100, 2), 'between identical value with a greater precision');
    expect(a).toBe(new D64(1, 0), 'between identical value with a lower precision');

    a = D64.nan();
    expect(a).not.toBe(new D64(0, 0), 'between a NaN and a number');
    expect(a).not.toBe(D64.nan(), 'between two NaN');
  });

  test('comparing (gt, gte, lt, lte)', () => {
    const a = new D64(10, 1);

    let b = new D64(11, 1);
    expect(a<b).toBeTruthy( 'lower than with same precision');

    b = new D64(9, 1);
    expect(a>b).toBeTruthy( 'greater than with same precision');

    b = new D64(10, 1);
    expect(a<=b).toBeTruthy( 'lower than or equal with same precision');
    expect(a>=b).toBeTruthy( 'greater than or equal with same precision');

    b = new D64(110, 2);
    expect(a<b).toBeTruthy( 'lower than with different precision');

    b = new D64(1, 2);
    expect(a>b).toBeTruthy( 'greater than with different precision');

    b = new D64(100, 2);
    expect(a<=b).toBeTruthy( 'lower than or equal with different precision');
    expect(a>=b).toBeTruthy( 'greater than or equal with different precision');

    b = D64.nan();
    expect(a<=b).not.toBeTruthy( 'lower than or equal with NaN');
    expect(a>=b).not.toBeTruthy( 'greater than or equal with NaN');
    expect(a<b).not.toBeTruthy( 'lower than with NaN');
    expect(a>b).not.toBeTruthy( 'greater than with NaN');
  });

  test('Sum', () => {
    let a = new D64(1, 0);
    let b = new D64(1, 0);
    expect(a+b).toBe(new D64(2, 0), 'with two D64 having same precision');

    a = new D64(1, 2);
    b = new D64(1, 1);
    expect(a+b).toBe(new D64(11, 2), 'with two D64 having different precision');

    a = new D64(18446744073709551615, 0);
    expect((a+b).isNaN()).toBeTruthy('with overflow');

    a = D64.nan();
    expect((a+b).isNaN()).toBeTruthy('with a NaN');
    expect((b+a).isNaN()).toBeTruthy('with a NaN (reverse order)');
  });

  test('Substraction', () => {
    let a = new D64(10, 0);
    let b = new D64(1, 0);
    expect(a-b).toBe(new D64(9, 0), 'with two D64 having same precision');

    a = new D64(1, 2);
    b = new D64(1, 1);
    expect(a-b).toBe(new D64(9, 2), 'with two D64 having different precision');

    a = new D64(0, 0);
    expect((a-b).isNaN()).toBeTruthy('with negative value');

    a = D64.nan();
    expect((a-b).isNaN()).toBeTruthy('with a NaN');
    expect((b-a).isNaN()).toBeTruthy('with a NaN (reverse order)');
  });

  test('Multiplication', () => {
    let a = new D64(10, 0);
    let b = new D64(10, 0);
    expect(a*b).toBe(new D64(100, 0), 'with two D64 having same precision');

    a = new D64(10, 0);
    b = new D64(1, 1);
    expect(a*b).toBe(new D64(1, 0), 'with two D64 having different precision');

    a = new D64(18446744073709551615, 0);
    b = new D64(10, 0);
    expect((a*b).isNaN()).toBeTruthy('with negative value');

    a = D64.nan();
    expect((a*b).isNaN()).toBeTruthy('with a NaN');
    expect((b*a).isNaN()).toBeTruthy('with a NaN (reverse order)');
  });

  test('Division', () => {
    let a = new D64(10, 0);
    let b = new D64(10, 0);
    expect(a/b).toBe(new D64(1, 0), 'with two D64 having same precision');

    a = new D64(10, 0);
    b = new D64(1, 1);
    expect(a/b).toBe(new D64(100, 0), 'with two D64 having different precision');

    a = new D64(1, 0);
    b = new D64(0, 0);
    expect((a/b).isNaN()).toBeTruthy('with null value');

    a = D64.nan();
    expect((a/b).isNaN()).toBeTruthy('with a NaN');
    expect((b/a).isNaN()).toBeTruthy('with a NaN (reverse order)');
  });
});


describe('Random tests', () => {
  test('+-*/', () => {
    for (let index = 0; index < 1000; index++) {
      let value = u64(Math.round(Math.random() * (1844674407370955161/2)));
      let stringifyA = value.toString();
      let precision = u8(Math.round(Math.random() * stringifyA.length));

      const actualA = new D64(value, precision);
      stringifyA = stringifyA.slice(0, stringifyA.length - precision) + '.' + stringifyA.slice(stringifyA.length - precision);
      const expectedA = Big.of(stringifyA);

      expect(actualA.toString()).toBe(expectedA.toString(), 'as-big not working (value: ' + value.toString() + ', precision: ' + precision.toString() + ')');

      value = u64(Math.round(Math.random() * (1844674407370955161/2)));
      let stringifyB = value.toString();
      precision = u8(Math.round(Math.random() * Math.min(stringifyB.length, precision)));


      const actualB = new D64(value, precision);
      stringifyB = stringifyB.slice(0, stringifyB.length - precision) + '.' + stringifyB.slice(stringifyB.length - precision);
      const expectedB = Big.of(stringifyB);

      expect(actualB.toString()).toBe(expectedB.toString(), 'as-big not working (value: ' + value.toString() + ', precision: ' + precision.toString() + ')');

      const actualStringified: string = (actualA+actualB).toString();
      const expectedStringified: string = (expectedA+expectedB).toString();

      if (expectedStringified.length >= 21) {
        expect((actualA+actualB).toString()).toBe('NaN', 'Sum of ' + actualA.toString() + ' + ' + actualB.toString() + ' = ' + actualStringified);
      } else {
        expect((actualA+actualB).toString()).toBe((expectedA+expectedB).toString(), 'Sum of ' + actualA.toString() + ' + ' + actualB.toString());
      }
    }
  });
});
