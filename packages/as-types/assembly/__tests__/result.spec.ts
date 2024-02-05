import { Result, Result } from '../result';
import { Divinity } from './dto-tests/Person';
import { Args } from '../argument';

describe('Result tests', () => {
  it('Test: create ok', () => {
    let val: u32 = 16721;
    let res: Result<u32> = new Result(val);
    let res2 = new Result<u32>(val);
    expect<bool>(res.isOk()).toBe(true);
    expect<bool>(res.isErr()).toBe(false);
    expect<u32>(res.unwrap()).toBe(val);
    expect<bool>(res2.isOk()).toBe(true);
    expect<bool>(res2.isErr()).toBe(false);
    expect<u32>(res2.unwrap()).toBe(val);
  });
});
