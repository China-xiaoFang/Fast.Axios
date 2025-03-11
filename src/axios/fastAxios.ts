import type { AxiosHeaderValue } from "axios";
import { AxiosError } from "axios";
import { isNil } from "lodash-unified";
import { CacheManage, CryptoManage, InterceptorsManage, LoadingManage, MessageBoxManage, MessageManage } from "./types";

// eslint-disable-next-line no-use-before-define
type InitializeOptions = Partial<Pick<FastAxios, "baseUrl" | "timeout" | "headers" | "requestCipher">>;

type CodeKeyType = string | number;

class FastAxios {
	// eslint-disable-next-line no-use-before-define
	static instance: FastAxios;

	constructor(options?: InitializeOptions) {
		this.baseUrl = options?.baseUrl;
		this.timeout = options?.timeout ?? 60000;
		this.headers = options?.headers ?? {};
		this.requestCipher = isNil(options.requestCipher) ? true : false;

		this.errorCode = {
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

		this.loading = new LoadingManage();
		this.message = new MessageManage();
		this.messageBox = new MessageBoxManage();
		this.cache = new CacheManage();
		this.crypto = new CryptoManage();
		this.interceptors = new InterceptorsManage();
	}

	/** 请求域名或者Base路径 */
	readonly baseUrl: string;

	/**
	 * 超时时间，单位毫秒
	 * @default 60000
	 */
	readonly timeout: number;

	/** 默认头部 */
	readonly headers: {
		[key: string]: AxiosHeaderValue;
	};

	/**
	 * 请求加密解密
	 * @default true
	 */
	readonly requestCipher: boolean;

	/** 错误Code */
	readonly errorCode: Record<CodeKeyType, string>;

	/** 加载 @description 需要自行处理多次调用的问题 */
	readonly loading: LoadingManage;

	/** 消息提示 */
	readonly message: MessageManage;

	/** 消息提示框 */
	readonly messageBox: MessageBoxManage;

	/** 缓存 */
	readonly cache: CacheManage;

	/** 加密解密 */
	readonly crypto: CryptoManage;

	/** 拦截器 */
	readonly interceptors: InterceptorsManage;

	/** 添加错误Code */
	addErrorCode(key: CodeKeyType, message: string): FastAxios;
	/** 添加错误Code */
	addErrorCode(codes: Record<CodeKeyType, string>): FastAxios;

	addErrorCode(arg: CodeKeyType | Record<CodeKeyType, string>, message?: string): FastAxios {
		if (typeof arg === "string" || typeof arg === "number") {
			this.errorCode[arg] = message;
		} else {
			for (const key in arg) {
				this.errorCode[key] = arg[key];
			}
		}
		return this;
	}
}

/**
 * 初始化 fast-axios
 * @param options 基础选项
 * @param newInstance 是否强制创建新的实例
 * @returns
 */
export const createFastAxios = (options?: InitializeOptions, newInstance = false): FastAxios => {
	if (newInstance) {
		return new FastAxios(options);
	} else {
		if (!FastAxios.instance) {
			const fastAxios = new FastAxios(options);
			FastAxios.instance = fastAxios;
		}
		return FastAxios.instance;
	}
};

/**
 * 获取 fast-axios 实例
 */
export const useFastAxios = (): FastAxios => {
	if (!FastAxios.instance) {
		throw new Error("请先调用 'createFastAxios' 初始化 'fast-axios'。");
	}

	return FastAxios.instance;
};
