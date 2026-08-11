<p align="left">
	<a href="./README.zh.md">简体中文</a> | <strong>English</strong>
</p>

<p align="center">
	<img src="./Fast.png" alt="logo" width="160" />
</p>

# @fast-china/axios

A typed Axios request library for Fast applications, browsers, and uni-app, with Fast.NET response handling, a uni-app adapter, and mini-program build plugins.

[![npm version](https://img.shields.io/npm/v/@fast-china/axios?color=orange)](https://www.npmjs.com/package/@fast-china/axios) [![node](https://img.shields.io/badge/node-%5E22.18%20%7C%7C%20%5E24.18-brightgreen)](https://nodejs.org/) [![axios](https://img.shields.io/badge/axios-%5E1.8.1-5a29e4)](https://axios-http.com/) [![license](https://img.shields.io/npm/l/@fast-china/axios)](./LICENSE)

## Highlights

- Preserves Axios request and response interceptors, cancellation, parameter serialization, `validateStatus`, and response transforms.
- Handles Fast.NET `ApiResponse` business status, simplified data, messages, cache, Loading, and crypto extension points.
- Routes uni-app `method: "upload" | "download"` requests to `uni.uploadFile` and `uni.downloadFile`.
- Provides `axios.upload()`, `axios.download()`, and typed uni-app platform configuration.
- Provides Vite and Webpack mini-program plugins that replace Axios FormData and Blob platform modules only when needed.
- Publishes pure ESM, declarations, dedicated `vite` and `webpack` subpaths, and a separately minified CDN entry from the repository root.
- Validates runtime behavior, public types, package entries, Source Maps, the CDN global, the npm archive, and Publint before packing.

## Requirements

- Axios `^1.8.1`.
- Node.js `^22.18.0 || ^24.18.0` and pnpm `^11.0.0` for repository development.
- `@dcloudio/types` is recommended for typed uni-app applications.
- uni-app mini-program builds require `miniprogram-formdata` and `miniprogram-blob` in the application project.

## Install

```bash
pnpm add @fast-china/axios axios
```

Install the platform polyfills in a mini-program project:

```bash
pnpm add miniprogram-formdata miniprogram-blob
```

### CDN

The `unpkg` and `jsdelivr` fields select `dist/index.global.min.js`. Load Axios first, then access this SDK through the `FastAxios` global:

```html
<script src="https://cdn.jsdelivr.net/npm/axios@1.8.1/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@fast-china/axios@2/dist/index.global.min.js"></script>
<script>
	FastAxios.createFastAxios({
		baseUrl: "https://api.example.com",
		requestCipher: false,
	});

	FastAxios.axiosUtil.request({
		url: "/users/1",
		method: "get",
		requestType: "query",
	});
</script>
```

The equivalent unpkg entry is `https://unpkg.com/@fast-china/axios@2/dist/index.global.min.js`. The CDN build is browser-only; uni-app and the Vite/Webpack plugins must use package-manager imports.

## Quick start

Create the global FastAxios container once during application startup, then send requests through `axiosUtil.request()`:

```ts
import { axiosUtil, createFastAxios } from "@fast-china/axios";

const fastAxios = createFastAxios({
	baseUrl: "https://api.example.com",
	timeout: 30_000,
	headers: {
		Authorization: "Bearer <token>",
	},
	requestCipher: false,
});

interface User {
	id: number;
	name: string;
}

const user = await axiosUtil.request<User>({
	url: "/users/1",
	method: "get",
	requestType: "query",
});
```

By default, `axiosUtil.request()` reads `code`, `success`, `message`, and `data` from the Fast.NET RESTful response and resolves with `data`. Disable `simpleDataFormat` or `restfulResult` on an individual request when the original structure is required.

## Project handlers

Every project-level handler uses `.use()` to replace its current implementation. This is not Axios's native interceptor queue; the most recent registration wins:

```ts
fastAxios.message.error.use((message) => {
	// Connect the application's Message component.
});

fastAxios.loading.show.use((text) => {
	// Show Loading.
});

fastAxios.loading.close.use((_options) => {
	// Close Loading and manage concurrent request counts in the application.
});

fastAxios.interceptors.request.use((config) => {
	config.headers.set("X-Request-Source", "fast-app");
});

fastAxios.interceptors.response.use((response) => {
	// Return null or undefined to continue the built-in response flow.
	return undefined;
});

fastAxios.interceptors.responseError.use((_error) => {
	// Return a non-null value to replace the final rejected error.
	return undefined;
});
```

Cache, request encryption, and response decryption are registered through `cache.get/set.use()` and `crypto.encrypt/decrypt.use()`. The default crypto handlers do not provide cryptographic protection; register the application's protocol before enabling `requestCipher`.

## uni-app adapter

`axiosUtil.request()` automatically uses the uni-app adapter when the global `uni` object exists. Fast.NET-generated mobile uploads keep the established method contract:

```ts
const fileId = await axiosUtil.request<string>({
	url: "/files/avatar",
	method: "upload",
	requestType: "upload",
	filePath,
	name: "file",
	cancelDuplicateRequest: false,
});
```

Install the adapter explicitly when creating a raw Axios instance:

```ts
import axios from "axios";
import { createUniAppAxiosAdapter } from "@fast-china/axios";

const http = axios.create({
	adapter: createUniAppAxiosAdapter(),
	baseURL: "https://api.example.com",
});

const response = await http.upload(
	"/files/avatar",
	{},
	{
		filePath,
		name: "file",
	}
);
```

See the [uni-app adapter documentation](./src/uni-adapter/README.md) for upload, download, cancellation, progress, and platform behavior.

## Mini-program build plugins

Use the dedicated Vite subpath. The plugin is active only when `UNI_PLATFORM` starts with `mp-`:

```ts
import { defineConfig } from "vite";
import uniAppAxiosPlugin from "@fast-china/axios/vite";

export default defineConfig({
	plugins: [uniAppAxiosPlugin()],
});
```

For Webpack:

```ts
import uniAppAxiosPlugin from "@fast-china/axios/webpack";

export default {
	plugins: [uniAppAxiosPlugin()],
};
```

The plugin replaces Axios FormData and Blob platform modules and fails the build when the application cannot resolve the required polyfill. H5, App, and ordinary Web builds retain their original modules.

## Package entries

| Import or global            | Purpose                                         | Runtime                     |
| --------------------------- | ----------------------------------------------- | --------------------------- |
| `@fast-china/axios`         | FastAxios, `axiosUtil`, and the uni-app adapter | Browser and uni-app         |
| `@fast-china/axios/vite`    | Vite mini-program FormData/Blob plugin          | Node.js build configuration |
| `@fast-china/axios/webpack` | Webpack mini-program FormData/Blob plugin       | Node.js build configuration |
| `FastAxios`                 | Minified IIFE root entry                        | Browser script tag          |

Importing the package does not access `window` or `uni`. Platform APIs are accessed only when the adapter is created, a request runs, or the related feature is called.

## Documentation

- [API reference](./docs/API.md)
- [uni-app adapter](./src/uni-adapter/README.md)
- [Runtime and package contract](./docs/RUNTIME_CONTRACT.md)
- [Development and release](./docs/DEVELOPMENT_RELEASE.zh-CN.md)
- [Contributing](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)

## Development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
```

## License

[Apache-2.0](./LICENSE)
