# API reference

This document describes the public entries, Fast request configuration, project handlers, uni-app adapter, and build plugins in `@fast-china/axios` 2.x.

## Package entries

| Import                      | Exports                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `@fast-china/axios`         | `createFastAxios`, `useFastAxios`, `axiosUtil`, `createUniAppAxiosAdapter`, public types, and Axios type augmentation |
| `@fast-china/axios/vite`    | Default Vite mini-program FormData/Blob plugin                                                                        |
| `@fast-china/axios/webpack` | Default Webpack mini-program FormData/Blob plugin                                                                     |

The browser CDN exposes the root-entry API as `FastAxios`. It does not include the Vite or Webpack plugin entries and requires Axios to be loaded first as `axios`.

## FastAxios container

### `createFastAxios(options?, newInstance?)`

Creates or updates the FastAxios configuration container.

```ts
const fastAxios = createFastAxios({
	baseUrl: "https://api.example.com",
	timeout: 30_000,
	headers: { Authorization: "Bearer <token>" },
	requestCipher: false,
});
```

| Parameter               | Type                               | Default | Behavior                                                                |
| ----------------------- | ---------------------------------- | ------- | ----------------------------------------------------------------------- |
| `options.baseUrl`       | `string`                           | `""`    | Axios `baseURL` used for new request instances.                         |
| `options.timeout`       | `number`                           | `60000` | Request timeout in milliseconds.                                        |
| `options.headers`       | `Record<string, AxiosHeaderValue>` | `{}`    | Shared request headers; repeated updates merge by field.                |
| `options.requestCipher` | `boolean`                          | `true`  | Crypto switch used when an individual request does not override it.     |
| `newInstance`           | `boolean`                          | `false` | Returns an independent container without updating the global singleton. |

`axiosUtil.request()` always reads the global singleton. An independent container does not automatically participate in that request flow.

Repeated singleton calls preserve the registered handlers and merge the new base options through `setOptions()`.

### `useFastAxios()`

Returns the initialized global container. It throws `Error` when `createFastAxios()` has not been called.

### `setOptions(options?)`

Updates the base options and returns the current container. Headers merge by field; other explicitly supplied values replace the active value. Empty strings, `0`, and `false` are valid.

### `addErrorCode()`

Adds or replaces error messages:

```ts
fastAxios.addErrorCode(40101, "The session has expired");

fastAxios.addErrorCode({
	40102: "The account is disabled",
	CUSTOM_ERROR: "Custom error",
});
```

Keys may be HTTP statuses, Axios error codes, or Fast business codes. The single-value overload throws `TypeError` when `message` is missing.

## Project handlers

`.use(fn)` replaces the current implementation. It does not accumulate handlers like the native Axios interceptor queue.

### Message

```ts
fastAxios.message.success.use((message) => {});
fastAxios.message.warning.use((message) => {});
fastAxios.message.info.use((message) => {});
fastAxios.message.error.use((message) => {});
```

The default implementation writes to the console. The request core does not emit an additional duplicate log before rejecting an error.

### Loading

```ts
fastAxios.loading.show.use((text) => {});
fastAxios.loading.close.use((options) => {});
```

The defaults are no-ops. The SDK does not own a global concurrency counter; the application handler must prevent one request from closing another request's Loading state.

### Cache

```ts
fastAxios.cache.get.use((key) => storage.get(key));
fastAxios.cache.set.use((key, value) => storage.set(key, value));
```

The default is an in-process `Map`. A reader must use `null` or `undefined` for a cache miss; `false`, `0`, and an empty string are valid cached values.

Caching is active only when all of the following are true:

- `cache: true`;
- GET method;
- `restfulResult: true`;
- `simpleDataFormat: true`.

The cache stores the final value returned to the caller, not the original AxiosResponse.

### Crypto

```ts
fastAxios.crypto.encrypt.use((config, timestamp) => {
	// May mutate data, params, or headers.
});

fastAxios.crypto.decrypt.use((response, options) => {
	return response.data;
});
```

The default encrypt handler does not mutate the request, and the default decrypt handler returns `response.data`. `requestCipher: true` does not provide cryptographic protection by itself; register the server-compatible protocol first.

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

- `request` may mutate the internal Axios request configuration.
- A non-null `response` result owns the successful response and skips file, RESTful, decrypt, and cache handling.
- A non-null `responseError` result replaces the final rejection; non-Error values are wrapped in `AxiosError`.

These are single Fast project handlers. The Axios instance still uses standard `instance.interceptors.request.use()` and `instance.interceptors.response.use()` calls for its lifecycle.

### MessageBox

```ts
fastAxios.messageBox.confirm.use(async (options) => {
	// Resolve for confirmation; throw or reject for cancellation.
});
```

The default prefers `uni.showModal` and otherwise uses browser `window.confirm`. Confirmation resolves; cancellation, platform failure, and unsupported runtimes reject.

## `axiosUtil`

### `axiosUtil.request<Output, Input>(config)`

Executes a Fast request and returns `Promise<Output>`.

```ts
const data = await axiosUtil.request<User, CreateUserInput>({
	url: "/users",
	method: "post",
	data: { name: "Fast" },
	requestType: "add",
});
```

