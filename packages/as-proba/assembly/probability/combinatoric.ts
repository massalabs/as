/**
 * Returns the number of unordered subsets of k elements
 * taken from a set of n elements.
 *
 * @param n - Number of elements in set.
 * @param k - Number of elements in subset.
 * @returns
 */
export function combination(n: u64, k: u64): f64 {
  return partialPermutation(n, k) / factorial(k);
}

/**
 * Returns the number of ordered subsets of k elements
 * taken from a set of n elements.
 *
 * @param n - Number of elements in set.
 * @param k - Number of elements in subset.
 * @returns
 */
export function partialPermutation(n: u64, k: u64): f64 {
  return factorial(n) / factorial(n - k);
}

/**
 * Returns the number of permutation of n elements.
 *
 * @param n - Number of elements.
 *
 * @returns
 */
export function factorial(n: u64): f64 {
  let r: f64 = 1;
  const l = f64(n);

  for (let i: f64 = 2; i <= l; i++) {
    r *= i;
  }
  return r;
}
