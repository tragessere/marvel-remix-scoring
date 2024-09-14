import { defineConfig, UserConfig } from 'vite'
import { UserConfig as VitestConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
const config: UserConfig & VitestConfig = {
    plugins: [react()],
    test: {
		globals: true
	}
}
export default defineConfig(config)
