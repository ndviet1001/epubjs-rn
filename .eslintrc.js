module.exports = {
  extends: [
    '@react-native-community',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:prettier/recommended',
  ],
  globals: {},
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: ['react-hooks'],
  ignorePatterns: ['node_modules/'],
  rules: {
    'react/self-closing-comp': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prefer-const': 'warn',
    'no-undef': 'warn',
    'no-redeclare': 'error',
    'prettier/prettier': 'error',
    'quotes': ['error', 'single', { avoidEscape: true }],
    'no-unused-vars': 'warn',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'padding-line-between-statements': 'error',
    'no-else-return': 'error',
    'jsx-quotes': ['error', 'prefer-single'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'curly': ['error', 'all'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
