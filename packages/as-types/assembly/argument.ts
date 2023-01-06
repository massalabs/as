import { Result } from './result';
import {
  bytesToString,
  stringToBytes,
  unwrapStaticArray,
  wrapStaticArray,
} from './serialization';

/**
 * Args for remote function call.
 *
 * This class can serialize assembly script native types into bytes, in order to
 * make smart-contract function call easier.
 *
 * In a smart-contract exposed function, use this class to deserialize the string
 * argument, using the `next...` methods.
 *
 * In a smart-contract, to call another smart-contract function, use this class
 * to serialize the arguments you want to pass to the smart-contract function
 * call.
 *
 */
export class Args {
  private offset: i32 = 0;
  private serialized: Uint8Array = new Uint8Array(0);

  /**
   *
   * @param {string} serialized
   */
  constructor(serialized: StaticArray<u8> = []) {
    this.serialized = wrapStaticArray(serialized);
  }

  /**
   * Returns the serialized string to pass to CallSC.
   *
   * @return {string} the serialized string
   */
  serialize(): StaticArray<u8> {
    return unwrapStaticArray(this.serialized);
  }

  // getters

  /**
   * Returns the deserialized string.
   *
   * @return {Result<string>} the string
   */
  nextString(): Result<string> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this.offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        '',
        "can't deserialize Uint8Array from given argument: out of range",
      );
    }

    let offset = this.offset;
    const end = offset + length.unwrap();
    const result = this.serialized.slice(offset, end);
    this.offset = end;
    return new Result(bytesToString(unwrapStaticArray(result)));
  }

  /**
   * Returns the deserialized Uint8Array.
   *
   * @return {Result<Uint8Array>}
   */
  nextUint8Array(): Result<Uint8Array> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this.offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        new Uint8Array(0),
        "can't deserialize Uint8Array from given argument: out of range",
      );
    }

    let byteArray = this.serialized.slice(
      this.offset,
      this.offset + length.unwrap(),
    );
    this.offset += length.unwrap();
    return new Result(byteArray);
  }

  nextBytes(): Result<StaticArray<u8>> {
    const u8ArrRes = this.nextUint8Array();

    if (u8ArrRes.isErr()) {
      return new Result(
        new StaticArray<u8>(0),
        'while deserializing StaticArray<u8>: ' + u8ArrRes.error!,
      );
    }

    const u8Arr = u8ArrRes.unwrap();
    return new Result(unwrapStaticArray(u8Arr));
  }

  /**
   * Returns the deserialized number as u64.
   *
   * @return {Result<u64>}
   */
  nextU64(): Result<u64> {
    if (this.offset + sizeof<u64>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize u64 from given argument: out of range",
      );
    }

    const value = this.toU64(this.serialized, this.offset as u8);
    this.offset += sizeof<u64>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as i64.
   *
   * @return {Result<i64>}
   */
  nextI64(): Result<i64> {
    if (this.offset + sizeof<i64>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize i64 from given argument: out of range",
      );
    }

    const value = changetype<i64>(
      this.toU64(this.serialized, this.offset as u8),
    );
    this.offset += sizeof<i64>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as f64.
   *
   * @return {Result<f64>}
   */
  nextF64(): Result<f64> {
    if (this.offset + sizeof<f64>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize f64 from given argument: out of range",
      );
    }

    const value = this.toF64(this.serialized, this.offset as u8);
    this.offset += sizeof<f64>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as f32.
   *
   * @return {Result<f32>}
   */
  nextF32(): Result<f32> {
    if (this.offset + sizeof<f32>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize f32 from given argument: out of range",
      );
    }

    const value = this.toF32(this.serialized, this.offset as u8);
    this.offset += sizeof<f32>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as u32.
   *
   * @return {Result<u32>}
   */
  nextU32(): Result<u32> {
    if (this.offset + sizeof<u32>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize u32 from given argument: out of range",
      );
    }

    const value = this.toU32(this.serialized, this.offset as u8);
    this.offset += sizeof<u32>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as i32.
   *
   * @return {Result<i32>}
   */
  nextI32(): Result<i32> {
    if (this.offset + sizeof<i32>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize i32 from given argument: out of range",
      );
    }

    const value = changetype<i32>(
      this.toU32(this.serialized, this.offset as u8),
    );
    this.offset += sizeof<i32>();
    return new Result(value);
  }

  /**
   * Returns the deserialized u8
   *
   * @return {Result<u8>}
   */
  nextU8(): Result<u8> {
    if (this.offset + sizeof<u8>() > this.serialized.length) {
      return new Result(
        u8(0),
        "can't deserialize u8 from given argument: out of range",
      );
    }

    return new Result(this.serialized[this.offset++]);
  }

  /**
   * Returns the deserialized boolean
   *
   * @return {Result<bool>}
   */
  nextBool(): Result<bool> {
    if (this.offset + sizeof<u8>() >= this.serialized.length) {
      return new Result(
        false,
        "can't deserialize bool from given argument: out of range",
      );
    }

    return new Result(this.serialized[this.offset++] == 0x01);
  }

  // Setter

  /**
   * Adds an argument to the serialized byte string if the argument is an
   * instance of a handled type (String of u32.MAX_VALUE characters maximum,
   * Address, Uint8Array, bool, u8, u32, i32, f32, u64, i64, f64).
   *
   * @param {T} arg the argument to add
   *
   * @return {Args} the modified Arg instance
   */
  add<T>(arg: T): Args {
    if (arg instanceof bool) {
      const value = new Uint8Array(1);
      value[0] = u8(arg);
      this.serialized = this.concatArrays(this.serialized, value);
    } else if (arg instanceof String) {
      this.add<u32>(arg.length << 1);
      this.serialized = this.concatArrays(
        this.serialized,
        wrapStaticArray(stringToBytes(arg as string)),
      );
    } else if (arg instanceof Uint8Array) {
      this.add<u32>(arg.length);
      this.serialized = this.concatArrays(this.serialized, arg);
    } else if (arg instanceof StaticArray<u8>) {
      this.add<u32>(arg.length);
      this.serialized = this.concatArrays(
        this.serialized,
        wrapStaticArray(arg),
      );
    } else if (arg instanceof u32) {
      this.serialized = this.concatArrays(
        this.serialized,
        this.fromU32(changetype<u32>(arg)),
      );
    } else if (arg instanceof i64) {
      this.serialized = this.concatArrays(
        this.serialized,
        this.fromU64(changetype<u64>(arg)),
      );
    } else if (arg instanceof u64) {
      this.serialized = this.concatArrays(
        this.serialized,
        this.fromU64(changetype<u64>(arg)),
      );
    } else if (arg instanceof f32) {
      this.serialized = this.concatArrays(
        this.serialized,
        this.fromF32(changetype<f32>(arg)),
      );
    } else if (arg instanceof f64) {
      this.serialized = this.concatArrays(
        this.serialized,
        this.fromF64(changetype<f64>(arg)),
      );
    } else if (arg instanceof i32) {
      this.serialized = this.concatArrays(
        this.serialized,
        this.fromU32(changetype<i32>(arg)),
      );
    } else if (arg instanceof u8) {
      this.serialized = this.concatArrays(
        this.serialized,
        this.fromU8(changetype<u8>(arg)),
      );
    }
    return this;
  }

  // Utils

  /**
   * Internal function to concat to Uint8Array.
   *
   * @param {Uint8Array} a first array to concat
   * @param {Uint8Array} b second array to concat
   *
   * @return {Uint8Array} the concatenated array
   */
  private concatArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
    var c = new Uint8Array(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }

  /**
   * Converts a f64 in a bytearray.
   *
   * @param {f64} number the number to convert
   *
   * @return {Uint8Array} the converted bytearray
   */
  private fromF64(number: f64): Uint8Array {
    return this.fromU64(bswap<u64>(reinterpret<u64>(number)));
  }

  /**
   * Converts a f32 in a bytearray.
   *
   * @param {f32} number the number to convert
   *
   * @return {Uint8Array} the converted bytearray
   */
  private fromF32(number: f32): Uint8Array {
    return this.fromU32(bswap<u32>(reinterpret<u32>(number)));
  }

  /**
   * Converts a u64 in a bytearray.
   *
   * @param {u64} number the number to convert
   *
   * @return {Uint8Array} the converted bytearray
   */
  private fromU64(number: u64): Uint8Array {
    let byteArray = new Uint8Array(8);
    let firstPart: u32 = (number >> 32) as u32;
    byteArray.set(this.fromU32(firstPart), 4);
    byteArray.set(this.fromU32(number as u32));
    return byteArray;
  }

  /**
   * Converts a u32 in a bytearray.
   *
   * @param {u32} number the number to convert
   *
   * @return {Uint8Array} the converted bytearray
   */
  private fromU32(number: u32): Uint8Array {
    const byteArray = new Uint8Array(4);
    for (let i = 0; i < 4; i++) {
      byteArray[i] = u8(number >> (i * 8));
    }
    return byteArray;
  }

  /**
   * Converts a u8 in a bytearray.
   *
   * @param {u8} number the number to convert
   *
   * @return {Uint8Array} the converted bytearray
   */
  private fromU8(number: u8): Uint8Array {
    const byteArray = new Uint8Array(1);
    byteArray[0] = number;
    return byteArray;
  }

  /**
   * Converts a byte array into a f64.
   *
   * @param {Uint8Array} byteArray
   * @param {u8} offset
   * @return {f64}
   */
  private toF64(byteArray: Uint8Array, offset: u8 = 0): f64 {
    if (byteArray.length - offset < 8) {
      return <f64>NaN;
    }

    return reinterpret<f64>(bswap<u64>(this.toU64(byteArray, offset)));
  }

  /**
   * Converts a byte array into a f32.
   *
   * @param {Uint8Array} byteArray
   * @param {u8} offset
   * @return {f32}
   */
  private toF32(byteArray: Uint8Array, offset: u8 = 0): f32 {
    if (byteArray.length - offset < 4) {
      return <f32>NaN;
    }

    return reinterpret<f32>(bswap<u32>(this.toU32(byteArray, offset)));
  }

  /**
   * Converts a byte array into a u64.
   *
   * @param {Uint8Array} byteArray
   * @param {u8} offset
   * @return {u64}
   */
  private toU64(byteArray: Uint8Array, offset: u8 = 0): u64 {
    if (byteArray.length - offset < sizeof<u64>()) {
      return <u64>NaN;
    }

    let x: u64 = 0;
    x = (x | this.toU32(byteArray, offset + 4)) << 32;
    x = x | this.toU32(byteArray, offset);
    return x;
  }

  /**
   * Converts a byte array into a u32.
   *
   * @param {Uint8Array} byteArray
   * @param {u8} offset
   * @return {u32}
   */
  private toU32(byteArray: Uint8Array, offset: u8 = 0): u32 {
    if (byteArray.length - offset < sizeof<u32>()) {
      return <u32>NaN;
    }

    let x: u32 = 0;
    for (let i = 3; i >= 1; --i) {
      x = (x | byteArray[offset + i]) << 8;
    }
    x = x | byteArray[offset];
    return x;
  }
}

export const NoArg: Args = new Args();
