import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  // https://thymikee.github.io/jest-preset-angular/docs/guides/angular-13+#usage-with-ionic-6-or-7
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|@stencil/core|.*\\.mjs$))'],
};

export default jestConfig;
