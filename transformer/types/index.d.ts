/// <reference types="assemblyscript/std/assembly/index" />

declare function fileToByteArray(filePath: string): StaticArray<u8>;

declare function checksForEachLineThatThe<T>(
  testSetName: string,
  templateOfValueToCompute: string,
  comparisonCriterion: string,
  templateOfExpectedResult: string,
  table: Array<T>,
): void;

declare function checksForEachLineThatThe<T>(
  testSetName: string,
  templateOfValueToCompute: string,
  comparisonCriterion: string,
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
