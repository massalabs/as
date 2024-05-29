/* eslint-disable new-cap */
import { Args, NoArg } from '../argument';
import { Amount } from '../amount';
import { Currency } from '../currency';
import { Divinity, Hero } from './dto-tests/Person';
import { i128, u128, u256 } from 'as-bignum/assembly';

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

  it('With a number', () => {
    const val: u32 = 97;
    const args1 = new Args();
    args1.add(val);
    expect(args1.nextU32().unwrap()).toBe(val);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU32().expect('next u32')).toBe(val);
  });

  it('With two number', () => {
    const val1: u32 = 97;
    const val2: u32 = 666;
    const args1 = new Args();
    args1.add(val1).add(val2);

    expect(args1.nextU32().unwrap()).toBe(val1);
    expect(args1.nextU32().unwrap()).toBe(val2);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU32().expect('next u32')).toBe(val1);
    expect(args2.nextU32().expect('next u32')).toBe(val2);
  });

  it('With i64', () => {
    const args1 = new Args();
    args1.add(97 as i64);
    args1.add(amt);
    args1.add(113 as i64);

    expect(args1.nextI64().unwrap()).toBe(97);
    expect(args1.nextSerializable<Amount>().unwrap()).toBe(amt);
    expect(args1.nextI64().unwrap()).toBe(113);

    const args2 = new Args(args1.serialize());
    expect(args2.nextI64().unwrap()).toBe(97);
    expect(args2.nextSerializable<Amount>().unwrap()).toBe(amt);
    expect(args2.nextI64().unwrap()).toBe(113);
  });

  it('With u64', () => {
    const args1 = new Args();
    args1.add(97 as u64);
    args1.add(amt);
    args1.add(113 as u64);

    expect(args1.nextU64().unwrap()).toBe(97);
    expect(args1.nextSerializable<Amount>().unwrap()).toBe(amt);
    expect(args1.nextU64().unwrap()).toBe(113);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU64().unwrap()).toBe(97);
    expect(args2.nextSerializable<Amount>().unwrap()).toBe(amt);
    expect(args2.nextU64().unwrap()).toBe(113);
  });

  it('With i128', () => {
    const val1 = i128.Max;
    const val2 = i128.add(i128.fromU64(U64.MAX_VALUE), i128.fromU64(1));
    const val3 = i128.Zero;

    const serialized = new Args().add(val1).add(val2).add(val3).serialize();

    const args = new Args(serialized);
    expect(args.nextI128().unwrap()).toBe(val1);
    expect(args.nextI128().unwrap()).toBe(val2);
    expect(args.nextI128().unwrap()).toBe(val3);
  });

  it('With u128', () => {
    const val1 = u128.Max;
    const val2 = u128.add(u128.fromU64(U64.MAX_VALUE), u128.fromU64(1));
    const val3 = u128.Zero;

    const serialized = new Args().add(val1).add(val2).add(val3).serialize();

    const args = new Args(serialized);
    expect(args.nextU128().unwrap()).toBe(val1);
    expect(args.nextU128().unwrap()).toBe(val2);
    expect(args.nextU128().unwrap()).toBe(val3);
  });

  it('With u256', () => {
    const val1 = u256.Zero;
    const val2 = u256.add(u256.fromU128(u128.Max), u256.fromU64(1));
    const val3 = u256.Max;

    const serialized = new Args().add(val1).add(val2).add(val3).serialize();

    const args = new Args(serialized);
    expect(args.nextU256().unwrap()).toBe(val1);
    expect(args.nextU256().unwrap()).toBe(val2);
    expect(args.nextU256().unwrap()).toBe(val3);
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

  it('With emoji string', () => {
    const args1 = new Args();
    const str = 'wagmi 🤩';
    args1.add(str);

    expect(args1.nextString().unwrap()).toBe(str);

    const args2 = new Args(args1.serialize());
    expect(args2.nextString().unwrap()).toBe(str);
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

  it('With u16 & i16', () => {
    const args1 = new Args();
    args1.add(97 as u16);

    expect(args1.nextU16().unwrap()).toBe(97 as u16);

    const args2 = new Args(args1.serialize());
    expect(args2.nextU16().unwrap()).toBe(97 as u16);

    const args3 = new Args();
    args3
      .add(U16.MAX_VALUE)
      .add(U16.MIN_VALUE)
      .add(I16.MAX_VALUE)
      .add(I16.MIN_VALUE);
    let n1 = args3.nextU16().expect('Cannot get u16');
    let n2 = args3.nextU16().expect('Cannot get u16');
    let n3 = args3.nextI16().expect('Cannot get i16');
    let n4 = args3.nextI16().expect('Cannot get i16');
    expect<u16>(n1).toBe(U16.MAX_VALUE);
    expect<u16>(n2).toBe(U16.MIN_VALUE);
    expect<i16>(n3).toBe(I16.MAX_VALUE);
    expect<i16>(n4).toBe(I16.MIN_VALUE);
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

  it('With empty string', () => {
    const args1 = new Args();
    args1.add('my string');
    args1.add('');
    args1.add('another string');
    expect(args1.nextString().unwrap()).toBe('my string');
    expect(args1.nextString().unwrap()).toBe('');
    expect(args1.nextString().unwrap()).toBe('another string');

    const args2 = new Args(args1.serialize());
    expect(args2.nextString().unwrap()).toBe('my string');
    expect(args2.nextString().unwrap()).toBe('');
    expect(args2.nextString().unwrap()).toBe('another string');
  });

  it('With u8', () => {
    const args1 = new Args();
    args1.add(u8(1));

    const args2 = new Args(args1.serialize());
    expect(args2.nextU8().unwrap()).toBe(u8(1));
    expect(args2.nextU8().isOk()).toBeFalsy('out of range deserialization');
  });

  // Object

  it('With object that uses Args', () => {
    // Example of a class that doesn't implement Serializable,
    // this will not compile:
    // const args = new Args().add(new Person(2, 'wrong'));

    const array = new Uint8Array(2);
    array.set([65, 88]);
    const age = 18 as i32;
    const name = 'Jack';
    const person = new Divinity(age, name);
    const floatingPointNumber = 13.7 as f32;

    const args = new Args();
    args.add(array).add(person).add(floatingPointNumber);

    const args2 = new Args(args.serialize());

    expect(args2.nextUint8Array().unwrap()).toStrictEqual(array);
    const person2 = args2.nextSerializable<Divinity>().unwrap();
    expect(person2.age).toBe(age);
    expect(person2.name).toBe(name);
    expect(args2.nextF32().unwrap()).toBeCloseTo(floatingPointNumber);
  });

  it('With object that uses Args and does not panic', () => {
    const array = new Uint8Array(2);
    array.set([65, 88]);
    const age = 24 as i32;
    const name = 'Me';
    const hero = new Hero(age, name);
    const floatingPointNumber = 19.11 as f32;

    const args = new Args(
      new Args().add(array).add(hero).add(floatingPointNumber).serialize(),
    );

    expect(args.nextUint8Array().unwrap()).toStrictEqual(array);
    const hero2 = args.nextSerializable<Hero>().unwrap();
    expect(hero2.age).toBe(age);
    expect(hero2.name).toBe(name);
    expect(args.nextF32().unwrap()).toBeCloseTo(floatingPointNumber);
  });

  // Array

  it('With array of u64', () => {
    const arrayU64 = [<u64>1765456765, <u64>7654690, <u64>3, <u64>5, <u64>8];
    const serialized = new Args().add(arrayU64).serialize();
    const args = new Args(serialized);
    const unserialized = args.nextFixedSizeArray<u64>().unwrap();
    expect<u64[]>(unserialized).toStrictEqual(arrayU64);
  });

  it('With array of u128', () => {
    const array = [
      u128.from(22),
      u128.from(3),
      new u128(444, 666),
      u128.from(8888),
      u128.from(555),
    ];
    const serialized = new Args().add(array).serialize();
    expect(serialized.length).toBe(array.length * offsetof<u128>() + 4);
    const args = new Args(serialized);
    const unserialized = args.nextFixedSizeArray<u128>().unwrap();
    expect<u128[]>(unserialized).toStrictEqual(array);
  });

  it('With array of i128', () => {
    const array = [
      i128.from(22),
      i128.from(3),
      i128.from(-1234),
      new i128(-444, 666),
      i128.from(555),
    ];
    const serialized = new Args().add(array).serialize();
    expect(serialized.length).toBe(array.length * offsetof<i128>() + 4);
    const args = new Args(serialized);
    const unserialized = args.nextFixedSizeArray<i128>().unwrap();
    expect<i128[]>(unserialized).toStrictEqual(array);
  });

  it('With array of u256', () => {
    const array = [
      u256.fromU64(22),
      new u256(444, 666, 555, 2222),
      u256.fromU64(44),
      u256.fromU64(8888),
      u256.fromU64(555),
    ];
    const serialized = new Args().add(array).serialize();
    expect(serialized.length).toBe(array.length * offsetof<u256>() + 4);
    const args = new Args(serialized);
    const unserialized = args.nextFixedSizeArray<u256>().unwrap();
    expect<u256[]>(unserialized).toStrictEqual(array);
  });

  it('With array of one u8', () => {
    const array = [<u8>54, <u8>0, <u8>0xff];
    const serialized = new Args().add(array).serialize();
    expect(serialized.length).toBe(array.length * sizeof<u8>() + 4);
    const args = new Args(serialized);
    expect<u8[]>(args.nextFixedSizeArray<u8>().unwrap()).toStrictEqual(array);
  });

  it('With empty array of boolean', () => {
    const emptyArray: boolean[] = [];
    const args = new Args(new Args().add(emptyArray).serialize());
    expect<boolean[]>(
      args.nextFixedSizeArray<boolean>().unwrap(),
    ).toStrictEqual(emptyArray);
  });

  it('With array of string', () => {
    const array = ["I'm", 'a', 'string', 'array', 'of', 'strings'];
    const serialized = new Args().add(array).serialize();
    const args = new Args(serialized);
    const unserialized = args.nextStringArray().unwrap();
    expect<string[]>(unserialized).toStrictEqual(array);
  });
  it('With 2 arrays of string', () => {
    const array1 = ["I'm", 'the', '1st'];
    const array2 = ["I'm", 'a', '2nd'];
    const serialized = new Args().add(array1).add(array2).serialize();
    const args = new Args(serialized);
    const unserialized1 = args.nextStringArray().unwrap();
    expect<string[]>(unserialized1).toStrictEqual(array1);
    const unserialized2 = args.nextStringArray().unwrap();
    expect<string[]>(unserialized2).toStrictEqual(array2);
  });
  it('With array of Serializable', () => {
    const arrayOfSerializable = [
      new Divinity(14, 'Poseidon?!#'),
      new Divinity(45, 'Superman'),
    ];
    const args = new Args(
      new Args().addSerializableObjectArray(arrayOfSerializable).serialize(),
    );
    const deser = args.nextSerializableObjectArray<Divinity>().unwrap();
    const first = deser[0];
    expect(deser).toHaveLength(2);
    expect(first.age).toBe(14);
    expect(first.name).toBe('Poseidon?!#');
    expect(deser[1].age).toBe(45);
    expect(deser[1].name).toBe('Superman');
  });
});

describe('Args next<T>', () => {
  it('handles u8', () => {
    const args = new Args(new Args().add(1 as u8).serialize());
    expect(args.next<u8>().unwrap()).toBe(1);
  });

  it('handles u16', () => {
    const args = new Args(new Args().add(2 as u16).serialize());
    expect(args.next<u16>().unwrap()).toBe(2);
  });

  it('handles u32', () => {
    const args = new Args(new Args().add(3 as u32).serialize());
    expect(args.next<u32>().unwrap()).toBe(3);
  });

  it('handles u64', () => {
    const args = new Args(new Args().add(4 as u64).serialize());
    expect(args.next<u64>().unwrap()).toBe(4);
  });

  it('handles i16', () => {
    const args = new Args(new Args().add(-5 as i16).serialize());
    expect(args.next<i16>().unwrap()).toBe(-5);
  });

  it('handles i32', () => {
    const args = new Args(new Args().add(-6 as i32).serialize());
    expect(args.next<i32>().unwrap()).toBe(-6);
  });

  it('handles i64', () => {
    const args = new Args(new Args().add(-7 as i64).serialize());
    expect(args.next<i64>().unwrap()).toBe(-7);
  });

  it('handles f32', () => {
    const args = new Args(new Args().add(8.8 as f32).serialize());
    expect(args.next<f32>().unwrap()).toBe(8.8);
  });

  it('handles f64', () => {
    const args = new Args(new Args().add(9.9 as f64).serialize());
    expect(args.next<f64>().unwrap()).toBe(9.9);
  });

  it('handles bool', () => {
    const args = new Args(new Args().add(true).serialize());
    expect(args.next<bool>().unwrap()).toBe(true);
  });

  it('handles u128', () => {
    const args = new Args(new Args().add(u128.Max).serialize());
    expect(args.next<u128>().unwrap()).toBe(u128.Max);
  });

  it('handles i128', () => {
    const args = new Args(new Args().add(i128.Max).serialize());
    expect(args.next<i128>().unwrap()).toBe(i128.Max);
  });

  it('handles u256', () => {
    const args = new Args(new Args().add(u256.Max).serialize());
    expect(args.next<u256>().unwrap()).toBe(u256.Max);
  });

  it('handles string', () => {
    const args = new Args(new Args().add('hello').serialize());
    expect(args.next<string>().unwrap()).toBe('hello');
  });

  it('handles Uint8Array', () => {
    const array = new Uint8Array(2);
    array.set([65, 88]);
    const args = new Args(new Args().add(array).serialize());
    expect(args.next<Uint8Array>().unwrap()).toStrictEqual(array);
  });

  it('handles StaticArray<u8>', () => {
    const array = new StaticArray<u8>(2);
    array[0] = 65;
    array[1] = 88;
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<StaticArray<u8>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect(resultArray[0]).toBe(array[0]);
    expect(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<u8>', () => {
    const array = [65, 88] as u8[];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<u8>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect(resultArray[0]).toBe(array[0]);
    expect(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<i32>', () => {
    const array = [65, 88] as i32[];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<i32>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect(resultArray[0]).toBe(array[0]);
    expect(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<i128>', () => {
    const array = [i128.from(65), i128.from(88)];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<i128>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect<i128>(resultArray[0]).toBe(array[0]);
    expect<i128>(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<u128>', () => {
    const array = [u128.from(65), u128.from(88)];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<u128>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect<u128>(resultArray[0]).toBe(array[0]);
    expect<u128>(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<u256>', () => {
    const array = [u256.from(65), u256.from(88)];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<u256>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect<u256>(resultArray[0]).toBe(array[0]);
    expect<u256>(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<f32>', () => {
    const array = [65.5, 88.8] as f32[];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<f32>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect(resultArray[0]).toBe(array[0]);
    expect(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<f64>', () => {
    const array = [65.5, 88.8] as f64[];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<f64>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect(resultArray[0]).toBe(array[0]);
    expect(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<bool>', () => {
    const array = [true, false];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<bool>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect(resultArray[0]).toBe(array[0]);
    expect(resultArray[1]).toBe(array[1]);
  });

  it('handles Array<string>', () => {
    const array = ['hello', 'world'];
    const args = new Args(new Args().add(array).serialize());
    const resultArray = args.next<Array<string>>().unwrap();
    expect(resultArray.length).toBe(array.length);
    expect(resultArray[0]).toBe(array[0]);
    expect(resultArray[1]).toBe(array[1]);
  });

  it('handles multiple types', () => {
    const args = new Args(
      new Args()
        .add(1 as u8)
        .add(2 as u16)
        .add(3 as u32)
        .add(4 as u64)
        .add(-5 as i16)
        .add(-6 as i32)
        .add(-7 as i64)
        .add(8.8 as f32)
        .add(9.9 as f64)
        .add(true)
        .add(u128.Max)
        .add(i128.Max)
        .add(u256.Max)
        .add('hello')
        .serialize(),
    );
    expect(args.next<u8>().unwrap()).toBe(1);
    expect(args.next<u16>().unwrap()).toBe(2);
    expect(args.next<u32>().unwrap()).toBe(3);
    expect(args.next<u64>().unwrap()).toBe(4);
    expect(args.next<i16>().unwrap()).toBe(-5);
    expect(args.next<i32>().unwrap()).toBe(-6);
    expect(args.next<i64>().unwrap()).toBe(-7);
    expect(args.next<f32>().unwrap()).toBe(8.8);
    expect(args.next<f64>().unwrap()).toBe(9.9);
    expect(args.next<bool>().unwrap()).toBe(true);
    expect(args.next<u128>().unwrap()).toBe(u128.Max);
    expect(args.next<i128>().unwrap()).toBe(i128.Max);
    expect(args.next<u256>().unwrap()).toBe(u256.Max);
    expect(args.next<string>().unwrap()).toBe('hello');
  });

  it('handles Serializable', () => {
    const age = 42 as i32;
    const name = 'Wolverine';
    const person = new Divinity(age, name);
    const args = new Args(new Args().add(person).serialize());
    const person2 = args.next<Divinity>().unwrap();
    expect(person2.age).toBe(age);
    expect(person2.name).toBe(name);
  });

  it('handles SerializableObjectArray', () => {
    const arrayOfSerializable = [
      new Divinity(42, 'Batman'),
      new Divinity(84, 'Superman'),
    ];
    const args = new Args(
      new Args()
        .add<Array<Divinity>, Divinity>(arrayOfSerializable)
        .serialize(),
    );
    const deser = args.next<Array<Divinity>, Divinity>().unwrap();
    expect(deser).toHaveLength(2);
    expect(deser[0].age).toBe(42);
    expect(deser[0].name).toBe('Batman');
    expect(deser[1].age).toBe(84);
    expect(deser[1].name).toBe('Superman');
  });

  it('handles SerializableObjectArray with empty array', () => {
    const emptyArray: Divinity[] = [];
    const args = new Args(
      new Args().add<Array<Divinity>, Divinity>(emptyArray).serialize(),
    );
    expect(args.next<Array<Divinity>, Divinity>().unwrap()).toStrictEqual(
      emptyArray,
    );
  });

  it('handles StringArray and SerializableObjectArray', () => {
    const arrayOfStrings = ['hello', 'world'];
    const arrayOfSerializable = [
      new Divinity(42, 'Batman'),
      new Divinity(84, 'Superman'),
    ];

    const args = new Args(
      new Args()
        .add(arrayOfStrings)
        .add<Array<Divinity>, Divinity>(arrayOfSerializable)
        .serialize(),
    );

    const strings = args.next<Array<string>>().unwrap();
    expect(strings).toStrictEqual(arrayOfStrings);

    const deserialized = args.next<Array<Divinity>, Divinity>().unwrap();
    expect(deserialized).toStrictEqual(arrayOfSerializable);
  });
});

describe('Args mustNext<T>', () => {
  it('handles u8,stringArray,u256', () => {
    const args = new Args(
      new Args()
        .add(123 as u8)
        .add(['hello', 'world'])
        .add(u256.Max)
        .serialize(),
    );

    expect(args.mustNext<u8>('byte')).toBe(123);
    expect(args.mustNext<Array<string>>('array')).toStrictEqual([
      'hello',
      'world',
    ]);
    expect(args.mustNext<u256>('u256')).toBe(u256.Max);
  });

  throws('fails to deserialize', () => {
    const args = new Args(
      new Args()
        .add(123 as u8)
        .add(['hello', 'world'])
        .add(u256.Max)
        .serialize(),
    );

    args.mustNext<Array<string>>('array');
  });
});
