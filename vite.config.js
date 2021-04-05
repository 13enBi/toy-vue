import { defineConfig } from 'vite';
import alias from '@rollup/plugin-alias';

export default defineConfig({
	plugins: [alias({ entries: [{ find: '@', replacement: './src' }] })],

	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'FRAGMENG',
		jsxInject: 'import {h,FRAGMENG} from "@/render/vnode";',
	},
});
