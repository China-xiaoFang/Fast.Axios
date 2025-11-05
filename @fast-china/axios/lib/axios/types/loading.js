"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});exports.LoadingManage=class{_handle;show;close;constructor(){this._handle={show:s=>{},close:s=>{}};const s=s=>{this._handle.show(s)};s.use=s=>{this._handle.show=s},this.show=s;const e=s=>{this._handle.close(s)};e.use=s=>{this._handle.close=s},this.close=e}};
//# sourceMappingURL=loading.js.map
