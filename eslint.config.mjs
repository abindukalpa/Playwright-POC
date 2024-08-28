import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'warn',
            'no-undefined': 'warn',
            'unused-imports/no-unused-imports': 'warn',
        },
    },
];
