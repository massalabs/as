/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
export {};

declare global {
  function error(message: string): void;
  function test(name: string, callback: () => i32): void;
  function describe(name: string, callback: () => i32): void;

  function checksThatThe<T>(
    testName: string,
    valueToCompute: T,
    comparisonCriterion: string,
  ): void;
  function checksThatThe<T, U>(
    testName: string,
    valueToCompute: T,
    comparisonCriterion: string,
    expectedValue: U,
  ): void;

  function checksForEachLineThatThe<T>(
    testSetName: string,
    templateOfValueToCompute: string,
    comparisonCriterion: string,
    templateOfExpectedResult: string,
    onFailure: onFailure,
    table: Array<T>,
  ): void;
  function checksForEachLineThatThe<T>(
    testSetName: string,
    templateOfValueToCompute: string,
    comparisonCriterion: string,
    onFailure: onFailure,
    table: Array<T>,
  ): void;

  enum onFailure {
    Continue,
    ExitSet,
  }

  const is = '';
  const isNot = '';
  const isTrue = '';
  const isFalse = '';

  enum TestResult {
    Panic,
    StopTestSet,
    Failure,
    Success,
  }
}
