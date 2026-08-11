import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { uniAppAxiosUnplugin } from "../src/unplugin/index";
import type { TransformResult } from "unplugin";

interface TestPlugin {
	transform?: {
		handler: (code: string, id: string) => TransformResult | null | undefined | Promise<TransformResult | null | undefined>;
	};
	vite?: {
		config?: () => unknown;
	};
}

const originalPlatform = process.env["UNI_PLATFORM"];

afterEach(() => {
	if (originalPlatform === undefined) delete process.env["UNI_PLATFORM"];
	else process.env["UNI_PLATFORM"] = originalPlatform;
});

/** 读取 raw 插件，直接验证跨 Vite/Webpack 共享的转换核心。 */
const createRawPlugin = (): TestPlugin => uniAppAxiosUnplugin.raw(undefined, { framework: "vite" }) as unknown as TestPlugin;

describe("mini-program build plugin", () => {
	it("leaves non-mini-program builds unchanged", async () => {
		process.env["UNI_PLATFORM"] = "h5";
		const plugin = createRawPlugin();
		const result = await plugin.transform?.handler("export default window.FormData;", "/node_modules/form-data/lib/browser.js");

		assert.equal(result, undefined);
		assert.equal(plugin.vite?.config?.(), undefined);
	});

	it("rewrites the form-data browser global only for mini-program builds", async () => {
		process.env["UNI_PLATFORM"] = "mp-weixin";
		const plugin = createRawPlugin();
		const result = await plugin.transform?.handler(
			"module.exports = typeof self == 'object' ? self.FormData : window.FormData;",
			"C:\\project\\node_modules\\form-data\\lib\\browser.js?commonjs-proxy"
		);

		assert.ok(result && typeof result === "object");
		assert.match(result.code, /globalThis\.FormData/u);
		assert.doesNotMatch(result.code, /window\.FormData/u);
	});

	it("replaces Axios platform modules and exposes the Vite optimizeDeps rule", async () => {
		process.env["UNI_PLATFORM"] = "mp-alipay";
		const plugin = createRawPlugin();
		const formDataResult = await plugin.transform?.handler(
			"export default FormData;",
			"/workspace/node_modules/.pnpm/axios@1.8.1/node_modules/axios/lib/platform/browser/classes/FormData.js"
		);
		const blobResult = await plugin.transform?.handler(
			"export default Blob;",
			"/workspace/node_modules/axios/lib/platform/browser/classes/Blob.js?import"
		);

		assert.ok(formDataResult && typeof formDataResult === "object");
		assert.match(formDataResult.code, /from "miniprogram-formdata"/u);
		assert.ok(blobResult && typeof blobResult === "object");
		assert.match(blobResult.code, /from "miniprogram-blob"/u);
		assert.deepEqual(plugin.vite?.config?.(), { optimizeDeps: { exclude: ["axios"] } });
	});
});
