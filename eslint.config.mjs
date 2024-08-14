import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'unused-imports/no-unused-imports': 'error',
        },
    },
]
