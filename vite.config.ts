import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react({ compiler: true })],
	build: {
		rolldownOptions: {
			experimental: {
				lazyBarrel: true
			}
		}
	},
	base: '/marvel-remix-scoring'
})
