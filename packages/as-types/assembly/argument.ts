import { Result } from './result';
import {
  bytesToString,
  stringToBytes,
  unwrapStaticArray,
  wrapStaticArray,
  bytesToF32,
  bytesToU32,
  bytesToU64,
  f32ToBytes,
  f64ToBytes,
  u32ToBytes,
  u64ToBytes,
  u8toByte,
  bytesToF64,
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
    const size: i32 = sizeof<u64>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize u64 from given argument: out of range",
      );
    }

    const subArray = this.serialized.slice(this.offset, this.offset + size);
    const value = bytesToU64(unwrapStaticArray(subArray));
    this.offset += size;
    return new Result(value);
  }

  /**
   * Returns the deserialized number as i64.
   *
   * @return {Result<i64>}
   */
  nextI64(): Result<i64> {
    const size: i32 = sizeof<i64>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize i64 from given argument: out of range",
      );
    }

    const subArray = this.serialized.slice(this.offset, this.offset + size);

    const value = changetype<i64>(bytesToU64(unwrapStaticArray(subArray)));
    this.offset += size;
    return new Result(value);
  }

  /**
   * Returns the deserialized number as f64.
   *
   * @return {Result<f64>}
   */
  nextF64(): Result<f64> {
    const size: i32 = sizeof<f64>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize f64 from given argument: out of range",
      );
    }
    const subArray = this.serialized.slice(this.offset, this.offset + size);

    const value = bytesToF64(unwrapStaticArray(subArray));
    this.offset += sizeof<f64>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as f32.
   *
   * @return {Result<f32>}
   */
  nextF32(): Result<f32> {
    const size: i32 = sizeof<f32>();
    if (this.offset + sizeof<f32>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize f32 from given argument: out of range",
      );
    }

    const subArray = this.serialized.slice(this.offset, this.offset + size);
    const value = bytesToF32(unwrapStaticArray(subArray));
    this.offset += sizeof<f32>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as u32.
   *
   * @return {Result<u32>}
   */
  nextU32(): Result<u32> {
    const size: i32 = sizeof<u32>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize u32 from given argument: out of range",
      );
    }

    const subArray = this.serialized.slice(this.offset, this.offset + size);
    const value = bytesToU32(unwrapStaticArray(subArray));
    this.offset += size;
    return new Result(value);
  }

  /**
   * Returns the deserialized number as i32.
   *
   * @return {Result<i32>}
   */
  nextI32(): Result<i32> {
    const size: i32 = sizeof<i32>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize i32 from given argument: out of range",
      );
    }
    const subArray = this.serialized.slice(this.offset, this.offset + size);

    const value = changetype<i32>(bytesToU32(unwrapStaticArray(subArray)));
    this.offset += size;
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

    return new Result(!!this.serialized[this.offset++]);
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
    } else if (arg instanceof u8) {
      this.serialized = this.concatArrays(
        this.serialized,
        wrapStaticArray(u8toByte(arg as u8)),
      );
    } else if (arg instanceof u32) {
      this.serialized = this.concatArrays(
        this.serialized,
        wrapStaticArray(u32ToBytes(arg as u32)),
      );
    } else if (arg instanceof u64) {
      this.serialized = this.concatArrays(
        this.serialized,
        wrapStaticArray(u64ToBytes(arg as u64)),
      );
    } else if (arg instanceof i32) {
      this.serialized = wrapStaticArray(
        unwrapStaticArray(this.serialized).concat(u32ToBytes(arg as u32)),
      );
    } else if (arg instanceof i64) {
      this.serialized = this.concatArrays(
        this.serialized,
        wrapStaticArray(u64ToBytes(arg as u64)),
      );
    } else if (arg instanceof f32) {
      this.serialized = this.concatArrays(
        this.serialized,
        wrapStaticArray(f32ToBytes(arg as f32)),
      );
    } else if (arg instanceof f64) {
      this.serialized = this.concatArrays(
        this.serialized,
        wrapStaticArray(f64ToBytes(arg as f64)),
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
}

export const NoArg: Args = new Args();
