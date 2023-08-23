/**
 * This module aim's to provide number variable types serialization and conversion helper functions.
 *
 * @remarks
 * This module is part of the {@link serialization} module.
 *
 * Some of the functions are generic templated functions, therefore you must use them with care
 * because they accept only specific type params. Otherwise the compiler will throw an error.
 *
 */

/**
 * Converts a u8 in a StaticArray<u8>.
 *
 * @remarks
 * This function creates a new StaticArray<u8> of size 1, and sets the first element to the passed u8 value.
 *
 * @param val - the number to convert
 *
 * @returns the converted StaticArray<u8>
 */
// @ts-ignore: decorator
@inline
export function u8toByte(val: u8): StaticArray<u8> {
  const arr = new StaticArray<u8>(1);
  arr[0] = val;
  return arr;
}

/**
 * Converts a StaticArray<u8> into a u8.
 *
 * @remarks
 * This is done by returning the value at index 0 of the passed StaticArray<u8>.
 *
 * @param arr - the array to convert
 *
 * @returns the converted u8
 */
// @ts-ignore: decorator
@inline
export function byteToU8(arr: StaticArray<u8>): u8 {
  return arr[0];
}

/**
 * Converts an integer number to StaticArray<u8>
 *
 * @remarks
 * Won't compile if the type param is not an integer.
 * @see {@link isInteger}
 *
 * @typeParam T - the type of the number to convert (it must be an integer type, such as i32, u32, i64, or u64)
 *
 * @param val - the number to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function toBytes<T>(val: T): StaticArray<u8> {
  if (!isInteger<T>()) {
    ERROR('input must be a integer');
  }
  const arr = new StaticArray<u8>(sizeof<T>());
  store<T>(changetype<usize>(arr), val);
  return arr;
}

/**
 * Converts a StaticArray<u8> to number
 *
 * @remarks
 * Won't compile if the type param is not an integer.
 * @see {@link isInteger}
 *
 *  * @typeParam T - the type of the number result (it must be an integer type, such as i32, u32, i64, or u64)
 *
 * @param arr - the array to convert
 *
 * @returns the converted number
 */
export function fromBytes<T>(arr: StaticArray<u8>): T {
  if (!isInteger<T>()) {
    ERROR('output must be a integer');
  }
  return load<T>(changetype<usize>(arr), 0);
}

/**
 * Converts a u16 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function u16ToBytes(val: u16): StaticArray<u8> {
  return toBytes(val);
}

/**
 * Converts a StaticArray<u8> into a u16.
 *
 * @param arr - the array to convert
 *
 * @returns the converted u16
 */
export function bytesToU16(arr: StaticArray<u8>): u16 {
  return fromBytes<u16>(arr);
}

/**
 * Converts a u32 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function u32ToBytes(val: u32): StaticArray<u8> {
  return toBytes(val);
}

/**
 * Converts a StaticArray<u8> into a u32.
 *
 * @param arr - the array to convert
 *
 * @returns the converted u32
 */
export function bytesToU32(arr: StaticArray<u8>): u32 {
  return fromBytes<u32>(arr);
}

/**
 * Converts a f32 in a StaticArray<u8>.
 *
 * @param val - the decimal number to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function f32ToBytes(val: f32): StaticArray<u8> {
  return u32ToBytes(reinterpret<u32>(val));
}

/**
 * Converts a StaticArray<u8> into a f32.
 *
 * @param arr - the array to convert
 *
 * @returns the converted f32
 */
export function bytesToF32(arr: StaticArray<u8>): f32 {
  return reinterpret<f32>(bytesToU32(arr));
}

/**
 * Converts a i16 in a StaticArray<u8>.
 *
 * @param val - the integer to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function i16ToBytes(val: i16): StaticArray<u8> {
  return u16ToBytes(val as u16);
}

/**
 * Converts a StaticArray<u8> into a i16.
 *
 * @param arr - the array to convert
 *
 * @returns the converted i16
 */
export function bytesToI16(arr: StaticArray<u8>): i16 {
  return bytesToU16(arr) as i16;
}

/**
 * Converts a i32 in a StaticArray<u8>.
 *
 * @param val - the integer to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function i32ToBytes(val: i32): StaticArray<u8> {
  return u32ToBytes(val as u32);
}

/**
 * Converts a StaticArray<u8> into a i32.
 *
 * @param arr - the array to convert
 *
 * @returns the converted i32
 */
export function bytesToI32(arr: StaticArray<u8>): i32 {
  return changetype<i32>(bytesToU32(arr));
}

/**
 * Converts a u64 in a StaticArray<u8>.
 *
 * @param val - the integer to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function u64ToBytes(val: u64): StaticArray<u8> {
  return toBytes(val);
}

/**
 * Converts a StaticArray<u8> into a u64.
 *
 * @param arr - the array to convert
 *
 * @returns the converted u64
 */
export function bytesToU64(arr: StaticArray<u8>): u64 {
  return fromBytes<u64>(arr);
}

/**
 * Converts a i64 in a StaticArray<u8>.
 *
 * @param val - the integer to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function i64ToBytes(val: i64): StaticArray<u8> {
  return u64ToBytes(val as u64);
}

/**
 * Converts a StaticArray<u8> into a i64.
 *
 * @param arr - the array to convert
 *
 * @returns the converted i64
 */
export function bytesToI64(arr: StaticArray<u8>): i64 {
  return changetype<i64>(bytesToU64(arr));
}

/**
 * Converts a f64 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 *
 * @returns the converted StaticArray<u8>
 */
export function f64ToBytes(val: f64): StaticArray<u8> {
  return u64ToBytes(reinterpret<u64>(val));
}

/**
 * Converts a StaticArray<u8> into a f64.
 *
 * @param arr - the array to convert
 *
 * @returns the converted f64
 */
export function bytesToF64(arr: StaticArray<u8>): f64 {
  return reinterpret<f64>(bytesToU64(arr));
}
