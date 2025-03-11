[中](https://gitee.com/China-xiaoFang/fast.axios) | **En**

<h1 align="center">Fast.Axios</h1>

<p align="center">
  <code>Fast</code> platform An request library built based on <code>Axios</code>, <code>TypeScript</code>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@fast-china/axios">
    <img src="https://img.shields.io/npm/v/@fast-china/axios?color=orange&label=" alt="version" />
  </a>
  <a href="https://gitee.com/China-xiaoFang/fast.axios/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/@fast-china/axios" alt="license" />
  </a>
</p>

## Install

#### Using a Package Manager

```sh
# Choose a package manager of your choice

# NPM
npm install @fast-china/axios

# Yarn
yarn add @fast-china/axios

# pnpm (recommend)
pnpm install @fast-china/axios
```

#### Direct browser import

##### unpkg

```html
<head>
  <!-- Import Axios -->
  <script src="//unpkg.com/axios@1.7.2"></script>
  <!-- Import request library -->
  <script src="//unpkg.com/@fast-china/axios"></script>
</head>
```

##### jsDelivr

```html
<head>
  <!-- Import Axios -->
  <script src="//cdn.jsdelivr.net/npm/axios@1.7.2"></script>
  <!-- Import request library -->
  <script src="//cdn.jsdelivr.net/npm/@fast-china/axios"></script>
</head>
```

## Use

```typescript
import { createFastAxios, useFastAxios } from "@fast-china/axios";
import { ElMessage } from "element-plus";

// Initialize FastAxios (singleton mode)
const fastAxios = createFastAxios({
  baseUrl: "",
  timeout: 60000,
  headers: {
    "authorization": ""
  },
  requestCipher: true
});

// Set message prompt.
fastAxios.message.success.use((message) => ElMessage.success(message));
fastAxios.message.warning.use((message) => ElMessage.warning(message));
fastAxios.message.info.use((message) => ElMessage.info(message));
fastAxios.message.error.use((message) => ElMessage.error(message));

// Use FastAxios options, or use the following method to set multiple times.
const uFastAxios = useFastAxios();

console.log(uFastAxios.baseUrl);

// Set message prompts.
uFastAxios.message.success.use((message) => ElMessage.success(message));
uFastAxios.message.warning.use((message) => ElMessage.warning(message));
uFastAxios.message.info.use((message) => ElMessage.info(message));
uFastAxios.message.error.use((message) => ElMessage.error(message));
```

## Update log

Update log [Click to view](https://gitee.com/China-xiaoFang/fast.axios/commits/master)

## Protocol

[Fast.Axios](https://gitee.com/China-xiaoFang/fast.axios) complies with the [Apache-2.0](https://gitee.com/China-xiaoFang/fast.axios/blob/master/LICENSE) open source agreement. Welcome to submit `PR` or `Issue`.

```
Apache Open Source License

Copyright © 2018-Now xiaoFang

The right to deal in the Software is hereby granted free of charge to any person obtaining a copy of this software and its related documentation (the "Software"),
Including but not limited to using, copying, modifying, merging, publishing, distributing, sublicensing, selling copies of the Software,
and permit individuals in possession of a copy of the software to do so, subject to the following conditions:

The above copyright notice and this license notice must be included on all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS AND NON-INFRINGEMENT.
In no event shall the author or copyright holder be liable for any claim, damages or other liability,
WHETHER ARISING IN CONTRACT, TORT OR OTHERWISE, IN CONNECTION WITH THE SOFTWARE OR ITS USE OR OTHER DEALINGS.
```

## Disclaimer

```
Please do not use it for projects that violate our country's laws
```

## Contributors

Thank you for all their contributions!

<a href="https://github.com/China-xiaoFang/Fast.Axios/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=China-xiaoFang/Fast.Axios" />
</a>

## Supplementary instructions

```
If it is helpful to you, you can click ⭐Star in the upper right corner to collect it and get the latest updates. Thank you!
```
