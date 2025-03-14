import { AxiosAdapter, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError, AxiosHeaderValue } from 'axios';

declare module "axios" {
    interface AxiosRequestConfig extends Omit<UniApp.RequestOptions, "success" | "fail" | "complete" | "header">, Omit<UniApp.UploadFileOption, "success" | "fail" | "complete" | "header" | "formData">, Omit<UniApp.DownloadFileOption, "success" | "fail" | "complete" | "header">, Partial<Pick<UniApp.RequestTask, "onHeadersReceived">> {
    }
    interface AxiosResponse {
        cookies?: string[];
    }
    interface Axios {
        /**
         * 文件上传
         */
        upload<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
        /**
         * 文件下载
         */
        download<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    }
}

declare const createUniAppAxiosAdapter: () => AxiosAdapter;

type CacheGetHandle = (key: string) => any;
type CacheGetUseHandle = {
    use: (fn: CacheGetHandle) => void;
};
type CacheSetHandle = (key: string, value: any) => void;
type CacheSetUseHandle = {
    use: (fn: CacheSetHandle) => void;
};
declare class CacheManage {
    private _handle;
    /** 获取 */
    readonly get: CacheGetHandle & CacheGetUseHandle;
    /** 设置 */
    readonly set: CacheSetHandle & CacheSetUseHandle;
    private _cacheRecord;
    constructor();
}

/**
 * RESTful风格Api响应
 */
type ApiResponse<Output = any, Input = any> = {
    /**
     * 执行成功
     */
    success?: boolean;
    /**
     * 状态码
     */
    code?: number;
    /**
     * 错误信息
     */
    message?: string;
    /**
     * 数据
     */
    data?: Output;
    /**
     * 时间戳
     */
    timestamp?: number;
    /**
     * 响应
     */
    response?: AxiosResponse<Output, Input>;
};
/**
 * 请求类型
 */
type RequestType = "auth" | "query" | "add" | "edit" | "delete" | "import" | "export" | "download" | "upload" | "other";
/**
 * Axios 选项
 */
type AxiosOptions = {
    /**
     * 是否开启取消重复请求, 默认为
     * @default true
     */
    cancelDuplicateRequest?: boolean;
    /**
     * 是否开启loading层效果
     * @default false
     */
    loading?: boolean;
    /**
     * 加载文字
     * @default '加载中...'
     */
    loadingText?: string;
    /**
     * 是否开启缓存，只有Get请求才行
     * @default false
     */
    cache?: boolean;
    /**
     * Get请求缓存问题处理
     * @default true
     */
    getMethodCacheHandle?: boolean;
    /**
     * 是否开启简洁的数据结构响应
     * - 只有响应格式是JSON并且是RESTFUL风格返回的才开启
     * @default true
     */
    simpleDataFormat?: boolean;
    /**
     * 是否开启接口错误信息展示
     * @default true
     */
    showErrorMessage?: boolean;
    /**
     * 是否开启code信息提示
     * - code >= 200 && code <= 299 则不提示
     * @default true
     * @description 只有RESTFUL风格返回的才开启
     */
    showCodeMessage?: boolean;
    /**
     * 是否开启自动下载文件
     * - 只有 responseType 配置了 "blob" 才会自动下载
     * - UniApp下不可用
     * @default true
     */
    autoDownloadFile?: boolean;
    /**
     * 请求加密，优先级高于 useAxios().requestCipher
     * @default undefined
     */
    requestCipher?: boolean;
    /**
     * RESTFUL风格返回
     * @default true
     */
    restfulResult?: boolean;
};
type FastAxiosRequestConfig<Input> = AxiosRequestConfig<Input> & {
    /**
     * 请求类型
     */
    requestType: RequestType;
} & AxiosOptions;

type CryptoEncryptHandle = <Input>(config: InternalAxiosRequestConfig<Input>, timestamp: number) => void;
type CryptoEncryptUseHandle = {
    use: (fn: CryptoEncryptHandle) => void;
};
type CryptoDecryptHandle = <Output = any, Input = any>(response: AxiosResponse<Output, Input>, options: FastAxiosRequestConfig<Input>) => any | void;
type CryptoDecryptUseHandle = {
    use: (fn: CryptoDecryptHandle) => void;
};
declare class CryptoManage {
    private _handle;
    /** 加密 */
    readonly encrypt: CryptoEncryptHandle & CryptoEncryptUseHandle;
    /** 解密 */
    readonly decrypt: CryptoDecryptHandle & CryptoDecryptUseHandle;
    constructor();
}

