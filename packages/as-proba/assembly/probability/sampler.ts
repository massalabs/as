import { randomInt } from './random';

/**
 * This module exports a class named Sampler that allows the generation of observations based on a
 * probability distribution.
 *
 * @remarks
 * - This class shall be extended with your own probability.
 * - Two methods are available to generate observations: {@link rejectionSampling} and
 * {@link inverseCumulativeDistributionSampling}.
 *    These methods use different techniques to generate observations and require the implementation
 *    of a probability function.
 */
export class Sampler {
  _bounderies: Float64Array;

  /**
   * Creates an instance of the Sampler class.
   *
   * @remarks
   * - The constructor uses an optional seed for the Math.random() function.
   * - The _bounderies field is initialized with an empty Float64Array.
   *
   * @param s - seed for random Math.random function. Default value is 0.
   *
   */
  constructor(s: u64 = 0) {
    Math.seedRandom(s);
    this._bounderies = new Float64Array(0);
  }

  /**
   * Returns the probability of the given sample.
   *
   *
   * @remarks
   * - This method should be overridden in the child class to match the desired probability distribution.
   * - The probability function doesn't need to be normalized, but the greatest probability of the
   *   distribution must be known.
   *
   * @param _ - sample.
   * @returns the probability of the given sample. 1 if you don't override this method.
   *
   */
  probability(_: u64): f64 {
    return 1;
  }

  /**
   * Generates an observation using the rejection sampling method.
   *
   * This method uses a uniform random function to generate:
   *  - the number k, the potential observation
   *  - the number x, an aleatory number between 0 and the greatest probability of the distribution
   *
   *  If the number x is lower or equal to the probability of event k,
   *  then it's an observation.
   *
   *  Otherwise, the process is restarted (k and x are generated).
   *
   *  This process can be describe using the following schema with:
   *   - observations in abscissa (from 0 to 4)
   *   - probability for each observation in ordinate (observation 2 having
   *   the greatest probability p_max)
   *
   *  p_max ────┬─┬────
   *            │ │ ┌─┐
   *          ┌─┤ │ │ │
   *        ┌─┤ │ ├─┤ │
   *        └─┴─┴─┴─┴─┘
   *         0 1 2 3 4
   *
   *  Rejection sampling method for this example do the following:
   *
   *  1- randomly find the potential observation k by using an uniform random
   *     function with lower limit 0 and upper limit 4.
   *     Lets say k = 0.
   *  2- draw a number x, from an uniform random function with lower limit 0
   *     and upper limit p_max.
   *     Lets say x \> p_0. In that case we restart the process from
   *     the beginning.
   *  3- randomly find k.
   *     Lets say k = 2.
   *  4- randomly find x.
   *     Lets say x \< p_2. In that case the process stop and
   *     the observation is returned.
   *
   *  Graphically, the following process can be represented as the following:
   *
   *   p_max ────┬─┬────
   *            │o│ ┌─┐
   *         x┌─┤ │ │ │
   *        ┌─┤ │ ├─┤ │
   *        └─┴─┴─┴─┴─┘
   *         0 1 2 3 4
   *
   *  Where x represents the failed attempt and o the success one.
   *
   *  Intuitively we "see" the returned observations will match
   *  the underlying probabilities because observations with
   *  greater probability will have a higher chance of being returned
   *  than observation with lower one.
   *
   * @param n - sampling upper limit
   * @param max - greatest probability of the distribution
   * @returns an observation
   *
   */
  rejectionSampling(n: u64, max: f32): u64 {
    while (true) {
      const k = randomInt(0, n - 1);
      const x = Math.random() * max;
      if (x <= this.probability(k)) {
        return k;
      }
    }
  }

  /**
   * This method populates observation zone bounderies.
   *
   * @remarks
   * - This method is used by the {@link inverseCumulativeDistributionSampling} method.
   *
   * @param n - Sampling upper limit
   */
  private populateBounderies(n: u64): void {
    this._bounderies = new Float64Array(i32(n));

    this._bounderies[0];
    this.probability(0);

    for (let i = 1; i < i32(n); i++) {
      this._bounderies[i] = this._bounderies[i - 1] + this.probability(i);
    }
  }

  /**
   * Generates an observation using the inverse cumulative distribution method.
   *
   * This method uses:
   * - the cumulative distribution function to breakdown its from/input set
   *   into observations zone
   * - a uniform random function to generate a number x, that will be used
   *   to identify which observation zone is chosen.
   *
   * The process is the following:
   *
   * 1- The cumulative distribution function is used to define bounderies
   *    of observation zone.
   * 2- An number x is drawn using a uniform distribution function
   * 3- The zone in which the number x falls is the observation
   *
   *  This process can be describe using the following schema with:
   *   - observations in ordinate (from 0 to 4)
   *   - probability for each observation in abscissa
   *
   *  0 ─
   *  1 ──
   *  2 ────
   *  3 ─
   *  4 ───
   *
   * Probabilities are cumulated:
   *
   *  0 ─
   *  1  ──
   *  2    ────
   *  3        ─
   *  4         ───
   *
   * Cumulated probabilities are projected on the same dimension:
   *
   *    ├┼─┼───┼┼──┤
   *    0 1  2 3 4
   *
   * x is drawn and the corresponding observation zone is identified
   * using bounderies:
   *
   *    ├┼x┼───┼┼──┤
   *    0 1  2 3 4
   *
   * @param n - Sampling upper limit.
   * @returns Observation
   */
  inverseCumulativeDistribution(n: u64): u64 {
    if (this._bounderies.length == 0) {
      this.populateBounderies(n);
    }

    const x = Math.random() * this._bounderies[i32(n - 1)];

    for (let i = 0; i < i32(n); i++) {
      if (x <= this._bounderies[i]) {
        return u64(i);
      }
    }
    return 0;
  }
}
