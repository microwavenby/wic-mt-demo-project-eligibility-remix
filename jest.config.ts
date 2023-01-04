import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  // [...]
  moduleNameMapper: {
    "^app/(.*)$": "<rootDir>/app/$1",
    "^tests/(.*)$": "<rootDir>/tests/$1",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
};

export default jestConfig;
