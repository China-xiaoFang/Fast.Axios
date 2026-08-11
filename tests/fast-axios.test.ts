import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AxiosHeaders } from "axios";
import { createFastAxios, useFastAxios } from "../src/axios/fastAxios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

describe("FastAxios configuration container", () => {
	it("keeps isolated instances outside the global singleton", () => {
		assert.throws(() => useFastAxios(), /createFastAxios/u);

		const isolated = createFastAxios(
			{
				baseUrl: "https://isolated.example.com",
				headers: { Authorization: "Bearer isolated" },
				requestCipher: false,
				timeout: 0,
			},
			true
		);

		assert.equal(isolated.baseUrl, "https://isolated.example.com");
		assert.equal(isolated.timeout, 0);
		assert.equal(isolated.requestCipher, false);
		assert.equal(isolated.headers["Authorization"], "Bearer isolated");
		assert.throws(() => useFastAxios(), /createFastAxios/u);
	});

	it("merges singleton options without replacing registered handlers", () => {
		const fastAxios = createFastAxios({ baseUrl: "https://api.example.com", headers: { A: "1" } });
		const messages: string[] = [];
		fastAxios.message.error.use((message) => messages.push(message));

		const updated = createFastAxios({ baseUrl: "", headers: { B: "2" }, requestCipher: false, timeout: 15_000 });
		updated.message.error("failed");

		assert.equal(updated, fastAxios);
		assert.equal(useFastAxios(), fastAxios);
		assert.equal(updated.baseUrl, "");
		assert.equal(updated.timeout, 15_000);
		assert.equal(updated.requestCipher, false);
		assert.deepEqual(updated.headers, { A: "1", B: "2" });
		assert.deepEqual(messages, ["failed"]);
	});

	it("replaces project handlers and preserves falsy cache values", () => {
		const fastAxios = createFastAxios(undefined, true);
		const loadingEvents: string[] = [];
		fastAxios.loading.show.use((text) => loadingEvents.push(`show:${text}`));
		fastAxios.loading.close.use(() => loadingEvents.push("close"));

		fastAxios.loading.show("Loading");
		fastAxios.loading.close({});
		assert.deepEqual(loadingEvents, ["show:Loading", "close"]);

		fastAxios.cache.set("false", false);
		fastAxios.cache.set("zero", 0);
		fastAxios.cache.set("empty", "");
		assert.equal(fastAxios.cache.get("false"), false);
		assert.equal(fastAxios.cache.get("zero"), 0);
		assert.equal(fastAxios.cache.get("empty"), "");
		assert.equal(fastAxios.cache.get("missing"), null);
	});

	it("keeps the default crypto handlers as explicit no-op boundaries", () => {
		const fastAxios = createFastAxios(undefined, true);
		const config = {
			headers: new AxiosHeaders(),
			method: "get",
			url: "/users",
		} as InternalAxiosRequestConfig;
		const response = {
			config,
			data: { code: 200, data: { id: 1 } },
			headers: new AxiosHeaders(),
			status: 200,
			statusText: "OK",
		} satisfies AxiosResponse;

		assert.doesNotThrow(() => fastAxios.crypto.encrypt(config, Date.now()));
		assert.equal(fastAxios.crypto.decrypt(response, { requestType: "query" }), response.data);
	});

	it("supports single and batch error-code registration", () => {
		const fastAxios = createFastAxios(undefined, true);
		assert.equal(fastAxios.addErrorCode(40101, "登录失效"), fastAxios);
		assert.equal(fastAxios.addErrorCode({ 40102: "账号停用", CUSTOM: "自定义错误" }), fastAxios);
		assert.equal(fastAxios.errorCode[40101], "登录失效");
		assert.equal(fastAxios.errorCode[40102], "账号停用");
		assert.equal(fastAxios.errorCode["CUSTOM"], "自定义错误");
		assert.throws(() => Reflect.apply(fastAxios.addErrorCode.bind(fastAxios), fastAxios, [40103]), TypeError);
	});
});
