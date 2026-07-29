import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default defineConfig(
	{
		files: ['**/*.ts?(x)'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			},
			globals: {
				...globals.es2023,
				...globals.node,
				...globals.browser,
				...globals.jest
			}
		},
		extends: [
			eslint.configs.recommended,
			tseslint.configs.strictTypeChecked,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite
		]
	},
	{
		ignores: ['**/*.mjs', '**/*.cjs', '**/coverage/**', '**/dist/**', '**/.yarn/**']
	},
	{
		rules: {
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					allowBoolean: true,
					allowNumber: true
				}
			]
		}
	}
)
