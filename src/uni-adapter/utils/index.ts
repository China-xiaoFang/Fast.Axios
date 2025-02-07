import type { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import { AxiosHeaders } from "axios";
// @ts-expect-error ignore
import buildFullPath from "axios/unsafe/core/buildFullPath";
// @ts-expect-error ignore
import buildURL from "axios/unsafe/helpers/buildURL";
// @ts-expect-error ignore
import speedometer from "axios/unsafe/helpers/speedometer";
import type { MethodType, UniNetworkRequestWithoutCallback } from "../type";

/**
 * 获取请求方法
 */
export const getMethodType = <T>(config: AxiosRequestConfig<T>): MethodType => {
	// 解析 method 如果不存在默认为 GET 请求
	const { method: rawMethod = "GET" } = config;
	const method = rawMethod.toLocaleLowerCase();
	switch (method) {
		case "download":
			return "download";
		case "upload":
			return "upload";
		default:
			return "request";
	}
};

/**
 * 解析 UniApp 请求选项
 * @param config
 */
export const resolveUniAppRequestOptions = (config: AxiosRequestConfig): UniNetworkRequestWithoutCallback => {
	const data = config.data;
	const responseType = config.responseType === "arraybuffer" ? "arraybuffer" : "text";
	const dataType = responseType === "text" ? "json" : undefined;

	const { headers, baseURL, ...requestConfig } = config;

	const requestHeaders = AxiosHeaders.from(headers as any).normalize(false);

	if (config.auth) {
		const username = config.auth.username || "";
		const password = config.auth.password ? decodeURIComponent(encodeURIComponent(config.auth.password)) : "";
		requestHeaders.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);
	}

	const fullPath = buildFullPath(baseURL, config.url);
	const method = (config?.method?.toUpperCase() ?? "GET") as unknown as any;
	const url = buildURL(fullPath, config.params, config.paramsSerializer);

	// set uni-app default value
	// request
	const timeout = config.timeout || 60000;
	// upload
	let formData = {};
	if (data && typeof data === "string") {
		try {
			formData = JSON.parse(data);
		} catch (error) {}
	}

	const header = requestHeaders.toJSON();

	return {
		...requestConfig,
		url,
		data,
		header,
		method,
		responseType,
		dataType,
		timeout,
		formData,
	};
};

/**
 * 处理 Axios 上传或下载进度
 * - https://github.com/axios/axios/blob/7d45ab2e2ad6e59f5475e39afd4b286b1f393fc0/lib/adapters/xhr.js#L17-L44
 * @param listener
 * @param isDownloadStream 是否为下载流
 */
export const progressEventReducer = (listener: (progressEvent: AxiosProgressEvent) => void, isDownloadStream: boolean) => {
	let bytesNotified = 0;
	const _speedometer = speedometer(50, 250);

	return (result: UniApp.OnProgressDownloadResult): void => {
		const loaded = result.totalBytesWritten;
		const total = result.totalBytesExpectedToWrite;
		const progressBytes = loaded - bytesNotified;
		const rate = _speedometer(progressBytes);
		const inRange = loaded <= total;

		bytesNotified = loaded;

		const data: AxiosProgressEvent = {
			loaded,
			total,
			progress: total ? loaded / total : undefined,
			bytes: progressBytes,
			rate: rate || undefined,
			estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
			event: result,
			lengthComputable: true,
		};
		data[isDownloadStream ? "download" : "upload"] = true;
		listener(data);
	};
};
