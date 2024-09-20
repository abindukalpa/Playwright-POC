import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    { files: ['**/*.{js,ts}'] },
    { ignores: ['playwright-report/*'] },
    { languageOptions: { globals: globals.node } },
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-undef': 'warn',
            'no-undefined': 'warn',
            'unused-imports/no-unused-imports': 'warn',
        },
    },
];
