var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { merge } from "lodash-unified";
const defaultState = {
  timeout: 6e4,
  requestCipher: true,
  loading: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    show: (text) => {
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close: (options) => {
    }
  },
  message: {
    success: (message) => {
      console.log(`[Fast.Axios] ${message}`);
    },
    warning: (message) => {
      console.warn(`[Fast.Axios] ${message}`);
    },
    info: (message) => {
      console.log(`[Fast.Axios] ${message}`);
    },
    error: (message) => {
      console.error(`[Fast.Axios] ${message}`);
    }
  },
  messageBox: {
    confirm: (options) => {
      if (typeof uni !== "undefined") {
        return new Promise((resolve, reject) => {
          uni.showModal({
            title: "温馨提示",
            content: options.message,
            cancelText: options.cancelButtonText,
            confirmText: options.confirmButtonText,
            success: (res) => {
              if (res.confirm) {
                resolve();
              } else {
                reject();
              }
            },
            fail: (res) => {
              res && console.error(res);
              throw new Error("'uni.showModal' Api调用异常。");
            }
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          if (typeof window.confirm === "undefined") {
            throw new Error("'window.confirm' Api调用异常。");
          }
          if (window.confirm(options.message)) {
            resolve();
          } else {
            reject();
          }
        });
      }
    }
  }
};
const _FastAxios = class _FastAxios {
  constructor(options) {
    __publicField(this, "state");
    this.state = merge(defaultState, options || {});
  }
  /** 获取实例 */
  static getInstance() {
    if (!_FastAxios.instance) {
      return new _FastAxios();
    }
    return _FastAxios.instance;
  }
  /**
   * 设置选项
   * @param key
   * @param value
   */
  setOptions(key, value) {
    this.state[key] = merge(this.state[key], value);
  }
  /** 请求域名或者Base路径 */
  get baseUrl() {
    return this.state.baseUrl;
  }
  /** 请求域名或者Base路径 */
  set baseUrl(value) {
    this.setOptions("baseUrl", value);
  }
  /**
   * 超时时间，单位毫秒
   * @default 60000
   */
  get timeout() {
    return this.state.timeout;
  }
  /**
   * 超时时间，单位毫秒
   * @default 60000
   */
  set timeout(value) {
    this.setOptions("timeout", value);
  }
  /** 默认头部 */
  get headers() {
    return this.state.headers;
  }
  /** 默认头部 */
  set headers(value) {
    this.setOptions("headers", value);
  }
  /**
   * 请求加密解密
   * @default true
   */
  get requestCipher() {
    return this.state.requestCipher;
  }
  /**
   * 请求加密解密
   * @default true
   */
  set requestCipher(value) {
    this.setOptions("requestCipher", value);
  }
  /** 加载 @description 需要自行处理多次调用的问题 */
  get loading() {
    return this.state.loading;
  }
  /** 加载 @description 需要自行处理多次调用的问题 */
  set loading(value) {
    this.setOptions("loading", value);
  }
  /** 消息提示 */
  get message() {
    return this.state.message;
  }
  /** 消息提示 */
  set message(value) {
    this.setOptions("message", value);
  }
  /** 消息提示框 */
  get messageBox() {
    return this.state.messageBox;
  }
  /** 消息提示框 */
  set messageBox(value) {
    this.setOptions("messageBox", value);
  }
  /** 缓存 */
  get cache() {
    return this.state.cache;
  }
  /** 缓存 */
  set cache(value) {
    this.setOptions("cache", value);
  }
  /** 加密解密 */
  get crypto() {
    return this.state.crypto;
  }
  /** 加密解密 */
  set crypto(value) {
    this.setOptions("crypto", value);
  }
  /** 拦截器 */
  get interceptors() {
    return this.state.interceptors;
  }
  /** 拦截器 */
  set interceptors(value) {
    this.setOptions("interceptors", value);
  }
};
// eslint-disable-next-line no-use-before-define
__publicField(_FastAxios, "instance");
let FastAxios = _FastAxios;
const createFastAxios = (options) => {
  return new FastAxios(options);
};
const useFastAxios = () => {
  return FastAxios.getInstance();
};
export {
  createFastAxios,
  useFastAxios
};
//# sourceMappingURL=fastAxios.mjs.map
