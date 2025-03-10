import { FastAxiosOption } from './type';
/**
 * 初始化 fast-axios
 */
export declare const createFastAxios: (options: Pick<FastAxiosOption, "baseUrl" | "timeout" | "headers" | "requestCipher">) => FastAxiosOption;
/**
 * 获取 fast-axios 实例
 */
export declare const useFastAxios: () => FastAxiosOption;
