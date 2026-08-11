# API 文档

本文档描述 `@fast-china/axios` 2.x 的公开入口、Fast 请求配置、项目处理器、uni-app adapter 和构建插件。

## 包入口

| 导入路径                    | 导出                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `@fast-china/axios`         | `createFastAxios`、`useFastAxios`、`axiosUtil`、`createUniAppAxiosAdapter`、公开类型及 Axios 类型扩展 |
| `@fast-china/axios/vite`    | Vite 小程序 FormData/Blob 插件，默认导出                                                              |
| `@fast-china/axios/webpack` | Webpack 小程序 FormData/Blob 插件，默认导出                                                           |

浏览器 CDN 通过全局变量 `FastAxios` 暴露根入口 API，不包含 Vite 或 Webpack 插件，并要求页面先把 Axios 加载为全局变量 `axios`。

## FastAxios 容器

### `createFastAxios(options?, newInstance?)`

创建或更新 FastAxios 配置容器。

```ts
const fastAxios = createFastAxios({
	baseUrl: "https://api.example.com",
	timeout: 30_000,
	headers: { Authorization: "Bearer <token>" },
	requestCipher: false,
});
```

| 参数                    | 类型                               | 默认值  | 说明                                           |
| ----------------------- | ---------------------------------- | ------- | ---------------------------------------------- |
| `options.baseUrl`       | `string`                           | `""`    | 创建 Axios 请求实例时使用的 `baseURL`。        |
| `options.timeout`       | `number`                           | `60000` | 请求超时，单位毫秒。                           |
| `options.headers`       | `Record<string, AxiosHeaderValue>` | `{}`    | 跨请求共享的公共请求头；重复设置时按字段合并。 |
| `options.requestCipher` | `boolean`                          | `true`  | 单次请求未覆盖时使用的加解密开关。             |
| `newInstance`           | `boolean`                          | `false` | 为 `true` 时返回独立容器，不写入全局单例。     |

`axiosUtil.request()` 始终读取全局单例。独立容器不会自动参与请求流程。

重复调用单例模式的 `createFastAxios()` 会保留现有处理器，并通过 `setOptions()` 合并本次基础配置。

### `useFastAxios()`

返回已经初始化的全局容器。尚未调用 `createFastAxios()` 时抛出 `Error`。

### `setOptions(options?)`

更新基础配置并返回当前容器。`headers` 按字段合并；其他显式传入的值直接覆盖。空字符串、`0` 和 `false` 都是有效值。

### `addErrorCode()`

添加或覆盖错误提示：

```ts
fastAxios.addErrorCode(40101, "登录状态已失效");

fastAxios.addErrorCode({
	40102: "账号已停用",
	CUSTOM_ERROR: "自定义错误",
});
```

支持 HTTP 状态码、Axios error code 和 Fast 业务 code。单值重载缺少 `message` 时抛出 `TypeError`。

## 项目处理器

处理器通过 `.use(fn)` 替换当前实现，不会像 Axios 原生拦截器一样累积成队列。

### Message

```ts
fastAxios.message.success.use((message) => {});
fastAxios.message.warning.use((message) => {});
fastAxios.message.info.use((message) => {});
fastAxios.message.error.use((message) => {});
```

未注册时默认输出到控制台。请求核心不会在抛错前额外重复输出日志。

### Loading

```ts
fastAxios.loading.show.use((text) => {});
fastAxios.loading.close.use((options) => {});
```

默认实现为空。SDK 不维护全局并发计数；应用需要在注册的处理器中自行避免一个请求提前关闭其他请求的 Loading。

### Cache

```ts
fastAxios.cache.get.use((key) => storage.get(key));
fastAxios.cache.set.use((key, value) => storage.set(key, value));
```

默认使用当前 JavaScript 进程内的 `Map`。读取处理器应使用 `null` 或 `undefined` 表示未命中；`false`、`0` 和空字符串都是有效缓存值。

缓存只用于同时满足以下条件的请求：

- `cache: true`；
- GET；
- `restfulResult: true`；
- `simpleDataFormat: true`。

缓存保存最终返回给调用方的数据，不是原始 AxiosResponse。

### Crypto

```ts
fastAxios.crypto.encrypt.use((config, timestamp) => {
	// 可修改 data、params 或 headers。
});

fastAxios.crypto.decrypt.use((response, options) => {
	return response.data;
});
```

默认加密处理器不修改请求，默认解密处理器返回 `response.data`。`requestCipher: true` 本身不提供加密安全性；应用必须注册与服务端协议一致的实现。

### Interceptors

```ts
fastAxios.interceptors.request.use((config) => {});

fastAxios.interceptors.response.use((response, options) => {
	return undefined;
});

fastAxios.interceptors.responseError.use((error, options) => {
	return undefined;
});
```

- `request` 可直接修改 Axios 内部请求配置。
- `response` 返回非 `null`/`undefined` 时完整接管成功响应，跳过文件、RESTful、解密和缓存处理。
- `responseError` 返回非 `null`/`undefined` 时替换最终拒绝错误；非 Error 值会被包装为 `AxiosError`。

这些是 Fast 项目级单处理器。Axios 实例自身仍使用标准 `instance.interceptors.request.use()` 和 `instance.interceptors.response.use()` 执行请求生命周期。

### MessageBox

```ts
fastAxios.messageBox.confirm.use(async (options) => {
	// 用户确认时正常完成；取消时抛错或返回 rejected Promise。
});
```

默认实现优先使用 `uni.showModal`，其次使用浏览器 `window.confirm`。确认时 Promise 完成，取消、平台失败或不支持的运行环境会拒绝。

## `axiosUtil`

### `axiosUtil.request<Output, Input>(config)`

执行 Fast 请求并返回 `Promise<Output>`。

