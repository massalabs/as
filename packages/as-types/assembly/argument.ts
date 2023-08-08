import { i128, u128, u256 } from 'as-bignum/assembly';
import { Result } from './result';
import { Serializable } from './serializable';
import * as ser from './serialization';
import { i256 } from 'as-bignum/assembly/integer/i256';

/**
 * Args for remote function call.
 *
 * @remarks
 * - This class can serialize assembly script native types into bytes, in order to
 *   make smart-contract function call easier.
 *
 * - In a smart-contract exposed function, use this class to deserialize the string
 *   argument, using the `next...` methods.
 *
 * - In a smart-contract, to call another smart-contract function, use this class
 *   to serialize the arguments you want to pass to the smart-contract function
 *   call.
 *
 */
export class Args {
  private _offset: i32 = 0;
  private serialized: StaticArray<u8> = new StaticArray<u8>(0);

  /**
   * Initializes a new instance of Args.
   *
   * @param serialized - The serialized arguments. Default: []
   * @param offset - The offset to start deserializing from. Default: 0
   *
   */
  constructor(serialized: StaticArray<u8> = [], offset: i32 = 0) {
    this.serialized = serialized;
    this._offset = offset;
  }

  /**
   * Gets the offset to start deserializing from.
   *
   * @returns the offset
   */
  get offset(): i32 {
    return this._offset;
  }

  /**
   * Returns the serialized arguments.
   *
   * @returns The serialized arguments as a static array of bytes.
   */
  serialize(): StaticArray<u8> {
    return this.serialized;
  }

  // getters

