# Installation
yarn add 'https://gitpkg.now.sh/massalabs/as/tester?main'

To avoid linter warning, you should add a file named `tester.d.ts` under the directory `assembly/__tests__` containing:

```typescript
/// <reference types="tester/assembly/global" />
```

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

// or the same thing, without the test wrapper, using check. But needs to use a specific transformer.
check('imports', import, 41);
```

## Running tester
### All test files
yarn astester
### Only given one
yarn astester assembly/__tests__/example.spec.ts
### Using transformer
yarn astester --transform tester/check_replacer.js
