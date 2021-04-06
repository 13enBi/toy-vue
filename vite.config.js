import { defineConfig } from "vite";
import alias from "@rollup/plugin-alias";

export default defineConfig({
    plugins: [alias({ entries: [{ find: "@", replacement: "./src" }] })],

    esbuild: {
        jsxFactory: "__h",
        jsxFragment: "__FRAGMENG",
        jsxInject: 'import { h as __h, FRAGMENG as __FRAGMENG } from "@/render/vnode";',
    },
});
