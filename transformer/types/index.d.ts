/// <reference types="assemblyscript/std/assembly/index" />

declare function fileToByteArray(filePath: string): StaticArray<u8>;

declare function checksThatThe<T>(
  testName: string,
  valueToCompute: T,
  comparisonCriterion: string,
): void;

declare function checksThatThe<T, U>(
  testName: string,
  valueToCompute: T,
  comparisonCriterion: string,
  expectedValue: U,
): void;

declare function checksForEachLineThatThe<T>(
  testSetName: string,
  templateOfValueToCompute: string,
  comparisonCriterion: string,
  templateOfExpectedResult: string,
  onFailure: onFailure,
  table: Array<T>,
): void;

declare function checksForEachLineThatThe<T>(
  testSetName: string,
  templateOfValueToCompute: string,
  comparisonCriterion: string,
  onFailure: onFailure,
  table: Array<T>,
): void;

declare enum onFailure {
  Continue,
  ExitSet,
}

declare const is = '';
declare const isNot = '';
declare const isTrue = '';
declare const isFalse = '';

declare enum TestResult {
  Panic,
  StopTestSet,
  Failure,
  Success,
}
