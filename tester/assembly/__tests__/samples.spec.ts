/* eslint-disable max-len */

test('A test', (): i32 => {
  assert(true, 'a test');
  return TestResult.Success;
});

describe('a tests set', (): i32 => {
  test('first verification in the set', (): i32 => {
    assert(42 == 42, 'this test fails');
    return TestResult.Success; // never called on failure
  });

  return TestResult.Success;
});

describe('manual test', (): i32 => {
  test('avoiding assert', (): i32 => {
    const got = 1 + 2;
    const want = 3;

    if (got != want) {
      error('1 + 2 = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return TestResult.StopTestSet; // will stop the execution of the following tests belonging to the same described set.
    }

    return TestResult.Success;
  });

  test('executed only if previous test passed', (): i32 => {
    const got = 2 + 3;
    const want = 5;

    if (got != want) {
      error('2 + 3 = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return TestResult.Failure;
    }

    return TestResult.Success;
  });

  return TestResult.Success;
});

checksThatThe('sum of two integers', 1 + 2, is, 3);
checksThatThe('`greater than` of two integers', 2 + 1 > 3, isFalse);
checksThatThe('`greater than or equals to` of two integers', 2 + 1 >= 3, isTrue);

checksForEachLineThatThe('sum of two integers', `arg0 + arg1`, is, `arg3`, onFailure.Continue, [
  1, 2, 3,
  3, 4, 7,
  4, 5, 9,
]);

checksForEachLineThatThe('`greater than` of two integers', `arg0 > arg1`, isFalse, onFailure.Continue, [
  0, 1,
  2, 3,
]);

@external("test", "imported")
  declare function imported(): i32;