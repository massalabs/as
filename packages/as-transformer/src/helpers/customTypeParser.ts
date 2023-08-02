import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import Debug from 'debug';

export const MASSA_TYPE_EXTENSION = '.massa-type.yml';

export type ASType = string;

export interface ProtoType {
  name: string;
  repeated?: bool;
  metaData?: ProtoMetadata;
}

class ProtoMetadata {
  import: string;
  serialize: string;
  deserialize: string;

  constructor(importPath: string, serialize: string, deserialize: string) {
    this.import = importPath;
    this.serialize = serialize;
    this.deserialize = deserialize;
  }
}

/**
 * Extract each custom type found in the given file content.
 * @see ProtoType
 *
 * @param fileContent - the yaml file content to parse.
 *
 * @returns a map of extracted types.
 */
function extractTypes(fileContent: string): Map<ASType, ProtoType> {
  const types: Map<ASType, ProtoType> = new Map();
  const data = yaml.parse(fileContent);

  for (const type of data) {
    types.set(type.name, {
      name: type.proto,
      metaData: new ProtoMetadata(
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
 * @returns a map of objects defining each type.
 */
export function fetchCustomTypes(): Map<ASType, ProtoType> {
  let files = scanForTypes();
  let types: Map<ASType, ProtoType> = new Map();

  for (const file of files) {
    let data = fs.readFileSync(file).toString();
    let ntypes = extractTypes(data);
    types = new Map([...types.entries(), ...ntypes.entries()]);
  }
  return types;
}
