import {Replacer} from 'transformer/index.js';
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
      console.log('inside');
      const args = [];
      node.args.forEach((element) => {
        const content = element.range.source.text.slice(element.range.start, element.range.end);
        args.push(content);
      });

      const testingArgs = [];

      for (let index = 1; index < args.length - 2; index++) {
        testingArgs.push(args[index]);
      }

      const expr =
                `describe(${args[0]}, () => {
      const got = ${args[1]}(${testingArgs.join(',')});
      const want = ${args.slice(-1)};
      if (got != want) {
        error('${args[1]}(${testingArgs.join(',')}) = ' + got.toString() + ', ' + want.toString() + ' was expected.');
        return;
      }
    });`;

      this.addUpdate({begin: node.range.start, end: node.range.end, content: expr});
    }

    return super.visitCallExpression(node);
  }
}

export default CheckReplacer;
