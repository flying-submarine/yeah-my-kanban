module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-unused-expressions': ['error', { allowShortCircuit: true }], // 允许不被使用的表达式
    'react/prop-types': ['error', { skipUndeclared: true }], // 忽视prop-types
    'react/no-unknown-property': ['error', { ignore: ['css'] }], // React 组件禁止使用未知的 DOM 属性 忽视emotion
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['evt'] }], // 忽略在函数内部修改函数参数
  },
};
