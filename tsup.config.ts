import { defineConfig } from "tsup";

export default defineConfig([
	{
		// 入口文件
		entry: ["src/vite.ts", "src/webpack.ts"],
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
		globalName: "FastAxios",
		// 入口文件
		entry: ["src/index.ts"],
		// 输出目录
		outDir: "dist",
		// 输出格式
		format: ["iife", "cjs", "esm"],
		// 生成类型定义文件
		dts: true,
		// 启用代码拆分
		splitting: true,
		// 生成 source map
		sourcemap: true,
		// 清理输出目录
		clean: false,
		// 压缩输出文件
		minify: false,
		// 去除未使用的代码
		treeshake: true,
		// 构建排除的包
		external: ["axios"],
	},
	{
		globalName: "FastAxios",
		entry: ["src/index.ts"],
		outDir: "dist",
		format: ["iife", "cjs", "esm"],
		dts: false,
		splitting: true,
		sourcemap: true,
		clean: false,
		minify: true,
		treeshake: true,
		// 构建排除的包
		external: ["axios"],
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		outExtension({ format }) {
			let ext;
			switch (format) {
				case "cjs":
					ext = ".min.cjs";
					break;
				case "iife":
					ext = ".global.min.js";
					break;
				default:
					ext = ".min.js";
			}
			return { js: ext };
		},
	},
]);