The global FastAxios container must be initialized first. The request continues to support public AxiosRequestConfig fields.

### `axiosUtil.downloadFile(response)`

Saves an existing Axios file response with browser Blob, Object URL, and a temporary anchor. It does not perform a DOM download in uni-app. The filename prefers `Content-Disposition`.

It throws `Error` when browser download APIs are unavailable.

## Fast request configuration

`FastAxiosRequestConfig<Input>` extends `AxiosRequestConfig<Input>` with the options below.

### `requestType`

Required. It follows the Fast.NET OpenAPI conversion of `HttpRequestActionEnum`:

```ts
type RequestType = "auth" | "query" | "add" | "edit" | "delete" | "submit" | "upload" | "download" | "export" | "import" | "callback" | "other";
```

`download` and `export` enter Fast file-response handling. The uni adapter still selects its file API through `method: "upload" | "download"`.

### Extended options

| Option                   | Default       | Behavior                                                                                          |
| ------------------------ | ------------- | ------------------------------------------------------------------------------------------------- |
| `cancelDuplicateRequest` | `true`        | Cancels the previous incomplete request with the same final URL, method, and body.                |
| `loading`                | `false`       | Calls Loading show/close during the request lifecycle.                                            |
| `loadingText`            | `"加载中..."` | Text passed to Loading show.                                                                      |
| `cache`                  | `false`       | Enables caching for eligible GET RESTful simplified responses.                                    |
| `getMethodCacheHandle`   | `true`        | Adds a timestamp parameter to unencrypted GET requests to avoid stale browser or proxy responses. |
| `simpleDataFormat`       | `true`        | Resolves successful RESTful JSON requests with `data`.                                            |
| `showErrorMessage`       | `true`        | Displays HTTP, network, and timeout errors.                                                       |
| `showCodeMessage`        | `true`        | Displays Fast business code/success errors.                                                       |
| `autoDownloadFile`       | `true`        | Saves successful browser file responses automatically.                                            |
| `requestCipher`          | global option | Calls the registered request encrypt and response decrypt handlers.                               |
| `restfulResult`          | `true`        | Validates code/success and handles data as `ApiResponse`.                                         |

### Return rules

| Condition                                         | Result                              |
| ------------------------------------------------- | ----------------------------------- |
| Custom response handler returns a non-null value  | Custom value                        |
| `method: "download"` or `requestType: "download"` | Full AxiosResponse                  |
| `requestType: "export"` or Blob response          | Full AxiosResponse                  |
| Non-JSON + `simpleDataFormat: true`               | `response.data`                     |
| Non-JSON + `simpleDataFormat: false`              | Full AxiosResponse                  |
| JSON + RESTful + simplified mode                  | `data` from the decrypted structure |
| Other JSON                                        | Decrypted or original response data |

A Fast business code outside 200–299 or `success === false` throws `AxiosError`. Canceled requests retain Axios `CanceledError` so callers may continue using `axios.isCancel()`.

## uni-app adapter

### `UniAppRequestOptions` and `UniAppUploadFile`

`UniAppRequestOptions` is merged into AxiosRequestConfig and types the platform fields actually forwarded by the adapter, including SSL, HTTP/2, QUIC, HttpDNS, Cookie, cache, redirect, upload file, and multi-file options. `UniAppUploadFile` describes each item in `files`.

These public declarations do not depend on uni-app global types. Install `@dcloudio/types` in a uni-app application when the application itself also needs the complete `uni` API declarations.

### `createUniAppAxiosAdapter()`

Returns an AxiosAdapter and installs the file convenience methods once on the Axios package in use:

```ts
const http = axios.create({
	adapter: createUniAppAxiosAdapter(),
});
```

Routing rules:

| Axios method | uni API            | Platform request method |
| ------------ | ------------------ | ----------------------- |
| `upload`     | `uni.uploadFile`   | POST                    |
| `download`   | `uni.downloadFile` | GET                     |
| Other method | `uni.request`      | Original HTTP method    |

See the [uni-app adapter documentation](../src/uni-adapter/README.md) for platform fields, progress, cancellation, and response behavior.

### `axios.upload()`

```ts
upload<T, R, D>(url, data?, config?): Promise<R>
```

Fixes `method` to `"upload"`. `data` supplies ordinary multipart fields; file options such as `filePath`, `name`, and `files` come from config.

### `axios.download()`

```ts
download<T, R, D>(url, config?): Promise<R>
```

Fixes `method` to `"download"`. A successful `response.data` is the temporary file path returned by uni-app.

## Vite and Webpack plugins

`@fast-china/axios/vite` and `@fast-china/axios/webpack` default-export the corresponding unplugin adapter.

Only when `process.env.UNI_PLATFORM` starts with `mp-`, the plugin:

- replaces the Axios FormData platform module with `miniprogram-formdata`;
- replaces the Axios Blob platform module with `miniprogram-blob`;
- changes `window.FormData` in `form-data/lib/browser.js` to `globalThis.FormData`;
- excludes Axios from Vite development dependency optimization.

The build fails when the required polyfill cannot be resolved from the application project. The plugin has no public options.
