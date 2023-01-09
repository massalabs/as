/**
 * Converts a u8 in a StaticArray<u8>.
 *
 * @param {u8} val the number to convert
 *
 * @return {StaticArray<u8>} the converted StaticArray<u8>
 */
export function u8toByte(val: u8): StaticArray<u8> {
  const arr = new StaticArray<u8>(1);
  arr[0] = val;
  return arr;
}

/**
 * Converts a u32 in a StaticArray<u8>.
 *
 * @param {u32} val the number to convert
 *
 * @return {StaticArray<u8>} the converted StaticArray<u8>
 */
export function u32ToBytes(val: u32): StaticArray<u8> {
  const arr = new StaticArray<u8>(4);
  for (let i = 0; i < 4; i++) {
    arr[i] = u8(val >> (i * 8));
  }
  return arr;
}

/**
 * Converts a byte array into a u32.
 *
 * @param {Uint8Array} arr
 * @return {u32}
 */
export function bytesToU32(arr: StaticArray<u8>): u32 {
  let x: u32 = 0;
  for (let i = 3; i >= 1; --i) {
    x = (x | arr[i]) << 8;
  }
  x = x | arr[0];
  return x;
}

/**
 * Converts a f32 in a StaticArray<u8>.
 *
 * @param {f32} val the number to convert
 *
 * @return {StaticArray<u8>} the converted StaticArray<u8>
 */
export function f32ToBytes(val: f32): StaticArray<u8> {
  return u32ToBytes(bswap<u32>(reinterpret<u32>(val)));
}

/**
 * Converts a byte array into a f32.
 *
 * @param {Uint8Array} arr
 * @return {u32}
 */
export function bytesToF32(arr: StaticArray<u8>): f32 {
  return reinterpret<f32>(bswap<u32>(bytesToU32(arr)));
}

/**
 * Converts a i32 in a StaticArray<u8>.
 *
 * @param {i32} val the number to convert
 *
 * @return {StaticArray<u8>} the converted StaticArray<u8>
 */
export function i32ToBytes(val: i32): StaticArray<u8> {
  return u32ToBytes(val as u32);
}

/**
 * Converts a byte array into a i32.
 *
 * @param {Uint8Array} arr
 * @return {i32}
 */
export function bytesToI32(arr: StaticArray<u8>): i32 {
  return changetype<i32>(bytesToU32(arr));
}

/**
 * Converts a u64 in a StaticArray<u8>.
 *
 * @param {u64} val the number to convert
 *
 * @return {StaticArray<u8>} the converted StaticArray<u8>
 */
export function u64ToBytes(val: u64): StaticArray<u8> {
  const arr = new StaticArray<u8>(8);
  for (let i = 0; i < 8; i++) {
    arr[i] = u8(val >> (i * 8));
  }
  return arr;
}

/**
 * Converts a byte array into a u64.
 *
 * @param {Uint8Array} arr
 * @return {u64}
 */
export function bytesToU64(arr: StaticArray<u8>): u64 {
  let x: u64 = 0;
  for (let i = 7; i >= 1; --i) {
    x = (x | arr[i]) << 8;
  }
  x = x | arr[0];
  return x;
}

/**
 * Converts a i64 in a StaticArray<u8>.
 *
 * @param {i64} val the number to convert
 *
 * @return {StaticArray<u8>} the converted StaticArray<u8>
 */
export function i64ToBytes(val: i64): StaticArray<u8> {
  return u64ToBytes(val as u64);
}

/**
 * Converts a byte array into a i64.
 *
 * @param {Uint8Array} arr
 * @return {i64}
 */
export function bytesToI64(arr: StaticArray<u8>): i64 {
  return changetype<i64>(bytesToU64(arr));
}

/**
 * Converts a f64 in a StaticArray<u8>.
 *
 * @param {f64} val the number to convert
 *
 * @return {StaticArray<u8>} the converted StaticArray<u8>
 */
export function f64ToBytes(val: f64): StaticArray<u8> {
  return u64ToBytes(bswap<u64>(reinterpret<u64>(val)));
}

/**
 * Converts a byte array into a f32.
 *
 * @param {Uint8Array} arr
 * @return {f64}
 */
export function bytesToF64(arr: StaticArray<u8>): f64 {
  return reinterpret<f64>(bswap<u64>(bytesToU64(arr)));
}
