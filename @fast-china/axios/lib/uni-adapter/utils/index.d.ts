import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { MethodType, UniNetworkRequestWithoutCallback } from '../type';
/**
 * 获取请求方法
 */
export declare const getMethodType: <T>(config: AxiosRequestConfig<T>) => MethodType;
/**
 * 解析 UniApp 请求选项
 * @param config
 */
export declare const resolveUniAppRequestOptions: (config: AxiosRequestConfig) => UniNetworkRequestWithoutCallback;
/**
 * 处理 Axios 上传或下载进度
 * - https://github.com/axios/axios/blob/7d45ab2e2ad6e59f5475e39afd4b286b1f393fc0/lib/adapters/xhr.js#L17-L44
 * @param listener
 * @param isDownloadStream 是否为下载流
 */
export declare const progressEventReducer: (listener: (progressEvent: AxiosProgressEvent) => void, isDownloadStream: boolean) => (result: UniApp.OnProgressDownloadResult) => void;
