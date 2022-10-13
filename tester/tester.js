#!/usr/bin/env node
import { spawn } from 'child_process';
import { URL } from 'url';
import path from 'path';
import { performance } from 'perf_hooks';
import { green } from 'kleur/colors';
import { fileURLToPath } from 'node:url';

const binLocation = import.meta.url;
const parsedBinLocation = new URL(binLocation);
const binFileURL = parsedBinLocation.href;
const fileDir = path.dirname(fileURLToPath(binFileURL));
const libFileLocation = path.join(fileDir, '/lib/bootstrap.js');

const args = [
  '--experimental-wasi-unstable-preview1',
  '--enable-source-maps',
  libFileLocation,
].concat(process.argv.slice(2));

console.log(args);

const start = performance.now();

const envyProcess = spawn('node', args, { stdio: 'inherit' });
envyProcess.ref();

envyProcess.on('exit', () => {
  process.stdout.write(green('\nFinished in ' + (performance.now() - start) + 'ms\n'));
});
