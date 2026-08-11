import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import vm from "node:vm";
import axios from "axios";

const workspaceRoot = path.resolve(import.meta.dirname, "..");
const distRoot = path.join(workspaceRoot, "dist");
const packageJsonPath = path.join(workspaceRoot, "package.json");
const publicExportKeys = [".", "./vite", "./webpack"];

/** 读取根 package.json，并拒绝数组、null 等无效清单结构。 */
const readPackageManifest = () => {
	const value = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TypeError("package.json must contain an object.");
	return value;
};

/** 把包内相对路径限制在当前工作区，避免测试误访问仓库外文件。 */
const resolveWorkspacePath = (relativePath) => {
	const absolutePath = path.resolve(workspaceRoot, ...relativePath.split("/"));
	if (absolutePath !== workspaceRoot && !absolutePath.startsWith(`${workspaceRoot}${path.sep}`)) {
		throw new Error(`Path escapes the workspace: ${relativePath}`);
	}
	return absolutePath;
};

const run = (command, arguments_) => {
	const result = spawnSync(command, arguments_, { cwd: workspaceRoot, encoding: "utf8" });
	if (result.error !== undefined) throw result.error;
	if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Command failed: ${command} (${result.signal ?? result.status})`);
	return result.stdout;
};

const collectFiles = (directory) => {
	const result = [];
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory()) result.push(...collectFiles(absolutePath));
		else if (entry.isFile()) result.push(absolutePath);
	}
	return result;
};

/** 验证每个公开入口、类型声明和 CDN 文件都由本次构建真实生成。 */
const verifyBuildArtifacts = () => {
	assert.ok(fs.existsSync(distRoot) && fs.statSync(distRoot).isDirectory(), "tsdown did not create dist/.");
	const manifest = readPackageManifest();
	const exportsMap = manifest["exports"];
	assert.ok(exportsMap !== null && typeof exportsMap === "object" && !Array.isArray(exportsMap));
	assert.deepEqual(Object.keys(exportsMap), publicExportKeys);

	const sourceRoot = path.join(workspaceRoot, "src");
	const sourceModulePaths = collectFiles(sourceRoot)
		.filter((filePath) => filePath.endsWith(".ts"))
		.map((filePath) => path.relative(sourceRoot, filePath).replaceAll(path.sep, "/").replace(/\.ts$/u, ""))
		.sort();
	const artifacts = collectFiles(distRoot)
		.map((filePath) => path.relative(workspaceRoot, filePath).replaceAll(path.sep, "/"))
		.sort();

	for (const required of [
		"dist/index.mjs",
		"dist/index.d.mts",
		"dist/vite.mjs",
		"dist/vite.d.mts",
		"dist/webpack.mjs",
		"dist/webpack.d.mts",
		"dist/index.global.min.js",
		"dist/index.global.min.js.map",
	]) {
		assert.ok(artifacts.includes(required), `required artifact is missing: ${required}`);
	}

	for (const artifact of artifacts) {
		if (/^dist\/index\.global\.min\.js(?:\.map)?$/u.test(artifact)) continue;
		assert.match(artifact, /\.(?:d\.mts|mjs|mjs\.map)$/u, `unexpected build artifact: ${artifact}`);
		const sourcePath = artifact.replace(/^dist\//u, "").replace(/\.(?:d\.mts|mjs)(?:\.map)?$/u, "");
		assert.ok(sourceModulePaths.includes(sourcePath), `stale build artifact has no source module: ${artifact}`);
	}
};

/** 验证发布模块中的相对 import 全部指向 dist 内的真实文件。 */
const verifyRelativeImports = () => {
	const importPattern = /(?:\bfrom\s*["']|\bimport\s*\(\s*["'])(\.{1,2}\/[^"']+)["']/gu;
	for (const absolutePath of collectFiles(distRoot)) {
		if (!/\.(?:d\.mts|mjs)$/u.test(absolutePath)) continue;
		const source = fs.readFileSync(absolutePath, "utf8");
		// 构建会保留 TSDoc 示例；先移除注释，避免把示例中的源码路径误判为发布 import。
		const executableSource = source.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/^\s*\/\/.*$/gmu, "");
		for (const match of executableSource.matchAll(importPattern)) {
			const specifier = match[1];
			if (specifier === undefined) continue;
			const dependency = path.resolve(path.dirname(absolutePath), specifier);
			// 声明中的 .mjs specifier 会由 TypeScript 对应解析到同名 .d.mts，不要求存在空运行时模块。
			const declarationDependency =
				absolutePath.endsWith(".d.mts") && dependency.endsWith(".mjs") ? dependency.replace(/\.mjs$/u, ".d.mts") : dependency;
			if (
				!declarationDependency.startsWith(`${distRoot}${path.sep}`) ||
				!fs.existsSync(declarationDependency) ||
				!fs.statSync(declarationDependency).isFile()
			) {
				throw new Error(`${path.relative(workspaceRoot, absolutePath)} imports missing file ${specifier}.`);
			}
		}
	}
};

/** Source Map 必须内嵌源码，避免 npm 包依赖未发布的 src 目录。 */
const verifySourceMaps = () => {
	for (const absolutePath of collectFiles(distRoot)) {
		if (!absolutePath.endsWith(".map")) continue;
		assert.ok(!absolutePath.endsWith(".d.mts.map"), `unexpected declaration map: ${path.relative(workspaceRoot, absolutePath)}`);
		const sourceMap = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
		assert.ok(sourceMap !== null && typeof sourceMap === "object" && !Array.isArray(sourceMap));
		assert.ok(Array.isArray(sourceMap.sources) && sourceMap.sources.length > 0);
		assert.equal(sourceMap.sources.length, sourceMap.sourcesContent?.length);
		assert.ok(sourceMap.sourcesContent.every((source) => typeof source === "string" && source.length > 0));
	}
};

/** 验证 IIFE 依赖页面提供 axios，并把根入口公开为 FastAxios。 */
const verifyCdnBundle = () => {
	const source = fs.readFileSync(path.join(distRoot, "index.global.min.js"), "utf8");
	assert.throws(() => vm.runInNewContext(source, {}), /axios is not defined/u);
	const context = {
		AbortController,
		Blob,
		FormData,
		URL,
		URLSearchParams,
		axios,
		clearTimeout,
		console,
		setTimeout,
	};
	vm.runInNewContext(source, context);
	assert.equal(typeof context.FastAxios.createFastAxios, "function");
	assert.equal(typeof context.FastAxios.createUniAppAxiosAdapter, "function");
	assert.equal(typeof context.FastAxios.axiosUtil.request, "function");
	const isolated = context.FastAxios.createFastAxios({ requestCipher: false }, true);
	assert.equal(isolated.requestCipher, false);
};

/** 验证发布声明和 JavaScript 能通过包名及两个子路径被真实消费者加载。 */
const verifyConsumerImports = () => {
	const runtimeConsumer = path.join(workspaceRoot, "__package-consumer__.mjs");
	const typeConsumer = path.join(workspaceRoot, "__package-consumer__.mts");
	for (const fixture of [runtimeConsumer, typeConsumer]) {
		if (fs.existsSync(fixture)) throw new Error(`Refusing to overwrite existing fixture: ${fixture}`);
	}

	try {
		fs.writeFileSync(
			runtimeConsumer,
			[
				'import axios from "axios";',
				'import { createFastAxios, createUniAppAxiosAdapter } from "@fast-china/axios";',
				'import vitePlugin from "@fast-china/axios/vite";',
				'import webpackPlugin from "@fast-china/axios/webpack";',
				'if (typeof vitePlugin !== "function" || typeof webpackPlugin !== "function") throw new Error("Build plugin entry failed.");',
				"const isolated = createFastAxios({ requestCipher: false }, true);",
				'if (isolated.requestCipher !== false) throw new Error("Root runtime entry failed.");',
				"axios.create({ adapter: createUniAppAxiosAdapter() });",
				'if (typeof axios.Axios.prototype.upload !== "function") throw new Error("Axios upload augmentation failed.");',
				'if (typeof axios.Axios.prototype.download !== "function") throw new Error("Axios download augmentation failed.");',
			].join("\n"),
			"utf8"
		);
		fs.writeFileSync(
			typeConsumer,
			[
				'import axios from "axios";',
				'import { axiosUtil, createFastAxios, createUniAppAxiosAdapter, type FastAxiosRequestConfig } from "@fast-china/axios";',
				'import vitePlugin from "@fast-china/axios/vite";',
				'import webpackPlugin from "@fast-china/axios/webpack";',
				'const config: FastAxiosRequestConfig = { url: "/users", requestType: "query" };',
				"const result: Promise<string> = axiosUtil.request<string>(config);",
				"const instance = axios.create({ adapter: createUniAppAxiosAdapter() });",
				'const upload = instance.upload("/upload", {}, { filePath: "/tmp/a", name: "file" });',
				'const download = instance.download("/download");',
				"void createFastAxios; void vitePlugin; void webpackPlugin; void result; void upload; void download;",
			].join("\n"),
			"utf8"
		);

		run(process.execPath, [runtimeConsumer]);
		const typeScriptPath = path.join(workspaceRoot, "node_modules", "typescript", "bin", "tsc");
		run(process.execPath, [
			typeScriptPath,
			"--ignoreConfig",
			"--module",
			"NodeNext",
			"--moduleResolution",
			"NodeNext",
			"--target",
			"ES2022",
			"--strict",
			"--noEmit",
			"--skipLibCheck",
			"false",
			typeConsumer,
		]);
	} finally {
		for (const fixture of [runtimeConsumer, typeConsumer]) {
			if (fs.existsSync(fixture)) fs.unlinkSync(fixture);
		}
	}
};

/** 检查 npm dry-run 文件列表，防止测试、源码或旧的嵌套发布目录进入归档。 */
const verifyPackArchive = () => {
	const npmArguments = ["pack", "--dry-run", "--ignore-scripts", "--json"];
	const npmCliPath = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
	const npmCommand = process.platform === "win32" ? process.execPath : "npm";
	const npmCommandArguments = process.platform === "win32" ? [npmCliPath, ...npmArguments] : npmArguments;
	if (process.platform === "win32" && !fs.existsSync(npmCliPath)) throw new Error(`npm CLI was not found next to Node.js: ${npmCliPath}`);
	const npmResult = spawnSync(npmCommand, npmCommandArguments, {
		cwd: workspaceRoot,
		encoding: "utf8",
		env: { ...process.env, npm_config_cache: path.join(os.tmpdir(), "fast-axios-npm-cache") },
	});
	if (npmResult.error !== undefined) throw npmResult.error;
	if (npmResult.status !== 0)
		throw new Error(npmResult.stderr || npmResult.stdout || `npm pack --dry-run failed (${npmResult.signal ?? npmResult.status}).`);

	const packReport = JSON.parse(npmResult.stdout);
	assert.ok(Array.isArray(packReport) && packReport.length === 1);
	const packedFiles = packReport[0].files?.map((file) => file.path ?? "") ?? [];
	for (const required of [
		"dist/index.mjs",
		"dist/index.d.mts",
		"dist/vite.mjs",
		"dist/webpack.mjs",
		"dist/index.global.min.js",
		"Fast.png",
		"README.md",
		"README.zh.md",
		"docs/API.md",
		"src/uni-adapter/README.md",
		"src/uni-adapter/README.zh.md",
	]) {
		assert.ok(packedFiles.includes(required), `packed archive is missing: ${required}`);
	}
	const allowedSourceFiles = new Set(["src/uni-adapter/README.md", "src/uni-adapter/README.zh.md"]);
	assert.ok(
		packedFiles.every((file) => !file.startsWith("src/") || allowedSourceFiles.has(file)),
		"TypeScript source leaked into the npm archive."
	);
	assert.ok(
		packedFiles.every((file) => !/^(?:@fast-china|tests)\//u.test(file)),
		"Private package or test files leaked into the npm archive."
	);
};

test("published package contract", () => {
	verifyBuildArtifacts();
	verifyRelativeImports();
	verifySourceMaps();
	verifyCdnBundle();
	verifyConsumerImports();

	const manifest = readPackageManifest();
	assert.equal(manifest["main"], "./dist/index.mjs");
	assert.equal(manifest["module"], manifest["main"]);
	assert.equal(manifest["unpkg"], "./dist/index.global.min.js");
	assert.equal(manifest["jsdelivr"], manifest["unpkg"]);
	assert.equal(manifest["sideEffects"], false);
	assert.equal(manifest["peerDependencies"]?.["axios"], "^1.8.1");
	assert.equal(manifest["peerDependenciesMeta"]?.["miniprogram-blob"]?.["optional"], true);
	assert.equal(manifest["peerDependenciesMeta"]?.["miniprogram-formdata"]?.["optional"], true);
	assert.ok(manifest["files"].includes("dist"));
	assert.ok(!manifest["files"].includes("src"));

	for (const value of Object.values(manifest["exports"])) {
		assert.ok(value !== null && typeof value === "object" && !Array.isArray(value));
		for (const target of Object.values(value)) {
			assert.equal(typeof target, "string");
			assert.ok(fs.existsSync(resolveWorkspacePath(target.slice(2))), `export target does not exist: ${target}`);
		}
	}

	verifyPackArchive();
});
