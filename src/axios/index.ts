import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";
import { isNil, isObject, isString } from "lodash-unified";
import type { ApiResponse, AxiosOptions, FastAxiosRequestConfig } from "./type";
import { useAxios } from "./useAxios";
import { createUniAppAxiosAdapter } from "../uni-adapter";

const axiosOptions: AxiosOptions = {
	cancelDuplicateRequest: true,
	loading: false,
	loadingText: "加载中...",
	cache: false,
	getMethodCacheHandle: true,
	simpleDataFormat: true,
	showErrorMessage: true,
	showCodeMessage: true,
	autoDownloadFile: true,
	restfulResult: true,
};

const errorCodeMessages = {
	cancelDuplicate: "重复请求，自动取消！",
	offLine: "您断网了！",
	fileDownloadError: "文件下载失败或此文件不存在！",
	302: "接口重定向了！",
	400: "参数不正确！",
	401: "您没有权限操作（令牌、用户名、密码错误）！",
	403: "您的访问是被禁止的！",
	404: "请求的资源不存在！",
	405: "请求的格式不正确！",
	408: "请求超时！",
	409: "系统已存在相同数据！",
	410: "请求的资源被永久删除，且不会再得到的！",
	422: "当创建一个对象时，发生一个验证错误！",
	429: "请求过于频繁，请稍后再试！",
	500: "服务器内部错误！",
	501: "服务未实现！",
	502: "网关错误！",
	503: "服务不可用，服务器暂时过载或维护！",
	504: "服务暂时无法访问，请稍后再试！",
	505: "HTTP版本不受支持！",
	[AxiosError.ETIMEDOUT]: "请求超时！",
	[AxiosError.ECONNABORTED]: "连接中断，服务器暂时过载或维护！",
	[AxiosError.ERR_NETWORK]: "网关错误，服务不可用，服务器暂时过载或维护！",
};

const pendingMap = new Map();

/**
 * 生成每个请求的唯一key
 */
const getPendingKey = (axiosConfig: AxiosRequestConfig): string => {
	let { data } = axiosConfig;
	const { url, method, params } = axiosConfig;
	// response里面返回的config.data是个字符串对象
	if (isString(data)) data = JSON.parse(data);
	return [url, method, JSON.stringify(params), JSON.stringify(data)].join("&");
};

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 */
const addPending = (pendingKey: string, axiosConfig: AxiosRequestConfig): void => {
	axiosConfig.cancelToken =
		axiosConfig.cancelToken ||
		new axios.CancelToken((cancel) => {
			if (!pendingMap.has(pendingKey)) {
				pendingMap.set(pendingKey, cancel);
			}
		});
};

/**
 * 删除重复的请求
 */
const removePending = (pendingKey: string): void => {
	if (pendingMap.has(pendingKey)) {
		const cancelToken = pendingMap.get(pendingKey);
		cancelToken(pendingKey);
		pendingMap.delete(pendingKey);
	}
};

/**
 * Http 错误状态码处理
 */
const httpErrorStatusHandle = async (error: AxiosError | any): Promise<string> => {
	let message = "";
	// 其他错误码处理
	// 尝试获取 Restful 风格返回Code，或者获取响应状态码
	const code = error?.response?.data?.code || error?.response?.status || error?.code || "default";
	// 400业务异常
	// 500服务器内部错误，可能返回错误信息
	// 判断响应类型是否为blob
	if (error?.request?.responseType === "blob") {
		try {
			message = JSON.parse(await error?.response?.data?.text())?.message;
		} catch (err) {
			message = error?.response?.data?.message || errorCodeMessages[code];
		}
	} else {
		message = error?.response?.data?.message || errorCodeMessages[code];
	}
	return message;
};

/**
 * 下载文件
 */
const downloadFile = (response: AxiosResponse): void => {
	if (typeof uni !== "undefined") {
		// 暂不支持
	} else {
		const blob = new Blob([response.data], { type: "application/octet-stream;charset=UTF-8" });
		const contentDisposition = response.headers["content-disposition"];
		const pat = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
		const result = pat.exec(contentDisposition);
		const filename = result[1];
		const downloadElement = document.createElement("a");
		const href = window.URL.createObjectURL(blob); // 创建下载的链接
		const reg = /^["](.*)["]$/g;
		downloadElement.style.display = "none";
		downloadElement.href = href;
		downloadElement.download = decodeURI(filename.replace(reg, "$1")); // 下载后文件名
		document.body.appendChild(downloadElement);
		// 点击下载
		downloadElement.click();
		// 下载完成移除元素
		document.body.removeChild(downloadElement);
		window.URL.revokeObjectURL(href);
	}
};

/**
 * 创建 Axios
 * @param axiosConfig axios 请求配置
 * @param loading loading配置
 */
