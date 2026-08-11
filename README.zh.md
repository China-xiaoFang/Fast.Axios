<p align="left">
	<strong>简体中文</strong> | <a href="./README.md">English</a>
</p>

<p align="center">
	<img src="./Fast.png" alt="logo" width="160" />
</p>

# @fast-china/axios

面向 Fast 项目、浏览器与 uni-app 的类型化 Axios 请求库，内置 Fast.NET 响应处理、uni-app adapter 和小程序构建插件。

[![npm 版本](https://img.shields.io/npm/v/@fast-china/axios?color=orange)](https://www.npmjs.com/package/@fast-china/axios) [![node](https://img.shields.io/badge/node-%5E22.18%20%7C%7C%20%5E24.18-brightgreen)](https://nodejs.org/) [![axios](https://img.shields.io/badge/axios-%5E1.8.1-5a29e4)](https://axios-http.com/) [![开源协议](https://img.shields.io/npm/l/@fast-china/axios)](./LICENSE)

## 特性

- 保留 Axios 请求、响应拦截器、取消、参数序列化、`validateStatus` 和响应转换语义。
- 按 Fast.NET `ApiResponse` 约定处理业务状态、简洁数据、错误提示、缓存、Loading 和加解密扩展点。
- 在 uni-app 中把 `method: "upload" | "download"` 分流到 `uni.uploadFile` 和 `uni.downloadFile`。
- 提供 `axios.upload()`、`axios.download()` 以及完整的 TypeScript 平台配置扩展。
- 提供 Vite 与 Webpack 小程序插件，按需替换 Axios 的 FormData 和 Blob 平台模块。
- 从仓库根目录发布纯 ESM、类型声明、独立的 `vite`、`webpack` 子路径和单独压缩的 CDN 入口。
- 打包前验证运行时、公开类型、包入口、Source Map、CDN 全局变量、npm 归档和 Publint。

## 环境要求

- Axios `^1.8.1`。
- 开发环境使用 Node.js `^22.18.0 || ^24.18.0` 和 pnpm `^11.0.0`。
- uni-app 类型项目建议安装 `@dcloudio/types`。
- uni-app 小程序构建需要在应用项目中安装 `miniprogram-formdata` 和 `miniprogram-blob`。

## 安装

```bash
pnpm add @fast-china/axios axios
```

小程序项目另外安装平台兼容包：

```bash
pnpm add miniprogram-formdata miniprogram-blob
```

### CDN

`unpkg` 和 `jsdelivr` 字段均指向 `dist/index.global.min.js`。页面必须先加载 Axios，再通过全局变量 `FastAxios` 使用本 SDK：

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

对应的 unpkg 地址为 `https://unpkg.com/@fast-china/axios@2/dist/index.global.min.js`。CDN 产物仅用于浏览器；uni-app 和 Vite/Webpack 插件必须使用包管理器导入。

## 快速开始

应用启动时先创建全局 FastAxios 容器，再通过 `axiosUtil.request()` 发起请求：

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

`axiosUtil.request()` 默认按 Fast.NET RESTful 响应读取 `code`、`success`、`message` 和 `data`，成功时直接返回 `data`。如需原始结构，可通过单次请求选项关闭 `simpleDataFormat` 或 `restfulResult`。

## 项目处理器

所有项目级处理器都通过 `.use()` 替换当前实现。它不是 Axios 原生的多拦截器队列，重复注册时以最后一次为准：

```ts
fastAxios.message.error.use((message) => {
	// 接入项目自己的 Message 组件。
});

fastAxios.loading.show.use((text) => {
	// 显示 Loading。
});

fastAxios.loading.close.use((_options) => {
	// 关闭 Loading，并自行处理并发请求计数。
});

fastAxios.interceptors.request.use((config) => {
	config.headers.set("X-Request-Source", "fast-app");
});

fastAxios.interceptors.response.use((response) => {
	// 返回 null 或 undefined 时继续执行内置响应流程。
	return undefined;
});

fastAxios.interceptors.responseError.use((_error) => {
	// 返回非空值时替换最终抛出的错误。
	return undefined;
});
```

缓存、请求加密和响应解密同样通过 `cache.get/set.use()` 与 `crypto.encrypt/decrypt.use()` 接入。默认加解密处理器不会提供实际密码学保护，启用 `requestCipher` 前必须注册项目自己的协议实现。

## uni-app adapter

`axiosUtil.request()` 检测到全局 `uni` 时会自动使用 uni-app adapter。Fast.NET 生成的移动端上传调用保持原有约定：

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

如果直接创建 Axios 实例，可显式安装 adapter：

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

上传、下载、取消、进度事件和平台差异见 [uni-app adapter 中文文档](./src/uni-adapter/README.zh.md)。

## 小程序构建插件

Vite 项目使用独立子路径，插件只在 `UNI_PLATFORM` 以 `mp-` 开头时生效：

```ts
import { defineConfig } from "vite";
import uniAppAxiosPlugin from "@fast-china/axios/vite";

export default defineConfig({
	plugins: [uniAppAxiosPlugin()],
});
```

Webpack 项目使用：

```ts
import uniAppAxiosPlugin from "@fast-china/axios/webpack";

export default {
	plugins: [uniAppAxiosPlugin()],
};
```

插件会替换 Axios 的 FormData、Blob 平台模块，并在应用项目缺少对应兼容包时直接终止构建。H5、App 和普通 Web 构建保持原始模块不变。

## 包入口

| 导入路径或全局变量          | 用途                                    | 运行环境           |
| --------------------------- | --------------------------------------- | ------------------ |
| `@fast-china/axios`         | FastAxios、`axiosUtil`、uni-app adapter | 浏览器、uni-app    |
| `@fast-china/axios/vite`    | Vite 小程序 FormData/Blob 插件          | Node.js 构建配置   |
| `@fast-china/axios/webpack` | Webpack 小程序 FormData/Blob 插件       | Node.js 构建配置   |
| `FastAxios`                 | 压缩后的 IIFE 根入口                    | 浏览器 script 标签 |

包导入阶段不会访问 `window` 或 `uni`。平台 API 只在创建 adapter、执行请求或调用对应功能时使用。

## 文档

- [API 文档](./docs/API.zh-CN.md)
- [uni-app adapter](./src/uni-adapter/README.zh.md)
- [运行时与包契约](./docs/RUNTIME_CONTRACT.md)
- [开发与发布](./docs/DEVELOPMENT_RELEASE.zh-CN.md)
- [贡献指南](./CONTRIBUTING.md)
- [安全策略](./SECURITY.md)
- [更新日志](./CHANGELOG.md)

## 开发

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
```

## 许可证

[Apache-2.0](./LICENSE)
