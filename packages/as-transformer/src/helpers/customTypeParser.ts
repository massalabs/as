import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import Debug from 'debug';

export const MASSA_TYPE_EXTENSION = '.massa-type.yml';

// TODO: care about yaml parsing
export interface MassaType {
  name: string;
  repeated?: bool;
  metaData?: TypeMetaData;
}

class TypeMetaData {
  proto: string;
  import: string;
  serialize: string;
  deserialize: string;

  constructor(
    proto: string,
    importPath: string,
    serialize: string,
    deserialize: string,
  ) {
    this.proto = proto;
    this.import = importPath;
    this.serialize = serialize;
    this.deserialize = deserialize;
  }
}

/**
 * Extract each custom type found in the given file content.
 * @see MassaType
 *
 * @param fileContent - the yaml fiel content to parse.
 *
 * @returns an array of extracted types.
 */
function extractTypes(fileContent: string): MassaType[] {
  const types: MassaType[] = [];
  const data = yaml.parse(fileContent);

  for (const type of data) {
    types.push({
      name: type.name,
      metaData: new TypeMetaData(
        type.proto,
        type.import,
        type.serialize,
        type.deserialize,
      ),
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
      Debug.log('Found custom type file', filePath);
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
export function fetchCustomTypes(): MassaType[] {
  let files = scanForTypes();
  let types: MassaType[] = [];

  for (const file of files) {
    let data = fs.readFileSync(file).toString();
    types.push(...extractTypes(data));
  }
  return types;
}
