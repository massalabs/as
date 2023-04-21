/**
 * Returns an unsafe random integer between the given limits (inclusive).
 *
 * @remarks
 * - Lower and upper limits are possible values.
 * - This function is not cryptographically secure.
 *
 * @param ll - included lower limit.
 * @param ul - included upper limit.
 * @returns an unsafe random integer between given limits.
 *
 */
export function randomInt(ll: u64, ul: u64): u64 {
  return ll + u64(Math.round(f64(ul - ll) * Math.random()));
}
