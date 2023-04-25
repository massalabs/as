import { combination } from './combinatoric';
import { Sampler } from './sampler';

export interface Drawer {
  draw(): u64;
}

/**
 * This class represents a binomial distribution.
 * It can be used to compute the probability of a given event
 * and generate random samples from the distribution.
 *
 */
export class Binomial extends Sampler implements Drawer {
  _n: u64; // Number of independent experiments.
  _p: f32; // Success probability of each experiment.
  _m: f32; // Maximal probability value returned by mass probability function.

  /**
   * Instantiates a binomial distribution.
   *
   * @param n - Number of independent experiments.
   * @param p - Probability of success of each experiment.
   */
  constructor(n: u64, p: f32) {
    super();
    this._n = n;
    this._p = p;
  }

  /**
   * Computes the probability of a given event `k`.
   *
   * @param k - An event.
   * @returns The probability of the event k in the binomial distribution.
   */
  probability(k: u64): f64 {
    return (
      combination(this._n, k) *
      Math.pow(this._p, f64(k)) *
      Math.pow(1 - this._p, f64(this._n - k))
    );
  }

  /**
   * Draws a number from the binomial distribution
   *
   * @remarks
   * Rejection sampling method is used to generates an observation
   *   from binomial distribution.
   *
   * @privateRemarks
   * The _m variable is used as the threshold for the rejection sampling method.
   *
   * @returns A random value sampled from the binomial distribution.
   *
   */
  draw(): u64 {
    if (this._m == 0) {
      if (this._n % 2 == 1) {
        this._m = f32(this.probability((this._n - 1) / 2));
      } else {
        this._m = f32(this.probability(this._n / 2));
      }
    }

    return this.rejectionSampling(this._n, this._m);
  }
}
