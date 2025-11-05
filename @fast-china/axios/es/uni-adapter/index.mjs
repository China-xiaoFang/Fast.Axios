import{Axios as o}from"axios";import{getMethod as t}from"./methods/index.mjs";import"./axios.type.mjs";const r=()=>{o.prototype.download=function(o,t){return this.request({url:o,method:"download",...t})},o.prototype.upload=function(o,t,r){return this.request({url:o,method:"upload",data:t,...r})};return o=>t(o)(o)};export{r as createUniAppAxiosAdapter};
//# sourceMappingURL=index.mjs.map
