import { defineConfig } from 'vite';
import path from 'path';
import alias from '@rollup/plugin-alias';

export default defineConfig({
	plugins: [alias({ entries: [{ find: '@', replacement: './src' }] })],

	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
		jsxInject: 'import {h} from "@/render/vnode";',
	},
});
