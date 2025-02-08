import { Axios } from "axios";
import { getMethod } from "./methods/index.mjs";
import "./axios.type.mjs";
const createUniAppAxiosAdapter = () => {
  Axios.prototype.download = function(url, config) {
    return this.request({
      url,
      method: "download",
      ...config
    });
  };
  Axios.prototype.upload = function(url, data, config) {
    return this.request({
      url,
      method: "upload",
      data,
      ...config
    });
  };
  const uniAppAdapter = (config) => {
    const method = getMethod(config);
    return method(config);
  };
  return uniAppAdapter;
};
export {
  createUniAppAxiosAdapter
};
//# sourceMappingURL=index.mjs.map
