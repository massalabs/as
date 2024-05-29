import { Result } from '../result';

describe('Doc tests', () => {
  it('should be simple to use - with a value', () => {
    const value = 'hello';
    const result = new Result<string>(value);

    expect(result.isOk()).toBeTruthy();
    expect(result.isErr()).toBeFalsy();
    expect(result.unwrap()).toBe(value);
    expect(result.unwrapOrDefault()).toBe(value);
    expect(result.expect('error')).toBe(value);
  });
  it('should be simple to use - with an error', () => {
    const errMsg = 'Oops!';
    const result = new Result<string>('', errMsg);

    expect(result.isOk()).toBeFalsy();
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapOrDefault()).toBe('');
  });
});

describe('Black box tests', () => {
  it('should work with non nullable types', () => {
    const r = new Result<u64>(1);
    expect(r.unwrap()).toBe(1);
  });
  it('should throw an error if the result is an error', () => {
    expect(() => {
      new Result<string>('', 'Oops!').unwrap();
    }).toThrow();
    expect(() => {
      new Result<string>('', 'Oops!').expect('error');
    }).toThrow();
  });
});
