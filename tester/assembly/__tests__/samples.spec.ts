/* eslint-disable max-len */
@external("test", "imported")
  declare function imported(): i32;

test('A test', () => {
  assert(true, 'a test');
});

describe('A block', () => {
  test('a test', () => {
    assert(42 == 42, 'this test fails');
  });
});

describe('imports', () => {
  test('a test avoiding assert', () => {
    const got = imported();
    const want = 42;
    if (got != want) {
      error('imported() = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return;
    }
  });
});

check('import works as expected.', imported, 42);

unitTestTable('Sum', onFailure.Continue, `arg0 + arg1`, compare.Equal, [
  1, 2, 3,
  3, 4, 7,
]);

unitTestTable('Greater than', onFailure.Continue, `arg0 > arg1`, compare.False, [
  1, 2,
  3, 4,
]);

