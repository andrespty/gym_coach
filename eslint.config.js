import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', 'supabase/functions/**'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Features may only be imported through their public index.ts.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message: 'Import from the feature index (e.g. "@/features/log"), not its internals.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/core/**/*.ts', 'evals/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
);
