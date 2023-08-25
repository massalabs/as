import { spawnSync } from 'child_process';
import { ASType, ProtoMetadata, ProtoType, fetchCustomTypes } from './customTypeParser.js';
import { MassaExport } from '../transformers/massaExport.js';
import { Update, UpdateType } from '../transformers/interfaces/Update.js';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'yaml';
// eslint-disable-next-line
// @ts-ignore
import { assert, debug } from 'console';
import { NamedTypeNode, TypeNode } from 'assemblyscript';
import { MassaFunctionNode } from './node.js';

export function readRefTable(): Map<ASType, ProtoType> {
  const __filename = path.resolve(decodeURI(new URL(import.meta.url).pathname));
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, '../../config/reftable.yml');

  const file = fs.readFileSync(filePath, 'utf8');
  const parsed = yaml.parse(file);
  let initial: Map<ASType, ProtoType> = new Map();
  for (const t of parsed) {
    if (t.serialize && t.deserialize) {
      let metaData = new ProtoMetadata(
        t.serialize,
        t.deserialize,
      );
      initial.set(t.as, {
        name: t.proto, repeated: t.repeated, metaData: metaData,
      });
    } else {
      initial.set(t.as, {
        name: t.proto, repeated: t.repeated,
      });
    }
  }
  let customs: Map<ASType, ProtoType> = fetchCustomTypes();
  let table = new Map([...initial.entries(), ...customs.entries()]);
  return table;
}

export class Argument {
  readonly name: string;
  readonly fnName: string;
  readonly type: TypeNode;

  constructor(name: string, fnName: string, type: TypeNode) {
    this.name = name;
    this.fnName = fnName;
    this.type = type;
  }
}

// create a global refTable, so we don't have to read the file every time
const refTable = readRefTable();

/**
 * Generates the protobuf file data for the passed function signature.
 *
 * @remarks
 * The protobuf file is written with the proto3 syntax.
 *
 * @see [proto3](https://protobuf.dev/programming-guides/proto3/)
 *
 * @param name - The name of the function.
 * @param args - The arguments of the function.
 * @param returnedType - The return type of the function.
 *
 * @returns the protobuf file as a string.
 */
export function generateProtoFile(
  massaFunction: MassaFunctionNode,
  transformer: MassaExport,
): string {
  const { name, args, returnNode } = massaFunction;
  const returnType = typeNodeToString(returnNode);

  const argumentMessages = args.map((arg, index) => {
    const message = computeArgument(transformer, arg, index, refTable);
    return message;
  });
  const fields = argumentMessages.join('\n');

  let customImports = `
import "google/protobuf/descriptor.proto";

extend google.protobuf.FieldOptions {
  optional string custom_type = 50002;
}
`;

  let imports = fields.indexOf('custom_type') > -1 ? customImports : '';

  let protoFile = `syntax = "proto3";
${imports}
message ${name}Helper {
${fields}
}
`;

  if (returnType != 'void') {
    const argumentResponse: Argument = new Argument('value', name, returnNode);

    const response = computeArgument(
      transformer,
      argumentResponse,
      0,
      refTable,
    );

    protoFile += `
message ${name}RHelper {
${response}
}`;
  }

  return protoFile;
}

function computeArgument(
  transformer: MassaExport,
  arg: Argument,
  prevIndex: number,
  refTable: Map<ASType, ProtoType>,
): string {
  let asType = typeNodeToString(arg.type);
  let protoType = refTable.get(asType);

  // If the type is not found in the refTable, maybe it's an array of a known type
  // try to find the type of the array
  if (!protoType) {
    if (isArray(arg.type)) {
      asType = typeNodeToString(getArrayElementType(arg.type));
      protoType = refTable.get(asType);
      protoType = protoType ? { ...protoType, repeated: true } : undefined;
    }
  }

  // not a simple array of something, give up
  if (!protoType) {
    // debug(arg.node?.type as TypeNode);
    debugTypeNode(arg.type);
    throw new Error(`Unsupported type: ${asType}`);
  }

  let fieldName = arg.name;
  let message = generatePayload(
    fieldName,
    typeNodeToString(arg.type),
    protoType,
    prevIndex + 1,
  );
  if (protoType && protoType.metaData) {
    pushCustomTypeUpdate(transformer, arg.fnName, asType, protoType, fieldName);
  }
  return message;
}

