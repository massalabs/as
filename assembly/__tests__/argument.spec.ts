import {Args, NoArg} from '../argument';
import {Amount} from '../amount';
import {Currency} from '../currency';

const AMOUNT = new Amount(1234, new Currency('my very own currency', 2));

describe('Args tests', () => {
  it('With bytes', () => {
    const arr: StaticArray<u8> = [1, 2, 3, 4, 5];
    const args1 = new Args();
    args1.add(arr);
    expect(args1.serialize()).toStrictEqual([5, 0, 0, 0, 1, 2, 3, 4, 5]);

    const args2 = new Args(args1.serialize());
    expect(args2.nextBytes().expect()).toStrictEqual(arr);
  });

  it('With a number', () => {
    // Create an argument class instance
    const args1 = new Args();
    // add some arguments
    args1.add(97 as u64);

    //
    // serialization / deserialization use case
    //

    // use serialize to get the byte array
    const serializedBytes = args1.serialize();

    // instanciate a new argument class from the serialized data
    const args2 = new Args(serializedBytes);

    // assert that the first address is same we provide
    // in the first call to add function
    expect(args2.nextU64().expect()).toBe(97);
  });

  it('With booleans and number', () => {
    const args1 = new Args();
    args1.add(true).add(false).add(83);

    const args2 = new Args(args1.serialize());
    expect(args2.nextBool().expect()).toBe(true);
    expect(args2.nextBool().expect()).toBe(false);
    expect(args2.nextI32().expect()).toBe(83);
  });

  it('With a number and an Amount', () => {
    const args1 = new Args();
    const amtBytes = AMOUNT.toBytes();
    args1.add(97 as u32).add(amtBytes);
    // AMOUNT.addArgs(args1);

    expect(args1.nextU32().expect()).toBe(97 as u32);
    const bytes = args1.nextBytes().expect('next bytes');
    expect(bytes).toStrictEqual(amtBytes);
    expect(Amount.fromBytes(bytes).expect('amount from bytes')).toBe(AMOUNT);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU32().expect('next u32')).toBe(97 as u32);

    // /!\ Not working anymore we can't mix both from/toBytes and from/toArgs
    // expect(Amount.fromArgs(args2).expect("amount from args")).toBe(AMOUNT);
  });

  it('With Address and i64', () => {
    const args1 = new Args();
    args1.add(97 as i64);
    AMOUNT.addArgs(args1);
    args1.add(113 as i64);

    expect(args1.nextI64().expect()).toBe(97);
    expect(Amount.fromArgs(args1).expect()).toBe(AMOUNT);
    expect(args1.nextI64().expect()).toBe(113);

    const args2 = new Args(args1.serialize());
    expect(args2.nextI64().expect()).toBe(97);
    expect(Amount.fromArgs(args2).expect()).toBe(AMOUNT);
    expect(args2.nextI64().expect()).toBe(113);
  });

  it('With Address and u64', () => {
    const args1 = new Args();
    args1.add(97 as u64);
    AMOUNT.addArgs(args1);
    args1.add(113 as u64);

    expect(args1.nextU64().expect()).toBe(97);
    expect(Amount.fromArgs(args1).expect()).toBe(AMOUNT);
    expect(args1.nextU64().expect()).toBe(113);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU64().expect()).toBe(97);
    expect(Amount.fromArgs(args2).expect()).toBe(AMOUNT);
    expect(args2.nextU64().expect()).toBe(113);
  });

  it('With string and i64', () => {
    const args1 = new Args();
    args1
      .add(97 as i64)
      .add('my string')
      .add(113 as i64);

    expect(args1.nextI64().expect()).toBe(97);
    expect(args1.nextString().expect()).toBe('my string');
    expect(args1.nextI64().expect()).toBe(113);

    const args2 = new Args(args1.serialize());
    expect(args2.nextI64().expect()).toBe(97);
    expect(args2.nextString().expect()).toBe('my string');
    expect(args2.nextI64().expect()).toBe(113);
  });

  it('With a big string', () => {
    const args1 = new Args();
    args1.add('a'.repeat(65600));

    expect(args1.nextString().expect()).toBe('a'.repeat(65600));

    const args2 = new Args(args1.serialize());
    expect(args2.nextString().expect()).toBe('a'.repeat(65600));
  });

  it('With string and u64', () => {
    const args1 = new Args();
    args1
      .add(97 as u64)
      .add('my string')
      .add(11356323656733 as u64);

    expect(args1.nextU64().expect()).toBe(97);
    expect(args1.nextString().expect()).toBe('my string');
    expect(args1.nextU64().expect()).toBe(11356323656733);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU64().expect()).toBe(97);
    expect(args2.nextString().expect()).toBe('my string');
    expect(args2.nextU64().expect()).toBe(11356323656733);
  });

  it('With u32', () => {
    const args1 = new Args();
    args1.add(97 as u32);

    expect(args1.nextU32().expect()).toBe(97 as u32);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU32().expect()).toBe(97 as u32);
  });

  it('With string and u32', () => {
    const args1 = new Args();
    args1
      .add(97 as u32)
      .add('my string')
      .add(112 as u32);

    expect(args1.nextU32().expect()).toBe(97 as u32);
    expect(args1.nextString().expect()).toBe('my string');
    expect(args1.nextU32().expect()).toBe(112 as u32);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU32().expect()).toBe(97 as u32);
    expect(args2.nextString().expect()).toBe('my string');
    expect(args2.nextU32().expect()).toBe(112 as u32);
  });

  it('With string and 0 and max number', () => {
    const args1 = new Args();
    args1
      .add(0 as u64)
      .add('my string')
      .add(u64.MAX_VALUE as u64);

    expect(args1.nextU64().expect()).toBe(0);
    expect(args1.nextString().expect()).toBe('my string');
    expect(args1.nextU64().expect()).toBe(u64.MAX_VALUE);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU64().expect()).toBe(0);
    expect(args2.nextString().expect()).toBe('my string');
    expect(args2.nextU64().expect()).toBe(u64.MAX_VALUE);
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

    expect(args1.nextF64().expect()).toBe(3);

    const args2 = new Args(args1.serialize());
    expect(args2.nextF64().expect()).toBe(3);
  });

  it('With negative numbers and decimal ones', () => {
    const args1 = new Args();
    args1.add(3.4648 as f64);
    args1.add(-2.4783 as f64);
    args1.add(-9 as i64);

    expect(args1.nextF64().expect()).toBe(3.4648);
    expect(args1.nextF64().expect()).toBe(-2.4783);
    expect(args1.nextI64().expect()).toBe(-9);

    const args2 = new Args(args1.serialize());
    expect(args2.nextF64().expect()).toBe(3.4648);
    expect(args2.nextF64().expect()).toBe(-2.4783);
    expect(args2.nextI64().expect()).toBe(-9);
  });

  it('With byteArray', () => {
    const args1 = new Args();
    let test = new Uint8Array(10);
    test[0] = 1;
    test[1] = 2;
    test[2] = 3;
    test[3] = 4;
    test[4] = 5;
    test[5] = 6;
    test[6] = 7;
    test[7] = 8;
    test[8] = 9;
    test[9] = 10;
    args1.add(test);
    expect(args1.nextUint8Array().expect()).toStrictEqual(test);

    const args2 = new Args(args1.serialize());
    expect(args2.nextUint8Array().expect()).toStrictEqual(test);
  });

  it('With byteArray, string and number', () => {
    const args1 = new Args();
    let test = new Uint8Array(10);
    test[0] = 1;
    test[1] = 2;
    test[2] = 3;
    test[3] = 4;
    test[4] = 5;
    test[5] = 6;
    test[6] = 7;
    test[7] = 8;
    test[8] = 9;
    test[9] = 10;
    args1.add('my string');
    args1.add(test);
    args1.add(300 as u64);
    expect(args1.nextString().expect()).toBe('my string');
    expect(args1.nextUint8Array().expect()).toStrictEqual(test);
    expect(args1.nextU64().expect()).toBe(300);

    const args2 = new Args(args1.serialize());
    expect(args2.nextString().expect()).toBe('my string');
    expect(args2.nextUint8Array().expect()).toStrictEqual(test);
    expect(args2.nextU64().expect()).toBe(300);
  });

  it('With u8', () => {
    const args1 = new Args();
    args1.add(u8(1));

    const args2 = new Args(args1.serialize());
    expect(args2.nextU8().expect()).toBe(u8(1));
    expect(args2.nextU8().isOk()).toBeFalsy('out of range deserialization');
  });
});
