import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals', // eslint-config-next
      'next/typescript', // eslint-config-next
      'plugin:tailwindcss/recommended', // eslint-plugin-tailwindcss
      'plugin:import/recommended', // eslint-plugin-import
      'prettier' // eslint-config-prettier
    ]
  }),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
            'object',
            'type'
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          pathGroups: [
            { pattern: '@/lib/**', group: 'internal', position: 'before' },
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'before'
            },
            { pattern: '@/types/**', group: 'index', position: 'before' }
          ],
          alphabetize: {
            order: 'asc'
          },
          'newlines-between': 'always'
        }
      ]
    }
  },
  {
    files: ['**/components/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function', // アロー関数で定義されていることを要求
          unnamedComponents: 'arrow-function'
        }
      ]
    }
  }
];

export default eslintConfig;
