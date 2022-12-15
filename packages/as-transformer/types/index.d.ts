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

declare const is: string;
declare const isNot: string;
declare const isTrue: string;
declare const isFalse: string;
