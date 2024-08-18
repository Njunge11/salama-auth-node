module.exports = [
  {
    ...require('eslint-config-love'),
    files: ['**/*.js', '**/*.ts'],
    rules: { '@typescript-eslint/explicit-function-return-type': 'off' },
  },
]
