import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { FastAxiosRequestConfig } from './options';
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
export declare class InterceptorsManage {
    private _handle;
    /** 请求拦截器 */
    readonly request: InterceptorsRequestHandle & InterceptorsRequestUseHandle;
    /** 响应拦截器 */
    readonly response: InterceptorsResponseHandle & InterceptorsResponseUseHandle;
    /** 响应错误处理 */
    readonly responseError: InterceptorsResponseErrorHandle & InterceptorsResponseErrorUseHandle;
    constructor();
}
export {};
