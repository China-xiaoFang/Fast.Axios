"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const e=require("axios"),t=require("./methods/index.js");require("./axios.type.js");exports.createUniAppAxiosAdapter=()=>{e.Axios.prototype.download=function(e,t){return this.request({url:e,method:"download",...t})},e.Axios.prototype.upload=function(e,t,o){return this.request({url:e,method:"upload",data:t,...o})};return e=>t.getMethod(e)(e)};
//# sourceMappingURL=index.js.map
