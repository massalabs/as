import {
  CallExpression,
  Expression,
  ArrayLiteralExpression,
} from 'assemblyscript/dist/assemblyscript.js';
import {SimpleParser} from 'visitor-as';
import {RangeTransform} from 'visitor-as/dist/transformRange.js';

/**
 * Checks replacer.
 *
 * Replace checksThatThe and checksForEachLineThatThe function calls with
 * assemblyscript code that use unittest functions.
 */
export class TestTable {
  static strPattern = 'checksForEachLineThatThe';

  /**
   * Replaces all checks functions.
   *
   * XXX: this function is clearly too big. Feel free to split it.
   *
   * @param {Node} node
   * @return {Node}
   */
  static transform(node: CallExpression): Expression {
    // Push all the arguments of the checksForEachLineThatThe function call to args array.
    // The function signature is the following:
    // testTable(<test set name>, <template of value to compute>,
    // <comparison criterion>, <template of expected result>, <test failure strategy>, [<test values>...])
    // <template of expected result>> field is optional
    const args: string[] = [];
    node.args.forEach((element) => {
      const content = element.range.source.text.slice(
        element.range.start,
        element.range.end,
      );
      args.push(content);
    });

    const testSetName = args[0];
    const gotTemplate = args[1]!;
    const comparisonCriterion = args[2]!;
    let expectedTemplate = args.length == 5 ? args[3]! : '';

    // extracts all test values and converts potential breaking single quotes to double ones.
    const rawValues = (node.args[args.length - 1] as ArrayLiteralExpression)
      .elementExpressions;
    const values = rawValues.map((e) =>
      e.range.source.text.slice(e.range.start, e.range.end).replace(/'/g, '"'),
    );

    let expr = `describe(${testSetName}, () => {\n`;

    const {ifExpr, hasWant: needWant} =
      TestTable.generateIfExpression(comparisonCriterion);

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
      ({instanciation: gotExpr, iValue} = TestTable.hydrateTemplate(
        gotTemplate,
        values,
        iValue,
      ));
      ({instanciation: expectExpr, iValue} = TestTable.hydrateTemplate(
        expectedTemplate,
        values,
        iValue,
      ));

      const test = TestTable.generateTest(
        testCounter.toString(), // use test counter as test name
        gotExpr.replace(/['`]/g, ''),
        expectExpr.replace(/['`]/g, ''),
        ifExpr,
        needWant,
      );

      expr += test.replace(/\n/g, '\n  '); // adds static indentation
    }
    expr += `\n});`;

    const processedNode = SimpleParser.parseExpression(expr);
    return RangeTransform.visit(processedNode, node);
  }

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
  static generateIfExpression(criterion: string) {
    switch (criterion) {
      case 'is':
        return {ifExpr: 'got == want', hasWant: true};
      case 'isNot':
        return {ifExpr: 'got != want', hasWant: true};
      case 'isFalse':
        return {ifExpr: '!got', hasWant: false};
      case 'isTrue':
        return {ifExpr: 'got', hasWant: false};
      default:
        return {ifExpr: criterion, hasWant: criterion.includes('want')};
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
   * @param {bool} needWant - include want in test ?
   * @param {bool} continueOnFailure - should the test failure stop the test set
   * @return {Object}
   */
  static generateTest(
    name: string,
    got: string,
    expect: string,
    ifExpression: string,
    needWant: bool,
  ) {
    if (needWant) {
      return `
  test('${name}', () => {

  const got = ${got};
  const want = ${expect};

  expect(got).toBe(want, '${got} = ' + got.toString() + ', ' + want.toString() + ' was expected.')

  });\n`;
    }

    return `
test('${name}', () => {
  const got = ${got};

  expect(${ifExpression}).toBe(true, '${got} was ' + got.toString() + '.')

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
  static hydrateTemplate(template: string, value: any, iValue: number) {
    let instanciation = template;

    while (instanciation.search(/arg[0-9]/) > -1) {
      instanciation = instanciation.replace(/arg[0-9]+/, value[iValue]);
      iValue++;
    }

    return {
      instanciation,
      iValue,
    };
  }
}
