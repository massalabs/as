# as-types

This package provides Assembly Script classes meant to be used for smart-contract development.

## Usage

### Requirements

- NodeJS 14+
- npm

### Installation
`npm install @massalabs/as-types`

### Classes
This section contains a description of the classes available in this package.

#### Result
This class provides a wrapper around a type and an error.

It will allow you to check the returns of various methods available in this package.

Available class methods :
- `isOk`
- `isErr`
- `expect`
Checks that the result is okay and panic if not.
- `unwrap`
Get the value inside Result object. Panic if error.


#### Currency
This class allows for the creation of a currency object with ease.
It also provides useful methods to manipulate currencies objects, such as :

- `equals`
- `notEqual`
- `toArgs`
- `fromArgs`

```as
const dollar = new Currency("dollar", 2);
```

#### Amount
This class allows for the creation of an amount object with ease.
It also provides useful methods to manipulate amounts objects, such as :

- `equals`
- `notEqual`
- `lessThan`
- `toArgs`
- `fromArgs`

```as
const dollar = new Currency("dollar", 2);
const price = new Amount(1034, dollar);
```

Note that if you try to add or substract amounts that are defined in different types of currencies, it will result in an error.

#### Argument
This class is very important to write smart contract.
It allows for the serialisation/deserialisation of a regular type (int, float, string) into a byteArray.

#### ByteArray
This class allows for the manipulation of byte arrays.
Available class methods :
- `equals`
- `notEqual`
- `toByteString`
- `toI32`
- `toU32`
- `toU64`
- `concat`

#### Valider
