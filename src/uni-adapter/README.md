# Axios Adapter for uni-app

[简体中文](./README.zh.md)

`createUniAppAxiosAdapter()` routes Axios requests to uni-app network APIs:

- Standard HTTP methods use `uni.request`.
- `method: "upload"` uses `uni.uploadFile`.
- `method: "download"` uses `uni.downloadFile`.

Axios request and response interceptors, `validateStatus`, cancellation, parameter serialization, and response transforms remain available.
The first call to `createUniAppAxiosAdapter()` installs `upload()` and `download()` once on the Axios prototype used by the current Axios package.

## Create an Axios instance

```ts
import axios from "axios";
import { createUniAppAxiosAdapter } from "@fast-china/axios";

export const http = axios.create({
	adapter: createUniAppAxiosAdapter(),
	baseURL: "https://api.example.com",
	timeout: 30_000,
});
```

Only create the adapter in a uni-app runtime where the global `uni` object is available. Standard requests continue to use the regular Axios API:

```ts
const response = await http.get<{ id: number; name: string }>("/users/1", {
	params: { locale: "en-US" },
	sslVerify: true,
});
```

## Upload a file

Use `upload(url, data, config)` for the common case. This convenience method fixes `method` to `"upload"` and routes the request to `uni.uploadFile`. The Axios request `data` is converted to `uni.uploadFile` `formData`; an explicit `formData` takes precedence over `data`.

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

When a single request configuration object is more convenient, use the adapter upload method marker directly:

```ts
const response = await http.request<{ fileId: string }>({
	url: "/files",
	method: "upload",
	filePath: tempFilePath,
	name: "file",
});
```

## Download a file

After a successful download, `response.data` contains the temporary file path returned by `uni.downloadFile`.

```ts
const response = await http.download<string>("/files/report.pdf", {
	onDownloadProgress(event) {
		console.log(event.progress);
	},
});

console.log(response.data);
```

## Cancel a request

```ts
const controller = new AbortController();
const request = http.get("/slow-api", { signal: controller.signal });

controller.abort();
await request;
```

The deprecated Axios `CancelToken` API is also supported.

## Behavior and platform differences

- Axios builds the final URL from `baseURL`, `params`, `paramsSerializer`, and `allowAbsoluteUrls`.
- `responseType: "arraybuffer"` is passed to `uni.request`; other Axios response types are received as text and then transformed by Axios.
- HTTP status codes are evaluated with Axios `validateStatus`. The uni network task `fail` callback is converted to an `AxiosError`.
- Upload data is converted from the Axios JSON payload to `uni.uploadFile` `formData`. The adapter removes the JSON `Content-Type` so uni-app can generate the multipart boundary.
- `onHeadersReceived`, upload/download progress, cancellation, and individual request options depend on support in the target uni-app platform.
- `method: "upload" | "download"` is the adapter file-task marker. Other standard HTTP methods use `uni.request`.
- Calling `createUniAppAxiosAdapter()` installs `upload` and `download` on the current Axios package prototype. Repeated calls do not install them again.

## Runtime requirements

- Axios `^1.8.1`.
- A uni-app runtime with a global `uni` object.
- `@dcloudio/types` available to TypeScript projects that consume the uni-app-specific request options.
