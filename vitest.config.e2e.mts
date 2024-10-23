import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [tsConfigPaths(), swc.vite({ module: { type: 'es6' } })],
	test: {
		include: ['**/*.e2e-spec.ts'],
		globals: true,
		root: './',
	},
})
