"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const e=require("../utils/index.js"),t=require("./download.js"),r=require("./request.js"),u=require("./upload.js");exports.getMethod=d=>{switch(e.getMethodType(d)){case"download":return t.default;case"upload":return u.default;default:return r.default}};
//# sourceMappingURL=index.js.map
