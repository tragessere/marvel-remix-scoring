import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const reactCompilerConfig = {}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler', reactCompilerConfig]]
			}
		})
	]
})
