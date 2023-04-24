
# as-proba

**MassaLabs** as-proba library.

This library provides useful *AssemblyScript* objects and functions to help you deal with types:

- **Binomial** in an object that represent a binomial distribution. It can be used to compute probabilities of a given event and generate random samples

- Useful methods to compute **combinations** an **partial permutations** 

- **randomInt**, a method to generate a random number between given limits

- **Sampler**, an object wich allows you to generate samples based on the probability distribution you built



The complete documentation of all available functions and objects is here:

- [`as-proba documentation`](https://as-proba.docs.massa.net)

## Warning
**Non-secure random functions are used here.**

Using non-secure random functions is the only way to have onchain randomness but **these functions do not generate truly random** values, making it easier for attackers to predict the output and exploit weaknesses in your smart contract.

## Install

Packages are independant you can choose to install what you need

```sh
npm i --save-dev @massalabs/as-proba
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

## Usage
After installing *as-proba*, you can import the object classes and functions that you need in your AssemblyScript file.

For example, to use the "args" object, you can import and use it like this:
```typescript
import { Args, i32ToBytes } from  '@massalabs/as-proba';

// This main function is called automatically when the smart contract is executed by the blockchain.
//the argument args contains the serialized values n and k as i32
export function main(binaryArgs: StaticArray<u8>): StaticArray<u8>{
	const args = new  Args(binaryArgs);
	const  n = args.nextI32();
	const  k = args.nextI32();
	return i32ToBytes(a + b)
}
```
## Contributing
We welcome contributions from the community!

If you would like to contribute to Massa-as-sdk, please read the [CONTRIBUTING file](CONTRIBUTING.md).

## License
Massa-as-sdk is released under the [MIT License](LICENSE).

## Powered By
Massa-as-sdk is developed with love by MassaLabs and powered by a variety of [open-source projects](powered-by.md).
