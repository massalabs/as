/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CallExpression,
  Expression,
} from 'assemblyscript/dist/assemblyscript.js';
import { SimpleParser } from 'visitor-as';
import { RangeTransform } from 'visitor-as/dist/transformRange.js';

/**
 * Replaces calls to verifyTableExpectations with AssemblyScript code that uses unittest functions.
 */
export class TestTable {
  static strPattern = 'verifyTableExpectations';

  /**
   * Transforms verifyTableExpectations function call and its arguments to proper AssemblyScript tests.
   *
   * @param {CallExpression} node - The CallExpression node.
   * @returns {Expression} The transformed node.
   */
  static transform(node: CallExpression): Expression {
    // Extract node arguments as text
    const args = node.args.map((arg: { range: { source: { text: string | any[]; }; start: any; end: any; }; }) => arg.range.source.text.slice(arg.range.start, arg.range.end));

    const testName = args[0];
    const expectationTemplate = args[1];
    const rawValues = node.args[args.length - 1].elementExpressions;
    const values = rawValues.map((e: { range: { source: { text: string; }; start: any; end: any; }; }) => e.range.source.text.slice(e.range.start, e.range.end).replace(/'/g, '"'));

    let expr = `describe(${testName}, () => {\n  `;

    let expectation;
    let testCounter = 0;
    for (let iValue = 0; iValue < values.length; testCounter++) {
      ({ instantiation: expectation, iValue } = TestTable.hydrateTemplate(expectationTemplate, values, iValue));
      const test = TestTable.generateTest(testCounter.toString(), expectation);
      expr += test.replace(/\n/g, '\n  ');
    }

    expr += `\n});`;

    console.log(expr);
    
    const newNode = SimpleParser.parseExpression(expr);
    
    // Use RangeTransform to keep the attributes of the original node and update its content only
    return RangeTransform.visit(newNode, node);
  }

  /**
   * Generates a test.
   *
   * @param {string} name - The test friendly name.
   * @param {string} expect - The expect expression.
   * @returns {string} The test.
   */
  static generateTest(name: string, expect: string): string {
    return `test('${name}', ${expect});\n`;
  }

  /**
   * Hydrates the template by replacing the tokens (row[0-9]+) with actual values.
   *
   * @param {string} template - The template.
   * @param {string[]} values - The array of values to populate the template with.
   * @param {number} iValue - The current index of values.
   * @returns {{instantiation: string, iValue: number}} The hydrated template and index of values.
   */
  static hydrateTemplate(template: string, values: string[], iValue: number): { instantiation: string, iValue: number } {
    let instantiation = template;
    while (instantiation.search(/row[0-9]/) > -1) {
      if(iValue >= values.length) {
        throw new Error("Inconsistent number of arguments");
      }

      // Replace all occurrences of the token with the current test value
      const match = instantiation.match(/(row[0-9]+)/i);

      if (match === null || match.length < 2) {
        throw new Error("search and match results are inconsistent");
      } else {
        const pattern :string = match[1]!;
        const replacement: string = values[iValue]!;
        instantiation = instantiation.replace(new RegExp(pattern), replacement);
        iValue++;
      }
    }

    return {
      instantiation,
      iValue,
    };
  }
}
