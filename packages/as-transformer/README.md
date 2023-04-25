# `as-transformer`

**MassaLabs** as-transformer library.

An [AssemblyScript transformer](https://www.assemblyscript.org/compiler.html#transforms) helper module.

The complete documentation of all available functions and objects can be found here:

- [`as-transformer documentation`](https://as-transformer.docs.massa.net)

## Install

To install this module, run the following command at your project root directory :

```shell
npm install -D @massalabs/as-transformer
```

## Development guide

### Build

```plain
npm run build
```

### Code linting and formatting

```plain
npm run fmt
```

### Test

```plain
npm run test
```

### Generate doc
From the root folder :
```plain
npm run doc
```


### Usage

Tell your editor where to find the transformer types in a typing file. For example `assembly/types.d.ts`.

```typescript
/// <reference types="@massalabs/as-transformer" />
```

You can use this transformer by adding `--transform @massalabs/as-transformer` to your asc command.

For instance, to compile `assembly/my_sc.ts` with this transformer you will execute:

```shell
npx asc --transform @massalabs/as-transformer assembly/my_sc.ts --target release --exportRuntime -o build/my_sc.wasm
```

### Transform ts files

#### file2ByteArray

##### Transformations

This transformer loads the given file, encodes it to `StaticArray<u8>` and then replace the call to `file2ByteArray` by the encoded content.

Example:

```typescript
export function main(_args: string): i32 {
    const bytes = fileToByteArray('./build/sc.wasm'); // will read `build/sc.wasm`, will encode it in array and then put the result in a string used to initialize `bytes`.
    const sc_addr = createSc(bytes);
    call(sc_addr, "advance", "", 0);
    generateEvent("SC deployed at addr: " + sc_addr);
    return 0;
}
```

## Contributing
We welcome contributions from the community!

If you would like to contribute to as-transformer, please read the [CONTRIBUTING file](CONTRIBUTING.md).

## License
as-transformer is released under the [MIT License](LICENSE).

## Powered By
as-transformer is developed with love by MassaLabs and powered by a variety of [open-source projects](powered-by.md).
