import { Parser, Source } from 'assemblyscript/dist/assemblyscript.js';
import { readFileSync } from 'fs';

export function parseFile(
  filePath: string,
  parser: Parser,
  subDir: string,
): Source {
  const isNodeModule = filePath.includes('node_modules/');
  let newParser = new Parser(parser.diagnostics);

  if (isNodeModule) {
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
