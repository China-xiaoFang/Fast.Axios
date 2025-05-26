import process from 'process';
import { isPackageExists } from 'local-pkg';
import { createUnplugin } from 'unplugin';

// src/unplugin/index.ts
var unplugin = createUnplugin(() => {
  const hasFormDataPolyfill = isPackageExists("miniprogram-formdata");
  const hasBlobPolyfill = isPackageExists("miniprogram-blob");
  return {
    name: "unplugin-uni-axios-adapter",
    enforce: "pre",
    transform(code, id) {
      if (process.env.UNI_PLATFORM?.includes("mp")) {
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

export { unplugin };
//# sourceMappingURL=chunk-ZB7Y5KDM.js.map
//# sourceMappingURL=chunk-ZB7Y5KDM.js.map