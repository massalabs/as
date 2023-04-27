import { Currency } from '../currency';
import { Amount } from '../amount';

describe('Doc tests', () => {
  it('should be simple to use', () => {
    const c1 = new Currency('Testing', 2);
    const a1 = new Amount(500, c1);

    const a2 = a1.add(new Amount(100, c1)).unwrap();

    expect(a2.value).toBe(600);
    expect(a1.lessThan(a2)).toBeTruthy('less than');

    // Amount a1 is lower than amout a2
    // Substraction is therefore negative which is forbidden.
    // Therefore new amount is not valid anymore.
    expect(a1.subtract(a2).isOk()).toBeFalsy('underflow');

    //
    // serialization / deserialization use case
    //
    const serializedBytes = a1.serialize();
    const anotherAmount = new Amount();

    anotherAmount.deserialize(serializedBytes, 0);

    expect(anotherAmount).toBe(a1);
  });
});

describe('Blackbox tests', () => {
  test('checker/getter', () => {
    const a = new Amount(100, new Currency());
    expect(a.value).toBe(100, 'value method');
    expect(a.currency.equals(new Currency())).toBeTruthy('currency method');
  });

  test('under/overflow', () => {
    const a = new Amount(u64.MAX_VALUE);
    expect(a.add(new Amount(1)).isOk()).toBeFalsy('overflow');
    expect(a.add(new Amount(0)).isOk()).toBeTruthy('MAX_VALUE + 0');
    expect(new Amount().subtract(a).isOk()).toBeFalsy('underflow');
  });
});
