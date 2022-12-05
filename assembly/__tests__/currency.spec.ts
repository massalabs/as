import {Currency} from '../currency';

describe('Doc tests', () => {
  it('should be easy to use', () => {
    const c1 = new Currency('Testing', 2);
    expect<string>(c1.name).toBe('Testing');
    expect<u8>(c1.minorUnit).toBe(2);

    const c2 = new Currency('Other testing', 2);
    expect<bool>(c1.equals(c2)).toBeFalsy();

    // serialization / deserialization

    const serialized = c1.toArgs();

    const deserialized = Currency.fromArgs(serialized);

    expect(deserialized.expect()).toBe(c1);
  });
});

describe('Black box tests', () => {
  test('empty constructor', () => {
    const c = new Currency();
    expect<string>(c.name).toBe('');
    expect<u8>(c.minorUnit).toBe(0);
  });

  test('same currency', () => {
    const c1 = new Currency('aaaa', 6);
    const c2 = new Currency('aaaa', 6);
    expect<bool>(c1.equals(c2)).toBeTruthy();
    expect<bool>(c2.equals(c1)).toBeTruthy();
    expect<bool>(c1.equals(c1)).toBeTruthy();
  });
});
