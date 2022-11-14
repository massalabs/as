/* eslint-disable max-len */
@external("test", "imported")
  declare function imported(): i32;

test('A test', (): i32 => {
  assert(true, 'a test');
  return 1;
});

describe('a tests set', (): i32 => {
  test('first verification in the set', (): i32 => {
    assert(42 == 42, 'this test fails');
    return 1; // never called on failure
  });
  return 1;
});

describe('manual test', (): i32 => {
  test('avoiding assert', (): i32 => {
    const got = 1 + 2;
    const want = 3;
    if (got != want) {
      error('1 + 2 = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return -1; // will stop the execution of the following tests belonging to the same described set.
    }
    return 1;
  });

  test('executed only if previous test passed', (): i32 => {
    const got = 2 + 3;
    const want = 5;
    if (got != want) {
      error('2 + 3 = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return -1;
    }
    return 1;
  });
  return 1;
});

check('test using a template', imported, 42);


unitTestTable('Sum tests using test table format', onFailure.Continue, `arg0 + arg1`, compare.Equal, [
  1, 2, 3,
  3, 4, 7,
  4, 5, 9,
]);

unitTestTable('Greater than', onFailure.Continue, `arg0 > arg1`, compare.False, [
  0, 1,
  2, 3,
]);

unitTestTable(
  'Greater than',
  onFailure.Continue,
  `arg0 > arg1`,
  compare.False,
  [1, 2, 3, 4]
);
