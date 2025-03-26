import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginEslintComments from 'eslint-plugin-eslint-comments';
import prettierConfig from './.prettierrc.js';

export default [
  {
    ignores: [
      'node_modules/**',
      '.turbo/**',
      'packages/*/dist/**',
      'packages/*/.turbo/**',
      'packages/cli/src/**/*.js',
      'dist/**',
      '**/*.d.ts',
      'coverage/**',
      'build/**',
      '.next/**',
      '.vercel/**',
      '*.log',
      '*.tsbuildinfo',
      'packages/cli/templates/**',
      'examples/**',
      'docs/**',
    ],
  },
  // Configuration for JS config files (no TypeScript checking)
  {
    files: ['*.config.js', '.*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': ['error', prettierConfig],
    },
  },
  // Base configuration for all TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
      'unused-imports': eslintPluginUnusedImports,
      'eslint-comments': eslintPluginEslintComments,
    },
    rules: {
      // Base ESLint rules
      'no-console': 'off', // Allow console for CLI applications
      'no-unused-vars': 'off', // TypeScript handles this
      'no-use-before-define': 'off', // TypeScript handles this better

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'off', // Using unused-imports instead
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Prettier integration
      'prettier/prettier': ['error', prettierConfig],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
];
