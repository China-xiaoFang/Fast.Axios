import { AxiosError, AxiosHeaderValue, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
/**
 * RESTful风格Api响应
 */
export type ApiResponse<Output = any, Input = any> = {
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
export type RequestType = "auth" | "query" | "add" | "edit" | "delete" | "import" | "export" | "download" | "upload" | "other";
/**
 * Axios 选项
 */
export type AxiosOptions = {
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
export type FastAxiosRequestConfig<Input> = AxiosRequestConfig<Input> & {
    /**
     * 请求类型
     */
    requestType: RequestType;
} & AxiosOptions;
export type UseAxiosType = {
    /** 请求域名或者Base路径 */
    baseUrl?: string;
    /**
     * 超时时间，单位毫秒
     * @default 60000
     */
    timeout?: number;
    /** 默认头部 */
    headers?: {
        [key: string]: AxiosHeaderValue;
    };
    /**
     * 请求加密解密
     * @default true
     */
    requestCipher?: boolean;
    /** 加载 @description 需要自行处理多次调用的问题 */
    loading?: {
        /** 显示 */
        show: (text: string) => void;
        /** 关闭 */
        close: (options: AxiosOptions) => void;
    };
    /** 消息提示 */
    message?: {
        /** 成功 */
        success: (message: string) => void;
        /** 警告 */
        warning: (message: string) => void;
        /** 信息 */
        info: (message: string) => void;
        /** 错误 */
        error: (message: string) => void;
    };
    /** 消息提示框 */
    messageBox?: {
        /** 确认弹窗 */
        confirm: (options: {
            /** 消息 */
            message: string;
            /** 类型 */
            type?: "success" | "warning" | "info" | "error";
            /** 取消按钮文字 */
            cancelButtonText?: string;
            /** 确认按钮文字 */
            confirmButtonText?: string;
        }) => Promise<void>;
    };
    /** 缓存 */
    cache?: {
        /** 获取 */
        get: (key: string) => any;
        /** 设置 */
        set: (key: string, value: any) => void;
    };
    /** 加密解密 */
    crypto?: {
        /** 加密 */
        encrypt: <Input>(config: InternalAxiosRequestConfig<Input>, timestamp: number) => void;
        /** 解密 */
        decrypt: <Output = any, Input = any>(response: AxiosResponse<Output, Input>, options: FastAxiosRequestConfig<Input>) => any | void;
    };
    /** 拦截器 */
    interceptors?: {
        /** 请求拦截器 */
        request?: <Input = any>(config: InternalAxiosRequestConfig<Input>) => void;
        /** 响应拦截器 */
        response?: <Output = any, Input = any>(response: AxiosResponse<Output, Input>, options: FastAxiosRequestConfig<Input>) => any | void;
        /** 响应错误处理 */
        responseError?: (error: AxiosError | any, options: FastAxiosRequestConfig<any>) => any | void;
    };
};
