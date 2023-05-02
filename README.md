# AS

![check-code-coverage](https://img.shields.io/badge/coverage-87%25-green)

**MassaLabs** monorepo for assemblyscript libraries.

This repository is a collection of tools, objects and functions in *AssemblyScript*.

- *Essential Classes and helper functions* with **as-types**

- *Probabilistic simulation functionalities for smart contracts* with **as-proba**

- *AssemblyScript transformers, dynamic code replacement features* with **as-transformer**

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

For example, to use the `combination` function to determine the combination of 2 numbers, you can import and use it like this:
```typescript
import { combination } from  '@massalabs/as-proba';
import { Args } from  '@massalabs/as-types';

//the argument args contains the serialized values n and k (n >= k) as U64
export function calculateCombination(args: StaticArray<u8>): void {
	const  n = args.nextU64();
	const  k = args.nextU64();
	const  result = combination(n, k);
	generateEvent(`The result of the combination of ${n.toString()} and ${k.toString()} is ${result.toString()}`);
}
```
## Contributing
We welcome contributions from the community!

If you would like to contribute to As, please read the [CONTRIBUTING file](CONTRIBUTING.md).

## License
As is released under the [MIT License](LICENSE).

## Powered By
As is developed with love by MassaLabs and powered by a variety of [open-source projects](powered-by.md).
