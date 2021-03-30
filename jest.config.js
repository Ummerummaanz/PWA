const config = {
  verbose: true,
  globals: {
    __DEV__: true,
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.(t|j)s?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    '\\.css': '<rootDir>/__mocks__/styleMock.js',
  },
};

module.exports = config;
