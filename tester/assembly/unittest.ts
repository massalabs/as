/* eslint-disable require-jsdoc */
import { fd_write } from '@assemblyscript/wasi-shim/assembly/bindings/wasi_snapshot_preview1';
import { wasi_process } from '@assemblyscript/wasi-shim/assembly/wasi_process';

export function _startTests(): i32 {
  return root.evaluate(new TestNodeReporterContext());
}

@global
  enum TestResult {
  Panic = -3,
  StopTestSet = -2,
  Failure = -1,
  Success = 1,
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


// XXX: if you use multiple test layers, requests for early returns on failed nested tests will be ignored
class TestNode {
  group: bool = false;
  children: TestNode[] = [];
  success: bool = false;
  constructor(
    public name: string,
    public callback: () => i32,
  ) { }

  evaluate(ctx: TestNodeReporterContext): i32 {
    if (this != root) {
      ctx.indent += 2;
      if (this.group) write(' '.repeat(ctx.indent) + 'Set: ' + this.name + '\n');
      else write(' '.repeat(ctx.indent) + 'Test: ' + this.name + '\n');
    }

    const parent = current;
    current = this;

    let testResult = this.callback();

    // Execute children tests.
    // Tests are stopped prematurely if the failure policy is Panic or StopTestSet.
    // Panic is propagated to the parent to stop the execution of all the tests.
    const children = this.children;
    const childrenLength = children.length;

    for (let i = 0; i < childrenLength; i++) {
      const child = unchecked(children[i]);

      const childTestResult = child.evaluate(ctx);

      if (childTestResult == TestResult.Panic) {
        testResult = TestResult.Panic;
        break;
      }

      if (childTestResult == TestResult.StopTestSet) {
        testResult = TestResult.Failure;
        break;
      }

      if (childTestResult == TestResult.Failure) {
        testResult = TestResult.Failure;
      }
    }


    current = parent;
    if (this != root) {
      ctx.indent -= 2;
    }

    return testResult;
  }
}

const root: TestNode = new TestNode('Root', (): i32 => {
  return 1;
});
let current: TestNode = root;

@global function test(name: string, callback: () => i32): void {
  const t = new TestNode(name, callback);
  current.children.push(t);
}

@global function error(message: string): void {
  const stdout = wasi_process.stderr;
  stdout.write(' '.repeat(6) + `\x1b[31m` + 'Error: ' + `\x1b[39m`);
  stdout.write(message);
  stdout.write('\n');
}


@global function describe(name: string, callback: () => i32): void {
  const t = new TestNode(name, callback);
  t.group = true;
  current.children.push(t);
}