import { defineConfig } from "tsdown";

export default defineConfig([
	{
		// 三个入口与 package.json exports 一一对应，禁止发布清单指向未生成文件。
		entry: {
			index: "src/index.ts",
			vite: "src/vite.ts",
			webpack: "src/webpack.ts",
		},
		// 包管理器产物统一写入仓库根目录的唯一 dist 目录。
		outDir: "dist",
		// 以 src 为构建根，保留 axios、uni-adapter 和 unplugin 的内部模块结构。
		root: "src",
		// 与 Fast.Utils 保持一致，仅发布现代 ESM 包入口。
		format: "esm",
		// 根入口保持平台中立；Node.js API 只会被 vite/webpack 子路径引用。
		platform: "neutral",
		// 以项目声明的最低现代运行时 ES2022 为语法目标。
		target: "es2022",
		// 固定生成 .mjs 和 .d.mts，与 package.json exports 完全一致。
		fixedExtension: true,
		// 保留模块边界，使消费项目可以按实际引用执行 Tree Shaking。
		unbundle: true,
		// 为根入口和两个构建插件入口生成声明，并保留 Axios 模块扩展的副作用 import。
		dts: { sideEffects: true },
		// Source Map 内嵌源码内容，发布包无需额外包含 TypeScript 源文件。
		sourcemap: true,
		// 每次构建前清空根 dist，避免入口删除或改名后残留陈旧产物。
		clean: true,
		// 删除公共入口没有引用的内部代码，减小包管理器产物体积。
		treeshake: true,
		// Node.js 内建模块、Axios Peer 和 unplugin 依赖都由对应消费环境解析。
		deps: {
			neverBundle: [/^node:/, "axios", "unplugin"],
			dts: { neverBundle: [/^node:/, "axios", "unplugin"] },
		},
		// 构建警告视为失败，避免发布存在未解析入口或平台问题的产物。
		failOnWarn: true,
	},
	{
		// CDN 仅包含浏览器可用的根入口，不把 Node.js 构建插件带入脚本产物。
		entry: { "index.global.min": "src/index.ts" },
		// CDN 文件与 ESM 文件共同进入根 dist 发布目录。
		outDir: "dist",
		// 输出可通过普通 script 标签加载的 IIFE。
		format: "iife",
		// 按浏览器运行时处理全局变量，不注入 Node.js 兼容代码。
		platform: "browser",
		// CDN 与 ESM 入口使用同一 ES2022 语法基线。
		target: "es2022",
		// CDN 文件名由 outputOptions 固定，不使用 .mjs 扩展名。
		fixedExtension: false,
		// 类型声明已由 ESM 配置生成，CDN 配置不重复输出。
		dts: false,
		// CDN 入口直接分发，因此单独生成压缩文件。
		minify: true,
		// script 加载后通过 globalThis.FastAxios 访问 SDK 公共 API。
		globalName: "FastAxios",
		// Axios 由页面先行加载，并通过全局 axios 提供给 FastAxios。
		outputOptions: {
			entryFileNames: "index.global.min.js",
			globals: { axios: "axios" },
		},
		// 生成带 sourcesContent 的 Source Map，便于定位 CDN 运行时问题。
		sourcemap: true,
		// dist 已由第一个配置清理，避免删除刚生成的 ESM 产物。
		clean: false,
		// 移除根入口未引用的代码，控制 CDN 文件大小。
		treeshake: true,
		// Axios 保持外部依赖，避免 CDN 同时下载两份 Axios 实现。
		deps: { neverBundle: ["axios"] },
		// CDN 构建警告同样视为失败。
		failOnWarn: true,
	},
]);
