export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['./tests/setup.js'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['*.js', 'controllers/**/*.js', 'services/**/*.js', 'utils/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/logs/'],
};
