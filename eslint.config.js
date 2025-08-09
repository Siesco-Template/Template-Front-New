import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

import globals from 'globals';

import js from '@eslint/js';

export default [
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', disallowTypeAnnotations: false },
            ],
            '@typescript-eslint/ban-ts-comment': 'warn',
        },
    },
];
