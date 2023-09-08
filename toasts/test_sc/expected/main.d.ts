/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/contracts/main/constructor
 * @param binaryArgs `~lib/staticarray/StaticArray<u8>`
 * @returns `~lib/staticarray/StaticArray<u8>`
 */
export declare function constructor(binaryArgs: ArrayLike<number>): ArrayLike<number>;
/**
 * assembly/contracts/main/event
 * @param _ `~lib/staticarray/StaticArray<u8>`
 * @returns `~lib/staticarray/StaticArray<u8>`
 */
export declare function event(_: ArrayLike<number>): ArrayLike<number>;
/**
 * assembly/contracts/main/_ms_test1_
 * @param arg `~lib/as-bignum/assembly/integer/u128/u128`
 * @returns `~lib/as-bignum/assembly/integer/u128/u128`
 */
export declare function _ms_test1_(arg: __Internref24): __Internref24;
/**
 * assembly/contracts/main/_ms_test2_
 * @param arg `~lib/as-bignum/assembly/integer/u256/u256`
 * @returns `~lib/as-bignum/assembly/integer/u256/u256`
 */
export declare function _ms_test2_(arg: __Internref25): __Internref25;
/**
 * assembly/contracts/main/_ms_test3_
 * @param arg `~lib/as-bignum/assembly/integer/u128/u128`
 * @returns `~lib/as-bignum/assembly/integer/u256/u256`
 */
export declare function _ms_test3_(arg: __Internref24): __Internref25;
/**
 * assembly/contracts/main/_ms_test4_
 * @param arg1 `i32`
 * @param arg2 `i32`
 */
export declare function _ms_test4_(arg1: number, arg2: number): void;
/**
 * assembly/contracts/main/_ms_test5_
 * @param arg1 `i32`
 * @param arg2 `i32`
 */
export declare function _ms_test5_(arg1: number, arg2: number): void;
/**
 * assembly/contracts/main/_ms_test6_
 * @param str1 `~lib/string/String`
 * @param str2 `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function _ms_test6_(str1: string, str2: string): string;
/**
 * assembly/contracts/main/_ms_testArrayI32Ret_
 * @param arg1 `i32`
 * @param arg2 `i32`
 * @returns `~lib/array/Array<i32>`
 */
export declare function _ms_testArrayI32Ret_(arg1: number, arg2: number): Array<number>;
/**
 * assembly/contracts/main/_ms_testBool_
 * @param arg1 `bool`
 * @returns `bool`
 */
export declare function _ms_testBool_(arg1: boolean): boolean;
/**
 * assembly/contracts/main/_ms_testArrayBool_
 * @param arg1 `~lib/array/Array<bool>`
 * @returns `~lib/array/Array<bool>`
 */
export declare function _ms_testArrayBool_(arg1: Array<boolean>): Array<boolean>;
/**
 * assembly/contracts/main/_ms_testArrayI8_
 * @param arg1 `~lib/array/Array<i8>`
 * @returns `~lib/array/Array<i8>`
 */
export declare function _ms_testArrayI8_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testArrayU8_
 * @param arg1 `~lib/array/Array<u8>`
 * @returns `~lib/array/Array<u8>`
 */
export declare function _ms_testArrayU8_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testArrayI16_
 * @param arg1 `~lib/array/Array<i16>`
 * @returns `~lib/array/Array<i16>`
 */
export declare function _ms_testArrayI16_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testArrayU16_
 * @param arg1 `~lib/array/Array<u16>`
 * @returns `~lib/array/Array<u16>`
 */
export declare function _ms_testArrayU16_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testArrayI32_
 * @param arg1 `~lib/array/Array<i32>`
 * @returns `~lib/array/Array<i32>`
 */
export declare function _ms_testArrayI32_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testArrayU32_
 * @param arg1 `~lib/array/Array<u32>`
 * @returns `~lib/array/Array<u32>`
 */
export declare function _ms_testArrayU32_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testArrayI64_
 * @param arg1 `~lib/array/Array<i64>`
 * @returns `~lib/array/Array<i64>`
 */
export declare function _ms_testArrayI64_(arg1: Array<bigint>): Array<bigint>;
/**
 * assembly/contracts/main/_ms_testArrayU64_
 * @param arg1 `~lib/array/Array<u64>`
 * @returns `~lib/array/Array<u64>`
 */
export declare function _ms_testArrayU64_(arg1: Array<bigint>): Array<bigint>;
/**
 * assembly/contracts/main/_ms_testArrayString_
 * @param arg1 `~lib/array/Array<~lib/string/String>`
 * @returns `~lib/array/Array<~lib/string/String>`
 */
export declare function _ms_testArrayString_(arg1: Array<string>): Array<string>;
/**
 * assembly/contracts/main/_ms_testArrayCustomType_
 * @param arg1 `~lib/array/Array<~lib/as-bignum/assembly/integer/u128/u128>`
 * @returns `~lib/array/Array<~lib/as-bignum/assembly/integer/u256/u256>`
 */
