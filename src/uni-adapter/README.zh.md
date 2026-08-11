# Axios uni-app 适配器

[English](./README.md)

`createUniAppAxiosAdapter()` 将 Axios 请求分发到 uni-app 网络 API：

- 标准 HTTP 方法使用 `uni.request`。
- `method: "upload"` 使用 `uni.uploadFile`。
- `method: "download"` 使用 `uni.downloadFile`。

Axios 请求与响应拦截器、`validateStatus`、取消请求、参数序列化和响应转换仍然有效。
首次调用 `createUniAppAxiosAdapter()` 时，会在当前 Axios 包使用的原型上安装一次 `upload()` 和 `download()`。

## 创建 Axios 实例

```ts
import axios from "axios";
import { createUniAppAxiosAdapter } from "@fast-china/axios";

export const http = axios.create({
	adapter: createUniAppAxiosAdapter(),
	baseURL: "https://api.example.com",
	timeout: 30_000,
});
```

只应在存在全局 `uni` 对象的 uni-app 运行环境中创建适配器。普通请求继续使用 Axios 原有 API：

```ts
const response = await http.get<{ id: number; name: string }>("/users/1", {
	params: { locale: "zh-CN" },
	sslVerify: true,
});
```

## 上传文件

常规场景使用 `upload(url, data, config)`。该便捷方法固定写入 `method: "upload"` 并分流到 `uni.uploadFile`。Axios 请求 `data` 会转换为 `uni.uploadFile` 的 `formData`；显式设置 `formData` 时，其优先级高于 `data`。

```ts
const response = await http.upload<{ fileId: string }>(
	"/files",
	{ category: "avatar" },
	{
		filePath: tempFilePath,
		name: "file",
		onUploadProgress(event) {
			console.log(event.progress);
		},
	}
);
```

需要通过单个配置对象构造请求时，可直接使用 adapter 的上传方法标记：

```ts
const response = await http.request<{ fileId: string }>({
	url: "/files",
	method: "upload",
	filePath: tempFilePath,
	name: "file",
});
```

## 下载文件

下载成功后，`response.data` 是 `uni.downloadFile` 返回的临时文件路径。

```ts
const response = await http.download<string>("/files/report.pdf", {
	onDownloadProgress(event) {
		console.log(event.progress);
	},
});

console.log(response.data);
```

## 取消请求

```ts
const controller = new AbortController();
const request = http.get("/slow-api", { signal: controller.signal });

controller.abort();
await request;
```

适配器同时支持 Axios 已弃用的 `CancelToken` API。

## 行为与平台差异

- Axios 根据 `baseURL`、`params`、`paramsSerializer` 和 `allowAbsoluteUrls` 生成最终 URL。
- `responseType: "arraybuffer"` 会传给 `uni.request`；其他 Axios 响应类型按文本接收，再由 Axios 转换。
- HTTP 状态码由 Axios `validateStatus` 判断；uni 网络任务的 `fail` 回调会转换为 `AxiosError`。
- 上传数据从 Axios JSON 请求体转换为 `uni.uploadFile` 的 `formData`。适配器会移除 JSON `Content-Type`，由 uni-app 生成 multipart boundary。
- `onHeadersReceived`、上传/下载进度、取消请求及单项请求配置是否可用，取决于目标 uni-app 平台。
- `method: "upload" | "download"` 是 adapter 的文件任务标记；其他标准 HTTP 方法使用 `uni.request`。
- 调用 `createUniAppAxiosAdapter()` 会在当前 Axios 包的原型上安装 `upload` 和 `download`，重复调用不会再次安装。

## 运行要求

- Axios `^1.8.1`。
- 存在全局 `uni` 对象的 uni-app 运行环境。
- TypeScript 项目使用 uni-app 专有请求选项时，需要提供 `@dcloudio/types`。
