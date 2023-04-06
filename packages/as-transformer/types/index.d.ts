/// <reference types="assemblyscript/std/assembly/index" />

declare function fileToByteArray(filePath: string): StaticArray<u8>;

declare function verifyTableExpectations<T>(
  testName: string,
  expectation: () => void,
  table: Array<T>,
): void;

/* eslint-disable  @typescript-eslint/no-explicit-any */
declare const row0: any;
declare const row1: any;
declare const row2: any;
declare const row3: any;
declare const row4: any;
declare const row5: any;
declare const row6: any;
declare const row7: any;
declare const row8: any;
declare const row9: any;