const createAxios = <Output = any, Input = any>(axiosConfig: FastAxiosRequestConfig<Input>): Promise<Output> => {
	const uAxios = useAxios();

	// 合并选项
	const options = { ...axiosOptions, ...axiosConfig };

	if (isNil(options.requestCipher)) {
		options.requestCipher = uAxios.requestCipher;
	}

	// 只有Get请求并且开启了简洁响应才可以进行缓存处理，且默认是不存在loading的
	if (options.cache && options.method.toUpperCase() === "GET" && options.restfulResult && options.simpleDataFormat) {
		// 如果启用缓存，则默认是不能携带参数的
		if (options.params) {
			console.warn("[Fast.Axios] 如果使用 Http Cache，则不能存在任何 'params' 参数");
		}

		if (uAxios.cache?.get) {
			const cacheRes = uAxios.cache.get(options.url);
			if (cacheRes) {
				return Promise.resolve(cacheRes);
			}
		}
	} else {
		// 不满足上述条件，则默认不使用缓存
		options.cache = false;
	}

	// 获取请求唯一 Key
	const pendingKey = getPendingKey(axiosConfig);

	const timestamp = Date.now();

	// 创建 Axios 请求
	const Axios = axios.create({
		/** 如果是 UniApp 则默认使用适配器 */
		adapter: typeof uni !== "undefined" ? createUniAppAxiosAdapter() : undefined,
		baseURL: uAxios.baseUrl,
		timeout: uAxios.timeout,
		headers: {
			...uAxios.headers,
		},
		responseType: "json",
	});

	/**
	 * 请求拦截
	 */
	Axios.interceptors.request.use(
		(config: InternalAxiosRequestConfig<Input>) => {
			// 删除重复请求
			removePending(pendingKey);

			// 判断是否开启取消重复请求
			options.cancelDuplicateRequest && addPending(pendingKey, config);

			// 自定义请求拦截器
			uAxios.interceptors?.request(config);

			// 判断是否显示loading层
			options.loading && uAxios.loading?.show(options.loadingText);

			if (config.responseType === "json") {
				// 请求参数加密
				if (options.requestCipher) {
					uAxios.crypto?.encrypt(config, timestamp);
				} else {
					// Get请求缓存处理
					if (options.getMethodCacheHandle && config.method.toUpperCase() === "GET") {
						config.params = config.params || {};
						config.params._ = timestamp;
					}
				}
			}

			return config;
		},
		(error) => {
			console.error("[Fast.Axios]", error);
			return Promise.reject(error);
		}
	);

	/**
	 * 响应拦截
	 */
	Axios.interceptors.response.use(
		(response: AxiosResponse<Output, Input>) => {
			// 删除重复请求标识
			removePending(pendingKey);

			// 关闭loading层
			options.loading && uAxios.loading?.close(options);

			// 自定义响应拦截器
			if (uAxios.interceptors?.response) {
				try {
					const result = uAxios.interceptors.response(response, options);
					if (!isNil(result)) {
						return Promise.resolve(result);
					}
				} catch (error) {
					console.error("[Fast.Axios]", error);
					return Promise.reject(error);
				}
			}

			if (response.config.responseType === "blob" || options.method.toUpperCase() === "DOWNLOAD") {
				if (response.status === 200) {
					// 判断是否自动下载
					if (options.autoDownloadFile) {
						downloadFile(response);
					}
					// 这里直接返回
					return Promise.resolve(response);
				} else {
					uAxios.message?.error(errorCodeMessages["fileDownloadError"]);
					return Promise.reject(response);
				}
			} else if (response.config.responseType === "json") {
				let responseData = response.data;
				if (options.restfulResult) {
					const restfulData = responseData as ApiResponse<Output, Input>;
					const code: number = restfulData?.code ?? response.status;
					if (code < 200 || code > 299 || restfulData?.success === false) {
						// 判断是否显示错误消息
						if (options.showCodeMessage) {
							// 判断返回的 message 是否为对象类型
							if (restfulData?.message) {
								if (isObject(restfulData?.message)) {
									uAxios.message?.error(JSON.stringify(restfulData?.message));
								} else {
									uAxios.message?.error(restfulData?.message);
								}
							}
						}
						console.error("[Fast.Axios]", new AxiosError(restfulData?.message ?? "服务器内部错误！"));
						return Promise.reject(new AxiosError(restfulData?.message ?? "服务器内部错误！"));
					}
				}

				// 请求响应解密
				if (options.requestCipher) {
					responseData = uAxios.crypto?.decrypt(response, options);
				}

				// 判断是否缓存
				if (options.cache && options.restfulResult && options.simpleDataFormat) {
					uAxios.cache?.set(options.url, (responseData as ApiResponse<Output, Input>)?.data);
				}

				if (options.simpleDataFormat) {
					return Promise.resolve((responseData as ApiResponse<Output, Input>)?.data);
				} else {
					return Promise.resolve(responseData);
				}
			} else {
				if (options.simpleDataFormat) {
					return Promise.resolve(response.data);
				} else {
					return Promise.resolve(response);
				}
			}
		},
		async (error: AxiosError) => {
			// 删除重复请求标识
			removePending(pendingKey);

			// 关闭loading层
			options.loading && uAxios.loading?.close(options);

			// 判断请求是否被取消
			if (axios.isCancel(error)) {
				console.warn(`[Fast.Axios] ${errorCodeMessages["cancelDuplicate"]}`);
				return Promise.reject();
			}

			// 判断是否断网
			if (!globalThis.navigator.onLine) {
				uAxios.message?.error(errorCodeMessages["offLine"]);
				return Promise.reject();
			}

			// 自定义响应错误拦截器
			if (uAxios.interceptors?.responseError) {
				try {
					const result = uAxios.interceptors.responseError(error, options);
					if (!isNil(result)) {
						return Promise.reject(result);
					}
				} catch (error) {
					console.error("[Fast.Axios]", error);
					return Promise.reject(error);
				}
			}

			// 处理错误状态码
			if (options.showErrorMessage) {
				const message = await httpErrorStatusHandle(error);
				uAxios.message?.error(message);
			}

			// 错误继续返回给到具体页面
			console.error("[Fast.Axios]", error);
			return Promise.reject(error);
		}
	);

	return Axios(options);
};

export const axiosUtil = {
	/**
	 * 请求
	 * @param axiosConfig axios 请求配置
	 * @param loading loading配置
	 */
	request: createAxios,
	/**
	 * 下载文件
	 */
	downloadFile,
};

export * from "./type";
export * from "./useAxios";
