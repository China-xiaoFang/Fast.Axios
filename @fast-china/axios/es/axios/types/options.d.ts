import { AxiosRequestConfig, AxiosResponse } from 'axios';
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
