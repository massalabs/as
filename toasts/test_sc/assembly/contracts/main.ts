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
export function test7(arg1: i32, arg2: i32): Array<i32> {
  return [arg1, arg2];
}

// @ts-ignore: decorator
@massaExport()
export function test8(arg1: Array<i32>): i32 {
  return arg1.length;
}

// // @ts-ignore: decorator
// @massaExport()
// export function test9(arg1: Array<StaticArray<u8>>): i32 {
//   // export function test9(arg1: StaticArray<u8>[]): i32 {
//     return arg1.length;
// }

// // @massaExport()
// export interface TestInterface {
//   arg1: i32;
//   arg2: i64;
// }

// // @ts-ignore: decorator
// @massaExport()
// export function test8(arg1: i32, arg2: i64): TestInterface {
//   return { arg1, arg2 };
// }

// // @ts-ignore: decorator
// @massaExport()
// export function test9(_arg1: TestInterface): void {
//   return;
// }

// // @ts-ignore: decorator
// @massaExport()
// export function test10(arg1: TestInterface): TestInterface {
//   return arg1;
// }

// // @ts-ignore: decorator
// @massaExport()
// export function test11(arg1: TestInterface): Array<TestInterface> {
//   return [arg1, arg1];
// }