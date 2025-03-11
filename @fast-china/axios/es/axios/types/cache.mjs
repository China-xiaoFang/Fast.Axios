var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class CacheManage {
  constructor() {
    __publicField(this, "_handle");
    /** 获取 */
    __publicField(this, "get");
    /** 设置 */
    __publicField(this, "set");
    __publicField(this, "_cacheRecord", /* @__PURE__ */ new Map());
    this._handle = {
      get: (key) => {
        if (!this._cacheRecord.has(key)) {
          return null;
        }
        return this._cacheRecord.get(key);
      },
      set: (key, value) => {
        this._cacheRecord.set(key, value);
      }
    };
    const getProxy = (key) => {
      this._handle.get(key);
    };
    getProxy.use = (fn) => {
      this._handle.get = fn;
    };
    this.get = getProxy;
    const setProxy = (key, value) => {
      this._handle.set(key, value);
    };
    setProxy.use = (fn) => {
      this._handle.set = fn;
    };
    this.set = setProxy;
  }
}
export {
  CacheManage
};
//# sourceMappingURL=cache.mjs.map
