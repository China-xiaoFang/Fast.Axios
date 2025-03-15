import { FastAxiosRequestConfig } from './types';
import { AxiosResponse } from 'axios';
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
export * from './types/options';
export * from './fastAxios';
