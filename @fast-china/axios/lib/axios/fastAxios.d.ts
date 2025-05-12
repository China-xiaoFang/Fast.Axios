import { CacheManage, CryptoManage, InterceptorsManage, LoadingManage, MessageBoxManage, MessageManage } from './types';
import { AxiosHeaderValue } from 'axios';
type InitializeOptions = Partial<Pick<FastAxios, "baseUrl" | "timeout" | "headers" | "requestCipher">>;
type CodeKeyType = string | number;
declare class FastAxios {
    static instance: FastAxios;
    constructor(options?: InitializeOptions);
    /**
     * 设置选项
     * @param options 初始化选项
     */
    setOptions(options: InitializeOptions): FastAxios;
    private _baseUrl;
    /** 请求域名或者Base路径 */
    get baseUrl(): string;
    private _timeout;
    /**
     * 超时时间，单位毫秒
     * @default 60000
     */
    get timeout(): number;
    private _headers;
    /** 默认头部 */
    get headers(): {
        [key: string]: AxiosHeaderValue;
    };
    private _requestCipher;
    /**
     * 请求加密解密
     * @default true
     */
    get requestCipher(): boolean;
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
}
/**
 * 初始化 fast-axios
 * @param options 基础选项
 * @param newInstance 是否强制创建新的实例
 * @returns
 */
export declare const createFastAxios: (options?: InitializeOptions, newInstance?: boolean) => FastAxios;
/**
 * 获取 fast-axios 实例
 */
export declare const useFastAxios: () => FastAxios;
export {};
