import type { ConfigEnv, UserConfig } from "vite";
import vitePluginDts from "vite-plugin-dts";
import { globalDependenciesMapping, peerDependencies } from "./vite.build.config";

/** 配置项文档：https://cn.vitejs.dev/config */
const ViteConfig = (_: ConfigEnv): UserConfig => {
	const dependencies = { ...peerDependencies, ...globalDependenciesMapping };
	return {
		build: {
			/** Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效 */
			minify: "terser",
			// 生成 source maps 文件
			sourcemap: true,
			lib: {
				entry: "./src/index.ts",
				name: "@fast-china/axios",
				formats: ["cjs", "es"],
				fileName: (format) => `index.${format}.js`,
			},
			/** 打包清空目录 */
			emptyOutDir: true,
			/** 静态资源打包处理 */
			rollupOptions: {
				// 确保外部化处理那些你不想打包进库的依赖
				external: Object.keys(dependencies),
				// 禁用 Tree-shaking
				treeshake: false,
				output: [
					{
						format: "cjs",
						// 保持模块结构
						preserveModules: true,
						// 将src文件夹作为根目录
						preserveModulesRoot: "src",
						// 解决同时使用默认导出和命名导出的警告
						exports: "named",
						// 保持文件名称不变
						entryFileNames: "[name].js",
						assetFileNames: "[name].[ext]",
						chunkFileNames: "[name].js",
						dir: "./@fast-china/axios/lib",
						globals: dependencies,
					},
					{
						format: "es",
						// 保持模块结构
						preserveModules: true,
						// 将src文件夹作为根目录
						preserveModulesRoot: "src",
						// 保持文件名称不变
						entryFileNames: "[name].mjs",
						assetFileNames: "[name].[ext]",
						chunkFileNames: "[name].mjs",
						dir: "./@fast-china/axios/es",
						globals: dependencies,
					},
				],
			},
		},
		/** Vite 插件 */
		plugins: [
			// 生成ts声明文件
			vitePluginDts({
				compilerOptions: {
					// 保留注释
					removeComments: false,
					declarationMap: false,
				},
				entryRoot: "./src",
				outDir: ["./@fast-china/axios/es", "./@fast-china/axios/lib"],
				insertTypesEntry: true,
				include: ["./src/**/*"],
			}),
		],
	};
};

export default ViteConfig;
