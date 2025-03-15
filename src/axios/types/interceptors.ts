import type { FastAxiosRequestConfig } from "./options";
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

type InterceptorsRequestHandle = <Input = any>(config: InternalAxiosRequestConfig<Input>) => void;
type InterceptorsRequestUseHandle = { use: (fn: InterceptorsRequestHandle) => void };
type InterceptorsResponseHandle = <Output = any, Input = any>(
	response: AxiosResponse<Output, Input>,
	options: FastAxiosRequestConfig<Input>
) => any | void;
type InterceptorsResponseUseHandle = { use: (fn: InterceptorsResponseHandle) => void };
type InterceptorsResponseErrorHandle = (error: AxiosError | any, options: FastAxiosRequestConfig<any>) => any | void;
type InterceptorsResponseErrorUseHandle = { use: (fn: InterceptorsResponseErrorHandle) => void };

export class InterceptorsManage {
	private _handle: {
		request: InterceptorsRequestHandle;
		response: InterceptorsResponseHandle;
		responseError: InterceptorsResponseErrorHandle;
	};

	/** 请求拦截器 */
	readonly request: InterceptorsRequestHandle & InterceptorsRequestUseHandle;
	/** 响应拦截器 */
	readonly response: InterceptorsResponseHandle & InterceptorsResponseUseHandle;
	/** 响应错误处理 */
	readonly responseError: InterceptorsResponseErrorHandle & InterceptorsResponseErrorUseHandle;

	constructor() {
		this._handle = {
			request: <Input = any>(config: InternalAxiosRequestConfig<Input>): void => {
				return;
			},
			response: <Output = any, Input = any>(response: AxiosResponse<Output, Input>, options: FastAxiosRequestConfig<Input>): any | void => {
				return null;
			},
			responseError: (error: AxiosError | any, options: FastAxiosRequestConfig<any>): any | void => {
				return null;
			},
		};

		const requestProxy: InterceptorsRequestHandle & InterceptorsRequestUseHandle = <Input = any>(
			config: InternalAxiosRequestConfig<Input>
		): void => {
			this._handle.request(config);
		};
		requestProxy.use = (fn: InterceptorsRequestHandle): void => {
			this._handle.request = fn;
		};
		this.request = requestProxy;

		const responseProxy: InterceptorsResponseHandle & InterceptorsResponseUseHandle = <Output = any, Input = any>(
			response: AxiosResponse<Output, Input>,
			options: FastAxiosRequestConfig<Input>
		): any | void => {
			this._handle.response(response, options);
		};
		responseProxy.use = (fn: InterceptorsResponseHandle): void => {
			this._handle.response = fn;
		};
		this.response = responseProxy;

		const responseErrorProxy: InterceptorsResponseErrorHandle & InterceptorsResponseErrorUseHandle = (
			error: AxiosError | any,
			options: FastAxiosRequestConfig<any>
		): any | void => {
			this._handle.responseError(error, options);
		};
		responseErrorProxy.use = (fn: InterceptorsResponseErrorHandle): void => {
			this._handle.responseError = fn;
		};
		this.responseError = responseErrorProxy;
	}
}
