# Changelog

All notable changes to Fast.Axios are documented in this file.

## [Unreleased]

## [2.0.0] - 2026-08-11

### Added

- Added a typed Fast.NET request configuration with synchronized `RequestType` values and explicit RESTful response handling.
- Added a uni-app Axios adapter for `uni.request`, `uni.uploadFile`, and `uni.downloadFile`, including progress, response headers, cancellation, and Axios status handling.
- Added stable `axios.upload()` and `axios.download()` convenience methods while preserving the established `method: "upload" | "download"` task contract.
- Added Vite and Webpack mini-program entries that replace Axios FormData and Blob platform modules with application-owned polyfills.
- Added an Axios-external browser IIFE exposed as `FastAxios`, with `unpkg` and `jsdelivr` package entries.
- Added Runtime, public-type, CDN, Source Map, npm archive, package-consumer, and Publint contract tests.
- Added synchronized English and Chinese README, API and adapter references, runtime contract, contribution guidance, security policy, and development/release instructions.

### Changed

- Moved package publishing to the repository root with one package.json and one root `dist/` directory.
- Reworked duplicate-request cancellation, cache keys, falsy cache values, file responses, error extraction, custom handlers, crypto defaults, and Loading cleanup.
- Kept Axios's native request and response interceptor structure while allowing the Fast response pipeline to return simplified business data.
- Removed duplicate request-core console output before rejected errors; applications retain logging control through Message and global error handlers.
- Standardized TypeScript 6, tsdown, ESLint, pnpm 11, and Node.js 22/24 development contracts.
- Standardized package-manager output as pure ESM with matching declarations for the root, Vite, and Webpack entries.
- Removed the public declaration dependency on uni-app globals while retaining typed adapter platform options.

### Removed

- Removed the duplicated nested publication package and legacy multi-tool build scripts.
- Removed the temporary `uniTask` routing design; the original Fast method-based upload/download contract remains authoritative.

[Unreleased]: https://gitee.com/FastDotnet/fast.axios/compare/v2.0.0...HEAD
[2.0.0]: https://gitee.com/FastDotnet/fast.axios/releases/tag/v2.0.0