  /**
   * Deserializes a string from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result object containing an empty string and an error message:
   * "can't deserialize string from given argument: out of range".
   * In this case, the offset will not be changed.
   *
   * @returns a Result object:
   * - Containing the next deserialized string starting from the current offset.
   * - Containing an empty string and an error message if the deserialization failed.
   *
   */
  nextString(): Result<string> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this._offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        '',
        "can't deserialize string from given argument: out of range",
      );
    }

    const value = ser.bytesToString(this.getNextData(length.unwrap()));
    return new Result(value);
  }

  /**
   * Deserializes a bytes array from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing an empty StaticArray of u8
   * and an error message: "can't deserialize bytes from given argument: out of range".
   * In this case, the offset will not be changed.
   *
   * @returns a Result object:
   * - Containing the next deserialized StaticArray of u8 starting from the current offset
   * - Containing an empty StaticArray and an error message if the deserialization failed
   *
   */
  nextBytes(): Result<StaticArray<u8>> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this._offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        new StaticArray<u8>(0),
        "can't deserialize bytes from given argument: out of range",
      );
    }

    const bufferSize = length.unwrap();
    if (!bufferSize) {
      return new Result([]);
    }

    const value = this.getNextData(bufferSize);
    return new Result(value);
  }

  /**
   * Deserializes an array of fixed size elements
   * starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result object containing an empty array and an error message:
   * "can't deserialize length of array from given argument".
   * In this case, the offset will not be changed.
   *
   * @returns a Result object:
   * - Containing the next deserialized array of fixed size elements
   * - Containing an empty array and an error message if the deserialization failed
   */
  nextFixedSizeArray<T>(): Result<T[]> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this._offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        [],
        "can't deserialize length of array from given argument",
      );
    }

    const bufferSize = length.unwrap();
    if (!bufferSize) {
      return new Result([]);
    }

    const buffer = this.getNextData(bufferSize);

    const value = ser.bytesToFixedSizeArray<T>(buffer);

    return new Result(value);
  }

  /**
   * Deserializes an array of strings starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result object containing an empty array and an error message:
   * "can't deserialize length of array from given argument".
   * In this case, the offset will not be changed.
   *
   * @returns a Result object:
   * - Containing the next deserialized array of strings
   * - Containing an empty array and an error message if the deserialization failed
   */
  nextStringArray(): Result<string[]> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this._offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        [],
        "can't deserialize length of array from given argument",
      );
    }

    const bufferSize = length.unwrap();
    if (!bufferSize) {
      return new Result([]);
    }

    const value: string[] = [];
    const startOffset = this._offset;
    while (this._offset < startOffset + bufferSize) {
      const u32Size = sizeof<u32>();
      const strLen = ser.bytesToU32(this.getNextData(<i32>u32Size));
      value.push(ser.bytesToString(this.getNextData(strLen)));
    }

    this._offset += bufferSize;
    return new Result(value);
  }

  /**
   * Deserializes an array of serializable objects from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing an empty array and an error message:
   * "can't deserialize length of array from given argument".
   *
   * @returns a Result object:
   * - Containing the next deserialized array of objects that implement Serializable objects starting from the current
   *    offset
   * - Containing an empty array and an error message if the deserialization failed
   *
   */
  nextSerializableObjectArray<T extends Serializable>(): Result<T[]> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this._offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        [],
        "can't deserialize length of array from given argument",
      );
    }

    const bufferSize = length.unwrap();

    if (bufferSize === 0) {
      return new Result([]);
    }

    const buffer = this.getNextData(bufferSize);

    const value = ser.bytesToSerializableObjectArray<T>(buffer);
    return value;
  }

  /**
   * Deserializes an array of u8 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing an empty Uint8Array and an error message:
   * "can't deserialize Uint8Array from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized array of u8 starting from the current offset
   * - Containing an empty Uint8Array and an error message if the deserialization failed
   *
   */
  nextUint8Array(): Result<Uint8Array> {
    const length = this.nextU32();
    if (
      length.isErr() ||
      this._offset + length.unwrap() > this.serialized.length
    ) {
      return new Result(
        new Uint8Array(0),
        "can't deserialize Uint8Array from given argument: out of range",
      );
    }

    const value = ser.wrapStaticArray(this.getNextData(length.unwrap()));
    return new Result(value);
  }

  /**
   * Deserializes an u256 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize u256 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized u256 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   *
   */
  nextU256(): Result<u256> {
    const size: i32 = 32;
    if (this._offset + size > this.serialized.length) {
      return new Result(
        u256.Zero,
        "can't deserialize u256 from given argument: out of range",
      );
    }
    const value = ser.bytesToU256(this.getNextData(size));
    return new Result(value);
  }

  /**
   * Deserializes an U128 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize u128 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized U128 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   *
   */
  nextU128(): Result<u128> {
    const size: i32 = 16;
    if (this._offset + size > this.serialized.length) {
      return new Result(
        u128.Zero,
        "can't deserialize u128 from given argument: out of range",
      );
    }
    const value = ser.bytesToU128(this.getNextData(size));
    return new Result(value);
  }

  /**
   * Deserializes an U64 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize u64 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized U64 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   *
   */
  nextU64(): Result<u64> {
    const size: i32 = sizeof<u64>();
    if (this._offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize u64 from given argument: out of range",
      );
    }
    const value = ser.bytesToU64(this.getNextData(size));
    return new Result(value);
  }

  /**
   * Deserializes an I64 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize i64 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized I64 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   *
   */
  nextI64(): Result<i64> {
    const size: i32 = sizeof<i64>();
    if (this._offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize i64 from given argument: out of range",
      );
    }

    const value = ser.bytesToI64(this.getNextData(size));
    return new Result(value);
  }

  /**
   * Deserializes an f64 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize f64 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized f64 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   */
  nextF64(): Result<f64> {
    const size: i32 = sizeof<f64>();
    if (this._offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize f64 from given argument: out of range",
      );
    }
    const value = ser.bytesToF64(this.getNextData(size));
    return new Result(value);
  }

  /**
   * Deserializes an F32 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize f32 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized f32 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   *
   */
  nextF32(): Result<f32> {
    const size: i32 = sizeof<f32>();
    if (this._offset + sizeof<f32>() > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize f32 from given argument: out of range",
      );
    }

    const value = ser.bytesToF32(this.getNextData(size));
    return new Result(value);
  }

  /**
   * Deserializes an u32 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize u32 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized u32 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   *
   */
  nextU32(): Result<u32> {
    const size: i32 = sizeof<u32>();
    if (this._offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize u32 from given argument: out of range",
      );
    }

    const value = ser.bytesToU32(this.getNextData(size));
    return new Result(value);
  }

  /**
   * Deserializes an i32 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize i32 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized i32 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   *
   */
  nextI32(): Result<i32> {
    const size: i32 = sizeof<i32>();
    if (this._offset + size > this.serialized.length) {
      return new Result(
        0,
        "can't deserialize i32 from given argument: out of range",
      );
    }
    const value = ser.bytesToI32(this.getNextData(size));
    return new Result(value);
  }

  /**
   * Deserializes an u8 from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing 0 and an error message:
   * "can't deserialize u8 from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized u8 starting from the current offset
   * - Containing 0 and an error message if the deserialization failed
   *
   */
  nextU8(): Result<u8> {
    if (this._offset + sizeof<u8>() > this.serialized.length) {
      return new Result(
        u8(0),
        "can't deserialize u8 from given argument: out of range",
      );
    }

    return new Result(this.serialized[this._offset++]);
  }

  /**
   * Deserializes a boolean from a serialized array starting from the current offset.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing false and an error message:
   * "can't deserialize bool from given argument: out of range".
   *
   * @returns a Result object:
   * - Containing the next deserialized boolean starting from the current offset
   * - Containing false and an error message if the deserialization failed
   *
   */
  nextBool(): Result<bool> {
    if (this._offset + sizeof<u8>() > this.serialized.length) {
      return new Result(
        false,
        "can't deserialize bool from given argument: out of range",
      );
    }

    return new Result(!!this.serialized[this._offset++]);
  }

  /**
   * Deserialize an object by calling its `deserialize` method.
   *
   * @remarks
   * If the deserialization failed, it returns a Result containing the object and an error message:
   * "Can't deserialize object " + type of the object.
   *
   * @returns a Result object:
   * - Containing the next deserialized object starting from the current offset
   * - Containing the object and an error message if the deserialization failed
   *
   */
  nextSerializable<T extends Serializable>(): Result<T> {
    const object = instantiate<T>();
    const result = object.deserialize(this.serialized, this._offset);
    if (result.isErr()) {
      return new Result(object, `Can't deserialize object ${typeof object}`);
    }
    this._offset = result.unwrap();
    return new Result(object);
  }

  /**
   * This function retrieves the next chunk of data from the serialized data array based on the specified size
   * and returns it as a static array of unsigned 8-bit integers.
   *
   *
   * @param size - The data size
   *
   * @returns the data of requested size for current offset
   */
  private getNextData(size: i32): StaticArray<u8> {
    const data = changetype<StaticArray<u8>>(
      this.serialized.slice(this._offset, this._offset + size).dataStart,
    );
    this._offset += size;
    return data;
  }

  // Setter

  /**
   * This method adds an argument to the serialized byte array if the argument is an
   * instance of a handled type (bool, String of u32.MAX_VALUE characters maximum,
   * Uint8Array, StaticArray<u8>, u8, u32, i32, u64, i64, f32, f64, Serializable).
   *
   * @remarks
   * If the type of the object to add isn't handled, it returns an error message:
   * "args doesn't know how to serialize the given type."
   *
   * @param arg - the argument to add
   * @returns the modified Arg instance
   */
  add<T>(arg: T): Args {
    if (arg instanceof bool) {
      this.serialized = this.serialized.concat(ser.boolToByte(<bool>arg));
    } else if (arg instanceof String) {
      const serialized = ser.stringToBytes(<string>arg);
      this.add<u32>(serialized.length);
      this.serialized = this.serialized.concat(serialized);
    } else if (arg instanceof Uint8Array) {
      this.add<u32>(arg.length);
      this.serialized = this.serialized.concat(ser.unwrapStaticArray(arg));
    } else if (arg instanceof StaticArray<u8>) {
      this.add<u32>(arg.length);
      this.serialized = this.serialized.concat(arg);
    } else if (arg instanceof u8) {
      this.serialized = this.serialized.concat(ser.u8toByte(<u8>arg));
    } else if (arg instanceof u32 || arg instanceof i32) {
      this.serialized = this.serialized.concat(ser.u32ToBytes(<u32>arg));
    } else if (arg instanceof u64 || arg instanceof i64) {
      this.serialized = this.serialized.concat(ser.u64ToBytes(<u64>arg));
    } else if (arg instanceof f32) {
      this.serialized = this.serialized.concat(ser.f32ToBytes(<f32>arg));
    } else if (arg instanceof f64) {
      this.serialized = this.serialized.concat(ser.f64ToBytes(<f64>arg));
    } else if (arg instanceof u128 || arg instanceof i128) {
      this.serialized = this.serialized.concat(ser.u128ToBytes(<u128>arg));
    } else if (arg instanceof u256 || arg instanceof i256) {
      this.serialized = this.serialized.concat(ser.u256ToBytes(<u256>arg));
      // @ts-ignore
    } else if (arg instanceof Serializable) {
      this.serialized = this.serialized.concat(
        (arg as Serializable).serialize(),
      );
    } else if (
      // prettier-ignore
      (arg instanceof Array<bool>) || (arg instanceof Array<u8>)
      || (arg instanceof Array<u32>) || (arg instanceof Array<i32>)
      || (arg instanceof Array<u64>) || (arg instanceof Array<i64>)
      || (arg instanceof Array<f32>) || (arg instanceof Array<f64>)
      || (arg instanceof Array<u128>) || (arg instanceof Array<i128>)
      || (arg instanceof Array<u256>) || (arg instanceof Array<i256>)
    ) {
      const content = ser.fixedSizeArrayToBytes(arg);
      this.add<u32>(content.length);
      this.serialized = this.serialized.concat(content);
    } else if (arg instanceof Array<string>) {
      let totalLength: u32 = 0;
      let serialized = new StaticArray<u8>(0);
      // serialize each string element with its length followed by its content
      for (let i = 0; i < arg.length; i++) {
        const strBytes = ser.stringToBytes(arg[i]);
        serialized = serialized
          .concat(ser.u32ToBytes(strBytes.length))
          .concat(strBytes);
        totalLength += <u32>sizeof<u32>() + strBytes.length;
      }
      this.add<u32>(totalLength);
      this.serialized = this.serialized.concat(serialized);
    } else {
      ERROR("args doesn't know how to serialize the given type.");
    }
    return this;
  }

  /**
   * This method adds an array of elements that implement `Serializable`.
   *
   * @remarks
   * This will perform a deep copy of your objects thanks to the `serialize` method you define in your class.
   *
   * @see {@link Serializable}
   *
   * @param arg - the argument to add
   * @returns the modified Arg instance
   */
  addSerializableObjectArray<T extends ArrayLike<Serializable>>(arg: T): Args {
    // @ts-ignore
    const content = ser.serializableObjectsArrayToBytes(arg);
    this.add<u32>(content.length);
    this.serialized = this.serialized.concat(content);
    return this;
  }
}

export const NoArg: Args = new Args();