function debugTypeNode(node: TypeNode) {
  debug('str:', node.range.toString());
  debug('main:', (node as NamedTypeNode)?.name.identifier.text);
  debug(
    'sub:',
    (node as NamedTypeNode)?.typeArguments?.map(
      (t) => (t as NamedTypeNode).name.identifier.text,
    ),
  );
  debug('ext:', (node as NamedTypeNode)?.name.next?.identifier.text);
}

function pushCustomTypeUpdate(
  transformer: MassaExport,
  functionName: string,
  as: ASType,
  proto: ProtoType,
  field: string,
) {
  transformer.updates.push(
    new Update(
      UpdateType.Argument,
      field,
      new Map([
        ['type', [as]],
        ['ser', [proto.metaData!.serialize]],
        ['deser', [proto.metaData!.deserialize]],
        ['fnName', [functionName]],
      ]),
      'custom-proto',
    ),
  );
}

/**
 *
 * @remarks
 * The protobuf argument is written with the proto3 syntax.
 * @see [proto3](https://protobuf.dev/programming-guides/proto3/)
 *
 * @returns the protobuf argument as a string.
 */
/**
 * Generates a payload string for a given field, AssemblyScript type, protobuf type, and index.
 * @param field - The name of the field.
 * @param asFullType - The AssemblyScript type of the field *including Array*.
 * @param proto - The protobuf type of the field.
 * @param index - The index of the field.
 * @returns The payload string.
 */
function generatePayload(
  field: string,
  asFullType: ASType,
  proto: ProtoType,
  index: number,
): string {
  const fieldType = (proto.repeated ? 'repeated ' : '') + proto.name;
  const optTemplateType = ` [(custom_type) = "${asFullType}"];`;
  return `  ${fieldType} ${field} = ${index}` + optTemplateType;
}

/**
 * Generates the AS helpers functions for the passed protobuf file.
 *
 * @remarks
 * The AS helpers code is generated using the as-proto-gen plugin with protoc compiler.
 * These generated functions are used to call the smart contract functions without having to pre-serialize the data.
 *
 * @param protoFile - The data of the protobuf file.
 * @param outputPath - The path to write the generated code to.
 */
export function generateASHelpers(protoFile: string, outputPath: string): void {
  let protocProcess = spawnSync('protoc', [
    `--plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen`,
    `--as_out=${outputPath}`,
    `--as_opt=gen-helper-methods`,
    `--proto_path=./build`,
    protoFile,
  ]);

  if (protocProcess.status !== 0) {
    // eslint-disable-next-line no-console
    console.error(
      `Failed to generate AS helpers code for: \n` +
      `${protoFile} \nwith error: ${protocProcess.stderr}`,
    );
  }
}

export function isArray(node: TypeNode): boolean {
  // debug(
  //   typeNodeToString(node),
  //   (node as NamedTypeNode)?.name.identifier.text.indexOf('Array') > -1,
  //   (node as NamedTypeNode)?.name.identifier.text === 'Array',
  // );
  return (node as NamedTypeNode)?.name.identifier.text === 'Array';
}

export function getArrayElementType(node: TypeNode): TypeNode {
  const namedTypeNode = node as NamedTypeNode;
  if (
    !namedTypeNode ||
    !namedTypeNode.typeArguments ||
    namedTypeNode.typeArguments.length === 0 ||
    !namedTypeNode.typeArguments[0]
  ) {
    throw new Error('Invalid array type node: ' + typeNodeToString(node));
  }
  return namedTypeNode.typeArguments[0];
}

export function typeNodeToString(node: TypeNode): string {
  return node.range.toString();
}
