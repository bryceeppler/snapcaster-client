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
        project: './tsconfig.json'
      }
    },
    plugins: {
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
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
      '@typescript-eslint/no-explicit-any': 'warn'
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
