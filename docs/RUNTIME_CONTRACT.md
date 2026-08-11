# Runtime and package contract

This document defines the supported boundaries of `@fast-china/axios` 2.x. Behavior outside these boundaries is not guaranteed unless it is added to the public API and documented.

## Public entries

The repository root is the only npm package source.

| Entry                       | Environment                 | Contract                                                    |
| --------------------------- | --------------------------- | ----------------------------------------------------------- |
| `@fast-china/axios`         | Browser and uni-app         | FastAxios, Fast request processing, and the uni-app adapter |
| `@fast-china/axios/vite`    | Node.js build configuration | Vite adapter for the mini-program polyfill plugin           |
| `@fast-china/axios/webpack` | Node.js build configuration | Webpack adapter for the mini-program polyfill plugin        |
| `FastAxios` CDN global      | Browser script tag          | Minified IIFE containing the root-entry API                 |

Only the package.json export-map entries and the declared CDN global are public. Files under `dist/` or `src/`, generated chunks, and other internal module paths remain implementation details even when documentation files from those directories are present in the npm archive.

Package-manager entries are pure ESM and public types come from their matching `.d.mts` declarations. CommonJS `require()` is not a declared package contract.

## Import safety

Importing the root entry does not access `window`, `document`, `navigator`, or `uni` and does not send a request.

- Browser DOM APIs are accessed only by `axiosUtil.downloadFile()` when a browser download is requested.
- uni-app APIs are accessed only after a request selects the uni adapter or the default MessageBox opens `uni.showModal`.
- Node.js built-ins are isolated to the `vite` and `webpack` build-plugin entries.

Calling `createUniAppAxiosAdapter()` installs `upload()` and `download()` once on the Axios prototype used by the current Axios package. Repeated adapter creation does not reinstall the methods.

## FastAxios ownership

`createFastAxios()` owns one global configuration and handler container by default.

- Repeated calls merge base options and preserve registered handlers.
- `useFastAxios()` throws until the global container exists.
- `createFastAxios(options, true)` creates an independent container.
- `axiosUtil.request()` always reads the global container; it never discovers an independent container automatically.

Base headers are copied into each newly created Axios request instance. Updating the FastAxios container affects later requests and does not mutate an already running request.

## Request lifecycle

Each `axiosUtil.request()` call creates an isolated Axios instance and registers the standard request and response interceptors.

The high-level order is:

1. resolve Fast request defaults;
2. read an eligible cache entry;
3. create the platform-appropriate Axios instance;
4. cancel the previous duplicate request and register the current request;
5. run the Fast project request handler;
6. show Loading when enabled;
7. run request encryption or append the unencrypted GET timestamp;
8. execute the Axios adapter;
9. release duplicate-request and Loading state;
10. run the Fast project response handler;
11. process file, non-JSON, RESTful, decrypt, simplified-data, and cache behavior;
12. resolve with the final business value or reject with the original/replaced error.

No automatic retry, token refresh, redirect policy, persistent cache, or global concurrency queue is provided.

## Duplicate requests and cancellation

Duplicate detection uses the final Axios URL, normalized method, and request body. The previous incomplete request with the same key is canceled before the new request is registered.

An externally supplied CancelToken is not replaced. Axios cancellation remains observable through `axios.isCancel()` and the original CanceledError is not converted to a business error.

## Cache

The built-in cache is an unbounded in-process `Map` scoped to the global FastAxios container. It is not persistent and is not shared across browser tabs, workers, processes, or application reloads.

Only GET + RESTful + simplified responses are eligible. Cache keys are calculated before adding the unencrypted GET timestamp. `null` and `undefined` are misses; other falsy values are valid entries.

Applications that require TTL, eviction, persistence, tenant isolation, or logout cleanup must replace both cache handlers.

## Response and error contract

Fast RESTful responses may contain `success`, `code`, `message`, `data`, `timestamp`, and `response`.

- A code outside 200–299 or `success === false` is a business error.
- Server `message` takes precedence over the local error-code table.
- Error message objects are serialized for the Message handler.
- The request rejects with AxiosError for Fast business and invalid file-response failures.
- A custom Fast response handler may replace the complete successful result.
- A custom Fast response-error handler may replace the final rejected error.

The request core does not emit duplicate console errors before rejecting. The default Message handlers intentionally use the console until the application replaces them.

## uni-app adapter

The adapter preserves the established Fast method contract:

- `method: "upload"` selects `uni.uploadFile` and constructs platform request options with POST;
- `method: "download"` selects `uni.downloadFile` and constructs platform request options with GET;
- every other method selects `uni.request` and preserves the HTTP method.

The special upload/download methods are adapter task markers. They are not standard HTTP methods and must not be sent through an ordinary browser or Node.js Axios adapter.

The adapter delegates URL construction to `axios.getUri()`, converts AxiosHeaders to a plain header object, lets Axios perform response transforms, and uses Axios `validateStatus` after a uni success callback.

Platform support for response-header events, progress, cancellation, file options, HTTP/2, QUIC, cookies, and other uni-specific fields depends on the selected uni-app target.

## Mini-program build plugin

The Vite and Webpack entries are build-time only.

- The plugin is inactive unless `UNI_PLATFORM` starts with `mp-`.
- It transforms only the reviewed Axios FormData/Blob and `form-data` browser modules.
- Required polyfills are resolved from the application working directory, not from this package.
- Missing `miniprogram-formdata` or `miniprogram-blob` fails the build instead of silently using an incompatible module.
- Vite development excludes Axios from dependency optimization only for active mini-program builds.

## Crypto and security boundary

The crypto hooks are protocol extension points. Their defaults do not encrypt, authenticate, sign, or protect a request. `requestCipher: true` only enables the registered hooks.

The package does not own credentials, token refresh, secure storage, certificate pinning, key management, replay prevention, authorization, or server trust decisions.

## CDN entry

The `unpkg` and `jsdelivr` package fields select `dist/index.global.min.js`.

- Axios is intentionally external and must be loaded first as the global `axios`.
- The SDK is exposed as `globalThis.FastAxios`.
- The CDN file contains only the browser-safe root entry; `vite` and `webpack` are never bundled into it.
- The CDN entry is built for ES2022 browsers and is not a uni-app distribution format.
- `dist/index.global.min.js.map` contains embedded sources for debugging without publishing TypeScript source files.

## Unsupported assumptions

- No deep import under `dist/` or `src/` is public.
- No CommonJS package entry or CDN build-plugin entry is declared.
- No server-side HTTP adapter behavior is promised by Fast request helpers.
- No polyfill is installed globally at runtime.
- No Message, Loading, cache, or crypto integration is selected automatically for a UI framework.
