[中](https://gitee.com/FastDotnet/Fast.Axios) | **En**

<h1 align="center">Fast.Axios</h1>

<p align="center">
  <code>Fast</code> platform An request library built based on <code>Axios</code>, <code>TypeScript</code>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@fast-china/axios">
    <img src="https://img.shields.io/npm/v/@fast-china/axios?color=orange&label=" alt="version" />
  </a>
  <a href="https://gitee.com/FastDotnet/Fast.Axios/blob/master/LICENSE">
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
import { ElMessage } from "element-plus";
import { createFastAxios, useFastAxios } from "@fast-china/axios";

// Initialize FastAxios (singleton mode)
const fastAxios = createFastAxios({
	baseUrl: "",
	timeout: 60000,
	headers: {
		authorization: "",
	},
	requestCipher: true,
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

Update log [Click to view](https://gitee.com/FastDotnet/Fast.Axios/commits/master)

## Protocol

[Fast.Axios](https://gitee.com/FastDotnet/Fast.Axios) complies with the [Apache-2.0](https://gitee.com/FastDotnet/Fast.Axios/blob/master/LICENSE) open source agreement. Welcome to submit `PR` or `Issue`.

```
Apache Open Source License

Copyright © 2018-Now xiaoFang

License:
This Agreement grants any individual or organization that obtains a copy of this software and its related documentation (hereinafter referred to as the "Software").
Subject to the terms of this Agreement, you have the right to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the Software:
1.All copies or major parts of the Software must retain this Copyright Notice and this License Agreement.
2.The use, copying, modification, or distribution of the Software shall not violate applicable laws or infringe upon the legitimate rights and interests of others.
3.Modified or derivative works must clearly indicate the original author and the source of the original Software.

Special Statement:
- This Software is provided "as is" without any express or implied warranty of any kind, including but not limited to the warranty of merchantability, fitness for purpose, and non-infringement.
- In no event shall the author or copyright holder be liable for any direct or indirect loss caused by the use or inability to use this Software.
- Including but not limited to data loss, business interruption, etc.

Disclaimer:
It is prohibited to use this software to engage in illegal activities such as endangering national security, disrupting social order, or infringing on the legitimate rights and interests of others.
The author does not assume any responsibility for any legal disputes and liabilities caused by the secondary development of this software.
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
