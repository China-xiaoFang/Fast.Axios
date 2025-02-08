import type { AxiosOptions, UseAxiosType } from "./type";

const state: UseAxiosType = {
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

export const useAxios = (): UseAxiosType & { setOptions: (options: UseAxiosType) => void } => {
	return {
		...state,
		/** 配置选项 */
		setOptions: (options: UseAxiosType): void => {
			for (const key in options) {
				if (Object.prototype.hasOwnProperty.call(options, key)) {
					// 如果是对象类型的配置，进行深度合并
					if (typeof options[key] === "object" && options[key] !== null && state[key] && typeof state[key] === "object") {
						state[key] = { ...state[key], ...options[key] };
					} else {
						// 否则直接更新
						state[key] = options[key];
					}
				}
			}
		},
	};
};
