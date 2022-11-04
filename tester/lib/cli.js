// This script is largely inspired from ENVY
import {yellow} from 'kleur/colors';
import {URL} from 'url';
import path from 'path';
import arg from 'arg';
import glob from 'glob-promise';
import asc from 'assemblyscript/dist/asc.js';
import {WASI} from 'wasi';
import fs, {promises as asyncfs} from 'fs';

const SIZE_OFFSET = -4;
const parsed = new URL(import.meta.url);
const filePath = path.resolve(parsed.pathname);// .slice(1));
const fileDir = path.dirname(filePath);
const assemblyEntry = path.join(fileDir, '../assembly/unittest.ts');
const cwd = process.cwd();


// entry point
// eslint-disable-next-line require-jsdoc
export async function main(argv = process.argv.slice(2)) {
  // check for rest argument
  let rest = [];
  const indexOfRest = argv.indexOf('--');
  if (indexOfRest !== -1) {
    rest = argv.slice(indexOfRest);
    argv = argv.slice(0, indexOfRest);
  }

  // parse the arguments
  const config = arg({
    '--help': Boolean,
    '--basedir': String,
    '--target': String,
    '--imports': String,
    '--ignore': String,
    '--transform': String,
  }, {
    argv,
  });

  // obtain configuration values
  const globs = config._;

  if (globs.length === 0) {
    process.stdout.write(yellow('No entry points specified. Using assembly/**/*.spec.ts'));
    globs.push('assembly/**/*.spec.ts');
  }

  // const help = config["--help"];
  const basedir = config['--basedir'] ?? process.cwd();
  const target = config['--target'] ?? 'debug';
  const imports = config['--imports'] ?? 'node_modules/tester/envy.imports.js';
  const ignore = config['--ignore'] ?? 'node_modules';
  const transformer = config['--transform'] ?? '';
  // get all the entry files
  const fileSets = [];
  const root = path.resolve(basedir);
  const globOptions = {
    nodir: true,
    absolute: true,
    root,
  };
  for (const globSet of globs) {
    fileSets.push(
        await glob(globSet, globOptions)
    );
  }
  const fileSet = new Set([].concat.apply([assemblyEntry], fileSets));

  for (const globSet of ignore.split(',')) {
    for (const file of await glob(globSet, globOptions)) {
      fileSet.delete(file);
    }
  }

  const files = Array.from(fileSet);

  // create an index
  const index = new Map();
  const {
    error,
    stats,
    stderr,
    stdout,
  } = transformer.length > 0 ? await asc.main([
    '--importMemory',
    '--target', target,
    '--bindings', 'raw',
    '--transform', transformer,
  ].concat(files), {
    writeFile(filename, contents, baseDir) {
      const fullPath = path.join(baseDir, filename);
      index.set(fullPath, contents);
    },
  }) : await asc.main([
    '--importMemory',
    '--target', target,
    '--bindings', 'raw',
  ].concat(files), {
    writeFile(filename, contents, baseDir) {
      const fullPath = path.join(baseDir, filename);
      index.set(fullPath, contents);
    },
  });


  // process.stdout.write(stdout.toString() + '\n');

  // obtain the wasm binary
  let wasm = null;
  for (const [name, binary] of index.entries()) {
    if (name.endsWith('.wasm')) {
      wasm = binary;
    }
    if (name.endsWith('.wat')) {
      fs.writeFileSync(name, binary);
    }
  }

  if (!wasm) {
    process.stderr.write('No wasm binary found. Exiting code 1.\n');
    process.stderr.write(stderr.toString() + '\n');
    process.exit(1);
  }

  const mod = new WebAssembly.Module(wasm);
  const memory = new WebAssembly.Memory({initial: 4});
  const utf16 = new TextDecoder('utf-16le', {fatal: true});

  /** Gets a string from memory. */
  const getString = (ptr) => {
    const len = new Uint32Array(memory.buffer)[ptr + SIZE_OFFSET >>> 2] >>> 1;
    const wtf16 = new Uint16Array(buffer, ptr, len);
    return utf16.decode(wtf16);
  };

  const wasi = new WASI({
    args: rest,
    env: process.env,
  });

  const wasiImports = {
    env: {
      memory,
      abort(msg, file, line, col) {
        process.stdout.write(`abort: ${getString(msg)} at ${getString(file)}:${line}:${col}\n`);
        process.exit(1);
      },
    },
    wasi_snapshot_preview1: wasi.wasiImport,
  };
  const wasmImportsPath = path.join(cwd, imports);

  const wasmImports = await asyncfs.access(wasmImportsPath)
      .then(async () => {
        const mod = await import('file://' + wasmImportsPath);
        return Object.assign(mod.default(memory), wasiImports);
      })
      .catch(() => wasiImports);


  const instance = await WebAssembly.instantiate(mod, wasmImports);
  wasi.initialize(instance);
  instance.exports._startTests();
}
