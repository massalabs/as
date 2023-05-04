import {
  FunctionDeclaration,
  IdentifierExpression,
  Parser,
  Source,
} from 'assemblyscript/dist/assemblyscript.js';
import { readFileSync } from 'fs';

// TODO: check if it's still needed.
/**
 * Checks if the passed function declaration has a given decorator.
 *
 * @privateRemarks
 * @see [inspiration](https://github.com/as-pect/visitor-as/blob/master/src/utils.ts#L35)
 *
 * @param node - The function declaration AST node to search a decorator from.
 * @param name - The name of the decorator to search for.
 *
 * @returns true if the function has indeed the passed decorator.
 */
export function hasDecorator(node: FunctionDeclaration, name: string): bool {
  let decl = node;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((node as any)['declaration'] !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decl = (node as any).declaration;
  }

  return (
    decl.decorators?.some(
      (node) => (<IdentifierExpression>node.name).text === name,
    ) == true
  );
}
/**
 * Gets the sources from the given filepath.
 *
 * @remarks
 * This function is able to parse the file wether it is located in the `node_modules` or elsewhere.
 *
 * @param filePath - The filepath to parse.
 * @param parser - The parser to use configuration from.
 * @param subDir - The subdirectory where the file is located.
 *
 * @returns The source data of the filepath as a {@link Source} object.
 */
export function parseFile(
  filePath: string,
  parser: Parser,
  subDir: string,
): Source {
  const nodeModulesIndex = filePath.indexOf('node_modules/');
  let newParser = new Parser(parser.diagnostics);

  if (nodeModulesIndex > -1) {
    const shortFilePath = filePath.replace(/.*node_modules/i, '~lib');
    newParser.parseFile(readFileSync(filePath, 'utf-8'), shortFilePath, false);
  } else {
    const shortFilePath = filePath.replace(process.cwd() + '/', '');
    newParser.parseFile(
      readFileSync(shortFilePath, 'utf-8'),
      shortFilePath.replace('build/', subDir),
      false,
    );
  }

  const src = newParser.sources.pop();

  assert(
    src !== undefined,
    `Source is undefined after parsing file ${filePath}`,
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return src!;
}
