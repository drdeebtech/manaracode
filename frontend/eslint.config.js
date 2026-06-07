import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

// ESLint 9 flat config. The gate that matters: js.configs.recommended enables
// `no-undef` (which would have caught the stray map-index `i` reference that once
// blanked the page) and react-hooks/rules-of-hooks. CI fails on errors only;
// stylistic items (e.g. exhaustive-deps) are warnings.
export default [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },

  js.configs.recommended,

  // Application + test code (browser).
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules, // no React import needed (Vite JSX runtime)
      ...jsxA11y.flatConfigs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off', // props are documented via JSDoc, not prop-types
      'react/no-unescaped-entities': 'off', // apostrophes/quotes in copy render fine
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  // Node-context config + test files (vitest test globals are imported explicitly).
  {
    files: ['*.config.js', 'src/test/**', '**/*.test.{js,jsx}'],
    languageOptions: { globals: { ...globals.node } },
  },
]
