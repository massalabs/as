// The entry file of your WebAssembly module.
import { Context, generateEvent } from '@massalabs/massa-as-sdk';
import { Args, stringToBytes } from '@massalabs/as-types';

/**
 * This function is meant to be called only one time: when the contract is deployed.
 *
 * @param binaryArgs - Arguments serialized with Args
 */
export function constructor(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  // This line is important. It ensures that this function can't be called in the future.
  // If you remove this check, someone could call your constructor function and reset your smart contract.
  if (!Context.isDeployingContract()) {
    return [];
  }
  const argsDeser = new Args(binaryArgs);
  const name = argsDeser
    .nextString()
    .expect('Name argument is missing or invalid');
  generateEvent(`Constructor called with name ${name}`);
  return [];
}

/**
 * @param _ - not used
 * @returns the emitted event serialized in bytes
 */
export function event(_: StaticArray<u8>): StaticArray<u8> {
  const message = "I'm an event!";
  generateEvent(message);
  return stringToBytes(message);
}

import { u128, u256 } from 'as-bignum/assembly';

// @ts-ignore: decorator
@massaExport()
export function test1(arg: u128): u128 {
  return arg;
}

// @ts-ignore: decorator
@massaExport()
export function test2(arg: u256): u256 {
  return arg;
}

// @ts-ignore: decorator
@massaExport()
export function test3(arg: u128): u256 {
  return arg.toU256();
}

// @ts-ignore: decorator
@massaExport()
export function test4(arg1: i32, arg2: i32): void {
  if (arg1 == arg2) {
    return;
  }
}

// @ts-ignore: decorator
@massaExport()
export function test5(arg1: i32, arg2: i32): void {
  test4(arg1, arg2);
}

// @ts-ignore: decorator
@massaExport()
export function test6(str1: string, str2: string): string {
  return str1 + str2;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayI32Ret(arg1: i32, arg2: i32): Array<i32> {
  return [arg1, arg2];
}

// @ts-ignore: decorator
@massaExport()
export function testBool(arg1: bool): bool {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayBool(arg1: Array<bool>): Array<bool> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayI8(arg1: Array<i8>): Array<i8> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayU8(arg1: Array<u8>): Array<u8> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayI16(arg1: Array<i16>): Array<i16> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayU16(arg1: Array<u16>): Array<u16> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayI32(arg1: Array<i32>): Array<i32> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayU32(arg1: Array<u32>): Array<u32> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayI64(arg1: Array<i64>): Array<i64> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayU64(arg1: Array<u64>): Array<u64> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayString(arg1: Array<string>): Array<string> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayCustomType(arg1: Array<u128>): Array<u256> {
  return arg1.map<u256>((arg) => arg.toU256());
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayU8(arg1: u8[]): u8[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayU16(arg1: u16[]): u16[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayU32(arg1: u32[]): u32[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayString(arg1: string[]): string[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayU128(arg1: u128[]): u128[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testUint8Array(arg1: Uint8Array): Uint8Array {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testInt8Array(arg1: Int8Array): Int8Array {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testUint16Array(arg1: Uint16Array): Uint16Array {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testInt16Array(arg1: Int16Array): Int16Array {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testUint32Array(arg1: Uint32Array): Uint32Array {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testInt32Array(arg1: Int32Array): Int32Array {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testUint64Array(arg1: Uint64Array): Uint64Array {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testInt64Array(arg1: Int64Array): Int64Array {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayOfUint8Array(arg1: Array<Uint8Array>): Array<Uint8Array> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayOfUint8Array(arg1: Uint8Array[]): Uint8Array[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayOfInt8Array(arg1: Array<Int8Array>): Array<Int8Array> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayOfInt8Array(arg1: Int8Array[]): Int8Array[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayOfUint16Array(arg1: Array<Uint16Array>): Array<Uint16Array> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayOfUint16Array(arg1: Uint16Array[]): Uint16Array[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayOfInt16Array(arg1: Array<Int16Array>): Array<Int16Array> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayOfInt16Array(arg1: Int16Array[]): Int16Array[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayOfUint32Array(arg1: Array<Uint32Array>): Array<Uint32Array> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayOfUint32Array(arg1: Uint32Array[]): Uint32Array[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayOfInt32Array(arg1: Array<Int32Array>): Array<Int32Array> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayOfInt32Array(arg1: Int32Array[]): Int32Array[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayOfUint64Array(arg1: Array<Uint64Array>): Array<Uint64Array> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayOfUint64Array(arg1: Uint64Array[]): Uint64Array[] {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testArrayOfInt64Array(arg1: Array<Int64Array>): Array<Int64Array> {
  return arg1;
}

// @ts-ignore: decorator
@massaExport()
export function testSquareArrayOfInt64Array(arg1: Int64Array[]): Int64Array[] {
  return arg1;
}


// // @ts-ignore: decorator
// @massaExport()
// export function test9(arg1: Array<StaticArray<u8>>): i32 {
//   // export function test9(arg1: StaticArray<u8>[]): i32 {
//     return arg1.length;
// }

