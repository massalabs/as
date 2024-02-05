
# as-types

**MassaLabs** as-types library.

This library provides useful *AssemblyScript* objects and functions to help you deal with types:

- **Amount** object to safely express amounts in every currency

- **Args** object to serialize assembly script native types into bytes

- **Currency** object to represent monetary units used to express a value

- **Result** object which represents wrapper for a value that can be either a success or an error

- **Serializable** an interface that allows you to use `Args` to serialize/de-serialize your objects

- **SafeMath** a module to avoid overflows and divisions by zero while doing operations

- Serialization and Deserialization methods for arrays, staticArrays, booleans, strings and numbers



The complete documentation of all available functions and objects is here:

- [`as-types documentation`](https://as-types.docs.massa.net)

## Warning
**Non-secure random functions are used here.**

Using non-secure random functions is the only way to have onchain randomness but **these functions do not generate truly random** values, making it easier for attackers to predict the output and exploit weaknesses in your smart contract.

## Install

Packages are independent you can choose to install what you need

```sh
npm i --save-dev @massalabs/as-types
```

## Usage
After installing *as-types*, you can import the object classes and functions that you need in your AssemblyScript file.

One way to use the "args" object is by importing and utilizing it in the following manner:
```typescript
import { Args, i32ToBytes } from  '@massalabs/as-types';

// This main function is called automatically when the smart contract is executed by the blockchain.
//the argument args contains the serialized values n and k as i32
export function sum(binaryArgs: StaticArray<u8>): StaticArray<u8>{
	const args = new  Args(binaryArgs);
	const  a = args.nextI32();
	const  b = args.nextI32();
	return i32ToBytes(a + b)
}
```
## Contributing
We welcome contributions from the community!

If you would like to contribute to Massa-as-sdk, please read the [CONTRIBUTING file](CONTRIBUTING.md).

## License
as-types is released under the [MIT License](LICENSE).

## Powered By
as-types is developed with love by MassaLabs and powered by a variety of [open-source projects](powered-by.md).
