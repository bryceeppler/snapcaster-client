import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'build/**',
      'dist/**',
      'out/**',
      'public/**',
      '**/*.d.ts'
    ]
  },
  // Apply typescript-eslint recommended rules and parser to TypeScript files
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      '@next/next': nextPlugin
    },
    rules: {
      // Unused imports/variables
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-unused-vars': 'off',

      // TypeScript specific
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true }
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' }
      ],
      '@typescript-eslint/no-unnecessary-condition': 'warn',

      // Import organization
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          pathGroups: [
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],

      // Next.js specific
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-unwanted-polyfillio': 'warn'
    }
  },
  // Configuration files override - allow require() imports
  {
    files: ['*.config.js', '*.config.cjs', 'postcss.config.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
];
