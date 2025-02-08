import { getMethodType } from "../utils/index.mjs";
import download from "./download.mjs";
import request from "./request.mjs";
import upload from "./upload.mjs";
const getMethod = (config) => {
  const methodType = getMethodType(config);
  switch (methodType) {
    case "download":
      return download;
    case "upload":
      return upload;
    default:
      return request;
  }
};
export {
  getMethod
};
//# sourceMappingURL=index.mjs.map
