import axios, { AxiosError } from "axios";
import { isString, isNil, isObject } from "lodash-unified";
import { useAxios } from "./useAxios.mjs";
import { createUniAppAxiosAdapter } from "../uni-adapter/index.mjs";
import "./type.mjs";
const axiosOptions = {
  cancelDuplicateRequest: true,
  loading: false,
  loadingText: "加载中...",
  cache: false,
  getMethodCacheHandle: true,
  simpleDataFormat: true,
  showErrorMessage: true,
  showCodeMessage: true,
  autoDownloadFile: true,
  restfulResult: true
};
const errorCodeMessages = {
  cancelDuplicate: "重复请求，自动取消！",
  offLine: "您断网了！",
  fileDownloadError: "文件下载失败或此文件不存在！",
  302: "接口重定向了！",
  400: "参数不正确！",
  401: "您没有权限操作（令牌、用户名、密码错误）！",
  403: "您的访问是被禁止的！",
  404: "请求的资源不存在！",
  405: "请求的格式不正确！",
  408: "请求超时！",
  409: "系统已存在相同数据！",
  410: "请求的资源被永久删除，且不会再得到的！",
  422: "当创建一个对象时，发生一个验证错误！",
  429: "请求过于频繁，请稍后再试！",
  500: "服务器内部错误！",
  501: "服务未实现！",
  502: "网关错误！",
  503: "服务不可用，服务器暂时过载或维护！",
  504: "服务暂时无法访问，请稍后再试！",
  505: "HTTP版本不受支持！",
  [AxiosError.ETIMEDOUT]: "请求超时！",
  [AxiosError.ECONNABORTED]: "连接中断，服务器暂时过载或维护！",
  [AxiosError.ERR_NETWORK]: "网关错误，服务不可用，服务器暂时过载或维护！"
};
const pendingMap = /* @__PURE__ */ new Map();
const getPendingKey = (axiosConfig) => {
  let { data } = axiosConfig;
  const { url, method, params } = axiosConfig;
  if (isString(data)) data = JSON.parse(data);
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join("&");
};
const addPending = (pendingKey, axiosConfig) => {
  axiosConfig.cancelToken = axiosConfig.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingMap.has(pendingKey)) {
      pendingMap.set(pendingKey, cancel);
    }
  });
};
const removePending = (pendingKey) => {
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
};
const httpErrorStatusHandle = async (error) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  let message = "";
  const code = ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.code) || ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.status) || (error == null ? void 0 : error.code) || "default";
  if (((_d = error == null ? void 0 : error.request) == null ? void 0 : _d.responseType) === "blob") {
    try {
      message = (_g = JSON.parse(await ((_f = (_e = error == null ? void 0 : error.response) == null ? void 0 : _e.data) == null ? void 0 : _f.text()))) == null ? void 0 : _g.message;
    } catch (err) {
      message = ((_i = (_h = error == null ? void 0 : error.response) == null ? void 0 : _h.data) == null ? void 0 : _i.message) || errorCodeMessages[code];
    }
  } else {
    message = ((_k = (_j = error == null ? void 0 : error.response) == null ? void 0 : _j.data) == null ? void 0 : _k.message) || errorCodeMessages[code];
  }
  return message;
};
const downloadFile = (response) => {
  if (typeof uni !== "undefined") {
  } else {
    const blob = new Blob([response.data], { type: "application/octet-stream;charset=UTF-8" });
    const contentDisposition = response.headers["content-disposition"];
    const pat = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
    const result = pat.exec(contentDisposition);
    const filename = result[1];
    const downloadElement = document.createElement("a");
    const href = window.URL.createObjectURL(blob);
    const reg = /^["](.*)["]$/g;
    downloadElement.style.display = "none";
    downloadElement.href = href;
    downloadElement.download = decodeURI(filename.replace(reg, "$1"));
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
  }
};
const createAxios = (axiosConfig) => {
  var _a;
  const uAxios = useAxios();
  const options = { ...axiosOptions, ...axiosConfig };
  if (isNil(options.requestCipher)) {
    options.requestCipher = uAxios.requestCipher;
  }
  if (options.cache && options.method.toUpperCase() === "GET" && options.restfulResult && options.simpleDataFormat) {
    if (options.params) {
      console.warn("[Fast.Axios] 如果使用 Http Cache，则不能存在任何 'params' 参数");
    }
    if ((_a = uAxios.cache) == null ? void 0 : _a.get) {
      const cacheRes = uAxios.cache.get(options.url);
      if (cacheRes) {
        return Promise.resolve(cacheRes);
      }
    }
  } else {
    options.cache = false;
  }
  const pendingKey = getPendingKey(axiosConfig);
  const timestamp = Date.now();
  const Axios = axios.create({
    /** 如果是 UniApp 则默认使用适配器 */
    adapter: typeof uni !== "undefined" ? createUniAppAxiosAdapter() : void 0,
    baseURL: uAxios.baseUrl,
    timeout: uAxios.timeout,
    headers: {
      ...uAxios.headers
    },
    responseType: "json"
  });
  Axios.interceptors.request.use(
    (config) => {
      var _a2, _b, _c;
      removePending(pendingKey);
      options.cancelDuplicateRequest && addPending(pendingKey, config);
      (_a2 = uAxios.interceptors) == null ? void 0 : _a2.request(config);
      options.loading && ((_b = uAxios.loading) == null ? void 0 : _b.show(options.loadingText));
      if (config.responseType === "json") {
        if (options.requestCipher) {
          (_c = uAxios.crypto) == null ? void 0 : _c.encrypt(config, timestamp);
        } else {
          if (options.getMethodCacheHandle && config.method.toUpperCase() === "GET") {
            config.params = config.params || {};
            config.params._ = timestamp;
          }
        }
      }
      return config;
    },
    (error) => {
      console.error("[Fast.Axios]", error);
      return Promise.reject(error);
    }
  );
  Axios.interceptors.response.use(
    (response) => {
      var _a2, _b, _c, _d, _e, _f, _g;
      removePending(pendingKey);
      options.loading && ((_a2 = uAxios.loading) == null ? void 0 : _a2.close(options));
      if ((_b = uAxios.interceptors) == null ? void 0 : _b.response) {
        try {
          const result = uAxios.interceptors.response(response, options);
          if (!isNil(result)) {
            return Promise.resolve(result);
          }
        } catch (error) {
          console.error("[Fast.Axios]", error);
          return Promise.reject(error);
        }
      }
      if (response.config.responseType === "blob" || options.method.toUpperCase() === "DOWNLOAD") {
        if (response.status === 200) {
          if (options.autoDownloadFile) {
            downloadFile(response);
          }
          return Promise.resolve(response);
        } else {
          (_c = uAxios.message) == null ? void 0 : _c.error(errorCodeMessages["fileDownloadError"]);
          return Promise.reject(response);
        }
      } else if (response.config.responseType === "json") {
        let responseData = response.data;
        if (options.restfulResult) {
          const restfulData = responseData;
          const code = (restfulData == null ? void 0 : restfulData.code) ?? response.status;
          if (code < 200 || code > 299 || (restfulData == null ? void 0 : restfulData.success) === false) {
            if (options.showCodeMessage) {
              if (restfulData == null ? void 0 : restfulData.message) {
                if (isObject(restfulData == null ? void 0 : restfulData.message)) {
                  (_d = uAxios.message) == null ? void 0 : _d.error(JSON.stringify(restfulData == null ? void 0 : restfulData.message));
                } else {
                  (_e = uAxios.message) == null ? void 0 : _e.error(restfulData == null ? void 0 : restfulData.message);
                }
              }
            }
            console.error("[Fast.Axios]", new AxiosError((restfulData == null ? void 0 : restfulData.message) ?? "服务器内部错误！"));
            return Promise.reject(new AxiosError((restfulData == null ? void 0 : restfulData.message) ?? "服务器内部错误！"));
          }
        }
        if (options.requestCipher) {
          responseData = (_f = uAxios.crypto) == null ? void 0 : _f.decrypt(response, options);
        }
        if (options.cache && options.restfulResult && options.simpleDataFormat) {
          (_g = uAxios.cache) == null ? void 0 : _g.set(options.url, responseData == null ? void 0 : responseData.data);
        }
        if (options.simpleDataFormat) {
          return Promise.resolve(responseData == null ? void 0 : responseData.data);
        } else {
          return Promise.resolve(responseData);
        }
      } else {
        if (options.simpleDataFormat) {
          return Promise.resolve(response.data);
        } else {
          return Promise.resolve(response);
        }
      }
    },
    async (error) => {
      var _a2, _b, _c, _d;
      removePending(pendingKey);
      options.loading && ((_a2 = uAxios.loading) == null ? void 0 : _a2.close(options));
      if (axios.isCancel(error)) {
        console.warn(`[Fast.Axios] ${errorCodeMessages["cancelDuplicate"]}`);
        return Promise.reject();
      }
      if (!globalThis.navigator.onLine) {
        (_b = uAxios.message) == null ? void 0 : _b.error(errorCodeMessages["offLine"]);
        return Promise.reject();
      }
      if ((_c = uAxios.interceptors) == null ? void 0 : _c.responseError) {
        try {
          const result = uAxios.interceptors.responseError(error, options);
          if (!isNil(result)) {
            return Promise.resolve(result);
          }
        } catch (error2) {
          console.error("[Fast.Axios]", error2);
          return Promise.reject(error2);
        }
      }
      if (options.showErrorMessage) {
        const message = await httpErrorStatusHandle(error);
        (_d = uAxios.message) == null ? void 0 : _d.error(message);
      }
      console.error("[Fast.Axios]", error);
      return Promise.reject(error);
    }
  );
  return Axios(options);
};
const axiosUtil = {
  /**
   * 请求
   * @param axiosConfig axios 请求配置
   * @param loading loading配置
   */
  request: createAxios,
  /**
   * 下载文件
   */
  downloadFile
};
export {
  axiosUtil,
  useAxios
};
//# sourceMappingURL=index.mjs.map
