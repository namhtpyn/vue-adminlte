module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: '@typescript-eslint/parser'
    },
    plugins: ['@typescript-eslint'],
    extends: ['plugin:vue/essential', 'plugin:vue/strongly-recommended', '@vue/prettier', '@vue/typescript'],
    rules: {
      // 'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'prettier/prettier': ['error', { singleQuote: true, semi: false, printWidth: 130 }],
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none' }]
    }
  }
  