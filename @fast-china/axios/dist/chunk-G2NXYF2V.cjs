'use strict';

var process = require('process');
var localPkg = require('local-pkg');
var unplugin$1 = require('unplugin');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var process__default = /*#__PURE__*/_interopDefault(process);

// src/unplugin/index.ts
var unplugin = unplugin$1.createUnplugin(() => {
  const hasFormDataPolyfill = localPkg.isPackageExists("miniprogram-formdata");
  const hasBlobPolyfill = localPkg.isPackageExists("miniprogram-blob");
  return {
    name: "unplugin-uni-axios-adapter",
    enforce: "pre",
    transform(code, id) {
      if (process__default.default.env.UNI_PLATFORM?.includes("mp")) {
        if (id.includes("/form-data/lib/browser.js")) {
          return {
            code: code.replace("window", "globalThis")
          };
        }
        if (id.includes("/axios/lib/platform/browser/classes/FormData.js")) {
          return {
            code: `${hasFormDataPolyfill ? "import FormData from 'miniprogram-formdata';" : "class FormData {};"}
export default FormData;`
          };
        }
        if (id.includes("/axios/lib/platform/browser/classes/Blob.js")) {
          return {
            code: `${hasBlobPolyfill ? "import Blob from 'miniprogram-blob';" : "class Blob {};"}
export default Blob;`
          };
        }
      }
    }
  };
});

exports.unplugin = unplugin;
//# sourceMappingURL=chunk-G2NXYF2V.cjs.map
//# sourceMappingURL=chunk-G2NXYF2V.cjs.map