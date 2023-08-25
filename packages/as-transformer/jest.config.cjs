module.exports = {
  preset: 'ts-jest',
  transform: {
    '<transform_regex>': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.jsx?$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
