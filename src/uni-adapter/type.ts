import type { AxiosPromise, AxiosRequestConfig } from "axios";

export type MethodType = "request" | "download" | "upload";

export type Method = (config: AxiosRequestConfig) => AxiosPromise;

export type UniNetworkRequestWithoutCallback = Omit<UniApp.RequestOptions, "success" | "fail" | "complete"> &
	Omit<UniApp.DownloadFileOption, "success" | "fail" | "complete"> &
	Omit<UniApp.UploadFileOption, "success" | "fail" | "complete">;
