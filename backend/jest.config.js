module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/backend/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'backend/src/**/*.js',
    '!backend/src/index.js'  // エントリーポイントはテスト対象から外す
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true
};