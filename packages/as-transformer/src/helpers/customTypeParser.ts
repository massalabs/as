import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

export const MASSA_TYPE_EXTENSION = '.massa-type.yml';

export interface MassaCustomType {
  name: string;
  proto: string;
  import: string;
  serialize: string;
  deserialize: string;
}

/**
 * Extract each custom type found in the given file content.
 * @see MassaCustomType
 *
 * @param fileContent - the yaml fiel content to parse.
 *
 * @returns an array of extracted types.
 */
export function extractTypes(fileContent: string): MassaCustomType[] {
  const types: MassaCustomType[] = [];
  const data = yaml.parse(fileContent);

  for (const type of data) {
    types.push({
      name: type.name,
      proto: type.proto,
      import: type.import,
      serialize: type.serialize,
      deserialize: type.deserialize,
    });
  }
  return types;
}

/**
 * This function scans the node_modules directory looking for custom proto types config files.
 *
 * @param dir - an optionnal value only used to search recursively in the current directory.
 *
 * @returns an array of filepaths leading ot each config file.
 */
function scanForTypes(dir = './node_modules/'): string[] {
  const results = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results.push(...scanForTypes(filePath));
    } else if (file.includes(MASSA_TYPE_EXTENSION)) {
      results.push(filePath);
    }
  }

  return results;
}

/**
 * This function is used to recover any accessible and defined custom protobuf types present in the current project.
 *
 * @returns an array of object defining each types.
 */
export function fetchCustomTypes(): MassaCustomType[] {
  let files = scanForTypes();
  let types: MassaCustomType[] = [];

  for (const file of files) {
    let data = fs.readFileSync(file).toString();
    types.push(...extractTypes(data));
  }
  return types;
}