type InterceptorsRequestHandle = <Input = any>(config: InternalAxiosRequestConfig<Input>) => void;
type InterceptorsRequestUseHandle = {
    use: (fn: InterceptorsRequestHandle) => void;
};
type InterceptorsResponseHandle = <Output = any, Input = any>(response: AxiosResponse<Output, Input>, options: FastAxiosRequestConfig<Input>) => any | void;
type InterceptorsResponseUseHandle = {
    use: (fn: InterceptorsResponseHandle) => void;
};
type InterceptorsResponseErrorHandle = (error: AxiosError | any, options: FastAxiosRequestConfig<any>) => any | void;
type InterceptorsResponseErrorUseHandle = {
    use: (fn: InterceptorsResponseErrorHandle) => void;
};
declare class InterceptorsManage {
    private _handle;
    /** 请求拦截器 */
    readonly request: InterceptorsRequestHandle & InterceptorsRequestUseHandle;
    /** 响应拦截器 */
    readonly response: InterceptorsResponseHandle & InterceptorsResponseUseHandle;
    /** 响应错误处理 */
    readonly responseError: InterceptorsResponseErrorHandle & InterceptorsResponseErrorUseHandle;
    constructor();
}

type LoadingShowHandle = (text: string) => void;
type LoadingShowUseHandle = {
    use: (fn: LoadingShowHandle) => void;
};
type LoadingCloseHandle = (options: AxiosOptions) => void;
type LoadingCloseUseHandle = {
    use: (fn: LoadingCloseHandle) => void;
};
declare class LoadingManage {
    private _handle;
    /** 显示 */
    readonly show: LoadingShowHandle & LoadingShowUseHandle;
    /** 关闭 */
    readonly close: LoadingCloseHandle & LoadingCloseUseHandle;
    constructor();
}

type MessageHandle = (message: string) => void;
type MessageUseHandle = {
    use: (fn: MessageHandle) => void;
};
declare class MessageManage {
    private _handle;
    /** 成功 */
    readonly success: MessageHandle & MessageUseHandle;
    /** 警告 */
    readonly warning: MessageHandle & MessageUseHandle;
    /** 信息 */
    readonly info: MessageHandle & MessageUseHandle;
    /** 错误 */
    readonly error: MessageHandle & MessageUseHandle;
    constructor();
}

type MessageBoxHandle = (options: {
    /** 消息 */
    message: string;
    /** 类型 */
    type?: "success" | "warning" | "info" | "error";
    /** 取消按钮文字 */
    cancelButtonText?: string;
    /** 确认按钮文字 */
    confirmButtonText?: string;
}) => Promise<void>;
type MessageBoxUseHandle = {
    use: (fn: MessageBoxHandle) => void;
};
declare class MessageBoxManage {
    private _handle;
    /** 确认弹窗 */
    readonly confirm: MessageBoxHandle & MessageBoxUseHandle;
    constructor();
}

type InitializeOptions = Partial<Pick<FastAxios, "baseUrl" | "timeout" | "headers" | "requestCipher">>;
type CodeKeyType = string | number;
declare class FastAxios {
    static instance: FastAxios;
    constructor(options?: InitializeOptions);
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
}
/**
 * 初始化 fast-axios
 * @param options 基础选项
 * @param newInstance 是否强制创建新的实例
 * @returns
 */
declare const createFastAxios: (options?: InitializeOptions, newInstance?: boolean) => FastAxios;
/**
 * 获取 fast-axios 实例
 */
declare const useFastAxios: () => FastAxios;

declare const axiosUtil: {
    /**
     * 请求
     * @param axiosConfig axios 请求配置
     * @param loading loading配置
     */
    request: <Output = any, Input = any>(axiosConfig: FastAxiosRequestConfig<Input>) => Promise<Output>;
    /**
     * 下载文件
     */
    downloadFile: (response: AxiosResponse) => void;
};

export { type ApiResponse, type AxiosOptions, type FastAxiosRequestConfig, type RequestType, axiosUtil, createFastAxios, createUniAppAxiosAdapter, useFastAxios };
