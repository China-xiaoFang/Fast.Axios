import { AxiosHeaders, AxiosError } from "axios";
import settle from "../../node_modules/.pnpm/axios@1.8.4/node_modules/axios/lib/core/settle.mjs";
import { resolveUniAppRequestOptions } from "../utils/index.mjs";
import OnCanceled from "./onCanceled.mjs";
const request = (config) => {
  return new Promise((resolve, reject) => {
    const requestOptions = resolveUniAppRequestOptions(config);
    const responseConfig = config;
    responseConfig.headers = new AxiosHeaders(requestOptions.header);
    const onCanceled = new OnCanceled(config);
    let task = uni.request({
      ...requestOptions,
      success(result) {
        if (!task) return;
        const headers = new AxiosHeaders(result.header);
        const response = {
          config: responseConfig,
          data: result.data,
          headers,
          status: result.statusCode,
          statusText: result.errMsg ?? "OK",
          request: task,
          cookies: result.cookies
        };
        settle(resolve, reject, response);
        task = null;
      },
      fail(error) {
        const { errMsg = "" } = error ?? {};
        if (errMsg) {
          const isTimeoutError = errMsg === "request:fail timeout";
          const isNetworkError = errMsg === "request:fail ";
          if (isTimeoutError) reject(new AxiosError(errMsg, AxiosError.ETIMEDOUT, responseConfig, task));
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
    if (typeof config.onHeadersReceived === "function") task.onHeadersReceived(config.onHeadersReceived);
    onCanceled.subscribe(task, reject);
  });
};
export {
  request as default
};
//# sourceMappingURL=request.mjs.map
