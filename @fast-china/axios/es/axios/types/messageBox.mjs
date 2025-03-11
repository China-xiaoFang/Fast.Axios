var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class MessageBoxManage {
  constructor() {
    __publicField(this, "_handle");
    /** 确认弹窗 */
    __publicField(this, "confirm");
    this._handle = {
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
    };
    const confirmProxy = (options) => {
      return this._handle.confirm(options);
    };
    confirmProxy.use = (fn) => {
      this._handle.confirm = fn;
    };
    this.confirm = confirmProxy;
  }
}
export {
  MessageBoxManage
};
//# sourceMappingURL=messageBox.mjs.map
