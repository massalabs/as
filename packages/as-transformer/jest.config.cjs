module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  "moduleNameMapper": { // see https://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1482644543
    "^(\\.\\.?\\/.+)\\.jsx?$": "$1"
},
};
  