import { Result, Result, SerializableResult } from '../result';
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
  it('Test 1: basics', () => {
    // let d1 = new Divinity()
    let d1 = new Divinity(14, 'Poseidon?!#');
    let d2 = new Divinity(42, 'Zeus');
    let res1: Result<Divinity> = new Result(d1);
    let res3 = Result.fromOk<Divinity>(d2);
    expect<Divinity>(res1.unwrap()).toBe(d1);
    expect<Divinity>(res3.unwrap()).toBe(d2);

    let sRes1 = SerializableResult.fromResult(res1);
    expect<Divinity>(sRes1.unwrap()).toBe(d1);
    let res2 = new Result<Divinity>(new Divinity());
    let sRes2 = SerializableResult.fromResult(res2);
    expect<Divinity>(sRes2.unwrap()).toBe(new Divinity());

    let _Res1 = SerializableResult.toResult(sRes1);
    expect<Divinity>(_Res1.unwrap()).toBe(d1);
    expect<Divinity>(_Res1.expect('expect to get divinity Poseidon')).toBe(d1);
    let _Res2 = SerializableResult.toResult(sRes2);
    expect<Divinity>(_Res2.unwrap()).toBe(new Divinity());
  });
  it('Test 2: ser / der', () => {
    let d1 = new Divinity(14, 'Poseidon?!#');
    let d2 = new Divinity(42, 'Zeus');
    let sres1: SerializableResult<Divinity> = new SerializableResult(d1);
    let sres2 = new SerializableResult<Divinity>(d2);
    let sres3 = SerializableResult.fromErr<Divinity>(d2, 'BadIO');
    expect<Divinity>(sres1.unwrap()).toBe(d1);
    expect<bool>(sres3.isErr()).toBe(true);

    let _args = new Args()
      .add<SerializableResult<Divinity>>(sres1)
      .add<SerializableResult<Divinity>>(sres2)
      .add<SerializableResult<Divinity>>(sres3);
    // uncomment to check how it is serialized (and check it only adds a u8 before data)
    // log<string>(_args.serialize().toString());
    let args = new Args(_args.serialize());

    let _sres1 = args
      .nextSerializable<SerializableResult<Divinity>>()
      .expect('Cannot deserialize SResult');
    let _sres2 = args
      .nextSerializable<SerializableResult<Divinity>>()
      .expect('Cannot deserialize SResult');
    let _sres3 = args
      .nextSerializable<SerializableResult<Divinity>>()
      .expect('Cannot deserialize SResult');

    expect<Divinity>(_sres1.unwrap()).toBe(d1);
    expect<Divinity>(_sres2.unwrap()).toBe(d2);
    expect<bool>(_sres3.isErr()).toBe(true);
  });
});
