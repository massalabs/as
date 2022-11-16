#!/usr/bin/env node
import {spawn} from 'child_process';
import {URL} from 'url';
import path from 'path';
import {performance} from 'perf_hooks';
import {green, red} from 'kleur/colors';
import {fileURLToPath} from 'node:url';

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

const start = performance.now();

const envyProcess = spawn('node', args, {stdio: 'inherit'});
envyProcess.ref();

envyProcess.on('exit', (rc) => {
  process.stdout.write('\nFinished in ' + (performance.now() - start) + 'ms\n');

  if (rc==1) {
    process.stdout.write(green('\nAll tests are good!\n'));
    process.exit(0);
  }

  process.stdout.write(red('\nAt least one test failed...\n'));
  process.exit(1);
});
