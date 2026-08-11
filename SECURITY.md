# Security Policy

## Supported releases

Security fixes are provided for the latest stable release of the current major. Pre-release builds, unsupported Axios versions, and unsupported platform combinations receive best-effort investigation only.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Email `2875616188@qq.com` with the subject `@fast-china/axios security report` and include:

- affected package and Axios versions;
- browser, uni-app platform, build tool, and runtime;
- affected public API or package entry;
- a minimal reproduction without real credentials or personal data;
- expected and observed impact;
- whether authentication, request encryption, file upload/download, redirects, or build-time module replacement is involved.

Maintainers should acknowledge a complete report within five business days. Timelines depend on severity, reproducibility, affected platforms, and release coordination. Do not disclose the issue publicly until a fix and coordinated disclosure plan are available.

## Security boundaries

Fast.Axios is a request integration library, not an authentication or cryptographic protocol.

- `requestCipher` only enables caller-registered hooks. The default encrypt handler is a no-op and the default decrypt handler returns the original response data.
- Applications own token acquisition, refresh, expiry, authorization, secure storage, redaction, and logout cleanup.
- Request headers, query parameters, bodies, server messages, file paths, and downloaded filenames may contain sensitive data. Do not send them to console or telemetry without explicit redaction.
- The default in-memory cache has no TTL, tenant boundary, persistence protection, or logout integration. Replace it before caching sensitive responses.
- Duplicate-request cancellation does not provide replay protection or server-side idempotency.
- Browser downloads trust the server's response data and suggested filename. Applications must enforce authorization and content policy on the server.
- uni-app file APIs and task capabilities vary by platform. Platform acceptance does not prove that the uploaded or downloaded content is safe.
- Basic Auth support only encodes credentials for the Authorization header; it does not protect transport. Use HTTPS.
- Server-provided error messages may reveal internal information. Production APIs should return reviewed public messages.

## Mini-program build plugin

- The plugin transforms only known Axios/FormData platform modules that enter the build graph.
- Polyfills are resolved from the application project. Applications own the selected versions and their supply-chain review.
- The plugin does not sandbox or audit `miniprogram-formdata`, `miniprogram-blob`, Axios, Vite, Webpack, or other dependencies.
- Pin and review dependencies according to the application's release policy.

## Supply chain and release controls

- Axios is a peer dependency and unplugin is the only production dependency.
- Mini-program polyfills are optional peer dependencies and must remain application-controlled.
- The CDN build keeps Axios external. Pages must pin and review the Axios CDN URL, version, integrity policy, and loading order separately.
- Development dependency resolution is locked by `pnpm-lock.yaml` and CI should install with `--frozen-lockfile`.
- Release checks must validate every public export, declaration, package file, and Publint result before publication.
- The package must be built and published from the repository root; duplicate manifests or generated package directories are not trusted release sources.

## Handling secrets

No secret is required to build or test the repository. Never commit npm tokens, Gitee tokens, signing keys, private registry credentials, `.env` files, production request logs, authorization headers, real cookies, or private uploaded files.
