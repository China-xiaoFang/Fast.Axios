import { merge } from "lodash-unified";
import type { AxiosOptions, FastAxiosOption } from "./type";

const defaultState: FastAxiosOption = {
	timeout: 60000,
	requestCipher: true,
	loading: {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		show: (text: string): void => {},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		close: (options: AxiosOptions): void => {},
	},
	message: {
		success: (message) => {
			// eslint-disable-next-line no-console
			console.log(`[Fast.Axios] ${message}`);
		},
		warning: (message) => {
			console.warn(`[Fast.Axios] ${message}`);
		},
		info: (message) => {
			// eslint-disable-next-line no-console
			console.log(`[Fast.Axios] ${message}`);
		},
		error: (message) => {
			console.error(`[Fast.Axios] ${message}`);
		},
	},
	messageBox: {
		confirm: (options) => {
			if (typeof uni !== "undefined") {
				return new Promise((resolve, reject) => {
					uni.showModal({
						title: "温馨提示",
						content: options.message,
						cancelText: options.cancelButtonText,
						confirmText: options.confirmButtonText,
						success: (res) => {
							if (res.confirm) {
								resolve();
							} else {
								reject();
							}
						},
						fail: (res) => {
							res && console.error(res);
							throw new Error("'uni.showModal' Api调用异常。");
						},
					});
				});
			} else {
				return new Promise((resolve, reject) => {
					if (typeof window.confirm === "undefined") {
						throw new Error("'window.confirm' Api调用异常。");
					}
					// eslint-disable-next-line no-alert
					if (window.confirm(options.message)) {
						resolve();
					} else {
						reject();
					}
				});
			}
		},
	},
};

class FastAxios {
	// eslint-disable-next-line no-use-before-define
	private static instance: FastAxios;
	private state: FastAxiosOption;

	public constructor(options?: FastAxiosOption) {
		this.state = merge(defaultState, options || {});
	}

	/** 获取实例 */
	public static getInstance(): FastAxios {
		if (!FastAxios.instance) {
			return new FastAxios();
			// throw new Error("请先调用 'createFastAxios' 初始化 'fast-axios'。");
		}

		return FastAxios.instance;
	}

	/**
	 * 设置选项
	 * @param key
	 * @param value
	 */
	setOptions<K extends keyof FastAxiosOption>(key: K, value: FastAxiosOption[K]): void {
		this.state[key] = merge(this.state[key], value);
	}

	/** 请求域名或者Base路径 */
	get baseUrl(): FastAxiosOption["baseUrl"] {
		return this.state.baseUrl;
	}

	/** 请求域名或者Base路径 */
	set baseUrl(value: FastAxiosOption["baseUrl"]) {
		this.setOptions("baseUrl", value);
	}

	/**
	 * 超时时间，单位毫秒
	 * @default 60000
	 */
	get timeout(): FastAxiosOption["timeout"] {
		return this.state.timeout;
	}

	/**
	 * 超时时间，单位毫秒
	 * @default 60000
	 */
	set timeout(value: FastAxiosOption["timeout"]) {
		this.setOptions("timeout", value);
	}

	/** 默认头部 */
	get headers(): FastAxiosOption["headers"] {
		return this.state.headers;
	}

	/** 默认头部 */
	set headers(value: FastAxiosOption["headers"]) {
		this.setOptions("headers", value);
	}

	/**
	 * 请求加密解密
	 * @default true
	 */
	get requestCipher(): FastAxiosOption["requestCipher"] {
		return this.state.requestCipher;
	}

	/**
	 * 请求加密解密
	 * @default true
	 */
	set requestCipher(value: FastAxiosOption["requestCipher"]) {
		this.setOptions("requestCipher", value);
	}

	/** 加载 @description 需要自行处理多次调用的问题 */
	get loading(): FastAxiosOption["loading"] {
		return this.state.loading;
	}

	/** 加载 @description 需要自行处理多次调用的问题 */
	set loading(value: FastAxiosOption["loading"]) {
		this.setOptions("loading", value);
	}

	/** 消息提示 */
	get message(): FastAxiosOption["message"] {
		return this.state.message;
	}

	/** 消息提示 */
	set message(value: FastAxiosOption["message"]) {
		this.setOptions("message", value);
	}

	/** 消息提示框 */
	get messageBox(): FastAxiosOption["messageBox"] {
		return this.state.messageBox;
	}

	/** 消息提示框 */
	set messageBox(value: FastAxiosOption["messageBox"]) {
		this.setOptions("messageBox", value);
	}

	/** 缓存 */
	get cache(): FastAxiosOption["cache"] {
		return this.state.cache;
	}

	/** 缓存 */
	set cache(value: FastAxiosOption["cache"]) {
		this.setOptions("cache", value);
	}

	/** 加密解密 */
	get crypto(): FastAxiosOption["crypto"] {
		return this.state.crypto;
	}

	/** 加密解密 */
	set crypto(value: FastAxiosOption["crypto"]) {
		this.setOptions("crypto", value);
	}

	/** 拦截器 */
	get interceptors(): FastAxiosOption["interceptors"] {
		return this.state.interceptors;
	}

	/** 拦截器 */
	set interceptors(value: FastAxiosOption["interceptors"]) {
		this.setOptions("interceptors", value);
	}
}

/**
 * 初始化 fast-axios
 */
export const createFastAxios = (options: Pick<FastAxiosOption, "baseUrl" | "timeout" | "headers" | "requestCipher">): FastAxiosOption => {
	return new FastAxios(options);
};

/**
 * 获取 fast-axios 实例
 */
export const useFastAxios = (): FastAxiosOption => {
	return FastAxios.getInstance();
};
