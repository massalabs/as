import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import { debug } from 'console';

export const MASSA_TYPE_EXTENSION = '.massa-type.yml';

export type ASType = string;

export interface ProtoType {
  name: string;
  repeated?: boolean;
  metaData?: ProtoMetadata;
}

export class ProtoMetadata {
  serialize: string;
  deserialize: string;
  import?: string;

  constructor(serialize: string, deserialize: string, importPath?: string) {
    this.serialize = serialize;
    this.deserialize = deserialize;
    if (importPath) {
      this.import = importPath;
    }
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
        type.serialize,
        type.deserialize,
        type.import,
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
      debug('Found custom type file', filePath);
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
