/* eslint-disable max-len */
import { Transform } from "assemblyscript/transform";

/**
 * Generates if expression.
 *
 * Known criteria are :
 * - is, isNot,
 * - isTrue, isFalse,
 *
 * If the criterion is not in the list,
 * the raw string value is taken.
 *
 * @param {string} criterion
 * @return {string}
 */
function generateIfExpression(criterion) {
  switch (criterion) {
    case ('is'):
      return {'ifExpr': 'got != want', 'hasWant': true};
    case ('isNot'):
      return {'ifExpr': 'got == want', 'hasWant': true};
    case ('isFalse'):
      return {'ifExpr': 'got', 'hasWant': false};
    case ('isTrue'):
      return {'ifExpr': '!got', 'hasWant': false};
    default:
      return {'ifExpr': criterion, 'hasWant': criterion.search('want') > -1};
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
 * @param {string} expect - expect expression
 * @param {string} ifExpression
 * @param {string} needWant - include want in test ?
 * @param {bool} continueOnFailure - should the test failure stop the test set
 * @return {Object}
 */
function generateTest(name, got, expect, ifExpression, needWant, continueOnFailure) {
  if (needWant) {
    return `
test('${name}', ():i32 => {
  const got = ${got};
  const want = ${expect};

  if (${ifExpression}) {
    error('${got} = ' + got.toString() + ', ' + want.toString() + ' was expected.');
    return ${continueOnFailure ? 'TestResult.Failure' : 'TestResult.StopTestSet'};
  }

  return TestResult.Success;
});\n`;
  }

  return `
test('${name}', ():i32 => {
  const got = ${got};

  if (${ifExpression}) {
    error('${got} was ' + got.toString() + '.');
    return ${continueOnFailure ? 'TestResult.Failure' : 'TestResult.StopTestSet'};
  }

  return TestResult.Success;
});\n`;
}

/**
 * Hydrates the template by replacing the tokens (arg[0-9]+) with actual values.
 *
 * @param {string} template - template
 * @param {Array} value - array of values to populate template with
 * @param {number} iValue - current index of values
 * @return {Object}
 */
function hydrateTemplate(template, value, iValue) {
  let instanciation = template;

  while (instanciation.search(/arg[0-9]/) > -1) {
    instanciation = instanciation.replace(/arg[0-9]+/, value[iValue]);
    iValue++;
  }

  return {
    'instanciation': instanciation,
    'iValue': iValue,
  };
}

/**
 * Checks replacer.
 *
 * Replace checksThatThe and checksForEachLineThatThe function calls with
 * assemblyscript code that use unittest functions.
 */
class CheckReplacer extends Transform {
  /**
     * Filters all standard (library) files.
     *
     * @param {Source} src
     * @return {bool}
     */
  isToTransform(src) {
    return !src.isLibrary && !src.internalPath.startsWith(`~lib/`);
  }

  /**
   * Replaces all checks functions.
   *
   * XXX: this function is clearly too big. Feel free to split it.
   *
   * @param {Node} node
   * @return {Node}
   */
  visitCallExpression(node) {
    if (node.expression.text == 'checksThatThe') {
      // Push all the arguments of the checksThatThe function call to args array.
      // The function signature is the following:
      // checksThatThe(<test name>, <value to compute>, <comparison criterion>, <expected value>)
      // <expected value> field is optional
      const args = [];
      node.args.forEach((element) => {
        const content = element.range.source.text.slice(element.range.start, element.range.end);
        args.push(content);
      });

      const testName = args[0];
      const got = args[1];
      const comparisonCriterion = args[2];
      const expected = args.length == 4 ? args[3] : '';

      const {ifExpr, hasWant: needWant} = generateIfExpression(comparisonCriterion);

      const test = generateTest(
        testName.replace(/['`]/g, ''),
        got.replace(/['`]/g, ''), expected.replace(/['`]/g, ''),
        ifExpr, needWant,
        'onFailure.Continue');

      // magic function define at parent level that will:
      // - remove the code used here from the initial file content
      // - create a new file with the generated tests
      this.addUpdate({
        begin: node.range.start,
        end: node.range.end + 2, // +2 to include the trailing semicolon and new line (;\n)
        content: test,
      });
    } else if (node.expression.text == 'checksForEachLineThatThe') {
      // Push all the arguments of the checksForEachLineThatThe function call to args array.
      // The function signature is the following:
      // checksForEachLineThatThe(<test set name>, <template of value to compute>, <comparison criterion>, <template of expected result>, <test failure strategy>, [<test values>...])
      // <template of expected result>> field is optional
      const args = [];
      node.args.forEach((element) => {
        const content = element.range.source.text.slice(element.range.start, element.range.end);
        args.push(content);
      });

      const testSetName = args[0];
      const gotTemplate = args[1];
      const comparisonCriterion = args[2];
      let expectedTemplate = args.length == 6 ? args[3] : '';
      const onFailure = args[args.length - 2];

      // extracts all test values and converts potential breaking single quotes to double ones.
      const rawValues = node.args[args.length - 1].elementExpressions;
      const values = rawValues.map((e) => e.range.source.text.slice(e.range.start, e.range.end).replace(/'/g, '"'));

      let expr = `describe(${testSetName}, ():i32 => {\n`;

      const {ifExpr, hasWant: needWant} = generateIfExpression(comparisonCriterion);

      if (needWant && expectedTemplate == '') {
        expectedTemplate = 'arg0';
      }

      let gotExpr;
      let expectExpr;

      // two concepts here:
      // - testCounter keeps track of the number of tests
      // - iValue is the index of the values array
      // One test can involve one or multiple values.
      // Here we loop until all test values are used.
      let testCounter = 0;
      for (let iValue = 0; iValue < values.length; testCounter++) {
        // Destructuring assignment unpacks returned object values into distinct values.
        ({instanciation: gotExpr, iValue} = hydrateTemplate(gotTemplate, values, iValue));
        ({instanciation: expectExpr, iValue} = hydrateTemplate(expectedTemplate, values, iValue));

        const test = generateTest(
          testCounter.toString(), // use test counter as test name
          gotExpr.replace(/['`]/g, ''), expectExpr.replace(/['`]/g, ''),
          ifExpr, needWant,
          onFailure == 'onFailure.Continue');

        expr += test.replace(/\n/g, '\n  '); // adds static indentation
      }

      expr += `\n  return TestResult.Success;\n});\n`;

      // magic function define at parent level that will:
      // - remove the code used here from the initial file content
      // - create a new file with the generated tests
      this.addUpdate({
        begin: node.range.start,
        end: node.range.end + 2, // +2 to include the trailing semicolon and new line (;\n)
        content: expr,
      });
    }

    return super.visitCallExpression(node);
  }
}

export default CheckReplacer;
