export {};

declare global {
  function error(message: string): void;
  function test(name: string, callback: () => void): void;
  function describe(name: string, callback: () => void): void;

  function check<T, U>(
    name: string,
    callback: (T) => V,
    arg1: T,
    expected: U
  ): void;
  function check<T>(name: string, callback: () => T, expected: T): void;
  function check<T>(name: string, callback: T): void;

  function unitTestTable<T>(
    name: string,
    onFailure: onFailure,
    pattern: string,
    compare: compare,
    table: Array<T>
  ): void;

  enum onFailure {
    Continue,
    Stop,
  }

  enum compare {
    Equal,
    Different,
    True,
    False,
  }

  @global enum TestResult {
    Panic,
    StopTestSet,
    Failure,
    Success,
  }

}
