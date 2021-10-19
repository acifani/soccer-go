module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es6: true,
    jest: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false },
    ],
  },
};
