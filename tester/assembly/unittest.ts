// / <reference path="./global.d.ts" />
import {fd_write} from '@assemblyscript/wasi-shim/assembly/bindings/wasi_snapshot_preview1.ts';
import {
  wasi_process,
} from '@assemblyscript/wasi-shim/assembly/wasi_process.ts';

export function _startTests(): void {
  root.evaluate(new TestNodeReporterContext());
}

class TestNodeReporterContext {
  indent: i32 = 0;
}

function write(str: string): void {
  const buff = String.UTF8.encode(str);
  const iov = memory.data(16);
  store<u32>(iov, changetype<usize>(buff), 0);
  store<u32>(iov, <u32>buff.byteLength, sizeof<usize>());
  const written_ptr = memory.data(8);
  fd_write(1, iov, 1, written_ptr);
}

class TestNode {
  group: bool = false;
  children: TestNode[] = [];
  success: bool = false;
  constructor(
    public name: string,
    public callback: () => void,
  ) { }

  evaluate(ctx: TestNodeReporterContext): void {
    if (this != root) {
      ctx.indent += 2;
      if (this.group) write(' '.repeat(ctx.indent) + 'Group: ' + this.name + '\n');
      else write(' '.repeat(ctx.indent) + 'Test: ' + this.name + '\n');
    }

    const parent = current;
    current = this;
    this.callback();

    // once the test is run, children are determined, evaluate them
    const children = this.children;
    const childrenLength = children.length;
    for (let i = 0; i < childrenLength; i++) {
      const child = unchecked(children[i]);
      child.evaluate(ctx);
    }

    current = parent;
    if (this != root) {
      ctx.indent -= 2;
    }
  }
}

const root: TestNode = new TestNode('Root', () => { });
let current: TestNode = root;

@global function test(name: string, callback: () => void): void {
  const t = new TestNode(name, callback);
  current.children.push(t);
}

@global function error(message:string): void {
  const stdout = wasi_process.stderr;
  stdout.write(`\x1b[31m` + 'Error: ' + `\x1b[39m`);
  stdout.write(message);
  stdout.write('\n');
}


@global function describe(name: string, callback: () => void): void {
  const t = new TestNode(name, callback);
  t.group = true;
  current.children.push(t);
}
