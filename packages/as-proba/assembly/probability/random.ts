/**
 * Returns a random number between given limits.
 *
 * Lower and upper limits are possible values.
 *
 * @param ll - included lower limit.
 * @param ul - included upper limit.
 */
export function randomInt(ll: u64, ul: u64): u64 {
  return ll + u64(Math.round(f64(ul - ll) * Math.random()));
}
