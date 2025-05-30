import { AxiosError, AxiosHeaders } from "axios";
// @ts-expect-error ignore
import settle from "axios/unsafe/core/settle";
import { resolveUniAppRequestOptions } from "../utils";
import OnCanceled from "./onCanceled";
import type { Method } from "../type";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const request: Method = (config) => {
	return new Promise((resolve, reject) => {
		const requestOptions = resolveUniAppRequestOptions(config);
		const responseConfig = config as InternalAxiosRequestConfig;
		responseConfig.headers = new AxiosHeaders(requestOptions.header);

		const onCanceled = new OnCanceled(config);
		let task: UniApp.RequestTask | null = uni.request({
			...requestOptions,
			success(result) {
				if (!task) return;

				const headers = new AxiosHeaders(result.header);
				const response: AxiosResponse = {
					config: responseConfig,
					data: result.data,
					headers,
					status: result.statusCode,
					statusText: result.errMsg ?? "OK",
					request: task,
					cookies: result.cookies,
				};
				settle(resolve, reject, response);
				task = null;
			},
			fail(error) {
				const { errMsg = "" } = error ?? {};
				if (errMsg) {
					const isTimeoutError = errMsg === "request:fail timeout";
					const isNetworkError = errMsg === "request:fail ";
					if (isTimeoutError) reject(new AxiosError(errMsg, AxiosError.ETIMEDOUT, responseConfig, task));

					if (isNetworkError) {
						reject(new AxiosError(errMsg, AxiosError.ERR_NETWORK, responseConfig, task));
					}
				}
				reject(new AxiosError(error.errMsg, undefined, responseConfig, task));
				task = null;
			},
			complete() {
				onCanceled.unsubscribe();
			},
		});

		if (typeof config.onHeadersReceived === "function") task.onHeadersReceived(config.onHeadersReceived);

		onCanceled.subscribe(task, reject);
	});
};

export default request;
