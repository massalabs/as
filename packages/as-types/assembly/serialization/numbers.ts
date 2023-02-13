/**
 * Converts a u8 in a StaticArray<u8>.
 *
 * @param val - the number to convert
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
 * @param arr - the array to convert
 */
// @ts-ignore: decorator
@inline
export function byteToU8(arr: StaticArray<u8>): u8 {
  return arr[0];
}

/**
 * Convert a number to StaticArray<u8>
 *
 *  @param val - the number to convert
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
 * Convert a StaticArray<u8> to number
 *
 *  @param arr - the array to convert
 */
export function fromBytes<T>(arr: StaticArray<u8>): T {
  if (!isInteger<T>()) {
    ERROR('output must be a integer');
  }
  return load<T>(changetype<usize>(arr), 0);
}

/**
 * Converts a u32 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 */
export function u32ToBytes(val: u32): StaticArray<u8> {
  return toBytes(val);
}

/**
 * Converts a StaticArray<u8> into a u32.
 *
 * @param arr - the array to convert
 */
export function bytesToU32(arr: StaticArray<u8>): u32 {
  return fromBytes<u32>(arr);
}

/**
 * Converts a f32 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 */
export function f32ToBytes(val: f32): StaticArray<u8> {
  return u32ToBytes(reinterpret<u32>(val));
}

/**
 * Converts a StaticArray<u8> into a f32.
 *
 * @param arr - the array to convert
 */
export function bytesToF32(arr: StaticArray<u8>): f32 {
  return reinterpret<f32>(bytesToU32(arr));
}

/**
 * Converts a i32 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 * @returns the converted StaticArray<u8>
 */
export function i32ToBytes(val: i32): StaticArray<u8> {
  return u32ToBytes(val as u32);
}

/**
 * Converts a StaticArray<u8> into a i32.
 *
 * @param arr - the array to convert
 */
export function bytesToI32(arr: StaticArray<u8>): i32 {
  return changetype<i32>(bytesToU32(arr));
}

/**
 * Converts a u64 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 * @returns the converted StaticArray<u8>
 */
export function u64ToBytes(val: u64): StaticArray<u8> {
  return toBytes(val);
}

/**
 * Converts a StaticArray<u8> into a u64.
 *
 * @param arr - the array to convert
 */
export function bytesToU64(arr: StaticArray<u8>): u64 {
  return fromBytes<u64>(arr);
}

/**
 * Converts a i64 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 */
export function i64ToBytes(val: i64): StaticArray<u8> {
  return u64ToBytes(val as u64);
}

/**
 * Converts a StaticArray<u8> into a i64.
 *
 * @param arr - the array to convert
 */
export function bytesToI64(arr: StaticArray<u8>): i64 {
  return changetype<i64>(bytesToU64(arr));
}

/**
 * Converts a f64 in a StaticArray<u8>.
 *
 * @param val - the number to convert
 */
export function f64ToBytes(val: f64): StaticArray<u8> {
  return u64ToBytes(reinterpret<u64>(val));
}

/**
 * Converts a StaticArray<u8> into a f64.
 *
 * @param arr - the array to convert
 */
export function bytesToF64(arr: StaticArray<u8>): f64 {
  return reinterpret<f64>(bytesToU64(arr));
}
