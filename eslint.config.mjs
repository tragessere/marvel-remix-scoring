import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowBoolean: true,
                    allowNumber: true
                }
            ]
        }
    },
    {
        ignores: ['**/*.mjs', '**/*.cjs', '**/coverage/**', '**/dist/**', '**/.yarn/**'],
    },
    reactCompiler.configs.recommended,
    reactRefresh.configs.vite,
    eslintPluginPrettierRecommended
)
