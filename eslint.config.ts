import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import { fixupConfigRules } from '@eslint/compat';

export default defineConfig([
  {
    ignores: [
      '.react-router/*',
      'build/*',
      'node_modules/*',
      '**/.antlr/*',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  tseslint.configs.recommended,
  ...fixupConfigRules(pluginReact.configs.flat.recommended),
  ...fixupConfigRules(pluginReact.configs.flat['jsx-runtime']),
  stylistic.configs['recommended'],
  {
    rules: {
      'no-empty-pattern': ['error', {
        allowObjectPatternsAsParameters: true,
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_+$',
        varsIgnorePattern: '^_+$',
        caughtErrorsIgnorePattern: '^_+$',
        destructuredArrayIgnorePattern: '^_+$',
      }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_+$',
        varsIgnorePattern: '^_+$',
      }],
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/operator-linebreak': ['error', 'after'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/space-unary-ops': ['error', {
        words: true,
        nonwords: false,
      }],
      '@stylistic/max-len': ['warn', {
        code: 80,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
      '@stylistic/spaced-comment': ['error', 'always', {
        block: {
          exceptions: ['*'],
        },
      }],
    },
  },
]);
