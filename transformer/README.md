# `as-transformer`

An [AssemblyScript transformer](https://www.assemblyscript.org/compiler.html#transforms) helper module.

## Installation

This module can be installed using [GitPkg](https://gitpkg.vercel.app/) that makes subfolders of repos directly usable with npm or yarn.

To install this module, run the following command at your project root directory :

```shell
npm install -D 'https://gitpkg.now.sh/massalabs/as/transformer?main'
```

## Usage

### Transform ts files

#### file2base64

##### Transformations

This transformer loads the given file, encodes it in base64 and then replace the call to `file2base64` by the encoded content.

Example:
```typescript
export function main(_args: string): i32 {
    const bytes = fileToBase64('./build/sc.wasm'); // will read `build/sc.wasm`, will encode it in base64 and then put the result in a string used to initialize `bytes`.
    const sc_addr = create_sc(bytes);
    call(sc_addr, "advance", "", 0);
    generate_event("gol SC deployed at addr: " + sc_addr);
    return 0;
}
```

##### Usage

You can use this transformer by adding `--transform transformer/file2base64.js` to your asc command.

For instance, to compile `assembly/my_sc.ts` with this transformer you will execute:

```shell
yarn asc --transform transformer/file2base64.js assembly/my_sc.ts --target release --exportRuntime -o build/my_sc.wasm
```

### Transformer extenders

#### Replacer

This extender simplify how you can write a code replacer. Have a look at as-tester/check_replacer.js to see usage.