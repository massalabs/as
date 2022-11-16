# as-tester
- [Installation](#installation)
- [Usage](#usage)
  * [Creating tests](#creating-tests)
    + [Manualy](#manualy)
    + [Using the check replacer transformer](#using-the-check-replacer-transformer)
      - [Unique test](#unique-test)
      - [Test table](#test-table)
  * [Running tester](#running-tester)
    + [All test files](#all-test-files)
    + [Only given one](#only-given-one)

## Installation

To install this module, run the following command at your project root directory :

```shell
npm install -D @massalabs/as-tester
```

To avoid linter warning, you should add a file named `tester.d.ts` under the directory `assembly/__tests__` containing:

```typescript
/// <reference types="tester/assembly/global" />
```

## Usage

### Creating tests

#### Manualy

```typescript
describe('manual test set', ():i32 => {
  test('avoid using panic assertion and with clean failure message', ():i32 => {
    const got = 1 + 2;
    const want = 4; // obviously a mistake

    if (got != want) {
      error('1 + 2 = ' + got.toString() + ', ' + want.toString() + ' was expected.'); // writes Error: 1 + 2 = 3, 4 was expected.
      return TestResult.StopTestSet; // stops the execution of any following tests belonging to the same set.
    }

    return TestResult.Success;
  });

  test('never called because of previous test failure strategy', ():i32 => {
    const got = 2 + 3;
    const want = 5; 

    if (got != want) {
      error('2 + 3 = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return TestResult.StopTestSet;
    }

    return TestResult.Success;
  });

  return TestResult.Success;
});

//output:
//  Set: manual test set
//    Test: avoid using panic assertion and with clean failure message
//      Error: 1 + 2 = 3, 4 was expected.

```
#### Using the check replacer transformer

NOTE: The transformer is automatically called.

##### Unique test
```typescript
checksThatThe('sum of two integers', 1 + 2, is, 4);

//output:
//  Test: sum of two integers
//      Error: 1 + 2 = 3, 4 was expected.
```

The transformer changes this function call to the following code:
```typescript
test('sum of two integers', ():i32 => {
  const got = 1 + 2;
  const want = 4;

  if (got != want) {
    error('1 + 2 = ' + got.toString() + ', ' + want.toString() + ' was expected.');
    return TestResult.Failure;
  }

  return TestResult.Success;
});
```

##### Test table

```typescript
//functionally similar to above except for the test names.
checksForEachLineThatThe('sum of two integers', `arg0 + arg1`, is, onFailure.StopTestSet, [
  1, 2, 4, // same obvious error 
  2, 3, 5,
]);

//output:
//  Set: sum of two integers
//    Test: 0
//      Error: 1 + 2 = 3, 4 was expected.
```

The transformer changes this function call to the following code:
```typescript
describe('sum of two integers', ():i32 => {

  test('0', ():i32 => {
    const got = 1 + 2;
    const want = 4;
  
    if (got != want) {
      error('1 + 2 = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return TestResult.StopTestSet;
    }
  
    return TestResult.Success;
  });
  
  test('1', ():i32 => {
    const got = 2 + 3;
    const want = 5;
  
    if (got != want) {
      error('2 + 3 = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return TestResult.StopTestSet;
    }
  
    return TestResult.Success;
  });
  
  return TestResult.Success;
});
```

### Running tester
#### All test files

Execute the following command to run all test files:
```shell
yarn astester
```

#### Only given one

Execute the following command to run `assembly/__tests__/example.spec.ts` file:
```shell
yarn astester assembly/__tests__/example.spec.ts
```