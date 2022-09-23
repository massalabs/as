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
  const got = imported();
  const want = 41;
  if (got != want) {
    error('imported() = ' + got.toString() + ', ' + want.toString() + ' was expected.');
    return;
  }
});
