import { Currency } from '../currency';

describe('Doc tests', () => {
  it('should be easy to use', () => {
    const c1 = new Currency('Testing', 2);
    expect(c1.name).toBe('Testing');
    expect(c1.minorUnit).toBe(2);

    const c2 = new Currency('Other testing', 2);
    expect<bool>(c1.equals(c2)).toBeFalsy();

    // serialization / deserialization

    const serializedBytes = c1.serialize();

    const anotherCurrency = new Currency();
    anotherCurrency.deserialize(serializedBytes, 0);

    expect(anotherCurrency).toBe(c1);
  });
});

describe('Black box tests', () => {
  test('empty constructor', () => {
    const c = new Currency();
    expect(c.name).toBe('');
    expect(c.minorUnit).toBe(0);
  });

  test('same currency', () => {
    const c1 = new Currency('aaaa', 6);
    const c2 = new Currency('aaaa', 6);
    expect(c1.equals(c2)).toBeTruthy();
    expect(c2.equals(c1)).toBeTruthy();
    expect(c1.equals(c1)).toBeTruthy();
  });
});
