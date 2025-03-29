import { AxiosHeaders, AxiosError } from "axios";
import settle from "../../node_modules/.pnpm/axios@1.8.4/node_modules/axios/lib/core/settle.mjs";
import { resolveUniAppRequestOptions, progressEventReducer } from "../utils/index.mjs";
import OnCanceled from "./onCanceled.mjs";
const download = (config) => {
  return new Promise((resolve, reject) => {
    const requestOptions = resolveUniAppRequestOptions(config);
    const responseConfig = config;
    responseConfig.headers = new AxiosHeaders(requestOptions.header);
    const onCanceled = new OnCanceled(config);
    let task = uni.downloadFile({
      ...requestOptions,
      success(result) {
        if (!task) return;
        const response = {
          config: responseConfig,
          data: result.tempFilePath,
          headers: {},
          status: result.statusCode,
          statusText: result.errMsg ?? "OK",
          request: task
        };
        settle(resolve, reject, response);
        task = null;
      },
      fail(error) {
        const { errMsg = "" } = error ?? {};
        if (errMsg) {
          const isTimeoutError = errMsg === "downloadFile:fail timeout";
          if (isTimeoutError) reject(new AxiosError(errMsg, AxiosError.ETIMEDOUT, responseConfig, task));
          const isNetworkError = errMsg === "downloadFile:fail ";
          if (isNetworkError) {
            reject(new AxiosError(errMsg, AxiosError.ERR_NETWORK, responseConfig, task));
          }
        }
        reject(new AxiosError(error.errMsg, void 0, responseConfig, task));
        task = null;
      },
      complete() {
        onCanceled.unsubscribe();
      }
    });
    if (typeof config.onDownloadProgress === "function") {
      task.onProgressUpdate(progressEventReducer(config.onDownloadProgress, true));
    }
    if (typeof config.onHeadersReceived === "function") task.onHeadersReceived(config.onHeadersReceived);
    onCanceled.subscribe(task, reject);
  });
};
export {
  download as default
};
//# sourceMappingURL=download.mjs.map
