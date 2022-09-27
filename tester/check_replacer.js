import { Replacer } from 'transformer/index.js';
import { ASTBuilder } from 'assemblyscript';
// import {Node, Source} from 'types:assemblyscript/src/ast';

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

      this.addUpdate({ begin: node.range.start, end: node.range.end, content: expr });

    } else if (node.expression.text == 'checkTable') {
      const args = [];
      node.args.forEach((element) => {
        const content = element.range.source.text.slice(element.range.start, element.range.end);
        args.push(content);
      });

      const name = args[0];
      const onFailure = args[1];
      const gotTemplate = args[2];
      const values = node.args[3].elementExpressions;

      let expr = `describe(${name}, () => {\n`;
      let counter = 0;
      let returnValue = onFailure == onFailure.Continue ? "0" : "-1";

      for (let index = 0; index < values.length; index++) {
        let gotExpr = gotTemplate;
        while (gotExpr.search(/arg[0-9]/) > -1) {
          gotExpr = gotExpr.replace(/arg[0-9]+/, ASTBuilder.build(values[index]));
          index++;
        }

        gotExpr = gotExpr.slice(1, -1)

        expr += `
  test('${counter}', () => {
    const got = ${gotExpr};
    const want = ${ASTBuilder.build(values[index])};
    if (got != want) {
      error('${gotExpr} = ' + got.toString() + ', ' + want.toString() + ' was expected.');
      return ${returnValue};
    }
    return 1;
  });\n`;

        counter++;
      }

      expr += `});\n`;

      this.addUpdate({ begin: node.range.start, end: node.range.end, content: expr });
    }

    return super.visitCallExpression(node);
  }
}

export default CheckReplacer;
