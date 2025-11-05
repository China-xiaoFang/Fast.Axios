class t{_handle;encrypt;decrypt;constructor(){this._handle={encrypt:(t,e)=>{},decrypt:(t,e)=>null};const t=(t,e)=>{this._handle.encrypt(t,e)};t.use=t=>{this._handle.encrypt=t},this.encrypt=t;const e=(t,e)=>this._handle.decrypt(t,e);e.use=t=>{this._handle.decrypt=t},this.decrypt=e}}export{t as CryptoManage};
//# sourceMappingURL=crypto.mjs.map
