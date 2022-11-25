const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  globals: {
    __DEV__: true,
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.(t|j)s?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(oasis|@ionic/react|@ionic/react-router|@ionic/core|@stencil/core|ionicons|oasis-os-contentful|oasis-os-common)/)',
  ],
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
      branches: 90,
      statements: 90,
    },
  },
};

module.exports = config;