```ts
const data = await axiosUtil.request<User, CreateUserInput>({
	url: "/users",
	method: "post",
	data: { name: "Fast" },
	requestType: "add",
});
```

调用前必须初始化全局 FastAxios 容器。请求仍支持 AxiosRequestConfig 的公共字段。

### `axiosUtil.downloadFile(response)`

使用浏览器 Blob、Object URL 和临时 `<a>` 保存已有 Axios 文件响应。在 uni-app 中不执行 DOM 下载；服务端文件名优先从 `Content-Disposition` 读取。

缺少浏览器下载 API 时抛出 `Error`。

## Fast 请求配置

`FastAxiosRequestConfig<Input>` 继承 `AxiosRequestConfig<Input>` 和以下扩展选项。

### `requestType`

必填。与 Fast.NET `HttpRequestActionEnum` 的 OpenAPI 输出同步：

```ts
type RequestType = "auth" | "query" | "add" | "edit" | "delete" | "submit" | "upload" | "download" | "export" | "import" | "callback" | "other";
```

`download` 和 `export` 进入 Fast 文件响应处理。uni adapter 是否选择文件 API 仍由 `method: "upload" | "download"` 决定。

### 扩展选项

| 选项                     | 默认值        | 行为                                                          |
| ------------------------ | ------------- | ------------------------------------------------------------- |
| `cancelDuplicateRequest` | `true`        | 取消相同最终 URL、HTTP method 和请求体的上一条未完成请求。    |
| `loading`                | `false`       | 在请求生命周期内调用 Loading show/close。                     |
| `loadingText`            | `"加载中..."` | 传给 Loading show 的文字。                                    |
| `cache`                  | `false`       | 对符合条件的 GET RESTful 简洁响应启用缓存。                   |
| `getMethodCacheHandle`   | `true`        | 未加密的 GET 请求追加时间戳参数，避免浏览器或代理复用旧响应。 |
| `simpleDataFormat`       | `true`        | RESTful JSON 成功响应只返回 `data`。                          |
| `showErrorMessage`       | `true`        | 展示 HTTP、网络和超时错误。                                   |
| `showCodeMessage`        | `true`        | 展示 Fast 业务 code/success 错误。                            |
| `autoDownloadFile`       | `true`        | 浏览器文件响应成功后自动保存。                                |
| `requestCipher`          | 全局配置      | 调用已注册的请求加密和响应解密处理器。                        |
| `restfulResult`          | `true`        | 按 `ApiResponse` 校验 code/success 并处理 data。              |

### 返回规则

| 条件                                              | 返回结果              |
| ------------------------------------------------- | --------------------- |
| 自定义 response 处理器返回非空值                  | 自定义返回值          |
| `method: "download"` 或 `requestType: "download"` | 完整 AxiosResponse    |
| `requestType: "export"` 或响应类型为 Blob         | 完整 AxiosResponse    |
| 非 JSON + `simpleDataFormat: true`                | `response.data`       |
| 非 JSON + `simpleDataFormat: false`               | 完整 AxiosResponse    |
| JSON + RESTful + 简洁模式                         | 解密后结构中的 `data` |
| 其他 JSON                                         | 解密后或原始响应数据  |

Fast 业务 code 不在 200–299 或 `success === false` 时抛出 `AxiosError`。取消请求保留 Axios `CanceledError`，便于调用方继续使用 `axios.isCancel()` 判断。

## uni-app adapter

### `UniAppRequestOptions` 与 `UniAppUploadFile`

`UniAppRequestOptions` 会合并到 AxiosRequestConfig，声明 adapter 实际透传的 SSL、HTTP/2、QUIC、HttpDNS、Cookie、缓存、重定向、上传文件和多文件等平台字段；`UniAppUploadFile` 描述 `files` 中的单个文件。

这些公开声明不依赖 uni-app 全局类型。uni-app 应用如果还需要完整的 `uni` API 声明，应在应用项目安装 `@dcloudio/types`。

### `createUniAppAxiosAdapter()`

返回 AxiosAdapter，并在当前 Axios 包的原型上安装一次文件便捷方法：

```ts
const http = axios.create({
	adapter: createUniAppAxiosAdapter(),
});
```

分流规则：

| Axios method | uni API            | 平台请求 method |
| ------------ | ------------------ | --------------- |
| `upload`     | `uni.uploadFile`   | POST            |
| `download`   | `uni.downloadFile` | GET             |
| 其他 method  | `uni.request`      | 原 HTTP method  |

完整平台字段、进度、取消和响应行为见 [uni-app adapter 文档](../src/uni-adapter/README.zh.md)。

### `axios.upload()`

```ts
upload<T, R, D>(url, data?, config?): Promise<R>
```

固定写入 `method: "upload"`。`data` 用作普通 multipart 表单字段；`filePath`、`name`、`files` 等文件选项通过 config 提供。

### `axios.download()`

```ts
download<T, R, D>(url, config?): Promise<R>
```

固定写入 `method: "download"`。成功时 `response.data` 为 uni-app 返回的临时文件路径。

## Vite 与 Webpack 插件

`@fast-china/axios/vite` 和 `@fast-china/axios/webpack` 默认导出对应 unplugin adapter。

插件仅在 `process.env.UNI_PLATFORM` 以 `mp-` 开头时：

- 把 Axios FormData 平台模块替换为 `miniprogram-formdata`；
- 把 Axios Blob 平台模块替换为 `miniprogram-blob`；
- 把 `form-data/lib/browser.js` 中的 `window.FormData` 改为 `globalThis.FormData`；
- 在 Vite 开发模式中把 Axios 排除出依赖预构建。

当需要的兼容包无法从应用项目解析时，插件抛出构建错误。插件没有公开配置选项。
