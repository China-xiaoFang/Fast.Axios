var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class CryptoManage {
  constructor() {
    __publicField(this, "_handle");
    /** 加密 */
    __publicField(this, "encrypt");
    /** 解密 */
    __publicField(this, "decrypt");
    this._handle = {
      encrypt: (config, timestamp) => {
        return;
      },
      decrypt: (response, options) => {
        return null;
      }
    };
    const encryptProxy = (config, timestamp) => {
      this._handle.encrypt(config, timestamp);
    };
    encryptProxy.use = (fn) => {
      this._handle.encrypt = fn;
    };
    this.encrypt = encryptProxy;
    const decryptProxy = (response, options) => {
      return this._handle.decrypt(response, options);
    };
    decryptProxy.use = (fn) => {
      this._handle.decrypt = fn;
    };
    this.decrypt = decryptProxy;
  }
}
export {
  CryptoManage
};
//# sourceMappingURL=crypto.mjs.map
