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
  bytesToI32,
  bytesToI64,
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
  private serialized: StaticArray<u8> = new StaticArray<u8>(0);

  /**
   *
   * @params serialized
   */
  constructor(serialized: StaticArray<u8> = []) {
    this.serialized = serialized;
  }

  /**
   * Returns the serialized string to pass to CallSC.
   *
   * @returns the serialized string
   */
  serialize(): StaticArray<u8> {
    return this.serialized;
  }

  // getters

  /**
   * Returns the deserialized string.
   *
   * @returns
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

    const value = bytesToString(this.getNextData(length.unwrap()));
    this.offset += length.unwrap();
    return new Result(value);
  }

  /**
   * Returns the deserialized byte.
   *
   * @returns
   */
  nextBytes(): Result<StaticArray<u8>> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this.offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        new StaticArray<u8>(0),
        "can't deserialize Uint8Array from given argument: out of range",
      );
    }
    const value = this.getNextData(length.unwrap());
    this.offset += length.unwrap();
    return new Result(value);
  }

  /**
   * Returns the deserialized Uint8Array.
   *
   * @returns
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

    const value = wrapStaticArray(this.getNextData(length.unwrap()));
    this.offset += length.unwrap();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as u64.
   *
   * @returns
   */
  nextU64(): Result<u64> {
    const size: i32 = sizeof<u64>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize u64 from given argument: out of range",
      );
    }
    const value = bytesToU64(this.getNextData(size));
    this.offset += size;
    return new Result(value);
  }

  /**
   * Returns the deserialized number as i64.
   *
   * @returns
   */
  nextI64(): Result<i64> {
    const size: i32 = sizeof<i64>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize i64 from given argument: out of range",
      );
    }

    const value = bytesToI64(this.getNextData(size));
    this.offset += size;
    return new Result(value);
  }

  /**
   * Returns the deserialized number as f64.
   *
   * @returns
   */
  nextF64(): Result<f64> {
    const size: i32 = sizeof<f64>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize f64 from given argument: out of range",
      );
    }
    const value = bytesToF64(this.getNextData(size));
    this.offset += sizeof<f64>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as f32.
   *
   * @returns
   */
  nextF32(): Result<f32> {
    const size: i32 = sizeof<f32>();
    if (this.offset + sizeof<f32>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize f32 from given argument: out of range",
      );
    }

    const value = bytesToF32(this.getNextData(size));
    this.offset += sizeof<f32>();
    return new Result(value);
  }

  /**
   * Returns the deserialized number as u32.
   *
   * @returns
   */
  nextU32(): Result<u32> {
    const size: i32 = sizeof<u32>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize u32 from given argument: out of range",
      );
    }

    const value = bytesToU32(this.getNextData(size));
    this.offset += size;
    return new Result(value);
  }

  /**
   * Returns the deserialized number as i32.
   *
   * @returns
   */
  nextI32(): Result<i32> {
    const size: i32 = sizeof<i32>();
    if (this.offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize i32 from given argument: out of range",
      );
    }
    const value = bytesToI32(this.getNextData(size));
    this.offset += size;
    return new Result(value);
  }

  /**
   * Returns the deserialized u8
   *
   * @returns
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
   * @returns
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

  /**
   * Returns the data of requested size for current offset
   * @param size The data size
   * @returns
   */
  private getNextData(size: i32): StaticArray<u8> {
    return changetype<StaticArray<u8>>(
      this.serialized.slice(this.offset, this.offset + size).dataStart,
    );
  }

  // Setter

  /**
   * Adds an argument to the serialized byte string if the argument is an
   * instance of a handled type (String of u32.MAX_VALUE characters maximum,
   * Address, Uint8Array, bool, u8, u32, i32, f32, u64, i64, f64).
   *
   * @param arg the argument to add
   *
   * @returns the modified Arg instance
   */
  add<T>(arg: T): Args {
    if (arg instanceof bool) {
      const value = new StaticArray<u8>(1);
      value[0] = u8(arg);
      this.serialized = this.serialized.concat(value);
    } else if (arg instanceof String) {
      this.add<u32>(arg.length << 1);
      this.serialized = this.serialized.concat(stringToBytes(arg as string));
    } else if (arg instanceof Uint8Array) {
      this.add<u32>(arg.length);
      this.serialized = this.serialized.concat(unwrapStaticArray(arg));
    } else if (arg instanceof StaticArray<u8>) {
      this.add<u32>(arg.length);
      this.serialized = this.serialized.concat(arg);
    } else if (arg instanceof u8) {
      this.serialized = this.serialized.concat(u8toByte(arg as u8));
    } else if (arg instanceof u32 || arg instanceof i32) {
      this.serialized = this.serialized.concat(u32ToBytes(arg as u32));
    } else if (arg instanceof u64 || arg instanceof i64) {
      this.serialized = this.serialized.concat(u64ToBytes(arg as u64));
    } else if (arg instanceof f32) {
      this.serialized = this.serialized.concat(f32ToBytes(arg as f32));
    } else if (arg instanceof f64) {
      this.serialized = this.serialized.concat(f64ToBytes(arg as f64));
    }
    return this;
  }
}

export const NoArg: Args = new Args();
