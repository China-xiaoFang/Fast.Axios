var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class LoadingManage {
  constructor() {
    __publicField(this, "_handle");
    /** 显示 */
    __publicField(this, "show");
    /** 关闭 */
    __publicField(this, "close");
    this._handle = {
      show: (text) => {
        return;
      },
      close: (options) => {
        return;
      }
    };
    const showProxy = (text) => {
      this._handle.show(text);
    };
    showProxy.use = (fn) => {
      this._handle.show = fn;
    };
    this.show = showProxy;
    const closeProxy = (options) => {
      this._handle.close(options);
    };
    closeProxy.use = (fn) => {
      this._handle.close = fn;
    };
    this.close = closeProxy;
  }
}
export {
  LoadingManage
};
//# sourceMappingURL=loading.mjs.map
