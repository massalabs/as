/* eslint-disable max-len */
import {Replacer} from 'transformer/index.js';

/**
 * Generates if expression.
 *
 * @param {string} compare
 * @return {string}
 */
function generateIfExpression(compare) {
  switch (compare) {
    case ('compare.Equal'):
      return {'ifExpr': 'got != want', 'hasWant': true};
    case ('compare.Different'):
      return {'ifExpr': 'got == want', 'hasWant': true};
    case ('compare.False'):
      return {'ifExpr': 'got', 'hasWant': false};
    case ('compare.True'):
      return {'ifExpr': '!got', 'hasWant': false};
    default:
      return {'ifExpr': compare, 'hasWant': compare.search('want')>-1};
  }
}

/**
 * Generates a test.
 *
 * There is two test models:
 * - When the result value is a boolean:
 *   - in that case we don't need to:
 *     - calculate a wanted value,
 *     - add the expecting value in the error message.
 * - Otherwise we need a wanted value.
 *
 * @param {string} name - test friendly name
 * @param {string} got - got expression
 * @param {string} ifExpression
 * @param {string} needWant - include want in test ?
 * @param {bool} continueOnFailure - should the test failure stop the test suite
 * @param {Array} value - array of values to populate got template with
 * @param {number} iValue - current index of values
 * @return {Object}
 */
function generateTest(name, got, ifExpression, needWant, continueOnFailure, value, iValue) {
  let expr;
  if (needWant) {
    expr = `
    test('${name}', () => {
      const got = ${got};
      const want = ${value[iValue]};
      if (${ifExpression}) {
        error('${got} = ' + got.toString() + ', ' + want.toString() + ' was expected.');
        return ${continueOnFailure ? '0':'-1'};
      }
      return 1;
    });\n`;
    iValue++; // one value was used in template
  } else {
    expr = `
    test('${name}', () => {
      const got = ${got};
      if (${ifExpression}) {
        error('${got} was ' + got.toString() + '.');
        return ${continueOnFailure ? '0':'-1'};
      }
      return 1;
    });\n`;
  }

  return {
    'test': expr,
    'iValue': iValue,
  };
}

/**
 * Hydrates the got template by replacing the tokens (arg[0-9]+) with actual values.
 *
 * @param {string} template - got template
 * @param {Array} value - array of values to populate got template with
 * @param {number} iValue - current index of values
 * @return {Object}
 */
function hydrateGot(template, value, iValue) {
  let got = template;

  while (got.search(/arg[0-9]/) > -1) {
    got = got.replace(/arg[0-9]+/, value[iValue]);
    iValue++;
  }

  return {
    'got': got.slice(1, -1),
    'iValue': iValue,
  };
}

/**
 * Check replacer.
 */
class CheckReplacer extends Replacer {
  /**
     * Checks all unit tests files.
     * @param {Source} src
     * @return {bool}
     */
  isToTransform(src) {
    return !src.isLibrary && !src.internalPath.startsWith(`~lib/`);
  }

  /**
   * Replaces all check functions.
   *
   * XXX: this function is clearly too big. Feel free to split it.
   *
   * @param {Node} node
   * @return {Node}
   */
  visitCallExpression(node) {
    if (node.expression.text == 'check') {
      const args = [];
      node.args.forEach((element) => {
        const content = element.range.source.text.slice(element.range.start, element.range.end);
        args.push(content);
      });

      const testingArgs = [];

      for (let index = 1; index < args.length - 2; index++) {
        testingArgs.push(args[index]);
      }

      const expr = `
describe(${args[0]}, () => {
  const got = ${args[1]}(${testingArgs.join(',')});
  const want = ${args.slice(-1)};
  if (got != want) {
    error('${args[1]}(${testingArgs.join(',')}) = ' + got.toString() + ', ' + want.toString() + ' was expected.');
    return;
  }
});`;

      this.addUpdate({begin: node.range.start, end: node.range.end, content: expr});
    } else if (node.expression.text == 'unitTestTable') {
      // Push all the arguments of the unitTestTable to args array.
      // unitTestTable(<name>, <onFailure>, <gotTemplate>, <compare>, A, B, C, ...)
      // => args = [<name>, <onFailure>, <gotTemplate>, <compare>, A, B, C, ...]
      const args = [];
      node.args.forEach((element) => {
        const content = element.range.source.text.slice(element.range.start, element.range.end);
        args.push(content);
      });

      const name = args[0];
      const onFailure = args[1];
      const gotTemplate = args[2];
      const compare = args[3];

      // extract all test values and convert potential breaking single quotes to double ones.
      const rawValues = node.args[4].elementExpressions;
      const values = rawValues.map((e) => e.range.source.text.slice(e.range.start, e.range.end).replace(/'/g, '"'));

      let expr = `describe(${name}, () => {\n`;

      const {ifExpr, hasWant: needWant} = generateIfExpression(compare);

      let gotExpr;
      let testExpr;

      // two concepts here:
      // - testCounter keeps track of the number of tests
      // - iValue is the index of the values array
      // One test can involve one or multiple values.
      // Here we loop until all test values are used.
      let testCounter = 0;
      for (let iValue = 0; iValue < values.length; testCounter++) {
        // Destructuring assignment unpacks returned object values into distinct values.
        ({got: gotExpr, iValue} = hydrateGot(gotTemplate, values, iValue));

        ({test: testExpr, iValue} = generateTest(
            testCounter, // use test counter as test name
            gotExpr,
            ifExpr, needWant,
            onFailure == 'onFailure.Continue',
            values, iValue));

        expr+= testExpr;
      }

      expr += `});\n`;

      // magic function define at parent level that will:
      // - remove the code used here from the initial file content
      // - create a new file with the generated tests
      this.addUpdate({
        begin: node.range.start,
        end: node.range.end+2, // +1 to include the trailing semicolon and new line (;\n)
        content: expr,
      });
    }

    return super.visitCallExpression(node);
  }
}

export default CheckReplacer;
