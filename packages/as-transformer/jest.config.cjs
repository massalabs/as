module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.jsx?$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '<transform_regex>': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
