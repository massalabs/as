# AS

![check-code-coverage](https://img.shields.io/badge/coverage-71%25-orange)

**MassaLabs** monorepo for assemblyscript libraries.

This repository is a collection of tools, objects and functions in *AssemblyScript*.

- *Classes and helper functions* with **as-types**

- *Random draws* with **as-proba**

- *AssemblyScript transformers for unit testing and reading a file* with **as-transformer**

The complete documentation of all available functions and objects is here:

- [`as-types documentation`](https://as-types.docs.massa.net)
- [`as-proba documentation`](https://as-proba.docs.massa.net)
- [`as-transformer documentation`](https://as-transformer.docs.massa.net)

## Install

Packages are independant you can choose to install what you need

```sh
npm i --save-dev @massalabs/as-types
npm i --save-dev @massalabs/as-proba
npm i --save-dev @massalabs/as-transformer
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

```plain
npm run doc
```
## Usage
After installing *As*, you can import the object classes and functions that you need in your AssemblyScript file.

For example, to use the "combination" function to determine the combination of 12 and 5, you can import and use it like this:
```typescript
import { combination } from  '@massalabs/as-proba';
import { Args } from  '@massalabs/as-types';

// This main function is called automatically when the smart contract is executed by the blockchain.
//the argument args contains the serialized values n and k (n >= k) as U64
export function main(args: StaticArray<u8>): void {
	const  n = args.nextU64();
	const  k = args.nextU64();
	const  result = combination(n, k);
	generateEvent(`The result of the combination of ${n.toString()} and ${k.toString()} is ${result.toString()}`);
}
```
## Contributing
We welcome contributions from the community!

If you would like to contribute to Massa-as-sdk, please read the [CONTRIBUTING file](CONTRIBUTING.md).

## License
Massa-as-sdk is released under the [MIT License](LICENSE).

## Powered By
Massa-as-sdk is developed with love by MassaLabs and powered by a variety of [open-source projects](powered-by.md).
