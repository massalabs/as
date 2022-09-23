# Installation
yarn add 'https://gitpkg.now.sh/massalabs/as/tester?7-adds-unit-test-tooling' -D

# Usage

## Creating tests

```typesscript
describe('imports', () => {
  test('a test avoiding assert', () => {
    const got = imported();
    const want = 41;
    if (got != want) {
      error('imported() = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return;
    }
  });
});
```

## Running tester
### All test files
yarn astester
### Only given one
yarn astester assembly/__tests__/example.spec.ts