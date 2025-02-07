import type { AxiosRequestConfig } from "axios";
import type { Method } from "../type";
import { getMethodType } from "../utils";
import download from "./download";
import request from "./request";
import upload from "./upload";

export const getMethod = (config: AxiosRequestConfig): Method => {
	const methodType = getMethodType(config);
	switch (methodType) {
		case "download":
			return download;
		case "upload":
			return upload;
		default:
			return request;
	}
};
