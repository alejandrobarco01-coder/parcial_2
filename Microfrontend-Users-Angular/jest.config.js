module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  coverageReporters: ["html", "json", "lcov", "text", "clover"],
  
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
  ],

  verbose: true,
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/app.ts',
    '!src/app/app.config.ts',
    '!src/app/app.routes.ts',
    '!src/app/interfaces/**',
    '!src/app/mocks/**',
  ],
  coverageThreshold: {
    global: { branches: 90, functions: 90, lines: 90, statements: 90 },
  },
  clearMocks: true,
  testMatch: ["**/*.spec.ts"],
  rootDir: './'
};
