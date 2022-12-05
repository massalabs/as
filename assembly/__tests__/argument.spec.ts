import {Args, NoArg} from '../argument';
import {Amount} from '../amount';
import {Currency} from '../currency';

const amt = new Amount(1234, new Currency('my very own currency', 2));

describe('Args tests', () => {
  it('With a number', () => {
    // Create an argument class instance
    const args1 = new Args();
    // add some arguments
    args1.add(97 as u64);

    // use serialize to get the byte array
    const serializedBytes = args1.serialize();

    // instantiate a new argument class from the serialized data
    const args2 = new Args(serializedBytes);

    // assert that the first address is same we provide
    // in the first call to add function
    expect(args2.nextU64().unwrap()).toBe(97);
  });

  it('With bytes', () => {
    const arr: StaticArray<u8> = [1, 2, 3, 4, 5];
    const args1 = new Args();
    args1.add(arr);
    expect(args1.serialize()).toStrictEqual([5, 0, 0, 0, 1, 2, 3, 4, 5]);

    const args2 = new Args(args1.serialize());
    expect(args2.nextBytes().unwrap()).toStrictEqual(arr);
  });

  it('With booleans and number', () => {
    const args1 = new Args();
    args1.add(true).add(false).add(83);

    const args2 = new Args(args1.serialize());
    expect(args2.nextBool().unwrap()).toBe(true);
    expect(args2.nextBool().unwrap()).toBe(false);
    expect(args2.nextI32().unwrap()).toBe(83);
  });

  it('With a number and an Amount', () => {
    const args1 = new Args();
    const amtBytes = amt.toBytes();
    args1.add(97 as u32).add(amtBytes);
    // amt.addArgs(args1);

    expect(args1.nextU32().unwrap()).toBe(97 as u32);
    const bytes = args1.nextBytes().expect('next bytes');
    expect(bytes).toStrictEqual(amtBytes);
    expect(Amount.fromBytes(bytes).expect('amount from bytes')).toBe(amt);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU32().expect('next u32')).toBe(97 as u32);

    // /!\ Not working anymore we can't mix both from/toBytes and from/toArgs
    // expect(Amount.fromArgs(args2).expect("amount from args")).toBe(amt);
  });

  it('With Address and i64', () => {
    const args1 = new Args();
    args1.add(97 as i64);
    amt.addArgs(args1);
    args1.add(113 as i64);

    expect(args1.nextI64().unwrap()).toBe(97);
    expect(Amount.fromArgs(args1).unwrap()).toBe(amt);
    expect(args1.nextI64().unwrap()).toBe(113);

    const args2 = new Args(args1.serialize());
    expect(args2.nextI64().unwrap()).toBe(97);
    expect(Amount.fromArgs(args2).unwrap()).toBe(amt);
    expect(args2.nextI64().unwrap()).toBe(113);
  });

  it('With Address and u64', () => {
    const args1 = new Args();
    args1.add(97 as u64);
    amt.addArgs(args1);
    args1.add(113 as u64);

    expect(args1.nextU64().unwrap()).toBe(97);
    expect(Amount.fromArgs(args1).unwrap()).toBe(amt);
    expect(args1.nextU64().unwrap()).toBe(113);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU64().unwrap()).toBe(97);
    expect(Amount.fromArgs(args2).unwrap()).toBe(amt);
    expect(args2.nextU64().unwrap()).toBe(113);
  });

  it('With string and i64', () => {
    const args1 = new Args();
    args1
      .add(97 as i64)
      .add('my string')
      .add(113 as i64);

    expect(args1.nextI64().unwrap()).toBe(97);
    expect(args1.nextString().unwrap()).toBe('my string');
    expect(args1.nextI64().unwrap()).toBe(113);

    const args2 = new Args(args1.serialize());
    expect(args2.nextI64().unwrap()).toBe(97);
    expect(args2.nextString().unwrap()).toBe('my string');
    expect(args2.nextI64().unwrap()).toBe(113);
  });

  it('With a big string', () => {
    const args1 = new Args();
    args1.add('a'.repeat(65600));

    expect(args1.nextString().unwrap()).toBe('a'.repeat(65600));

    const args2 = new Args(args1.serialize());
    expect(args2.nextString().unwrap()).toBe('a'.repeat(65600));
  });

  it('With string and u64', () => {
    const args1 = new Args();
    args1
      .add(97 as u64)
      .add('my string')
      .add(11356323656733 as u64);

    expect(args1.nextU64().unwrap()).toBe(97);
    expect(args1.nextString().unwrap()).toBe('my string');
    expect(args1.nextU64().unwrap()).toBe(11356323656733);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU64().unwrap()).toBe(97);
    expect(args2.nextString().unwrap()).toBe('my string');
    expect(args2.nextU64().unwrap()).toBe(11356323656733);
  });

  it('With u32', () => {
    const args1 = new Args();
    args1.add(97 as u32);

    expect(args1.nextU32().unwrap()).toBe(97 as u32);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU32().unwrap()).toBe(97 as u32);
  });

  it('With string and u32', () => {
    const args1 = new Args();
    args1
      .add(97 as u32)
      .add('my string')
      .add(112 as u32);

    expect(args1.nextU32().unwrap()).toBe(97 as u32);
    expect(args1.nextString().unwrap()).toBe('my string');
    expect(args1.nextU32().unwrap()).toBe(112 as u32);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU32().unwrap()).toBe(97 as u32);
    expect(args2.nextString().unwrap()).toBe('my string');
    expect(args2.nextU32().unwrap()).toBe(112 as u32);
  });

  it('With string and 0 and max number', () => {
    const args1 = new Args();
    args1
      .add(0 as u64)
      .add('my string')
      .add(u64.MAX_VALUE as u64);

    expect(args1.nextU64().unwrap()).toBe(0);
    expect(args1.nextString().unwrap()).toBe('my string');
    expect(args1.nextU64().unwrap()).toBe(u64.MAX_VALUE);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU64().unwrap()).toBe(0);
    expect(args2.nextString().unwrap()).toBe('my string');
    expect(args2.nextU64().unwrap()).toBe(u64.MAX_VALUE);
  });

  it('With no args', () => {
    const args1 = NoArg;
    const expectedArray = new StaticArray<u8>(0);
    expect(args1.serialize()).toHaveLength(0);
    expect(args1.serialize()).toStrictEqual(expectedArray);
  });

  it('With float numbers', () => {
    const args1 = new Args();
    args1.add(3 as f64);

    expect(args1.nextF64().unwrap()).toBe(3);

    const args2 = new Args(args1.serialize());
    expect(args2.nextF64().unwrap()).toBe(3);
  });

  it('With negative numbers and decimal ones', () => {
    const args1 = new Args();
    args1.add(3.4648 as f64);
    args1.add(-2.4783 as f64);
    args1.add(-9 as i64);

    expect(args1.nextF64().unwrap()).toBe(3.4648);
    expect(args1.nextF64().unwrap()).toBe(-2.4783);
    expect(args1.nextI64().unwrap()).toBe(-9);

    const args2 = new Args(args1.serialize());
    expect(args2.nextF64().unwrap()).toBe(3.4648);
    expect(args2.nextF64().unwrap()).toBe(-2.4783);
    expect(args2.nextI64().unwrap()).toBe(-9);
  });

  it('With byteArray', () => {
    const args1 = new Args();
    let test = new Uint8Array(10);
    test.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    args1.add(test);
    expect(args1.nextUint8Array().unwrap()).toStrictEqual(test);

    const args2 = new Args(args1.serialize());
    expect(args2.nextUint8Array().unwrap()).toStrictEqual(test);
  });

  it('With byteArray, string and number', () => {
    const args1 = new Args();
    let test = new Uint8Array(10);
    test.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    args1.add('my string');
    args1.add(test);
    args1.add(300 as u64);
    expect(args1.nextString().unwrap()).toBe('my string');
    expect(args1.nextUint8Array().unwrap()).toStrictEqual(test);
    expect(args1.nextU64().unwrap()).toBe(300);

    const args2 = new Args(args1.serialize());
    expect(args2.nextString().unwrap()).toBe('my string');
    expect(args2.nextUint8Array().unwrap()).toStrictEqual(test);
    expect(args2.nextU64().unwrap()).toBe(300);
  });

  it('With u8', () => {
    const args1 = new Args();
    args1.add(u8(1));

    const args2 = new Args(args1.serialize());
    expect(args2.nextU8().unwrap()).toBe(u8(1));
    expect(args2.nextU8().isOk()).toBeFalsy('out of range deserialization');
  });
});
