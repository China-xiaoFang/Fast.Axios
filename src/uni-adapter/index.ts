import { type AxiosAdapter, type AxiosRequestConfig } from "axios";
import { Axios } from "axios";
import { getMethod } from "./methods";

export * from "./axios.type";

export const createUniAppAxiosAdapter = (): AxiosAdapter => {
	// 新增 download 方法
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	Axios.prototype.download = function (url, config) {
		return this.request({
			url,
			method: "download",
			...config,
		});
	};

	// 新增 upload 方法
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	Axios.prototype.upload = function (url, data, config) {
		return this.request({
			url,
			method: "upload",
			data,
			...config,
		});
	};

	const uniAppAdapter: AxiosAdapter = (config: AxiosRequestConfig) => {
		const method = getMethod(config);
		return method(config);
	};

	return uniAppAdapter;
};
