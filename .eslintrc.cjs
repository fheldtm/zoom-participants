/* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution');
module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-eval': 'error',
    'no-var': 'error',
    'block-spacing': 'error',
    'arrow-spacing': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'brace-style': 'error',
    'comma-dangle': ['error', 'never'],
    'comma-spacing': 'error',
    'dot-location': ['error', 'property'],
    'key-spacing': 'error',
    'no-multi-spaces': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'object-curly-spacing': ['error', 'always'],
    'wrap-regex': 'error',
    'template-curly-spacing': ['error', 'never']
  }
};
