var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class InterceptorsManage {
  constructor() {
    __publicField(this, "_handle");
    /** 请求拦截器 */
    __publicField(this, "request");
    /** 响应拦截器 */
    __publicField(this, "response");
    /** 响应错误处理 */
    __publicField(this, "responseError");
    this._handle = {
      request: (config) => {
        return;
      },
      response: (response, options) => {
        return null;
      },
      responseError: (error, options) => {
        return null;
      }
    };
    const requestProxy = (config) => {
      this._handle.request(config);
    };
    requestProxy.use = (fn) => {
      this._handle.request = fn;
    };
    this.request = requestProxy;
    const responseProxy = (response, options) => {
      this._handle.response(response, options);
    };
    responseProxy.use = (fn) => {
      this._handle.response = fn;
    };
    this.response = responseProxy;
    const responseErrorProxy = (error, options) => {
      this._handle.responseError(error, options);
    };
    responseErrorProxy.use = (fn) => {
      this._handle.responseError = fn;
    };
    this.responseError = responseErrorProxy;
  }
}
export {
  InterceptorsManage
};
//# sourceMappingURL=interceptors.mjs.map
