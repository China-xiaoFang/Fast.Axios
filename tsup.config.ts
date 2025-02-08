import { defineConfig } from "tsup";

export default defineConfig([
	{
		// 入口文件
		entry: ["src/index.ts", "src/vite.ts", "src/webpack.ts"],
		// 输出目录
		outDir: "dist",
		// 输出格式
		format: ["cjs", "esm"],
		// 生成类型定义文件
		dts: true,
		// 启用代码拆分
		splitting: true,
		// 生成 source map
		sourcemap: true,
		// 清理输出目录
		clean: true,
		// 压缩输出文件
		minify: false,
		// 去除未使用的代码
		treeshake: true,
		// 构建排除的包
		external: ["axios"],
	},
	{
		entry: ["src/index.ts", "src/vite.ts", "src/webpack.ts"],
		outDir: "dist",
		format: ["cjs", "esm"],
		dts: false,
		splitting: true,
		sourcemap: true,
		clean: true,
		minify: true,
		treeshake: true,
		// 构建排除的包
		external: ["axios"],
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		outExtension({ format }) {
			return {
				js: format === "cjs" ? ".min.cjs" : ".min.js",
			};
		},
	},
]);