export declare function _ms_testArrayCustomType_(arg1: Array<__Internref24>): Array<__Internref25>;
/**
 * assembly/contracts/main/_ms_testSquareArrayU8_
 * @param arg1 `~lib/array/Array<u8>`
 * @returns `~lib/array/Array<u8>`
 */
export declare function _ms_testSquareArrayU8_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testSquareArrayU16_
 * @param arg1 `~lib/array/Array<u16>`
 * @returns `~lib/array/Array<u16>`
 */
export declare function _ms_testSquareArrayU16_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testSquareArrayU32_
 * @param arg1 `~lib/array/Array<u32>`
 * @returns `~lib/array/Array<u32>`
 */
export declare function _ms_testSquareArrayU32_(arg1: Array<number>): Array<number>;
/**
 * assembly/contracts/main/_ms_testSquareArrayString_
 * @param arg1 `~lib/array/Array<~lib/string/String>`
 * @returns `~lib/array/Array<~lib/string/String>`
 */
export declare function _ms_testSquareArrayString_(arg1: Array<string>): Array<string>;
/**
 * assembly/contracts/main/_ms_testSquareArrayU128_
 * @param arg1 `~lib/array/Array<~lib/as-bignum/assembly/integer/u128/u128>`
 * @returns `~lib/array/Array<~lib/as-bignum/assembly/integer/u128/u128>`
 */
export declare function _ms_testSquareArrayU128_(arg1: Array<__Internref24>): Array<__Internref24>;
/**
 * assembly/contracts/main/_ms_testUint8Array_
 * @param arg1 `~lib/typedarray/Uint8Array`
 * @returns `~lib/typedarray/Uint8Array`
 */
export declare function _ms_testUint8Array_(arg1: Uint8Array): Uint8Array;
/**
 * assembly/contracts/main/_ms_testInt8Array_
 * @param arg1 `~lib/typedarray/Int8Array`
 * @returns `~lib/typedarray/Int8Array`
 */
export declare function _ms_testInt8Array_(arg1: Int8Array): Int8Array;
/**
 * assembly/contracts/main/_ms_testUint16Array_
 * @param arg1 `~lib/typedarray/Uint16Array`
 * @returns `~lib/typedarray/Uint16Array`
 */
export declare function _ms_testUint16Array_(arg1: Uint16Array): Uint16Array;
/**
 * assembly/contracts/main/_ms_testInt16Array_
 * @param arg1 `~lib/typedarray/Int16Array`
 * @returns `~lib/typedarray/Int16Array`
 */
export declare function _ms_testInt16Array_(arg1: Int16Array): Int16Array;
/**
 * assembly/contracts/main/_ms_testUint32Array_
 * @param arg1 `~lib/typedarray/Uint32Array`
 * @returns `~lib/typedarray/Uint32Array`
 */
export declare function _ms_testUint32Array_(arg1: Uint32Array): Uint32Array;
/**
 * assembly/contracts/main/_ms_testInt32Array_
 * @param arg1 `~lib/typedarray/Int32Array`
 * @returns `~lib/typedarray/Int32Array`
 */
export declare function _ms_testInt32Array_(arg1: Int32Array): Int32Array;
/**
 * assembly/contracts/main/_ms_testUint64Array_
 * @param arg1 `~lib/typedarray/Uint64Array`
 * @returns `~lib/typedarray/Uint64Array`
 */
export declare function _ms_testUint64Array_(arg1: BigUint64Array): BigUint64Array;
/**
 * assembly/contracts/main/_ms_testInt64Array_
 * @param arg1 `~lib/typedarray/Int64Array`
 * @returns `~lib/typedarray/Int64Array`
 */
export declare function _ms_testInt64Array_(arg1: BigInt64Array): BigInt64Array;
/**
 * assembly/contracts/main/_ms_testArrayOfUint8Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Uint8Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Uint8Array>`
 */
export declare function _ms_testArrayOfUint8Array_(arg1: Array<Uint8Array>): Array<Uint8Array>;
/**
 * assembly/contracts/main/_ms_testSquareArrayOfUint8Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Uint8Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Uint8Array>`
 */
export declare function _ms_testSquareArrayOfUint8Array_(arg1: Array<Uint8Array>): Array<Uint8Array>;
/**
 * assembly/contracts/main/_ms_testArrayOfInt8Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Int8Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Int8Array>`
 */
export declare function _ms_testArrayOfInt8Array_(arg1: Array<Int8Array>): Array<Int8Array>;
/**
 * assembly/contracts/main/_ms_testSquareArrayOfInt8Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Int8Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Int8Array>`
 */
export declare function _ms_testSquareArrayOfInt8Array_(arg1: Array<Int8Array>): Array<Int8Array>;
/**
 * assembly/contracts/main/_ms_testArrayOfUint16Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Uint16Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Uint16Array>`
 */
export declare function _ms_testArrayOfUint16Array_(arg1: Array<Uint16Array>): Array<Uint16Array>;
/**
 * assembly/contracts/main/_ms_testSquareArrayOfUint16Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Uint16Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Uint16Array>`
 */
