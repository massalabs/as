# `as-transformer`

An [AssemblyScript transformer](https://www.assemblyscript.org/compiler.html#transforms) helper module.

## Installation

To install this module, run the following command at your project root directory :

```shell
npm install -D @massalabs/as-transformer
```

## Usage

### Transform ts files

#### file2ByteArray

##### Transformations

This transformer loads the given file, encodes it to StaticArray<u8> and then replace the call to `file2ByteArray` by the encoded content.

Example:
```typescript
export function main(_args: string): i32 {
    const bytes = fileToByteArray('./build/sc.wasm'); // will read `build/sc.wasm`, will encode it in array and then put the result in a string used to initialize `bytes`.
    const sc_addr = create_sc(bytes);
    call(sc_addr, "advance", "", 0);
    generate_event("gol SC deployed at addr: " + sc_addr);
    return 0;
}
```

##### Usage

You can use this transformer by adding `--transform @massalabs/as-transformer` to your asc command.

For instance, to compile `assembly/my_sc.ts` with this transformer you will execute:

```shell
yarn asc --transform @massalabs/as-transformer assembly/my_sc.ts --target release --exportRuntime -o build/my_sc.wasm
```
