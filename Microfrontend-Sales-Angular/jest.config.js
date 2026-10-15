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
  clearMocks: true,
  testMatch: ["**/*.spec.ts"],
  coverageThreshold: {
    global: { branches: 90, functions: 90, lines: 90, statements: 90 }
  },
  rootDir: './'
};
