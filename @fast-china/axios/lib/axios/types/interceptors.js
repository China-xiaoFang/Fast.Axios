"use strict";var e=Object.defineProperty,s=(s,r,t)=>((s,r,t)=>r in s?e(s,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[r]=t)(s,"symbol"!=typeof r?r+"":r,t);Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});exports.InterceptorsManage=class{constructor(){s(this,"_handle"),s(this,"request"),s(this,"response"),s(this,"responseError"),this._handle={request:e=>{},response:(e,s)=>null,responseError:(e,s)=>null};const e=e=>{this._handle.request(e)};e.use=e=>{this._handle.request=e},this.request=e;const r=(e,s)=>{this._handle.response(e,s)};r.use=e=>{this._handle.response=e},this.response=r;const t=(e,s)=>{this._handle.responseError(e,s)};t.use=e=>{this._handle.responseError=e},this.responseError=t}};
//# sourceMappingURL=interceptors.js.map
