var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class MessageManage {
  constructor() {
    __publicField(this, "_handle");
    /** 成功 */
    __publicField(this, "success");
    /** 警告 */
    __publicField(this, "warning");
    /** 信息 */
    __publicField(this, "info");
    /** 错误 */
    __publicField(this, "error");
    this._handle = {
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
    };
    const successProxy = (message) => {
      this._handle.success(message);
    };
    successProxy.use = (fn) => {
      this._handle.success = fn;
    };
    this.success = successProxy;
    const warningProxy = (message) => {
      this._handle.warning(message);
    };
    warningProxy.use = (fn) => {
      this._handle.warning = fn;
    };
    this.warning = warningProxy;
    const infoProxy = (message) => {
      this._handle.info(message);
    };
    infoProxy.use = (fn) => {
      this._handle.info = fn;
    };
    this.info = infoProxy;
    const errorProxy = (message) => {
      this._handle.error(message);
    };
    errorProxy.use = (fn) => {
      this._handle.error = fn;
    };
    this.error = errorProxy;
  }
}
export {
  MessageManage
};
//# sourceMappingURL=message.mjs.map
