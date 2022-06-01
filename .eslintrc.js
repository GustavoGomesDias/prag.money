module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    JSX: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': 'off',
    'import/extensions': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'max-len': 'off',
    'no-plusplus': 'off',
    'react/require-default-props': 'off',
    'class-methods-use-this': 'off',
    'max-classes-per-file': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    '@typescript-eslint/no-namespace': 'off',
    'no-useless-constructor': 'off',
    'no-restricted-syntax': 'off',
  },
};
