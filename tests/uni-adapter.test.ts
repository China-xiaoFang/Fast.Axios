/// <reference types="@dcloudio/types" />

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import axios, { AxiosError } from "axios";
import { createUniAppAxiosAdapter } from "../src/uni-adapter/index";

const originalUni = Object.getOwnPropertyDescriptor(globalThis, "uni");

/** 安装单个测试使用的 uni mock，避免真实网络请求和平台依赖。 */
const installUni = (value: UniNamespace.Uni): void => {
	Object.defineProperty(globalThis, "uni", { configurable: true, value, writable: true });
};

/** 恢复 Node.js 原始全局状态，防止一个 adapter 用例污染后续用例。 */
afterEach(() => {
	if (originalUni) Object.defineProperty(globalThis, "uni", originalUni);
	else Reflect.deleteProperty(globalThis, "uni");
});

describe("uni-app Axios adapter", () => {
	it("routes request, upload, and download methods to their matching uni APIs", async () => {
		const calls: { download?: Record<string, unknown>; request?: Record<string, unknown>; upload?: Record<string, unknown> } = {};
		const requestTask = {
			abort() {
				return;
			},
			onHeadersReceived() {
				return;
			},
		} as unknown as UniNamespace.RequestTask;
		const uploadTask = {
			abort() {
				return;
			},
			onHeadersReceived() {
				return;
			},
			onProgressUpdate() {
				return;
			},
		} as unknown as UniNamespace.UploadTask;
		const downloadTask = {
			abort() {
				return;
			},
			onHeadersReceived() {
				return;
			},
			onProgressUpdate() {
				return;
			},
		} as unknown as UniNamespace.DownloadTask;

		installUni({
			request(options: UniNamespace.RequestOptions): UniNamespace.RequestTask {
				calls.request = options as unknown as Record<string, unknown>;
				queueMicrotask(() => {
					options.success?.({
						cookies: ["sid=1"],
						data: { code: 200, data: { id: 1 } },
						errMsg: "request:ok",
						header: { X: "1" },
						statusCode: 200,
					});
					options.complete?.({ errMsg: "request:ok" });
				});
				return requestTask;
			},
			uploadFile(options: UniNamespace.UploadFileOption): UniNamespace.UploadTask {
				calls.upload = options as unknown as Record<string, unknown>;
				queueMicrotask(() => {
					options.success?.({ data: '{"code":200,"data":"file-id"}', errMsg: "uploadFile:ok", header: {}, statusCode: 200 });
					options.complete?.({ errMsg: "uploadFile:ok" });
				});
				return uploadTask;
			},
			downloadFile(options: UniNamespace.DownloadFileOption): UniNamespace.DownloadTask {
				calls.download = options as unknown as Record<string, unknown>;
				queueMicrotask(() => {
					options.success?.({ errMsg: "downloadFile:ok", statusCode: 200, tempFilePath: "/tmp/report.xlsx" });
					options.complete?.({ errMsg: "downloadFile:ok" });
				});
				return downloadTask;
			},
		} as unknown as UniNamespace.Uni);

		const http = axios.create({ adapter: createUniAppAxiosAdapter(), baseURL: "https://api.example.com" });
		const requestResponse = await http.get("/users", { params: { page: 1 } });
		const uploadResponse = await http.upload<{ code: number; data: string }>(
			"/files/avatar",
			{ category: "avatar" },
			{ filePath: "/tmp/avatar.png", name: "file" }
		);
		const downloadResponse = await http.download<string>("/files/report");

		assert.deepEqual(requestResponse.data, { code: 200, data: { id: 1 } });
		assert.deepEqual(requestResponse.cookies, ["sid=1"]);
		assert.equal(uploadResponse.data.data, "file-id");
		assert.equal(downloadResponse.data, "/tmp/report.xlsx");
		assert.equal(calls.request?.["method"], "GET");
		assert.equal(calls.request?.["url"], "https://api.example.com/users?page=1");
		assert.equal(calls.upload?.["method"], "POST");
		assert.deepEqual(calls.upload?.["formData"], { category: "avatar" });
		assert.equal(calls.download?.["method"], "GET");
	});

	it("rejects uni success callbacks that fail Axios validateStatus", async () => {
		const task = {
			abort() {
				return;
			},
			onHeadersReceived() {
				return;
			},
		} as unknown as UniNamespace.RequestTask;
		installUni({
			request(options: UniNamespace.RequestOptions): UniNamespace.RequestTask {
				queueMicrotask(() => {
					options.success?.({ cookies: [], data: "failed", errMsg: "request:ok", header: {}, statusCode: 503 });
					options.complete?.({ errMsg: "request:ok" });
				});
				return task;
			},
		} as unknown as UniNamespace.Uni);

		const http = axios.create({ adapter: createUniAppAxiosAdapter() });
		await assert.rejects(http.get("https://api.example.com/unavailable"), (error: unknown) => {
			assert.ok(error instanceof AxiosError);
			assert.equal(error.code, AxiosError.ERR_BAD_RESPONSE);
			assert.equal(error.response?.status, 503);
			return true;
		});
	});

	it("aborts the active uni task through AbortSignal", async () => {
		let aborted = false;
		const task = {
			abort() {
				aborted = true;
			},
			onHeadersReceived() {
				return;
			},
		} as unknown as UniNamespace.RequestTask;
		installUni({
			request(): UniNamespace.RequestTask {
				return task;
			},
		} as unknown as UniNamespace.Uni);

		const controller = new AbortController();
		const http = axios.create({ adapter: createUniAppAxiosAdapter() });
		const pending = http.get("https://api.example.com/slow", { signal: controller.signal });
		controller.abort();

		await assert.rejects(pending, (error: unknown) => axios.isCancel(error));
		assert.equal(aborted, true);
	});
});
