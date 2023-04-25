# as-proba

**MassaLabs** as-proba library.

This library provides useful *AssemblyScript* objects and functions :

- **Binomial** in an object that represent a binomial distribution. It can be used to compute probabilities of a given event and generate random samples

- Useful methods to compute **combinations** an **partial permutations** 

- **randomInt**, a method to generate a random number between given limits

- **Sampler**, an object wich allows you to generate samples based on the probability distribution you built

The complete documentation of all available functions and objects is here:

- [`as-proba documentation`](https://as-proba.docs.massa.net)

## Warning
**Non-secure random functions are used here.**

Using non-secure random functions is the only way to have onchain randomness but **these functions generates pseudo-random values (predictable and repeatable randomness), it is NOT a real randomness**.
Therefore it is easier for attackers to predict the output and exploit weaknesses in your smart contract.

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

For example, to compute the combination of 2 numbers, you can use as-proba like this:
```typescript
import { Args, u64ToBytes} from '@massalabs/as-types';
import { combination } from '@massalabs/as-proba';

// This main function is called automatically when the smart contract is executed by the blockchain.
//the argument args contains the serialized values n and k as U64 (n >= k)
export function main(binaryArgs: StaticArray<u8>): StaticArray<u8>{
	const args = new  Args(binaryArgs);
	const  n = args.nextU64();
	const  k = args.nextU64();
	cont result = combination(n, k);
	return u64toBytes(result)
}
```
## Contributing
We welcome contributions from the community!

If you would like to contribute to as-proba, please read the [CONTRIBUTING file](CONTRIBUTING.md).

## License
as-proba is released under the [MIT License](LICENSE).

## Powered By
as-proba is developed with love by MassaLabs and powered by a variety of [open-source projects](powered-by.md).
