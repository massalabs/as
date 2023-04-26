# Contributing to as-transformer

Thank you for considering contributing to !

## Reporting Bugs

If you discover a bug, please create a [new issue](https://github.com/massalabs/as/issues/new?assignees=&
In your issue, please include a clear and concise description of the bug, any relevant code snippets, error messages, and 


## Installation

To start developing with as-transformer, you must install all the necessary dev dependencies. You can do so by running the 
```sh
npm install
```

This will install all the required packages listed in the package.json file, allowing you to update, fix, or improve 


## Contributing Code

We welcome contributions in the form of bug fixes, enhancements, and new features.
To contribute code, please follow these steps:

1. Fork the 'as' repository to your own account.
2. Create a new branch from the `main` branch for your changes.
3. Make your changes and commit them to your branch.
4. Push your branch to your fork.
5. Create a pull request from your branch to the develop branch of the 'as' repository.

> **NOTE:** When creating a pull request, please include a clear and concise title and description of your changes, as well 

### Create a transformer

Transformers are located in `src/transformers` folder.
To create a new "call expression" transformer, the created class must implements:

- a constant member `strPattern` which define the call expression to be matched by the transformer
- a `transform` method which implement the transformer itself


## Code Style

Please ensure that your code follows the existing code style used in the project.
We use the [MassaLabs Prettier configuration](https://github.com/massalabs/prettier-config-as) and [MassaLabs ESLint 
You can run the following command to format your code before committing:

```sh
npm run fmt

```

## Tests

Please ensure that your changes include any necessary tests.
We use [as-pect library](https://as-pect.gitbook.io/as-pect/) for unit testing.
You can run the following command to run the tests in the root folder:

```sh
npm run test

```

## License

By contributing to as-transformer, you agree that your contributions will be licensed under the MIT License.

## Documentation

as-transformer provides complete documentation of all available functions and objects.
To generate the documentation for a specific branch, run the following command:

```sh
npm run doc

```

The documentation will be generated in the `docs/documentation/html` directory.
