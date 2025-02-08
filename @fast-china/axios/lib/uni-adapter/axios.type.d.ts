declare module "axios" {
    interface AxiosRequestConfig extends Omit<UniApp.RequestOptions, "success" | "fail" | "complete" | "header">, Omit<UniApp.UploadFileOption, "success" | "fail" | "complete" | "header" | "formData">, Omit<UniApp.DownloadFileOption, "success" | "fail" | "complete" | "header">, Partial<Pick<UniApp.RequestTask, "onHeadersReceived">> {
    }
    interface AxiosResponse {
        cookies?: string[];
    }
    interface Axios {
        /**
         * 文件上传
         */
        upload<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
        /**
         * 文件下载
         */
        download<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    }
}
export {};
