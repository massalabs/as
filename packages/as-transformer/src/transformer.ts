/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TransformVisitor, utils } from 'visitor-as/dist/index.js';

import {
  Expression,
  Parser,
  CallExpression,
  IdentifierExpression,
  Source,
} from 'assemblyscript/dist/assemblyscript.js';
import { File2ByteArray } from './transformers/file2ByteArray.js';
import { TestTable } from './transformers/testTable.js';

const callTransformers = [new File2ByteArray(), new TestTable()];

/**
 * The `Transformer` class extends the `TransformVisitor` class from visitor-as and overrides its methods to perform
 * custom transformations on the AST during the compilation process.
 * It looks for specific function calls or decorators and replaces them with new expressions
 * or functions as needed.
 */
export class Transformer extends TransformVisitor {
  /**
   * Visits a call expression node, checks if it matches any registered transformer patterns
   * from {@link callTransformers}, and if so, transforms it.
   *
   * @param node - A {@link CallExpression} to visit.
   *
   * @returns The transformed node if its call expression matches a transformer pattern, otherwise
   * the original node.
   */
  override visitCallExpression(node: CallExpression): Expression {
    const inputText = (node.expression as IdentifierExpression)?.text;

    for (let transformer of callTransformers) {
      if (transformer.isMatching(inputText)) {
        // Debug.log('Found call to transform: ' + inputText);
        return transformer.transform(node);
      }
    }

    return super.visitCallExpression(node);
  }

  /**
   * Performs transformations on the AST after the parser completes.
   * It visits each source file, checks for updates, performs transformations, and writes the transformed code
   * to a new file in the build directory.
   *
   * @privateRemarks
   * This is one of the three transformer hooks as defined
   * [here](https://www.assemblyscript.org/compiler.html#transforms). It is the first one,
   * called just after parsing the code.
   *
   * @param parser - A {@link Parser} object.
   */
  afterParse(parser: Parser): void {
    let sources = parser.sources.filter(
      // Fetching only project parsed sources (AST Tree for each file)
      (source) => {
        return (
          !source.internalPath.startsWith(`node_modules/`) &&
          !utils.isLibrary(source) &&
          !source.internalPath.includes('build/')
        );
      },
    );
    let updatedSources: Source[] = [];

    if (sources.length <= 0) {
      return;
    }
    sources.forEach((source) => {
      this.visit(source); // visiting AST Tree nodes and calling transformers

      let actualSource = source;

      updatedSources.push(actualSource);
      updatedSources.forEach((s) => {
        this.visit(s);
      });
    });
  }
}
