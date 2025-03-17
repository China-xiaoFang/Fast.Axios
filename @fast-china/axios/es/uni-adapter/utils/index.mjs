import { AxiosHeaders } from "axios";
import buildFullPath from "../../node_modules/.pnpm/axios@1.8.3/node_modules/axios/lib/core/buildFullPath.mjs";
import buildURL from "../../node_modules/.pnpm/axios@1.8.3/node_modules/axios/lib/helpers/buildURL.mjs";
import speedometer from "../../node_modules/.pnpm/axios@1.8.3/node_modules/axios/lib/helpers/speedometer.mjs";
const getMethodType = (config) => {
  const { method: rawMethod = "GET" } = config;
  const method = rawMethod.toLocaleLowerCase();
  switch (method) {
    case "download":
      return "download";
    case "upload":
      return "upload";
    default:
      return "request";
  }
};
const resolveUniAppRequestOptions = (config) => {
  var _a;
  const data = config.data;
  const responseType = config.responseType === "arraybuffer" ? "arraybuffer" : "text";
  const dataType = responseType === "text" ? "json" : void 0;
  const { headers, baseURL, ...requestConfig } = config;
  const requestHeaders = AxiosHeaders.from(headers).normalize(false);
  if (config.auth) {
    const username = config.auth.username || "";
    const password = config.auth.password ? decodeURIComponent(encodeURIComponent(config.auth.password)) : "";
    requestHeaders.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);
  }
  const fullPath = buildFullPath(baseURL, config.url);
  const method = ((_a = config == null ? void 0 : config.method) == null ? void 0 : _a.toUpperCase()) ?? "GET";
  const url = buildURL(fullPath, config.params, config.paramsSerializer);
  const timeout = config.timeout || 6e4;
  let formData = {};
  if (data && typeof data === "string") {
    try {
      formData = JSON.parse(data);
    } catch {
    }
  }
  const header = requestHeaders.toJSON();
  return {
    ...requestConfig,
    url,
    data,
    header,
    method,
    responseType,
    dataType,
    timeout,
    formData
  };
};
const progressEventReducer = (listener, isDownloadStream) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return (result) => {
    const loaded = result.totalBytesWritten;
    const total = result.totalBytesExpectedToWrite;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate || void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: result,
      lengthComputable: true
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  };
};
export {
  getMethodType,
  progressEventReducer,
  resolveUniAppRequestOptions
};
//# sourceMappingURL=index.mjs.map
