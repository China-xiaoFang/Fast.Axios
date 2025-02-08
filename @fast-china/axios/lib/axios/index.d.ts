import { AxiosResponse } from 'axios';
import { FastAxiosRequestConfig } from './type';
/**
 * Http 缓存 Key
 */
export declare const HTTP_CACHE_KEY = "HTTP_CACHE_";
export declare const axiosUtil: {
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
export * from './type';
export * from './useAxios';
