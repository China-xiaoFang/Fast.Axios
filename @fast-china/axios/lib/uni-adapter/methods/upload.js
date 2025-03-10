"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const e=require("axios"),s=require("../../node_modules/.pnpm/axios@1.8.2/node_modules/axios/lib/core/settle.js"),r=require("../utils/index.js"),o=require("./onCanceled.js");exports.default=i=>new Promise(((t,n)=>{const u=r.resolveUniAppRequestOptions(i),l=i;l.headers=new e.AxiosHeaders(u.header);const a=new o.default(i);let d=uni.uploadFile({...u,success(e){if(!d)return;const r={config:l,data:e.data,headers:{},status:e.statusCode,statusText:e.errMsg??"OK",request:d};s.default(t,n,r),d=null},fail(s){const{errMsg:r=""}=s??{};if(r){const s="uploadFile:fail file error"===r;"uploadFile:fail timeout"===r&&n(new e.AxiosError(r,e.AxiosError.ETIMEDOUT,l,d)),s&&n(new e.AxiosError(r,e.AxiosError.ERR_NETWORK,l,d))}n(new e.AxiosError(s.errMsg,void 0,l,d)),d=null},complete(){a.unsubscribe()}});"function"==typeof i.onHeadersReceived&&d.onHeadersReceived(i.onHeadersReceived),a.subscribe(d,n)}));
//# sourceMappingURL=upload.js.map
