"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const e=require("axios"),s=require("lodash-unified"),r=require("../uni-adapter/index.js"),o=require("./fastAxios.js");require("./types/options.js");const t={cancelDuplicateRequest:!0,loading:!1,loadingText:"加载中...",cache:!1,getMethodCacheHandle:!0,simpleDataFormat:!0,showErrorMessage:!0,showCodeMessage:!0,autoDownloadFile:!0,restfulResult:!0},a=new Map,l=e=>{if(a.has(e)){a.get(e)(e),a.delete(e)}},n=e=>{if("undefined"!=typeof uni);else{const s=new Blob([e.data],{type:"application/octet-stream;charset=UTF-8"}),r=e.headers["content-disposition"],o=/filename=([^;]+.[^.;]+);*/.exec(r)[1],t=document.createElement("a"),a=window.URL.createObjectURL(s),l=/^"(.*)"$/g;t.style.display="none",t.href=a,t.download=decodeURI(o.replace(l,"$1")),document.body.appendChild(t),t.click(),document.body.removeChild(t),window.URL.revokeObjectURL(a)}},i={request:i=>{var u;const c=o.useFastAxios(),d={...t,...i};if(s.isNil(d.requestCipher)&&(d.requestCipher=c.requestCipher),d.cache&&"GET"===d.method.toUpperCase()&&d.restfulResult&&d.simpleDataFormat){if(d.params&&console.warn("[Fast.Axios] 如果使用 Http Cache，则不能存在任何 'params' 参数"),null==(u=c.cache)?void 0:u.get){const e=c.cache.get(d.url);if(e)return Promise.resolve(e)}}else d.cache=!1;const p=(e=>{let{data:r}=e;const{url:o,method:t,params:a}=e;return s.isString(r)&&(r=JSON.parse(r)),[o,t,JSON.stringify(a),JSON.stringify(r)].join("&")})(i),m=Date.now(),v=e.create({adapter:"undefined"!=typeof uni?r.createUniAppAxiosAdapter():void 0,baseURL:c.baseUrl,timeout:c.timeout,headers:c.headers,responseType:"json"});return v.interceptors.request.use((s=>{var r,o,t;return l(p),d.cancelDuplicateRequest&&((s,r)=>{r.cancelToken=r.cancelToken||new e.CancelToken((e=>{a.has(s)||a.set(s,e)}))})(p,s),null==(r=c.interceptors)||r.request(s),d.loading&&(null==(o=c.loading)||o.show(d.loadingText)),"json"===s.responseType&&(d.requestCipher?null==(t=c.crypto)||t.encrypt(s,m):d.getMethodCacheHandle&&"GET"===s.method.toUpperCase()&&(s.params=s.params||{},s.params._=m)),s}),(e=>(console.error("[Fast.Axios]",e),Promise.reject(e)))),v.interceptors.response.use((r=>{var o,t,a,i,u,m,v;if(l(p),d.loading&&(null==(o=c.loading)||o.close(d)),null==(t=c.interceptors)?void 0:t.response)try{const e=c.interceptors.response(r,d);if(!s.isNil(e))return Promise.resolve(e)}catch(g){return console.error("[Fast.Axios]",g),Promise.reject(g)}if("blob"===r.config.responseType||"DOWNLOAD"===d.method.toUpperCase())return 200===r.status?(d.autoDownloadFile&&n(r),Promise.resolve(r)):(null==(a=c.message)||a.error(c.errorCode.fileDownloadError),Promise.reject(r));if("json"===r.config.responseType){let o=r.data;if(d.restfulResult){const t=o,a=(null==t?void 0:t.code)??r.status;if(a<200||a>299||!1===(null==t?void 0:t.success))return d.showCodeMessage&&(null==t?void 0:t.message)&&(s.isObject(null==t?void 0:t.message)?null==(i=c.message)||i.error(JSON.stringify(null==t?void 0:t.message)):null==(u=c.message)||u.error(null==t?void 0:t.message)),console.error("[Fast.Axios]",new e.AxiosError((null==t?void 0:t.message)??"服务器内部错误！")),Promise.reject(new e.AxiosError((null==t?void 0:t.message)??"服务器内部错误！"))}return d.requestCipher&&(o=null==(m=c.crypto)?void 0:m.decrypt(r,d)),d.cache&&d.restfulResult&&d.simpleDataFormat&&(null==(v=c.cache)||v.set(d.url,null==o?void 0:o.data)),d.simpleDataFormat?Promise.resolve(null==o?void 0:o.data):Promise.resolve(o)}return d.simpleDataFormat?Promise.resolve(r.data):Promise.resolve(r)}),(async r=>{var t,a,n,i;if(l(p),d.loading&&(null==(t=c.loading)||t.close(d)),e.isCancel(r))return console.warn(`[Fast.Axios] ${c.errorCode.cancelDuplicate}`),Promise.reject();if(!globalThis.navigator.onLine)return null==(a=c.message)||a.error(c.errorCode.offLine),Promise.reject();if(null==(n=c.interceptors)?void 0:n.responseError)try{const e=c.interceptors.responseError(r,d);if(!s.isNil(e))return Promise.reject(e)}catch(u){return console.error("[Fast.Axios]",u),Promise.reject(u)}if(d.showErrorMessage){const e=await(async e=>{var s,r,t,a,l,n,i,u,c,d,p;let m="";const v=(null==(r=null==(s=null==e?void 0:e.response)?void 0:s.data)?void 0:r.code)||(null==(t=null==e?void 0:e.response)?void 0:t.status)||(null==e?void 0:e.code)||"default";if("blob"===(null==(a=null==e?void 0:e.request)?void 0:a.responseType))try{m=null==(i=JSON.parse(await(null==(n=null==(l=null==e?void 0:e.response)?void 0:l.data)?void 0:n.text())))?void 0:i.message}catch(g){m=(null==(c=null==(u=null==e?void 0:e.response)?void 0:u.data)?void 0:c.message)||o.useFastAxios().errorCode[v]}else m=(null==(p=null==(d=null==e?void 0:e.response)?void 0:d.data)?void 0:p.message)||o.useFastAxios().errorCode[v];return m})(r);null==(i=c.message)||i.error(e)}return console.error("[Fast.Axios]",r),Promise.reject(r)})),v(d)},downloadFile:n};exports.createFastAxios=o.createFastAxios,exports.useFastAxios=o.useFastAxios,exports.axiosUtil=i;
//# sourceMappingURL=index.js.map
