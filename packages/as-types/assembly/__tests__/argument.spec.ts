import { Args, NoArg } from '../argument';
import { Amount } from '../amount';
import { Currency } from '../currency';
import { Divinity, Hero, Person } from '../Person';

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

  it('With u64', () => {
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

  it('With array of numbers', () => {
    const arrayU64 = [
      <u64>1765456765.654,
      <u64>7654690.00005,
      <u64>3,
      <u64>5,
      <u64>8,
    ];
    const args = new Args(new Args().add(arrayU64).serialize());
    expect<u64[]>(args.nextArray<u64>().unwrap()).toStrictEqual(arrayU64);
  });

  it('With array of one u8', () => {
    // limit case
    const arrayU8 = [<u8>54];
    const args2 = new Args(new Args().add(arrayU8).serialize());
    expect<u8[]>(args2.nextArray<u8>().unwrap()).toStrictEqual(arrayU8);
    const arrayEmpty: boolean[] = [];
    const args3 = new Args(new Args().add(arrayEmpty).serialize());
    expect<boolean[]>(args3.nextArray<boolean>().unwrap()).toStrictEqual(
      arrayEmpty,
    );
  });

  it('With array of object (no deep copy)', () => {
    const arrayOfPerson = [
      new Person(14, 'Poseidon'),
      new Person(45, 'Superman'),
    ];
    const args = new Args(new Args().add(arrayOfPerson).serialize());
    const deser = args.nextArray<Person>().unwrap();
    const first = deser[0];
    expect(deser).toHaveLength(2);
    expect(first.age).toBe(14);
    expect(first.name).toBe('Poseidon');
    expect(deser[1].age).toBe(45);
    expect(deser[1].name).toBe('Superman');
  });

  it('With array of Serializable', () => {
    const arrayOfSerializable = [
      new Divinity(14, 'Poseidon'),
      new Divinity(45, 'Superman'),
    ];
    const args = new Args(new Args().add(arrayOfSerializable).serialize());
    const deser = args.nextSerializableArray<Divinity>().unwrap();
    const first = deser[0];
    expect(deser).toHaveLength(2);
    expect(first.age).toBe(14);
    expect(first.name).toBe('Poseidon');
    expect(deser[1].age).toBe(45);
    expect(deser[1].name).toBe('Superman');
  });
});
