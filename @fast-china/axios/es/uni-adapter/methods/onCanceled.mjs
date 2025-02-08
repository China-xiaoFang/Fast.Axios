var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { CanceledError } from "axios";
class OnCanceled {
  constructor(config) {
    __publicField(this, "config");
    __publicField(this, "onCanceled");
    this.config = config;
  }
  subscribe(task, reject) {
    if (this.config.cancelToken || this.config.signal) {
      this.onCanceled = (cancel) => {
        if (!task) return;
        reject(!cancel || cancel.type ? new CanceledError(void 0, void 0, this.config, task) : cancel);
        task.abort();
        task = null;
      };
      if (this.config.cancelToken) {
        this.config.cancelToken.subscribe(this.onCanceled);
      }
      if (this.config.signal && this.config.signal.addEventListener) {
        this.config.signal.aborted ? this.onCanceled() : this.config.signal.addEventListener("abort", this.onCanceled);
      }
    }
  }
  unsubscribe() {
    if (this.config.cancelToken) {
      this.config.cancelToken.unsubscribe(this.onCanceled);
    }
    if (this.config.signal && this.config.signal.removeEventListener) this.config.signal.removeEventListener("abort", this.onCanceled);
  }
}
export {
  OnCanceled as default
};
//# sourceMappingURL=onCanceled.mjs.map
