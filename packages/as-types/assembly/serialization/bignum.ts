import { i128, u128, u256 } from 'as-bignum/assembly';
import { wrapStaticArray } from './staticArrays';

/**
 * Converts a StaticArray<u8> into a u128.
 *
 * @param arr - the array to convert
 *
 * @returns the converted u128
 */
export function bytesToU128(arr: StaticArray<u8>): u128 {
  return u128.fromUint8ArrayLE(wrapStaticArray(arr));
}

/**
 * Converts a StaticArray<u8> into a i128.
 *
 * @param arr - the array to convert
 *
 * @returns the converted i128
 */
export function bytesToI128(arr: StaticArray<u8>): i128 {
  return i128.fromUint8ArrayLE(wrapStaticArray(arr));
}

/**
 * Converts a u128 in a StaticArray<u8>.
 *
 * @param val - the integer to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function u128ToBytes(val: u128): StaticArray<u8> {
  return val.toStaticBytes();
}

/**
 * Converts a i128 in a StaticArray<u8>.
 *
 * @param val - the integer to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function i128ToBytes(val: i128): StaticArray<u8> {
  return val.toStaticBytes();
}

/**
 * Converts a StaticArray<u8> into a u256.
 *
 * @param arr - the array to convert
 *
 * @returns the converted u256
 */
export function bytesToU256(arr: StaticArray<u8>): u256 {
  return u256.fromUint8ArrayLE(wrapStaticArray(arr));
}

/**
 * Converts a u256 in a StaticArray<u8>.
 *
 * @param val - the integer to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function u256ToBytes(val: u256): StaticArray<u8> {
  return val.toStaticBytes();
}
