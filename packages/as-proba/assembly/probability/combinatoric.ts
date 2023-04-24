/**
 * This method calculates the number of unordered subsets of k elements taken from a set of n elements, 
 * also known as 'n choose k'. 
 * 
 * @remarks
 * - The method uses the formula C(n,k) = n!/(k!(n-k)!) to calculate the number of combinations.
 * - Requires n > k >= 0 to work properly. Otherwise, if k >= n, the method returns the value of n!/k! 
 * 
 * @param n - Number of elements in set.
 * @param k - Number of elements in subset.

 * @return 
 * - If n > k >= 0 : the number of unordered subsets of k elements taken from a set of n elements.
 * - If k >= n : the value of n!/k!
 * 
 */
export function combination(n: u64, k: u64): f64 {
  return partialPermutation(n, k) / factorial(k);
}

/**
 * This method calculates the number of ordered subsets of k elements taken from a set of n elements.
 *
 * @remarks
 * - The method uses the formula P(n,k) = n!/(n-k)! to calculate the number of permutations.
 * - Requires n > k >= 0 to work properly. If k > n, the method returns the value of n!.
 * 
 * @param n - Number of elements in set.
 * @param k - Number of elements in subset.

 * @return 
 * - The number of ordered subsets of k elements taken from a set of n elements.
 * - If k > n : the value of n!.
 * 
 */
export function partialPermutation(n: u64, k: u64): f64 {
  return factorial(n) / factorial(n - k);
}

/**
 * 
 * This method calculates the factorial of a non-negative integer n
 * ie the number of permutation of n elements.
 * 
 * @remarks
 * - The function uses a loop to multiply all the integers from 2 to n inclusive to obtain the factorial.
 * 
 * @param n - Number of elements.
 * @return The factorial of n.
 * 
 */
export function factorial(n: u64): f64 {
  let r: f64 = 1;
  const l = f64(n);

  for (let i: f64 = 2; i <= l; i++) {
    r *= i;
  }
  return r;
}