export declare function _ms_testSquareArrayOfUint16Array_(arg1: Array<Uint16Array>): Array<Uint16Array>;
/**
 * assembly/contracts/main/_ms_testArrayOfInt16Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Int16Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Int16Array>`
 */
export declare function _ms_testArrayOfInt16Array_(arg1: Array<Int16Array>): Array<Int16Array>;
/**
 * assembly/contracts/main/_ms_testSquareArrayOfInt16Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Int16Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Int16Array>`
 */
export declare function _ms_testSquareArrayOfInt16Array_(arg1: Array<Int16Array>): Array<Int16Array>;
/**
 * assembly/contracts/main/_ms_testArrayOfUint32Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Uint32Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Uint32Array>`
 */
export declare function _ms_testArrayOfUint32Array_(arg1: Array<Uint32Array>): Array<Uint32Array>;
/**
 * assembly/contracts/main/_ms_testSquareArrayOfUint32Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Uint32Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Uint32Array>`
 */
export declare function _ms_testSquareArrayOfUint32Array_(arg1: Array<Uint32Array>): Array<Uint32Array>;
/**
 * assembly/contracts/main/_ms_testArrayOfInt32Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Int32Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Int32Array>`
 */
export declare function _ms_testArrayOfInt32Array_(arg1: Array<Int32Array>): Array<Int32Array>;
/**
 * assembly/contracts/main/_ms_testSquareArrayOfInt32Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Int32Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Int32Array>`
 */
export declare function _ms_testSquareArrayOfInt32Array_(arg1: Array<Int32Array>): Array<Int32Array>;
/**
 * assembly/contracts/main/_ms_testArrayOfUint64Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Uint64Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Uint64Array>`
 */
export declare function _ms_testArrayOfUint64Array_(arg1: Array<BigUint64Array>): Array<BigUint64Array>;
/**
 * assembly/contracts/main/_ms_testSquareArrayOfUint64Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Uint64Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Uint64Array>`
 */
export declare function _ms_testSquareArrayOfUint64Array_(arg1: Array<BigUint64Array>): Array<BigUint64Array>;
/**
 * assembly/contracts/main/_ms_testArrayOfInt64Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Int64Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Int64Array>`
 */
export declare function _ms_testArrayOfInt64Array_(arg1: Array<BigInt64Array>): Array<BigInt64Array>;
/**
 * assembly/contracts/main/_ms_testSquareArrayOfInt64Array_
 * @param arg1 `~lib/array/Array<~lib/typedarray/Int64Array>`
 * @returns `~lib/array/Array<~lib/typedarray/Int64Array>`
 */
export declare function _ms_testSquareArrayOfInt64Array_(arg1: Array<BigInt64Array>): Array<BigInt64Array>;
/**
 * assembly/contracts/main/test1
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function test1(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/test2
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function test2(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/test3
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function test3(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/test4
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 */
export declare function test4(_args: ArrayBuffer): void;
/**
 * assembly/contracts/main/test5
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 */
export declare function test5(_args: ArrayBuffer): void;
/**
 * assembly/contracts/main/test6
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function test6(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayI32Ret
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayI32Ret(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testBool
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testBool(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayBool
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayBool(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayI8
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayI8(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayU8
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayU8(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayI16
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayI16(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayU16
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayU16(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayI32
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayI32(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayU32
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayU32(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayI64
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayI64(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayU64
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayU64(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayString
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayString(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayCustomType
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayCustomType(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayU8
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayU8(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayU16
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayU16(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayU32
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayU32(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayString
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayString(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayU128
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayU128(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testUint8Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testUint8Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testInt8Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testInt8Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testUint16Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testUint16Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testInt16Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testInt16Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testUint32Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testUint32Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testInt32Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testInt32Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testUint64Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testUint64Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testInt64Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testInt64Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayOfUint8Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayOfUint8Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayOfUint8Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayOfUint8Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayOfInt8Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayOfInt8Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayOfInt8Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayOfInt8Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayOfUint16Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayOfUint16Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayOfUint16Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayOfUint16Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayOfInt16Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayOfInt16Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayOfInt16Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayOfInt16Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayOfUint32Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayOfUint32Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayOfUint32Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayOfUint32Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayOfInt32Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayOfInt32Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayOfInt32Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayOfInt32Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayOfUint64Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayOfUint64Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayOfUint64Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayOfUint64Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testArrayOfInt64Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testArrayOfInt64Array(_args: ArrayBuffer): ArrayBuffer;
/**
 * assembly/contracts/main/testSquareArrayOfInt64Array
 * @param _args `~lib/arraybuffer/ArrayBuffer`
 * @returns `~lib/arraybuffer/ArrayBuffer`
 */
export declare function testSquareArrayOfInt64Array(_args: ArrayBuffer): ArrayBuffer;
/** ~lib/as-bignum/assembly/integer/u128/u128 */
declare class __Internref24 extends Number {
  private __nominal24: symbol;
  private __nominal0: symbol;
}
/** ~lib/as-bignum/assembly/integer/u256/u256 */
declare class __Internref25 extends Number {
  private __nominal25: symbol;
  private __nominal0: symbol;
}
