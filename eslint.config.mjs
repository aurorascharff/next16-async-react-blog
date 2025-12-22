import nextConfig from 'eslint-config-next';
import autofix from 'eslint-plugin-autofix';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = [
  {
    ignores: ['**/next-env.d.ts', '.next/**', 'node_modules/**', 'generated/**'],
  },
  ...nextConfig,
  eslintConfigPrettier,
  {
    plugins: {
      autofix,
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      'sort-keys-fix/sort-keys-fix': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
        },
      ],
      'arrow-body-style': ['warn', 'always'],
      'autofix/no-unused-vars': [
        'warn',
        {
          args: 'none',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
          },
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              group: 'parent',
              pattern: '@/**/**',
              position: 'before',
            },
          ],
        },
      ],
      'no-console': 'warn',
      'no-redeclare': 'warn',
      quotes: ['warn', 'single', { avoidEscape: true }],
      'react/display-name': 'error',
      'react/jsx-key': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'spaced-comment': 'warn',
    },
  },
];

export default eslintConfig;
