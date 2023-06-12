import { Divinity, Hero, Person } from './dto-tests/Person';
import {
  boolToByte,
  bytesToF32,
  bytesToF64,
  bytesToI32,
  bytesToI64,
  bytesToNativeTypeArray,
  bytesToString,
  bytesToU32,
  bytesToU64,
  byteToBool,
  byteToU8,
  f32ToBytes,
  f64ToBytes,
  i32ToBytes,
  i64ToBytes,
  nativeTypeArrayToBytes,
  stringToBytes,
  u32ToBytes,
  u64ToBytes,
  u8toByte,
} from '../serialization';
import { u128, u256 } from 'as-bignum/assembly';
import {
  bytesToU128,
  bytesToU256,
  u128ToBytes,
  u256ToBytes,
} from '../serialization/bignum';

describe('Serialization tests', () => {
  it('ser/deser with emojis', () => {
    const str = 'Hello world 🙂';
    expect(bytesToString(stringToBytes(str))).toBe(str);
  });
  it('ser/deser Ascii', () => {
    const str =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    expect(bytesToString(stringToBytes(str))).toBe(str);
  });
  it('ser/deser utf16 char', () => {
    const str = String.fromCharCodes([0xd83d, 0xde42]);
    expect(bytesToString(stringToBytes(str))).toBe('🙂');
  });
  it('ser/deser bool', () => {
    let val = false;
    expect(byteToBool(boolToByte(val))).toBe(val);
    val = true;
    expect(byteToBool(boolToByte(val))).toBe(val);
  });
  it('ser/deser u8', () => {
    const val: u8 = 123;
    expect(byteToU8(u8toByte(val))).toBe(val);
  });
  it('ser/deser u32', () => {
    const val: u32 = 666;
    expect(bytesToU32(u32ToBytes(val))).toBe(val);
  });
  it('ser/deser u64', () => {
    const val: u64 = 666;
    expect(bytesToU64(u64ToBytes(val))).toBe(val);
  });
  it('ser/deser i32', () => {
    const val: i32 = -666;
    expect(bytesToI32(i32ToBytes(val))).toBe(val);
  });
  it('ser/deser i64', () => {
    const val: i64 = -666;
    expect(bytesToI64(i64ToBytes(val))).toBe(val);
  });
  it('ser/deser f32', () => {
    const val: f32 = -666.666;
    expect(bytesToF32(f32ToBytes(val))).toBe(val);
  });
  it('ser/deser f64', () => {
    const val: f64 = -666.666;
    expect(bytesToF64(f64ToBytes(val))).toBe(val);
  });
  it('ser/deser f64 max val', () => {
    const val: f64 = F64.MAX_VALUE;
    expect(bytesToF64(f64ToBytes(val))).toBe(val);
  });
  it('ser/deser u128', () => {
    const val: u128 = u128.Max;
    expect(bytesToU128(u128ToBytes(val))).toBe(val);
  });
  it('ser/deser u128', () => {
    const val: u128 = u128.Zero;
    expect(bytesToU128(u128ToBytes(val))).toBe(val);
  });
  it('ser/deser u128', () => {
    const val: u128 = u128.fromString('123456789012345678901234567890');
    expect(bytesToU128(u128ToBytes(val))).toBe(val);
  });
  it('ser/deser u256', () => {
    const val: u256 = u256.Max;
    expect(bytesToU256(u256ToBytes(val))).toBe(val);
  });
  it('ser/deser u256.Zero', () => {
    const val: u256 = u256.Zero;
    expect(bytesToU256(u256ToBytes(val))).toBe(val);
  });
  it('ser/deser u256', () => {
    // u256.fromString is not implemented
    const val: u256 = u256.add(u256.fromU128(u128.Max), u256.fromU32(1));
    expect(bytesToU256(u256ToBytes(val))).toBe(val);
  });

  // ARRAYS

  it('ser/deser array of object', () => {
    const age1 = 18;
    const age2 = 37;
    const name1 = 'Hercules';
    const name2 = 'Zeus';
    const array = [new Person(age1, name1), new Person(age2, name2)];
    const bytes = nativeTypeArrayToBytes(array);
    const arrayDeser = bytesToNativeTypeArray<Person>(bytes);
    expect(arrayDeser.length).toBe(2);
    expect(arrayDeser[0].age).toBe(age1);
    expect(arrayDeser[0].name).toBe(name1);
    expect(arrayDeser[1].age).toBe(age2);
    expect(arrayDeser[1].name).toBe(name2);
  });

  it('ser/deser array of object (deep copy)', () => {
    const age1 = 18;
    const age2 = 37;
    const name1 = 'Hercules';
    const name2 = 'Zeus';
    const array = [new Hero(age1, name1), new Divinity(age2, name2)];
    const bytes = nativeTypeArrayToBytes(array);
    const arrayDeser = bytesToNativeTypeArray<Divinity>(bytes);
    expect(arrayDeser.length).toBe(2);
    expect(arrayDeser[0].age).toBe(age1);
    expect(arrayDeser[0].name).toBe(name1);
    expect(arrayDeser[1].age).toBe(age2);
    expect(arrayDeser[1].name).toBe(name2);
  });

  // ARRAY U8
  it('ser/deser empty array u8', () => {
    const array: u8[] = [];
    expect<u8[]>(
      bytesToNativeTypeArray<u8>(nativeTypeArrayToBytes<u8>(array)),
    ).toStrictEqual(array);
  });
  it('ser/deser array of one u8', () => {
    const array = [1 as u8];
    const ser = nativeTypeArrayToBytes<u8>(array);
    expect<u8[]>(bytesToNativeTypeArray<u8>(ser)).toStrictEqual(array);
  });
  it('ser/deser array of two u8', () => {
    const array = [1 as u8, 2 as u8];
    const ser = nativeTypeArrayToBytes<u8>(array);
    expect<u8[]>(bytesToNativeTypeArray<u8>(ser)).toStrictEqual(array);
  });
  it('ser/deser array of 8 u8', () => {
    const array = [
      1 as u8,
      2 as u8,
      3 as u8,
      5 as u8,
      8 as u8,
      13 as u8,
      21 as u8,
      34 as u8,
    ];
    const ser = nativeTypeArrayToBytes<u8>(array);
    expect<u8[]>(bytesToNativeTypeArray<u8>(ser)).toStrictEqual(array);
  });

  // ARRAY I16
  it('ser/deser empty array i16', () => {
    const array: i16[] = [];
    expect<i16[]>(
      bytesToNativeTypeArray<i16>(nativeTypeArrayToBytes<i16>(array)),
    ).toStrictEqual(array);
  });
  it('ser/deser array of one i16', () => {
    const array = [1 as i16];
    expect<i16[]>(
      bytesToNativeTypeArray<i16>(nativeTypeArrayToBytes<i16>(array)),
    ).toStrictEqual(array);
  });
  it('ser/deser array of i16', () => {
    const array = [1 as i16, 2 as i16, 3 as i16, 5 as i16, 8 as i16];
    expect<i16[]>(
      bytesToNativeTypeArray<i16>(nativeTypeArrayToBytes<i16>(array)),
    ).toStrictEqual(array);
  });

  // ARRAY I32
  it('ser/deser empty array i32', () => {
    const array: i32[] = [];
    expect<i32[]>(
      bytesToNativeTypeArray<i32>(nativeTypeArrayToBytes<i32>(array)),
    ).toStrictEqual(array);
  });
  it('ser/deser array of one i32', () => {
    const array = [1 as i32];
    expect<i32[]>(
      bytesToNativeTypeArray<i32>(nativeTypeArrayToBytes<i32>(array)),
    ).toStrictEqual(array);
  });
  it('ser/deser array of i32', () => {
    const array = [1, 2, 3, 5, 8];
    expect<i32[]>(
      bytesToNativeTypeArray<i32>(nativeTypeArrayToBytes<i32>(array)),
    ).toStrictEqual(array);
  });
  it('ser/deser big array i32', () => {
    const array: i32[] = [];
    for (let index = 0; index < 999; index++) {
      array.push(index);
    }
    expect<i32[]>(
      bytesToNativeTypeArray<i32>(nativeTypeArrayToBytes<i32>(array)),
    ).toStrictEqual(array);
  });

  // ARRAY I64
  it('ser/deser array of u64', () => {
    const array = [<u64>1765456765, <u64>7654690, <u64>3, <u64>5, <u64>8];
    expect<u64[]>(
      bytesToNativeTypeArray<u64>(nativeTypeArrayToBytes<u64>(array)),
    ).toStrictEqual(array);
  });
});
