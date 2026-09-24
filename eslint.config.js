import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/**'],
    },

    eslint.configs.recommended,

    ...tseslint.configs.recommended,

    {
        plugins: {
            unicorn,
        },
        linterOptions: {
            noInlineConfig: true,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },

    unicorn.configs.recommended,

    prettier,
);