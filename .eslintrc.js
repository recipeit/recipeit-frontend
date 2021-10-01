module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-v-html': 0,
    'vue/require-default-prop': 0,
    'prettier/prettier': [
        'error',
        {
          'singleQuote': true,
          'semi': false,
          'printWidth': 140
        }
    ],
  },
  globals: {
    __BUILD_VERSION__: true
  }
}
