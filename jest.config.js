const config = {
  verbose: true,
  globals: {
    __DEV__: true,
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.(t|j)s?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!oasis)'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    '\\.css': '<rootDir>/__mocks__/styleMock.js',
  },
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/index.ts',
    '<rootDir>/src/app',
    '<rootDir>/src/components/index.tsx',
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageThreshold: {
    global: {
      branches: 75,
      statements: 100,
    },
  },
};

module.exports = config;
