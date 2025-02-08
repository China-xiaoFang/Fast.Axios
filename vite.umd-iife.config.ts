import terser from "@rollup/plugin-terser";
import type { ConfigEnv, UserConfig } from "vite";
import { peerDependencies } from "./vite.build.config";

/** 配置项文档：https://cn.vitejs.dev/config */
const ViteConfig = (_: ConfigEnv): UserConfig => {
	return {
		build: {
			minify: false,
			// 生成 source maps 文件
			sourcemap: true,
			lib: {
				entry: "./src/index.ts",
				name: "@fast-china/axios",
				formats: ["iife"],
				fileName: (format) => `index.${format}.js`,
			},
			/** 打包清空目录 */
			emptyOutDir: true,
			/** 静态资源打包处理 */
			rollupOptions: {
				// 确保外部化处理那些你不想打包进库的依赖
				external: Object.keys(peerDependencies),
				// 禁用 Tree-shaking
				treeshake: false,
				output: [
					{
						format: "iife",
						// 名称
						name: "FastAxios",
						// 解决同时使用默认导出和命名导出的警告
						exports: "named",
						// 保持文件名称不变
						entryFileNames: "[name].global.js",
						assetFileNames: "[name].[ext]",
						chunkFileNames: "[name].global.js",
						dir: "./@fast-china/axios/dist",
						globals: peerDependencies,
					},
					{
						format: "iife",
						// 名称
						name: "FastAxios",
						// 解决同时使用默认导出和命名导出的警告
						exports: "named",
						// 保持文件名称不变
						entryFileNames: "[name].global.min.js",
						assetFileNames: "[name].[ext]",
						chunkFileNames: "[name].global.min.js",
						dir: "./@fast-china/axios/dist",
						globals: peerDependencies,
						plugins: [terser()],
					},
				],
			},
		},
	};
};

export default ViteConfig;
