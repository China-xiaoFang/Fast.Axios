var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { AxiosError } from "axios";
import { isNil } from "lodash-unified";
import "./types/index.mjs";
import { LoadingManage } from "./types/loading.mjs";
import { MessageManage } from "./types/message.mjs";
import { MessageBoxManage } from "./types/messageBox.mjs";
import { CacheManage } from "./types/cache.mjs";
import { CryptoManage } from "./types/crypto.mjs";
import { InterceptorsManage } from "./types/interceptors.mjs";
class FastAxios {
  constructor(options) {
    __publicField(this, "_baseUrl");
    __publicField(this, "_timeout");
    __publicField(this, "_headers");
    __publicField(this, "_requestCipher");
    /** 错误Code */
    __publicField(this, "errorCode");
    /** 加载 @description 需要自行处理多次调用的问题 */
    __publicField(this, "loading");
    /** 消息提示 */
    __publicField(this, "message");
    /** 消息提示框 */
    __publicField(this, "messageBox");
    /** 缓存 */
    __publicField(this, "cache");
    /** 加密解密 */
    __publicField(this, "crypto");
    /** 拦截器 */
    __publicField(this, "interceptors");
    this.setOptions(options);
    this.errorCode = {
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
    this.loading = new LoadingManage();
    this.message = new MessageManage();
    this.messageBox = new MessageBoxManage();
    this.cache = new CacheManage();
    this.crypto = new CryptoManage();
    this.interceptors = new InterceptorsManage();
  }
  /**
   * 设置选项
   * @param options 初始化选项
   */
  setOptions(options) {
    if (options == null ? void 0 : options.baseUrl) {
      this._baseUrl = options.baseUrl;
    }
    if (options == null ? void 0 : options.timeout) {
      this._timeout = options.timeout;
    } else {
      this._timeout = this._timeout ?? 6e4;
    }
    if (options == null ? void 0 : options.headers) {
      this._headers = { ...this._headers ?? {}, ...options.headers };
    }
    if (!isNil(options == null ? void 0 : options.requestCipher)) {
      this._requestCipher = options.requestCipher;
    } else {
      this._requestCipher = isNil(this._requestCipher) ? true : this._requestCipher;
    }
    return this;
  }
  /** 请求域名或者Base路径 */
  get baseUrl() {
    return this._baseUrl;
  }
  /**
   * 超时时间，单位毫秒
   * @default 60000
   */
  get timeout() {
    return this._timeout;
  }
  /** 默认头部 */
  get headers() {
    return this._headers;
  }
  /**
   * 请求加密解密
   * @default true
   */
  get requestCipher() {
    return this._requestCipher;
  }
  addErrorCode(arg, message) {
    if (typeof arg === "string" || typeof arg === "number") {
      this.errorCode[arg] = message;
    } else {
      for (const key in arg) {
        this.errorCode[key] = arg[key];
      }
    }
    return this;
  }
}
// eslint-disable-next-line no-use-before-define
__publicField(FastAxios, "instance");
const createFastAxios = (options, newInstance = false) => {
  if (newInstance) {
    return new FastAxios(options);
  } else {
    if (!FastAxios.instance) {
      const fastAxios = new FastAxios(options);
      FastAxios.instance = fastAxios;
    }
    return FastAxios.instance;
  }
};
const useFastAxios = () => {
  if (!FastAxios.instance) {
    throw new Error("请先调用 'createFastAxios' 初始化 'fast-axios'。");
  }
  return FastAxios.instance;
};
export {
  createFastAxios,
  useFastAxios
};
//# sourceMappingURL=fastAxios.mjs.map
