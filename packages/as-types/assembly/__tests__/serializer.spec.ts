import {
  boolToByte,
  bytesToF32,
  bytesToF64,
  bytesToI32,
  bytesToI64,
  bytesToString,
  bytesToU32,
  bytesToU64,
  byteToBool,
  byteToU8,
  f32ToBytes,
  f64ToBytes,
  i32ToBytes,
  i64ToBytes,
  stringToBytes,
  u32ToBytes,
  u64ToBytes,
  u8toByte,
} from '../serialization';

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
});
