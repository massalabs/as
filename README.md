# AS

![check-code-coverage](https://img.shields.io/badge/coverage-71%25-orange)

**As** is a monorepo for **AssemblyScript** libraries developed by MassaLabs. It contains a collection of tools, objects, and functions specifically designed for AssemblyScript projects, including classes and helper functions, random draws, and AssemblyScript transformers for unit testing and reading files.

- [`as-types documentation`](https://as-types.docs.massa.net)
- [`as-proba documentation`](https://as-proba.docs.massa.net)
- [`as-transformer documentation`](https://as-transformer.docs.massa.net)

## Installation

To use AssemblyScript Libraries in your AssemblyScript project, simply add the desired package as a dependency:

```sh
npm i --save-dev @massalabs/as-types
npm i --save-dev @massalabs/as-proba
npm i --save-dev @massalabs/as-transformer
```

## Usage

After installing the desired package, you can import the object classes and functions that you need in your AssemblyScript project. Refer to the respective documentation for each package for more information.

## Contributing

We welcome contributions from the community!

If you would like to contribute to AssemblyScript Libraries, please read the [CONTRIBUTING file](CONTRIBUTING.md).

## License

AssemblyScript Libraries are released under the [MIT License](LICENSE).

## Powered By

AssemblyScript Libraries are developed with love by MassaLabs and powered by a variety of [open-source projects](powered-by.md).

## Development Guide

### Build

```plain
npm run build
```

### Code Linting and Formatting

```plain
npm run fmt
```

### Test

```plain
npm run test
```

### Generate Documentation

```plain
npm run doc
```
