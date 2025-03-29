var FastAxios = function(exports, axios2) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  "use strict";
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  "use strict";
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  "use strict";
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  "use strict";
  function bind$1(fn, thisArg) {
    return function wrap2() {
      return fn.apply(thisArg, arguments);
    };
  }
  "use strict";
  const { toString: toString$1 } = Object.prototype;
  const { getPrototypeOf } = Object;
  const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString$1.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  const typeOfTest = (type) => (thing) => typeof thing === type;
  const { isArray: isArray$1 } = Array;
  const isUndefined$1 = typeOfTest("undefined");
  function isBuffer$1(val) {
    return val !== null && !isUndefined$1(val) && val.constructor !== null && !isUndefined$1(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer$1 = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result2;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result2 = ArrayBuffer.isView(val);
    } else {
      result2 = val && val.buffer && isArrayBuffer$1(val.buffer);
    }
    return result2;
  }
  const isString$1 = typeOfTest("string");
  const isFunction$1 = typeOfTest("function");
  const isNumber$1 = typeOfTest("number");
  const isObject$1 = (thing) => thing !== null && typeof thing === "object";
  const isBoolean$1 = (thing) => thing === true || thing === false;
  const isPlainObject$1 = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };
  const isDate$1 = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject$1(val) && isFunction$1(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim$1 = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach$1(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray$1(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      const keys2 = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys2.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys2[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey$1(obj, key) {
    key = key.toLowerCase();
    const keys2 = Object.keys(obj);
    let i = keys2.length;
    let _key;
    while (i-- > 0) {
      _key = keys2[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined$1(context) && context !== _global;
  function merge$1() {
    const { caseless } = isContextDefined(this) && this || {};
    const result2 = {};
    const assignValue2 = (val, key) => {
      const targetKey = caseless && findKey$1(result2, key) || key;
      if (isPlainObject$1(result2[targetKey]) && isPlainObject$1(val)) {
        result2[targetKey] = merge$1(result2[targetKey], val);
      } else if (isPlainObject$1(val)) {
        result2[targetKey] = merge$1({}, val);
      } else if (isArray$1(val)) {
        result2[targetKey] = val.slice();
      } else {
        result2[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach$1(arguments[i], assignValue2);
    }
    return result2;
  }
  const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach$1(b, (val, key) => {
      if (thisArg && isFunction$1(val)) {
        a[key] = bind$1(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith$1 = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray$1 = (thing) => {
    if (!thing) return null;
    if (isArray$1(thing)) return thing;
    let i = thing.length;
    if (!isNumber$1(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray$1 = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result2;
    while ((result2 = iterator.next()) && !result2.done) {
      const pair = result2.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches2;
    const arr = [];
    while ((matches2 = regExp.exec(str)) !== null) {
      arr.push(matches2);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty$p = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp$1 = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach$1(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction$1(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray$1(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop$1 = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject$1(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray$1(source) ? [] : {};
          forEach$1(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined$1(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject$1(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction$1(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const utils = {
    isArray: isArray$1,
    isArrayBuffer: isArrayBuffer$1,
    isBuffer: isBuffer$1,
    isFormData,
    isArrayBufferView,
    isString: isString$1,
    isNumber: isNumber$1,
    isBoolean: isBoolean$1,
    isObject: isObject$1,
    isPlainObject: isPlainObject$1,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined: isUndefined$1,
    isDate: isDate$1,
    isFile,
    isBlob,
    isRegExp: isRegExp$1,
    isFunction: isFunction$1,
    isStream,
    isURLSearchParams,
    isTypedArray: isTypedArray$1,
    isFileList,
    forEach: forEach$1,
    merge: merge$1,
    extend,
    trim: trim$1,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith: endsWith$1,
    toArray: toArray$1,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty: hasOwnProperty$p,
    hasOwnProp: hasOwnProperty$p,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop: noop$1,
    toFiniteNumber,
    findKey: findKey$1,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap
  };
  "use strict";
  function AxiosError(message, code, config, request2, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request2 && (this.request = request2);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError.from = (error, code, config, request2, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils.toFlatObject(error, axiosError, function filter2(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error.message, code, config, request2, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const PlatformFormData = null;
  "use strict";
  function isVisitable(thing) {
    return utils.isPlainObject(thing) || utils.isArray(thing);
  }
  function removeBrackets(key) {
    return utils.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils.toFlatObject(utils, {}, null, function filter2(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new (PlatformFormData || FormData)();
    options = utils.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils.isSpecCompliantForm(formData);
    if (!utils.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils.isDate(value)) {
        return value.toISOString();
      }
      if (!useBlob && utils.isBlob(value)) {
        throw new AxiosError("Blob is not supported. Use a Buffer instead.");
      }
      if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils.isArray(value) && isFlatArray(value) || (utils.isFileList(value) || utils.endsWith(key, "[]")) && (arr = utils.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils.forEach(value, function each(el, key) {
        const result2 = !(utils.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result2 === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  "use strict";
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  "use strict";
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode;
    if (utils.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  "use strict";
  function speedometer(samplesCount, min2) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head2 = 0;
    let tail2 = 0;
    let firstSampleTS;
    min2 = min2 !== void 0 ? min2 : 1e3;
    return function push(chunkLength) {
      const now2 = Date.now();
      const startedAt = timestamps[tail2];
      if (!firstSampleTS) {
        firstSampleTS = now2;
      }
      bytes[head2] = chunkLength;
      timestamps[head2] = now2;
      let i = tail2;
      let bytesCount = 0;
      while (i !== head2) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head2 = (head2 + 1) % samplesCount;
      if (head2 === tail2) {
        tail2 = (tail2 + 1) % samplesCount;
      }
      if (now2 - firstSampleTS < min2) {
        return;
      }
      const passed = startedAt && now2 - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  const getMethodType = (config) => {
    const { method: rawMethod = "GET" } = config;
    const method2 = rawMethod.toLocaleLowerCase();
    switch (method2) {
      case "download":
        return "download";
      case "upload":
        return "upload";
      default:
        return "request";
    }
  };
  const resolveUniAppRequestOptions = (config) => {
    var _a;
    const data = config.data;
    const responseType = config.responseType === "arraybuffer" ? "arraybuffer" : "text";
    const dataType = responseType === "text" ? "json" : void 0;
    const { headers, baseURL, ...requestConfig } = config;
    const requestHeaders = axios2.AxiosHeaders.from(headers).normalize(false);
    if (config.auth) {
      const username = config.auth.username || "";
      const password = config.auth.password ? decodeURIComponent(encodeURIComponent(config.auth.password)) : "";
      requestHeaders.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);
    }
    const fullPath = buildFullPath(baseURL, config.url);
    const method2 = ((_a = config == null ? void 0 : config.method) == null ? void 0 : _a.toUpperCase()) ?? "GET";
    const url = buildURL(fullPath, config.params, config.paramsSerializer);
    const timeout = config.timeout || 6e4;
    let formData = {};
    if (data && typeof data === "string") {
      try {
        formData = JSON.parse(data);
      } catch {
      }
    }
    const header = requestHeaders.toJSON();
    return {
      ...requestConfig,
      url,
      data,
      header,
      method: method2,
      responseType,
      dataType,
      timeout,
      formData
    };
  };
  const progressEventReducer = (listener, isDownloadStream) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return (result2) => {
      const loaded = result2.totalBytesWritten;
      const total = result2.totalBytesExpectedToWrite;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange2 = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate || void 0,
        estimated: rate && total && inRange2 ? (total - loaded) / rate : void 0,
        event: result2,
        lengthComputable: true
      };
      data[isDownloadStream ? "download" : "upload"] = true;
      listener(data);
    };
  };
  "use strict";
  function settle(resolve, reject2, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject2(new AxiosError(
        "Request failed with status code " + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  class OnCanceled {
    constructor(config) {
      __publicField(this, "config");
      __publicField(this, "onCanceled");
      this.config = config;
    }
    subscribe(task, reject2) {
      if (this.config.cancelToken || this.config.signal) {
        this.onCanceled = (cancel) => {
          if (!task) return;
          reject2(!cancel || cancel.type ? new axios2.CanceledError(void 0, void 0, this.config, task) : cancel);
          task.abort();
          task = null;
        };
        if (this.config.cancelToken) {
          this.config.cancelToken.subscribe(this.onCanceled);
        }
        if (this.config.signal && this.config.signal.addEventListener) {
          this.config.signal.aborted ? this.onCanceled() : this.config.signal.addEventListener("abort", this.onCanceled);
        }
      }
    }
    unsubscribe() {
      if (this.config.cancelToken) {
        this.config.cancelToken.unsubscribe(this.onCanceled);
      }
      if (this.config.signal && this.config.signal.removeEventListener) this.config.signal.removeEventListener("abort", this.onCanceled);
    }
  }
  const download = (config) => {
    return new Promise((resolve, reject2) => {
      const requestOptions = resolveUniAppRequestOptions(config);
      const responseConfig = config;
      responseConfig.headers = new axios2.AxiosHeaders(requestOptions.header);
      const onCanceled = new OnCanceled(config);
      let task = uni.downloadFile({
        ...requestOptions,
        success(result2) {
          if (!task) return;
          const response = {
            config: responseConfig,
            data: result2.tempFilePath,
            headers: {},
            status: result2.statusCode,
            statusText: result2.errMsg ?? "OK",
            request: task
          };
          settle(resolve, reject2, response);
          task = null;
        },
        fail(error) {
          const { errMsg = "" } = error ?? {};
          if (errMsg) {
            const isTimeoutError = errMsg === "downloadFile:fail timeout";
            if (isTimeoutError) reject2(new axios2.AxiosError(errMsg, axios2.AxiosError.ETIMEDOUT, responseConfig, task));
            const isNetworkError = errMsg === "downloadFile:fail ";
            if (isNetworkError) {
              reject2(new axios2.AxiosError(errMsg, axios2.AxiosError.ERR_NETWORK, responseConfig, task));
            }
          }
          reject2(new axios2.AxiosError(error.errMsg, void 0, responseConfig, task));
          task = null;
        },
        complete() {
          onCanceled.unsubscribe();
        }
      });
      if (typeof config.onDownloadProgress === "function") {
        task.onProgressUpdate(progressEventReducer(config.onDownloadProgress, true));
      }
      if (typeof config.onHeadersReceived === "function") task.onHeadersReceived(config.onHeadersReceived);
      onCanceled.subscribe(task, reject2);
    });
  };
  const request = (config) => {
    return new Promise((resolve, reject2) => {
      const requestOptions = resolveUniAppRequestOptions(config);
      const responseConfig = config;
      responseConfig.headers = new axios2.AxiosHeaders(requestOptions.header);
      const onCanceled = new OnCanceled(config);
      let task = uni.request({
        ...requestOptions,
        success(result2) {
          if (!task) return;
          const headers = new axios2.AxiosHeaders(result2.header);
          const response = {
            config: responseConfig,
            data: result2.data,
            headers,
            status: result2.statusCode,
            statusText: result2.errMsg ?? "OK",
            request: task,
            cookies: result2.cookies
          };
          settle(resolve, reject2, response);
          task = null;
        },
        fail(error) {
          const { errMsg = "" } = error ?? {};
          if (errMsg) {
            const isTimeoutError = errMsg === "request:fail timeout";
            const isNetworkError = errMsg === "request:fail ";
            if (isTimeoutError) reject2(new axios2.AxiosError(errMsg, axios2.AxiosError.ETIMEDOUT, responseConfig, task));
            if (isNetworkError) {
              reject2(new axios2.AxiosError(errMsg, axios2.AxiosError.ERR_NETWORK, responseConfig, task));
            }
          }
          reject2(new axios2.AxiosError(error.errMsg, void 0, responseConfig, task));
          task = null;
        },
        complete() {
          onCanceled.unsubscribe();
        }
      });
      if (typeof config.onHeadersReceived === "function") task.onHeadersReceived(config.onHeadersReceived);
      onCanceled.subscribe(task, reject2);
    });
  };
  const upload = (config) => {
    return new Promise((resolve, reject2) => {
      const requestOptions = resolveUniAppRequestOptions(config);
      const responseConfig = config;
      responseConfig.headers = new axios2.AxiosHeaders(requestOptions.header);
      const onCanceled = new OnCanceled(config);
      let task = uni.uploadFile({
        ...requestOptions,
        success(result2) {
          if (!task) return;
          const response = {
            config: responseConfig,
            data: result2.data,
            headers: {},
            status: result2.statusCode,
            statusText: result2.errMsg ?? "OK",
            request: task
          };
          settle(resolve, reject2, response);
          task = null;
        },
        fail(error) {
          const { errMsg = "" } = error ?? {};
          if (errMsg) {
            const isTimeoutError = errMsg === "uploadFile:fail timeout";
            const isNetworkError = errMsg === "uploadFile:fail file error";
            if (isTimeoutError) reject2(new axios2.AxiosError(errMsg, axios2.AxiosError.ETIMEDOUT, responseConfig, task));
            if (isNetworkError) {
              reject2(new axios2.AxiosError(errMsg, axios2.AxiosError.ERR_NETWORK, responseConfig, task));
            }
          }
          reject2(new axios2.AxiosError(error.errMsg, void 0, responseConfig, task));
          task = null;
        },
        complete() {
          onCanceled.unsubscribe();
        }
      });
      if (typeof config.onHeadersReceived === "function") task.onHeadersReceived(config.onHeadersReceived);
      onCanceled.subscribe(task, reject2);
    });
  };
  const getMethod = (config) => {
    const methodType = getMethodType(config);
    switch (methodType) {
      case "download":
        return download;
      case "upload":
        return upload;
      default:
        return request;
    }
  };
  const createUniAppAxiosAdapter = () => {
    axios2.Axios.prototype.download = function(url, config) {
      return this.request({
        url,
        method: "download",
        ...config
      });
    };
    axios2.Axios.prototype.upload = function(url, data, config) {
      return this.request({
        url,
        method: "upload",
        data,
        ...config
      });
    };
    const uniAppAdapter = (config) => {
      const method2 = getMethod(config);
      return method2(config);
    };
    return uniAppAdapter;
  };
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var Symbol$1 = root.Symbol;
  var objectProto$s = Object.prototype;
  var hasOwnProperty$o = objectProto$s.hasOwnProperty;
  var nativeObjectToString$3 = objectProto$s.toString;
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$o.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result2 = nativeObjectToString$3.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result2;
  }
  var objectProto$r = Object.prototype;
  var nativeObjectToString$2 = objectProto$r.toString;
  function objectToString(value) {
    return nativeObjectToString$2.call(value);
  }
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var symbolTag$3 = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
  }
  var NAN$2 = 0 / 0;
  function baseToNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN$2;
    }
    return +value;
  }
  function arrayMap(array2, iteratee2) {
    var index = -1, length = array2 == null ? 0 : array2.length, result2 = Array(length);
    while (++index < length) {
      result2[index] = iteratee2(array2[index], index, array2);
    }
    return result2;
  }
  var isArray = Array.isArray;
  var INFINITY$5 = 1 / 0;
  var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result2 = value + "";
    return result2 == "0" && 1 / value == -INFINITY$5 ? "-0" : result2;
  }
  function createMathOperation(operator, defaultValue) {
    return function(value, other) {
      var result2;
      if (value === void 0 && other === void 0) {
        return defaultValue;
      }
      if (value !== void 0) {
        result2 = value;
      }
      if (other !== void 0) {
        if (result2 === void 0) {
          return other;
        }
        if (typeof value == "string" || typeof other == "string") {
          value = baseToString(value);
          other = baseToString(other);
        } else {
          value = baseToNumber(value);
          other = baseToNumber(other);
        }
        result2 = operator(value, other);
      }
      return result2;
    };
  }
  var add = createMathOperation(function(augend, addend) {
    return augend + addend;
  }, 0);
  var reWhitespace = /\s/;
  function trimmedEndIndex(string2) {
    var index = string2.length;
    while (index-- && reWhitespace.test(string2.charAt(index))) {
    }
    return index;
  }
  var reTrimStart$2 = /^\s+/;
  function baseTrim(string2) {
    return string2 ? string2.slice(0, trimmedEndIndex(string2) + 1).replace(reTrimStart$2, "") : string2;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var NAN$1 = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN$1;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN$1 : +value;
  }
  var INFINITY$4 = 1 / 0, MAX_INTEGER = 17976931348623157e292;
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY$4 || value === -INFINITY$4) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  function toInteger(value) {
    var result2 = toFinite(value), remainder = result2 % 1;
    return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
  }
  var FUNC_ERROR_TEXT$b = "Expected a function";
  function after(n, func2) {
    if (typeof func2 != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$b);
    }
    n = toInteger(n);
    return function() {
      if (--n < 1) {
        return func2.apply(this, arguments);
      }
    };
  }
  function identity(value) {
    return value;
  }
  var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
  }
  var coreJsData = root["__core-js_shared__"];
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func2) {
    return !!maskSrcKey && maskSrcKey in func2;
  }
  var funcProto$2 = Function.prototype;
  var funcToString$2 = funcProto$2.toString;
  function toSource(func2) {
    if (func2 != null) {
      try {
        return funcToString$2.call(func2);
      } catch (e) {
      }
      try {
        return func2 + "";
      } catch (e) {
      }
    }
    return "";
  }
  var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto$1 = Function.prototype, objectProto$q = Object.prototype;
  var funcToString$1 = funcProto$1.toString;
  var hasOwnProperty$n = objectProto$q.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString$1.call(hasOwnProperty$n).replace(reRegExpChar$1, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function getValue(object2, key) {
    return object2 == null ? void 0 : object2[key];
  }
  function getNative(object2, key) {
    var value = getValue(object2, key);
    return baseIsNative(value) ? value : void 0;
  }
  var WeakMap = getNative(root, "WeakMap");
  var metaMap = WeakMap && new WeakMap();
  var baseSetData = !metaMap ? identity : function(func2, data) {
    metaMap.set(func2, data);
    return func2;
  };
  var objectCreate = Object.create;
  var baseCreate = /* @__PURE__ */ function() {
    function object2() {
    }
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object2.prototype = proto;
      var result2 = new object2();
      object2.prototype = void 0;
      return result2;
    };
  }();
  function createCtor(Ctor) {
    return function() {
      var args = arguments;
      switch (args.length) {
        case 0:
          return new Ctor();
        case 1:
          return new Ctor(args[0]);
        case 2:
          return new Ctor(args[0], args[1]);
        case 3:
          return new Ctor(args[0], args[1], args[2]);
        case 4:
          return new Ctor(args[0], args[1], args[2], args[3]);
        case 5:
          return new Ctor(args[0], args[1], args[2], args[3], args[4]);
        case 6:
          return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7:
          return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      }
      var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
      return isObject(result2) ? result2 : thisBinding;
    };
  }
  var WRAP_BIND_FLAG$8 = 1;
  function createBind(func2, bitmask, thisArg) {
    var isBind = bitmask & WRAP_BIND_FLAG$8, Ctor = createCtor(func2);
    function wrapper() {
      var fn = this && this !== root && this instanceof wrapper ? Ctor : func2;
      return fn.apply(isBind ? thisArg : this, arguments);
    }
    return wrapper;
  }
  function apply(func2, thisArg, args) {
    switch (args.length) {
      case 0:
        return func2.call(thisArg);
      case 1:
        return func2.call(thisArg, args[0]);
      case 2:
        return func2.call(thisArg, args[0], args[1]);
      case 3:
        return func2.call(thisArg, args[0], args[1], args[2]);
    }
    return func2.apply(thisArg, args);
  }
  var nativeMax$g = Math.max;
  function composeArgs(args, partials, holders, isCurried) {
    var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax$g(argsLength - holdersLength, 0), result2 = Array(leftLength + rangeLength), isUncurried = !isCurried;
    while (++leftIndex < leftLength) {
      result2[leftIndex] = partials[leftIndex];
    }
    while (++argsIndex < holdersLength) {
      if (isUncurried || argsIndex < argsLength) {
        result2[holders[argsIndex]] = args[argsIndex];
      }
    }
    while (rangeLength--) {
      result2[leftIndex++] = args[argsIndex++];
    }
    return result2;
  }
  var nativeMax$f = Math.max;
  function composeArgsRight(args, partials, holders, isCurried) {
    var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax$f(argsLength - holdersLength, 0), result2 = Array(rangeLength + rightLength), isUncurried = !isCurried;
    while (++argsIndex < rangeLength) {
      result2[argsIndex] = args[argsIndex];
    }
    var offset = argsIndex;
    while (++rightIndex < rightLength) {
      result2[offset + rightIndex] = partials[rightIndex];
    }
    while (++holdersIndex < holdersLength) {
      if (isUncurried || argsIndex < argsLength) {
        result2[offset + holders[holdersIndex]] = args[argsIndex++];
      }
    }
    return result2;
  }
  function countHolders(array2, placeholder) {
    var length = array2.length, result2 = 0;
    while (length--) {
      if (array2[length] === placeholder) {
        ++result2;
      }
    }
    return result2;
  }
  function baseLodash() {
  }
  var MAX_ARRAY_LENGTH$6 = 4294967295;
  function LazyWrapper(value) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__dir__ = 1;
    this.__filtered__ = false;
    this.__iteratees__ = [];
    this.__takeCount__ = MAX_ARRAY_LENGTH$6;
    this.__views__ = [];
  }
  LazyWrapper.prototype = baseCreate(baseLodash.prototype);
  LazyWrapper.prototype.constructor = LazyWrapper;
  function noop() {
  }
  var getData = !metaMap ? noop : function(func2) {
    return metaMap.get(func2);
  };
  var realNames = {};
  var objectProto$p = Object.prototype;
  var hasOwnProperty$m = objectProto$p.hasOwnProperty;
  function getFuncName(func2) {
    var result2 = func2.name + "", array2 = realNames[result2], length = hasOwnProperty$m.call(realNames, result2) ? array2.length : 0;
    while (length--) {
      var data = array2[length], otherFunc = data.func;
      if (otherFunc == null || otherFunc == func2) {
        return data.name;
      }
    }
    return result2;
  }
  function LodashWrapper(value, chainAll) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__chain__ = !!chainAll;
    this.__index__ = 0;
    this.__values__ = void 0;
  }
  LodashWrapper.prototype = baseCreate(baseLodash.prototype);
  LodashWrapper.prototype.constructor = LodashWrapper;
  function copyArray(source, array2) {
    var index = -1, length = source.length;
    array2 || (array2 = Array(length));
    while (++index < length) {
      array2[index] = source[index];
    }
    return array2;
  }
  function wrapperClone(wrapper) {
    if (wrapper instanceof LazyWrapper) {
      return wrapper.clone();
    }
    var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
    result2.__actions__ = copyArray(wrapper.__actions__);
    result2.__index__ = wrapper.__index__;
    result2.__values__ = wrapper.__values__;
    return result2;
  }
  var objectProto$o = Object.prototype;
  var hasOwnProperty$l = objectProto$o.hasOwnProperty;
  function lodash(value) {
    if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
      if (value instanceof LodashWrapper) {
        return value;
      }
      if (hasOwnProperty$l.call(value, "__wrapped__")) {
        return wrapperClone(value);
      }
    }
    return new LodashWrapper(value);
  }
  lodash.prototype = baseLodash.prototype;
  lodash.prototype.constructor = lodash;
  function isLaziable(func2) {
    var funcName = getFuncName(func2), other = lodash[funcName];
    if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
      return false;
    }
    if (func2 === other) {
      return true;
    }
    var data = getData(other);
    return !!data && func2 === data[0];
  }
  var HOT_COUNT = 800, HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func2) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func2.apply(void 0, arguments);
    };
  }
  var setData = shortOut(baseSetData);
  var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
  function getWrapDetails(source) {
    var match = source.match(reWrapDetails);
    return match ? match[1].split(reSplitDetails) : [];
  }
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
  function insertWrapDetails(source, details) {
    var length = details.length;
    if (!length) {
      return source;
    }
    var lastIndex = length - 1;
    details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
    details = details.join(length > 2 ? ", " : " ");
    return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
  }
  function constant(value) {
    return function() {
      return value;
    };
  }
  var defineProperty = function() {
    try {
      var func2 = getNative(Object, "defineProperty");
      func2({}, "", {});
      return func2;
    } catch (e) {
    }
  }();
  var baseSetToString = !defineProperty ? identity : function(func2, string2) {
    return defineProperty(func2, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string2),
      "writable": true
    });
  };
  var setToString = shortOut(baseSetToString);
  function arrayEach(array2, iteratee2) {
    var index = -1, length = array2 == null ? 0 : array2.length;
    while (++index < length) {
      if (iteratee2(array2[index], index, array2) === false) {
        break;
      }
    }
    return array2;
  }
  function baseFindIndex(array2, predicate, fromIndex, fromRight) {
    var length = array2.length, index = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index-- : ++index < length) {
      if (predicate(array2[index], index, array2)) {
        return index;
      }
    }
    return -1;
  }
  function baseIsNaN(value) {
    return value !== value;
  }
  function strictIndexOf(array2, value, fromIndex) {
    var index = fromIndex - 1, length = array2.length;
    while (++index < length) {
      if (array2[index] === value) {
        return index;
      }
    }
    return -1;
  }
  function baseIndexOf(array2, value, fromIndex) {
    return value === value ? strictIndexOf(array2, value, fromIndex) : baseFindIndex(array2, baseIsNaN, fromIndex);
  }
  function arrayIncludes(array2, value) {
    var length = array2 == null ? 0 : array2.length;
    return !!length && baseIndexOf(array2, value, 0) > -1;
  }
  var WRAP_BIND_FLAG$7 = 1, WRAP_BIND_KEY_FLAG$6 = 2, WRAP_CURRY_FLAG$6 = 8, WRAP_CURRY_RIGHT_FLAG$3 = 16, WRAP_PARTIAL_FLAG$6 = 32, WRAP_PARTIAL_RIGHT_FLAG$3 = 64, WRAP_ARY_FLAG$4 = 128, WRAP_REARG_FLAG$3 = 256, WRAP_FLIP_FLAG$2 = 512;
  var wrapFlags = [
    ["ary", WRAP_ARY_FLAG$4],
    ["bind", WRAP_BIND_FLAG$7],
    ["bindKey", WRAP_BIND_KEY_FLAG$6],
    ["curry", WRAP_CURRY_FLAG$6],
    ["curryRight", WRAP_CURRY_RIGHT_FLAG$3],
    ["flip", WRAP_FLIP_FLAG$2],
    ["partial", WRAP_PARTIAL_FLAG$6],
    ["partialRight", WRAP_PARTIAL_RIGHT_FLAG$3],
    ["rearg", WRAP_REARG_FLAG$3]
  ];
  function updateWrapDetails(details, bitmask) {
    arrayEach(wrapFlags, function(pair) {
      var value = "_." + pair[0];
      if (bitmask & pair[1] && !arrayIncludes(details, value)) {
        details.push(value);
      }
    });
    return details.sort();
  }
  function setWrapToString(wrapper, reference, bitmask) {
    var source = reference + "";
    return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
  }
  var WRAP_BIND_FLAG$6 = 1, WRAP_BIND_KEY_FLAG$5 = 2, WRAP_CURRY_BOUND_FLAG$1 = 4, WRAP_CURRY_FLAG$5 = 8, WRAP_PARTIAL_FLAG$5 = 32, WRAP_PARTIAL_RIGHT_FLAG$2 = 64;
  function createRecurry(func2, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
    var isCurry = bitmask & WRAP_CURRY_FLAG$5, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
    bitmask |= isCurry ? WRAP_PARTIAL_FLAG$5 : WRAP_PARTIAL_RIGHT_FLAG$2;
    bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$2 : WRAP_PARTIAL_FLAG$5);
    if (!(bitmask & WRAP_CURRY_BOUND_FLAG$1)) {
      bitmask &= ~(WRAP_BIND_FLAG$6 | WRAP_BIND_KEY_FLAG$5);
    }
    var newData = [
      func2,
      bitmask,
      thisArg,
      newPartials,
      newHolders,
      newPartialsRight,
      newHoldersRight,
      argPos,
      ary2,
      arity
    ];
    var result2 = wrapFunc.apply(void 0, newData);
    if (isLaziable(func2)) {
      setData(result2, newData);
    }
    result2.placeholder = placeholder;
    return setWrapToString(result2, func2, bitmask);
  }
  function getHolder(func2) {
    var object2 = func2;
    return object2.placeholder;
  }
  var MAX_SAFE_INTEGER$5 = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$5 : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  var nativeMin$e = Math.min;
  function reorder(array2, indexes) {
    var arrLength = array2.length, length = nativeMin$e(indexes.length, arrLength), oldArray = copyArray(array2);
    while (length--) {
      var index = indexes[length];
      array2[length] = isIndex(index, arrLength) ? oldArray[index] : void 0;
    }
    return array2;
  }
  var PLACEHOLDER$1 = "__lodash_placeholder__";
  function replaceHolders(array2, placeholder) {
    var index = -1, length = array2.length, resIndex = 0, result2 = [];
    while (++index < length) {
      var value = array2[index];
      if (value === placeholder || value === PLACEHOLDER$1) {
        array2[index] = PLACEHOLDER$1;
        result2[resIndex++] = index;
      }
    }
    return result2;
  }
  var WRAP_BIND_FLAG$5 = 1, WRAP_BIND_KEY_FLAG$4 = 2, WRAP_CURRY_FLAG$4 = 8, WRAP_CURRY_RIGHT_FLAG$2 = 16, WRAP_ARY_FLAG$3 = 128, WRAP_FLIP_FLAG$1 = 512;
  function createHybrid(func2, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
    var isAry = bitmask & WRAP_ARY_FLAG$3, isBind = bitmask & WRAP_BIND_FLAG$5, isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4, isCurried = bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2), isFlip = bitmask & WRAP_FLIP_FLAG$1, Ctor = isBindKey ? void 0 : createCtor(func2);
    function wrapper() {
      var length = arguments.length, args = Array(length), index = length;
      while (index--) {
        args[index] = arguments[index];
      }
      if (isCurried) {
        var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
      }
      if (partials) {
        args = composeArgs(args, partials, holders, isCurried);
      }
      if (partialsRight) {
        args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
      }
      length -= holdersCount;
      if (isCurried && length < arity) {
        var newHolders = replaceHolders(args, placeholder);
        return createRecurry(
          func2,
          bitmask,
          createHybrid,
          wrapper.placeholder,
          thisArg,
          args,
          newHolders,
          argPos,
          ary2,
          arity - length
        );
      }
      var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func2] : func2;
      length = args.length;
      if (argPos) {
        args = reorder(args, argPos);
      } else if (isFlip && length > 1) {
        args.reverse();
      }
      if (isAry && ary2 < length) {
        args.length = ary2;
      }
      if (this && this !== root && this instanceof wrapper) {
        fn = Ctor || createCtor(fn);
      }
      return fn.apply(thisBinding, args);
    }
    return wrapper;
  }
  function createCurry(func2, bitmask, arity) {
    var Ctor = createCtor(func2);
    function wrapper() {
      var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
      while (index--) {
        args[index] = arguments[index];
      }
      var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
      length -= holders.length;
      if (length < arity) {
        return createRecurry(
          func2,
          bitmask,
          createHybrid,
          wrapper.placeholder,
          void 0,
          args,
          holders,
          void 0,
          void 0,
          arity - length
        );
      }
      var fn = this && this !== root && this instanceof wrapper ? Ctor : func2;
      return apply(fn, this, args);
    }
    return wrapper;
  }
  var WRAP_BIND_FLAG$4 = 1;
  function createPartial(func2, bitmask, thisArg, partials) {
    var isBind = bitmask & WRAP_BIND_FLAG$4, Ctor = createCtor(func2);
    function wrapper() {
      var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func2;
      while (++leftIndex < leftLength) {
        args[leftIndex] = partials[leftIndex];
      }
      while (argsLength--) {
        args[leftIndex++] = arguments[++argsIndex];
      }
      return apply(fn, isBind ? thisArg : this, args);
    }
    return wrapper;
  }
  var PLACEHOLDER = "__lodash_placeholder__";
  var WRAP_BIND_FLAG$3 = 1, WRAP_BIND_KEY_FLAG$3 = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG$3 = 8, WRAP_ARY_FLAG$2 = 128, WRAP_REARG_FLAG$2 = 256;
  var nativeMin$d = Math.min;
  function mergeData(data, source) {
    var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG$3 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);
    var isCombo = srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_CURRY_FLAG$3 || srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_REARG_FLAG$2 && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$2) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG$3;
    if (!(isCommon || isCombo)) {
      return data;
    }
    if (srcBitmask & WRAP_BIND_FLAG$3) {
      data[2] = source[2];
      newBitmask |= bitmask & WRAP_BIND_FLAG$3 ? 0 : WRAP_CURRY_BOUND_FLAG;
    }
    var value = source[3];
    if (value) {
      var partials = data[3];
      data[3] = partials ? composeArgs(partials, value, source[4]) : value;
      data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
    }
    value = source[5];
    if (value) {
      partials = data[5];
      data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
      data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
    }
    value = source[7];
    if (value) {
      data[7] = value;
    }
    if (srcBitmask & WRAP_ARY_FLAG$2) {
      data[8] = data[8] == null ? source[8] : nativeMin$d(data[8], source[8]);
    }
    if (data[9] == null) {
      data[9] = source[9];
    }
    data[0] = source[0];
    data[1] = newBitmask;
    return data;
  }
  var FUNC_ERROR_TEXT$a = "Expected a function";
  var WRAP_BIND_FLAG$2 = 1, WRAP_BIND_KEY_FLAG$2 = 2, WRAP_CURRY_FLAG$2 = 8, WRAP_CURRY_RIGHT_FLAG$1 = 16, WRAP_PARTIAL_FLAG$4 = 32, WRAP_PARTIAL_RIGHT_FLAG$1 = 64;
  var nativeMax$e = Math.max;
  function createWrap(func2, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
    var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2;
    if (!isBindKey && typeof func2 != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$a);
    }
    var length = partials ? partials.length : 0;
    if (!length) {
      bitmask &= ~(WRAP_PARTIAL_FLAG$4 | WRAP_PARTIAL_RIGHT_FLAG$1);
      partials = holders = void 0;
    }
    ary2 = ary2 === void 0 ? ary2 : nativeMax$e(toInteger(ary2), 0);
    arity = arity === void 0 ? arity : toInteger(arity);
    length -= holders ? holders.length : 0;
    if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$1) {
      var partialsRight = partials, holdersRight = holders;
      partials = holders = void 0;
    }
    var data = isBindKey ? void 0 : getData(func2);
    var newData = [
      func2,
      bitmask,
      thisArg,
      partials,
      holders,
      partialsRight,
      holdersRight,
      argPos,
      ary2,
      arity
    ];
    if (data) {
      mergeData(newData, data);
    }
    func2 = newData[0];
    bitmask = newData[1];
    thisArg = newData[2];
    partials = newData[3];
    holders = newData[4];
    arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func2.length : nativeMax$e(newData[9] - length, 0);
    if (!arity && bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1)) {
      bitmask &= ~(WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1);
    }
    if (!bitmask || bitmask == WRAP_BIND_FLAG$2) {
      var result2 = createBind(func2, bitmask, thisArg);
    } else if (bitmask == WRAP_CURRY_FLAG$2 || bitmask == WRAP_CURRY_RIGHT_FLAG$1) {
      result2 = createCurry(func2, bitmask, arity);
    } else if ((bitmask == WRAP_PARTIAL_FLAG$4 || bitmask == (WRAP_BIND_FLAG$2 | WRAP_PARTIAL_FLAG$4)) && !holders.length) {
      result2 = createPartial(func2, bitmask, thisArg, partials);
    } else {
      result2 = createHybrid.apply(void 0, newData);
    }
    var setter = data ? baseSetData : setData;
    return setWrapToString(setter(result2, newData), func2, bitmask);
  }
  var WRAP_ARY_FLAG$1 = 128;
  function ary(func2, n, guard) {
    n = guard ? void 0 : n;
    n = func2 && n == null ? func2.length : n;
    return createWrap(func2, WRAP_ARY_FLAG$1, void 0, void 0, void 0, void 0, n);
  }
  function baseAssignValue(object2, key, value) {
    if (key == "__proto__" && defineProperty) {
      defineProperty(object2, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object2[key] = value;
    }
  }
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var objectProto$n = Object.prototype;
  var hasOwnProperty$k = objectProto$n.hasOwnProperty;
  function assignValue(object2, key, value) {
    var objValue = object2[key];
    if (!(hasOwnProperty$k.call(object2, key) && eq(objValue, value)) || value === void 0 && !(key in object2)) {
      baseAssignValue(object2, key, value);
    }
  }
  function copyObject(source, props, object2, customizer) {
    var isNew = !object2;
    object2 || (object2 = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object2[key], source[key], key, object2, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object2, key, newValue);
      } else {
        assignValue(object2, key, newValue);
      }
    }
    return object2;
  }
  var nativeMax$d = Math.max;
  function overRest(func2, start, transform2) {
    start = nativeMax$d(start === void 0 ? func2.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax$d(args.length - start, 0), array2 = Array(length);
      while (++index < length) {
        array2[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform2(array2);
      return apply(func2, this, otherArgs);
    };
  }
  function baseRest(func2, start) {
    return setToString(overRest(func2, start, identity), func2 + "");
  }
  var MAX_SAFE_INTEGER$4 = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$4;
  }
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  function isIterateeCall(value, index, object2) {
    if (!isObject(object2)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike(object2) && isIndex(index, object2.length) : type == "string" && index in object2) {
      return eq(object2[index], value);
    }
    return false;
  }
  function createAssigner(assigner) {
    return baseRest(function(object2, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object2 = Object(object2);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object2, source, index, customizer);
        }
      }
      return object2;
    });
  }
  var objectProto$m = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$m;
    return value === proto;
  }
  function baseTimes(n, iteratee2) {
    var index = -1, result2 = Array(n);
    while (++index < n) {
      result2[index] = iteratee2(index);
    }
    return result2;
  }
  var argsTag$3 = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$3;
  }
  var objectProto$l = Object.prototype;
  var hasOwnProperty$j = objectProto$l.hasOwnProperty;
  var propertyIsEnumerable$1 = objectProto$l.propertyIsEnumerable;
  var isArguments = baseIsArguments(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$j.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
  };
  function stubFalse() {
    return false;
  }
  var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
  var Buffer$2 = moduleExports$2 ? root.Buffer : void 0;
  var nativeIsBuffer = Buffer$2 ? Buffer$2.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse;
  var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$4 = "[object Boolean]", dateTag$4 = "[object Date]", errorTag$3 = "[object Error]", funcTag$1 = "[object Function]", mapTag$9 = "[object Map]", numberTag$4 = "[object Number]", objectTag$4 = "[object Object]", regexpTag$4 = "[object RegExp]", setTag$9 = "[object Set]", stringTag$4 = "[object String]", weakMapTag$3 = "[object WeakMap]";
  var arrayBufferTag$4 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
  typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$4] = typedArrayTags[boolTag$4] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$4] = typedArrayTags[errorTag$3] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$9] = typedArrayTags[numberTag$4] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$4] = typedArrayTags[setTag$9] = typedArrayTags[stringTag$4] = typedArrayTags[weakMapTag$3] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseUnary(func2) {
    return function(value) {
      return func2(value);
    };
  }
  var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  var freeProcess = moduleExports$1 && freeGlobal.process;
  var nodeUtil = function() {
    try {
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  var objectProto$k = Object.prototype;
  var hasOwnProperty$i = objectProto$k.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String) : [], length = result2.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$i.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex(key, length)))) {
        result2.push(key);
      }
    }
    return result2;
  }
  function overArg(func2, transform2) {
    return function(arg) {
      return func2(transform2(arg));
    };
  }
  var nativeKeys = overArg(Object.keys, Object);
  var objectProto$j = Object.prototype;
  var hasOwnProperty$h = objectProto$j.hasOwnProperty;
  function baseKeys(object2) {
    if (!isPrototype(object2)) {
      return nativeKeys(object2);
    }
    var result2 = [];
    for (var key in Object(object2)) {
      if (hasOwnProperty$h.call(object2, key) && key != "constructor") {
        result2.push(key);
      }
    }
    return result2;
  }
  function keys(object2) {
    return isArrayLike(object2) ? arrayLikeKeys(object2) : baseKeys(object2);
  }
  var objectProto$i = Object.prototype;
  var hasOwnProperty$g = objectProto$i.hasOwnProperty;
  var assign = createAssigner(function(object2, source) {
    if (isPrototype(source) || isArrayLike(source)) {
      copyObject(source, keys(source), object2);
      return;
    }
    for (var key in source) {
      if (hasOwnProperty$g.call(source, key)) {
        assignValue(object2, key, source[key]);
      }
    }
  });
  function nativeKeysIn(object2) {
    var result2 = [];
    if (object2 != null) {
      for (var key in Object(object2)) {
        result2.push(key);
      }
    }
    return result2;
  }
  var objectProto$h = Object.prototype;
  var hasOwnProperty$f = objectProto$h.hasOwnProperty;
  function baseKeysIn(object2) {
    if (!isObject(object2)) {
      return nativeKeysIn(object2);
    }
    var isProto = isPrototype(object2), result2 = [];
    for (var key in object2) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty$f.call(object2, key)))) {
        result2.push(key);
      }
    }
    return result2;
  }
  function keysIn(object2) {
    return isArrayLike(object2) ? arrayLikeKeys(object2, true) : baseKeysIn(object2);
  }
  var assignIn = createAssigner(function(object2, source) {
    copyObject(source, keysIn(source), object2);
  });
  var assignInWith = createAssigner(function(object2, source, srcIndex, customizer) {
    copyObject(source, keysIn(source), object2, customizer);
  });
  var assignWith = createAssigner(function(object2, source, srcIndex, customizer) {
    copyObject(source, keys(source), object2, customizer);
  });
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
  function isKey(value, object2) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object2 != null && value in Object(object2);
  }
  var nativeCreate = getNative(Object, "create");
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  function hashDelete(key) {
    var result2 = this.has(key) && delete this.__data__[key];
    this.size -= result2 ? 1 : 0;
    return result2;
  }
  var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
  var objectProto$g = Object.prototype;
  var hasOwnProperty$e = objectProto$g.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result2 = data[key];
      return result2 === HASH_UNDEFINED$2 ? void 0 : result2;
    }
    return hasOwnProperty$e.call(data, key) ? data[key] : void 0;
  }
  var objectProto$f = Object.prototype;
  var hasOwnProperty$d = objectProto$f.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty$d.call(data, key);
  }
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
    return this;
  }
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function assocIndexOf(array2, key) {
    var length = array2.length;
    while (length--) {
      if (eq(array2[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var arrayProto$5 = Array.prototype;
  var splice$2 = arrayProto$5.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice$2.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  var Map$1 = getNative(root, "Map");
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$1 || ListCache)(),
      "string": new Hash()
    };
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function getMapData(map2, key) {
    var data = map2.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function mapCacheDelete(key) {
    var result2 = getMapData(this, key)["delete"](key);
    this.size -= result2 ? 1 : 0;
    return result2;
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size2 = data.size;
    data.set(key, value);
    this.size += data.size == size2 ? 0 : 1;
    return this;
  }
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  var FUNC_ERROR_TEXT$9 = "Expected a function";
  function memoize(func2, resolver) {
    if (typeof func2 != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$9);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result2 = func2.apply(this, args);
      memoized.cache = cache.set(key, result2) || cache;
      return result2;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func2) {
    var result2 = memoize(func2, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
    var cache = result2.cache;
    return result2;
  }
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped(function(string2) {
    var result2 = [];
    if (string2.charCodeAt(0) === 46) {
      result2.push("");
    }
    string2.replace(rePropName, function(match, number2, quote, subString) {
      result2.push(quote ? subString.replace(reEscapeChar, "$1") : number2 || match);
    });
    return result2;
  });
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function castPath(value, object2) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object2) ? [value] : stringToPath(toString(value));
  }
  var INFINITY$3 = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result2 = value + "";
    return result2 == "0" && 1 / value == -INFINITY$3 ? "-0" : result2;
  }
  function baseGet(object2, path) {
    path = castPath(path, object2);
    var index = 0, length = path.length;
    while (object2 != null && index < length) {
      object2 = object2[toKey(path[index++])];
    }
    return index && index == length ? object2 : void 0;
  }
  function get(object2, path, defaultValue) {
    var result2 = object2 == null ? void 0 : baseGet(object2, path);
    return result2 === void 0 ? defaultValue : result2;
  }
  function baseAt(object2, paths) {
    var index = -1, length = paths.length, result2 = Array(length), skip = object2 == null;
    while (++index < length) {
      result2[index] = skip ? void 0 : get(object2, paths[index]);
    }
    return result2;
  }
  function arrayPush(array2, values2) {
    var index = -1, length = values2.length, offset = array2.length;
    while (++index < length) {
      array2[offset + index] = values2[index];
    }
    return array2;
  }
  var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  function baseFlatten(array2, depth, predicate, isStrict, result2) {
    var index = -1, length = array2.length;
    predicate || (predicate = isFlattenable);
    result2 || (result2 = []);
    while (++index < length) {
      var value = array2[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result2);
        } else {
          arrayPush(result2, value);
        }
      } else if (!isStrict) {
        result2[result2.length] = value;
      }
    }
    return result2;
  }
  function flatten(array2) {
    var length = array2 == null ? 0 : array2.length;
    return length ? baseFlatten(array2, 1) : [];
  }
  function flatRest(func2) {
    return setToString(overRest(func2, void 0, flatten), func2 + "");
  }
  var at = flatRest(baseAt);
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  var objectTag$3 = "[object Object]";
  var funcProto = Function.prototype, objectProto$e = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$c = objectProto$e.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$c.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }
  var domExcTag = "[object DOMException]", errorTag$2 = "[object Error]";
  function isError(value) {
    if (!isObjectLike(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == errorTag$2 || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
  }
  var attempt = baseRest(function(func2, args) {
    try {
      return apply(func2, void 0, args);
    } catch (e) {
      return isError(e) ? e : new Error(e);
    }
  });
  var FUNC_ERROR_TEXT$8 = "Expected a function";
  function before(n, func2) {
    var result2;
    if (typeof func2 != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$8);
    }
    n = toInteger(n);
    return function() {
      if (--n > 0) {
        result2 = func2.apply(this, arguments);
      }
      if (n <= 1) {
        func2 = void 0;
      }
      return result2;
    };
  }
  var WRAP_BIND_FLAG$1 = 1, WRAP_PARTIAL_FLAG$3 = 32;
  var bind = baseRest(function(func2, thisArg, partials) {
    var bitmask = WRAP_BIND_FLAG$1;
    if (partials.length) {
      var holders = replaceHolders(partials, getHolder(bind));
      bitmask |= WRAP_PARTIAL_FLAG$3;
    }
    return createWrap(func2, bitmask, thisArg, partials, holders);
  });
  bind.placeholder = {};
  var bindAll = flatRest(function(object2, methodNames) {
    arrayEach(methodNames, function(key) {
      key = toKey(key);
      baseAssignValue(object2, key, bind(object2[key], object2));
    });
    return object2;
  });
  var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG$1 = 2, WRAP_PARTIAL_FLAG$2 = 32;
  var bindKey = baseRest(function(object2, key, partials) {
    var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG$1;
    if (partials.length) {
      var holders = replaceHolders(partials, getHolder(bindKey));
      bitmask |= WRAP_PARTIAL_FLAG$2;
    }
    return createWrap(key, bitmask, object2, partials, holders);
  });
  bindKey.placeholder = {};
  function baseSlice(array2, start, end) {
    var index = -1, length = array2.length;
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result2 = Array(length);
    while (++index < length) {
      result2[index] = array2[index + start];
    }
    return result2;
  }
  function castSlice(array2, start, end) {
    var length = array2.length;
    end = end === void 0 ? length : end;
    return !start && end >= length ? array2 : baseSlice(array2, start, end);
  }
  var rsAstralRange$3 = "\\ud800-\\udfff", rsComboMarksRange$4 = "\\u0300-\\u036f", reComboHalfMarksRange$4 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$4 = "\\u20d0-\\u20ff", rsComboRange$4 = rsComboMarksRange$4 + reComboHalfMarksRange$4 + rsComboSymbolsRange$4, rsVarRange$3 = "\\ufe0e\\ufe0f";
  var rsZWJ$3 = "\\u200d";
  var reHasUnicode = RegExp("[" + rsZWJ$3 + rsAstralRange$3 + rsComboRange$4 + rsVarRange$3 + "]");
  function hasUnicode(string2) {
    return reHasUnicode.test(string2);
  }
  function asciiToArray(string2) {
    return string2.split("");
  }
  var rsAstralRange$2 = "\\ud800-\\udfff", rsComboMarksRange$3 = "\\u0300-\\u036f", reComboHalfMarksRange$3 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$3 = "\\u20d0-\\u20ff", rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3, rsVarRange$2 = "\\ufe0e\\ufe0f";
  var rsAstral$1 = "[" + rsAstralRange$2 + "]", rsCombo$3 = "[" + rsComboRange$3 + "]", rsFitz$2 = "\\ud83c[\\udffb-\\udfff]", rsModifier$2 = "(?:" + rsCombo$3 + "|" + rsFitz$2 + ")", rsNonAstral$2 = "[^" + rsAstralRange$2 + "]", rsRegional$2 = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair$2 = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ$2 = "\\u200d";
  var reOptMod$2 = rsModifier$2 + "?", rsOptVar$2 = "[" + rsVarRange$2 + "]?", rsOptJoin$2 = "(?:" + rsZWJ$2 + "(?:" + [rsNonAstral$2, rsRegional$2, rsSurrPair$2].join("|") + ")" + rsOptVar$2 + reOptMod$2 + ")*", rsSeq$2 = rsOptVar$2 + reOptMod$2 + rsOptJoin$2, rsSymbol$1 = "(?:" + [rsNonAstral$2 + rsCombo$3 + "?", rsCombo$3, rsRegional$2, rsSurrPair$2, rsAstral$1].join("|") + ")";
  var reUnicode$1 = RegExp(rsFitz$2 + "(?=" + rsFitz$2 + ")|" + rsSymbol$1 + rsSeq$2, "g");
  function unicodeToArray(string2) {
    return string2.match(reUnicode$1) || [];
  }
  function stringToArray(string2) {
    return hasUnicode(string2) ? unicodeToArray(string2) : asciiToArray(string2);
  }
  function createCaseFirst(methodName) {
    return function(string2) {
      string2 = toString(string2);
      var strSymbols = hasUnicode(string2) ? stringToArray(string2) : void 0;
      var chr = strSymbols ? strSymbols[0] : string2.charAt(0);
      var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string2.slice(1);
      return chr[methodName]() + trailing;
    };
  }
  var upperFirst = createCaseFirst("toUpperCase");
  function capitalize(string2) {
    return upperFirst(toString(string2).toLowerCase());
  }
  function arrayReduce(array2, iteratee2, accumulator, initAccum) {
    var index = -1, length = array2 == null ? 0 : array2.length;
    if (initAccum && length) {
      accumulator = array2[++index];
    }
    while (++index < length) {
      accumulator = iteratee2(accumulator, array2[index], index, array2);
    }
    return accumulator;
  }
  function basePropertyOf(object2) {
    return function(key) {
      return object2 == null ? void 0 : object2[key];
    };
  }
  var deburredLetters = {
    // Latin-1 Supplement block.
    "À": "A",
    "Á": "A",
    "Â": "A",
    "Ã": "A",
    "Ä": "A",
    "Å": "A",
    "à": "a",
    "á": "a",
    "â": "a",
    "ã": "a",
    "ä": "a",
    "å": "a",
    "Ç": "C",
    "ç": "c",
    "Ð": "D",
    "ð": "d",
    "È": "E",
    "É": "E",
    "Ê": "E",
    "Ë": "E",
    "è": "e",
    "é": "e",
    "ê": "e",
    "ë": "e",
    "Ì": "I",
    "Í": "I",
    "Î": "I",
    "Ï": "I",
    "ì": "i",
    "í": "i",
    "î": "i",
    "ï": "i",
    "Ñ": "N",
    "ñ": "n",
    "Ò": "O",
    "Ó": "O",
    "Ô": "O",
    "Õ": "O",
    "Ö": "O",
    "Ø": "O",
    "ò": "o",
    "ó": "o",
    "ô": "o",
    "õ": "o",
    "ö": "o",
    "ø": "o",
    "Ù": "U",
    "Ú": "U",
    "Û": "U",
    "Ü": "U",
    "ù": "u",
    "ú": "u",
    "û": "u",
    "ü": "u",
    "Ý": "Y",
    "ý": "y",
    "ÿ": "y",
    "Æ": "Ae",
    "æ": "ae",
    "Þ": "Th",
    "þ": "th",
    "ß": "ss",
    // Latin Extended-A block.
    "Ā": "A",
    "Ă": "A",
    "Ą": "A",
    "ā": "a",
    "ă": "a",
    "ą": "a",
    "Ć": "C",
    "Ĉ": "C",
    "Ċ": "C",
    "Č": "C",
    "ć": "c",
    "ĉ": "c",
    "ċ": "c",
    "č": "c",
    "Ď": "D",
    "Đ": "D",
    "ď": "d",
    "đ": "d",
    "Ē": "E",
    "Ĕ": "E",
    "Ė": "E",
    "Ę": "E",
    "Ě": "E",
    "ē": "e",
    "ĕ": "e",
    "ė": "e",
    "ę": "e",
    "ě": "e",
    "Ĝ": "G",
    "Ğ": "G",
    "Ġ": "G",
    "Ģ": "G",
    "ĝ": "g",
    "ğ": "g",
    "ġ": "g",
    "ģ": "g",
    "Ĥ": "H",
    "Ħ": "H",
    "ĥ": "h",
    "ħ": "h",
    "Ĩ": "I",
    "Ī": "I",
    "Ĭ": "I",
    "Į": "I",
    "İ": "I",
    "ĩ": "i",
    "ī": "i",
    "ĭ": "i",
    "į": "i",
    "ı": "i",
    "Ĵ": "J",
    "ĵ": "j",
    "Ķ": "K",
    "ķ": "k",
    "ĸ": "k",
    "Ĺ": "L",
    "Ļ": "L",
    "Ľ": "L",
    "Ŀ": "L",
    "Ł": "L",
    "ĺ": "l",
    "ļ": "l",
    "ľ": "l",
    "ŀ": "l",
    "ł": "l",
    "Ń": "N",
    "Ņ": "N",
    "Ň": "N",
    "Ŋ": "N",
    "ń": "n",
    "ņ": "n",
    "ň": "n",
    "ŋ": "n",
    "Ō": "O",
    "Ŏ": "O",
    "Ő": "O",
    "ō": "o",
    "ŏ": "o",
    "ő": "o",
    "Ŕ": "R",
    "Ŗ": "R",
    "Ř": "R",
    "ŕ": "r",
    "ŗ": "r",
    "ř": "r",
    "Ś": "S",
    "Ŝ": "S",
    "Ş": "S",
    "Š": "S",
    "ś": "s",
    "ŝ": "s",
    "ş": "s",
    "š": "s",
    "Ţ": "T",
    "Ť": "T",
    "Ŧ": "T",
    "ţ": "t",
    "ť": "t",
    "ŧ": "t",
    "Ũ": "U",
    "Ū": "U",
    "Ŭ": "U",
    "Ů": "U",
    "Ű": "U",
    "Ų": "U",
    "ũ": "u",
    "ū": "u",
    "ŭ": "u",
    "ů": "u",
    "ű": "u",
    "ų": "u",
    "Ŵ": "W",
    "ŵ": "w",
    "Ŷ": "Y",
    "ŷ": "y",
    "Ÿ": "Y",
    "Ź": "Z",
    "Ż": "Z",
    "Ž": "Z",
    "ź": "z",
    "ż": "z",
    "ž": "z",
    "Ĳ": "IJ",
    "ĳ": "ij",
    "Œ": "Oe",
    "œ": "oe",
    "ŉ": "'n",
    "ſ": "s"
  };
  var deburrLetter = basePropertyOf(deburredLetters);
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
  var rsComboMarksRange$2 = "\\u0300-\\u036f", reComboHalfMarksRange$2 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$2 = "\\u20d0-\\u20ff", rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2;
  var rsCombo$2 = "[" + rsComboRange$2 + "]";
  var reComboMark = RegExp(rsCombo$2, "g");
  function deburr(string2) {
    string2 = toString(string2);
    return string2 && string2.replace(reLatin, deburrLetter).replace(reComboMark, "");
  }
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
  function asciiWords(string2) {
    return string2.match(reAsciiWord) || [];
  }
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
  function hasUnicodeWord(string2) {
    return reHasUnicodeWord.test(string2);
  }
  var rsAstralRange$1 = "\\ud800-\\udfff", rsComboMarksRange$1 = "\\u0300-\\u036f", reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$1 = "\\u20d0-\\u20ff", rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange$1 = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
  var rsApos$1 = "['’]", rsBreak = "[" + rsBreakRange + "]", rsCombo$1 = "[" + rsComboRange$1 + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange$1 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz$1 = "\\ud83c[\\udffb-\\udfff]", rsModifier$1 = "(?:" + rsCombo$1 + "|" + rsFitz$1 + ")", rsNonAstral$1 = "[^" + rsAstralRange$1 + "]", rsRegional$1 = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair$1 = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ$1 = "\\u200d";
  var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos$1 + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos$1 + "(?:D|LL|M|RE|S|T|VE))?", reOptMod$1 = rsModifier$1 + "?", rsOptVar$1 = "[" + rsVarRange$1 + "]?", rsOptJoin$1 = "(?:" + rsZWJ$1 + "(?:" + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join("|") + ")" + rsOptVar$1 + reOptMod$1 + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1, rsEmoji = "(?:" + [rsDingbat, rsRegional$1, rsSurrPair$1].join("|") + ")" + rsSeq$1;
  var reUnicodeWord = RegExp([
    rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
    rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
    rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
    rsUpper + "+" + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join("|"), "g");
  function unicodeWords(string2) {
    return string2.match(reUnicodeWord) || [];
  }
  function words(string2, pattern, guard) {
    string2 = toString(string2);
    pattern = guard ? void 0 : pattern;
    if (pattern === void 0) {
      return hasUnicodeWord(string2) ? unicodeWords(string2) : asciiWords(string2);
    }
    return string2.match(pattern) || [];
  }
  var rsApos = "['’]";
  var reApos = RegExp(rsApos, "g");
  function createCompounder(callback) {
    return function(string2) {
      return arrayReduce(words(deburr(string2).replace(reApos, "")), callback, "");
    };
  }
  var camelCase = createCompounder(function(result2, word, index) {
    word = word.toLowerCase();
    return result2 + (index ? capitalize(word) : word);
  });
  function castArray() {
    if (!arguments.length) {
      return [];
    }
    var value = arguments[0];
    return isArray(value) ? value : [value];
  }
  var nativeIsFinite$1 = root.isFinite, nativeMin$c = Math.min;
  function createRound(methodName) {
    var func2 = Math[methodName];
    return function(number2, precision) {
      number2 = toNumber(number2);
      precision = precision == null ? 0 : nativeMin$c(toInteger(precision), 292);
      if (precision && nativeIsFinite$1(number2)) {
        var pair = (toString(number2) + "e").split("e"), value = func2(pair[0] + "e" + (+pair[1] + precision));
        pair = (toString(value) + "e").split("e");
        return +(pair[0] + "e" + (+pair[1] - precision));
      }
      return func2(number2);
    };
  }
  var ceil = createRound("ceil");
  function chain(value) {
    var result2 = lodash(value);
    result2.__chain__ = true;
    return result2;
  }
  var nativeCeil$3 = Math.ceil, nativeMax$c = Math.max;
  function chunk(array2, size2, guard) {
    if (guard ? isIterateeCall(array2, size2, guard) : size2 === void 0) {
      size2 = 1;
    } else {
      size2 = nativeMax$c(toInteger(size2), 0);
    }
    var length = array2 == null ? 0 : array2.length;
    if (!length || size2 < 1) {
      return [];
    }
    var index = 0, resIndex = 0, result2 = Array(nativeCeil$3(length / size2));
    while (index < length) {
      result2[resIndex++] = baseSlice(array2, index, index += size2);
    }
    return result2;
  }
  function baseClamp(number2, lower, upper) {
    if (number2 === number2) {
      if (upper !== void 0) {
        number2 = number2 <= upper ? number2 : upper;
      }
      if (lower !== void 0) {
        number2 = number2 >= lower ? number2 : lower;
      }
    }
    return number2;
  }
  function clamp(number2, lower, upper) {
    if (upper === void 0) {
      upper = lower;
      lower = void 0;
    }
    if (upper !== void 0) {
      upper = toNumber(upper);
      upper = upper === upper ? upper : 0;
    }
    if (lower !== void 0) {
      lower = toNumber(lower);
      lower = lower === lower ? lower : 0;
    }
    return baseClamp(toNumber(number2), lower, upper);
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key) {
    var data = this.__data__, result2 = data["delete"](key);
    this.size = data.size;
    return result2;
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  var LARGE_ARRAY_SIZE$2 = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE$2 - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function baseAssign(object2, source) {
    return object2 && copyObject(source, keys(source), object2);
  }
  function baseAssignIn(object2, source) {
    return object2 && copyObject(source, keysIn(source), object2);
  }
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer$1 = moduleExports ? root.Buffer : void 0, allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : void 0;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result2);
    return result2;
  }
  function arrayFilter(array2, predicate) {
    var index = -1, length = array2 == null ? 0 : array2.length, resIndex = 0, result2 = [];
    while (++index < length) {
      var value = array2[index];
      if (predicate(value, index, array2)) {
        result2[resIndex++] = value;
      }
    }
    return result2;
  }
  function stubArray() {
    return [];
  }
  var objectProto$d = Object.prototype;
  var propertyIsEnumerable = objectProto$d.propertyIsEnumerable;
  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object2) {
    if (object2 == null) {
      return [];
    }
    object2 = Object(object2);
    return arrayFilter(nativeGetSymbols$1(object2), function(symbol) {
      return propertyIsEnumerable.call(object2, symbol);
    });
  };
  function copySymbols(source, object2) {
    return copyObject(source, getSymbols(source), object2);
  }
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object2) {
    var result2 = [];
    while (object2) {
      arrayPush(result2, getSymbols(object2));
      object2 = getPrototype(object2);
    }
    return result2;
  };
  function copySymbolsIn(source, object2) {
    return copyObject(source, getSymbolsIn(source), object2);
  }
  function baseGetAllKeys(object2, keysFunc, symbolsFunc) {
    var result2 = keysFunc(object2);
    return isArray(object2) ? result2 : arrayPush(result2, symbolsFunc(object2));
  }
  function getAllKeys(object2) {
    return baseGetAllKeys(object2, keys, getSymbols);
  }
  function getAllKeysIn(object2) {
    return baseGetAllKeys(object2, keysIn, getSymbolsIn);
  }
  var DataView = getNative(root, "DataView");
  var Promise$1 = getNative(root, "Promise");
  var Set = getNative(root, "Set");
  var mapTag$8 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$8 = "[object Set]", weakMapTag$2 = "[object WeakMap]";
  var dataViewTag$3 = "[object DataView]";
  var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
  var getTag = baseGetTag;
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$8 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$8 || WeakMap && getTag(new WeakMap()) != weakMapTag$2) {
    getTag = function(value) {
      var result2 = baseGetTag(value), Ctor = result2 == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$3;
          case mapCtorString:
            return mapTag$8;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag$8;
          case weakMapCtorString:
            return weakMapTag$2;
        }
      }
      return result2;
    };
  }
  const getTag$1 = getTag;
  var objectProto$c = Object.prototype;
  var hasOwnProperty$b = objectProto$c.hasOwnProperty;
  function initCloneArray(array2) {
    var length = array2.length, result2 = new array2.constructor(length);
    if (length && typeof array2[0] == "string" && hasOwnProperty$b.call(array2, "index")) {
      result2.index = array2.index;
      result2.input = array2.input;
    }
    return result2;
  }
  var Uint8Array$1 = root.Uint8Array;
  function cloneArrayBuffer(arrayBuffer) {
    var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result2).set(new Uint8Array$1(arrayBuffer));
    return result2;
  }
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  var reFlags$1 = /\w*$/;
  function cloneRegExp(regexp) {
    var result2 = new regexp.constructor(regexp.source, reFlags$1.exec(regexp));
    result2.lastIndex = regexp.lastIndex;
    return result2;
  }
  var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
  function cloneSymbol(symbol) {
    return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
  }
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  var boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", mapTag$7 = "[object Map]", numberTag$3 = "[object Number]", regexpTag$3 = "[object RegExp]", setTag$7 = "[object Set]", stringTag$3 = "[object String]", symbolTag$2 = "[object Symbol]";
  var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
  function initCloneByTag(object2, tag, isDeep) {
    var Ctor = object2.constructor;
    switch (tag) {
      case arrayBufferTag$3:
        return cloneArrayBuffer(object2);
      case boolTag$3:
      case dateTag$3:
        return new Ctor(+object2);
      case dataViewTag$2:
        return cloneDataView(object2, isDeep);
      case float32Tag$1:
      case float64Tag$1:
      case int8Tag$1:
      case int16Tag$1:
      case int32Tag$1:
      case uint8Tag$1:
      case uint8ClampedTag$1:
      case uint16Tag$1:
      case uint32Tag$1:
        return cloneTypedArray(object2, isDeep);
      case mapTag$7:
        return new Ctor();
      case numberTag$3:
      case stringTag$3:
        return new Ctor(object2);
      case regexpTag$3:
        return cloneRegExp(object2);
      case setTag$7:
        return new Ctor();
      case symbolTag$2:
        return cloneSymbol(object2);
    }
  }
  function initCloneObject(object2) {
    return typeof object2.constructor == "function" && !isPrototype(object2) ? baseCreate(getPrototype(object2)) : {};
  }
  var mapTag$6 = "[object Map]";
  function baseIsMap(value) {
    return isObjectLike(value) && getTag$1(value) == mapTag$6;
  }
  var nodeIsMap = nodeUtil && nodeUtil.isMap;
  var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
  var setTag$6 = "[object Set]";
  function baseIsSet(value) {
    return isObjectLike(value) && getTag$1(value) == setTag$6;
  }
  var nodeIsSet = nodeUtil && nodeUtil.isSet;
  var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
  var CLONE_DEEP_FLAG$7 = 1, CLONE_FLAT_FLAG$1 = 2, CLONE_SYMBOLS_FLAG$5 = 4;
  var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$5 = "[object Map]", numberTag$2 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$2 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$2 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag$1 = "[object WeakMap]";
  var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var cloneableTags = {};
  cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$2] = cloneableTags[dateTag$2] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$5] = cloneableTags[numberTag$2] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$2] = cloneableTags[setTag$5] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag$1] = false;
  function baseClone(value, bitmask, customizer, key, object2, stack) {
    var result2, isDeep = bitmask & CLONE_DEEP_FLAG$7, isFlat = bitmask & CLONE_FLAT_FLAG$1, isFull = bitmask & CLONE_SYMBOLS_FLAG$5;
    if (customizer) {
      result2 = object2 ? customizer(value, key, object2, stack) : customizer(value);
    }
    if (result2 !== void 0) {
      return result2;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result2 = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result2);
      }
    } else {
      var tag = getTag$1(value), isFunc = tag == funcTag || tag == genTag;
      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object2) {
        result2 = isFlat || isFunc ? {} : initCloneObject(value);
        if (!isDeep) {
          return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object2 ? value : {};
        }
        result2 = initCloneByTag(value, tag, isDeep);
      }
    }
    stack || (stack = new Stack());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result2);
    if (isSet(value)) {
      value.forEach(function(subValue) {
        result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap(value)) {
      value.forEach(function(subValue, key2) {
        result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
    }
    var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
    var props = isArr ? void 0 : keysFunc(value);
    arrayEach(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
    return result2;
  }
  var CLONE_SYMBOLS_FLAG$4 = 4;
  function clone(value) {
    return baseClone(value, CLONE_SYMBOLS_FLAG$4);
  }
  var CLONE_DEEP_FLAG$6 = 1, CLONE_SYMBOLS_FLAG$3 = 4;
  function cloneDeep(value) {
    return baseClone(value, CLONE_DEEP_FLAG$6 | CLONE_SYMBOLS_FLAG$3);
  }
  var CLONE_DEEP_FLAG$5 = 1, CLONE_SYMBOLS_FLAG$2 = 4;
  function cloneDeepWith(value, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return baseClone(value, CLONE_DEEP_FLAG$5 | CLONE_SYMBOLS_FLAG$2, customizer);
  }
  var CLONE_SYMBOLS_FLAG$1 = 4;
  function cloneWith(value, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return baseClone(value, CLONE_SYMBOLS_FLAG$1, customizer);
  }
  function wrapperCommit() {
    return new LodashWrapper(this.value(), this.__chain__);
  }
  function compact(array2) {
    var index = -1, length = array2 == null ? 0 : array2.length, resIndex = 0, result2 = [];
    while (++index < length) {
      var value = array2[index];
      if (value) {
        result2[resIndex++] = value;
      }
    }
    return result2;
  }
  function concat() {
    var length = arguments.length;
    if (!length) {
      return [];
    }
    var args = Array(length - 1), array2 = arguments[0], index = length;
    while (index--) {
      args[index - 1] = arguments[index];
    }
    return arrayPush(isArray(array2) ? copyArray(array2) : [array2], baseFlatten(args, 1));
  }
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  function SetCache(values2) {
    var index = -1, length = values2 == null ? 0 : values2.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values2[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function arraySome(array2, predicate) {
    var index = -1, length = array2 == null ? 0 : array2.length;
    while (++index < length) {
      if (predicate(array2[index], index, array2)) {
        return true;
      }
    }
    return false;
  }
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
  function equalArrays(array2, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array2.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array2);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array2;
    }
    var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
    stack.set(array2, other);
    stack.set(other, array2);
    while (++index < arrLength) {
      var arrValue = array2[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array2, stack) : customizer(arrValue, othValue, index, array2, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result2 = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result2 = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result2 = false;
        break;
      }
    }
    stack["delete"](array2);
    stack["delete"](other);
    return result2;
  }
  function mapToArray(map2) {
    var index = -1, result2 = Array(map2.size);
    map2.forEach(function(value, key) {
      result2[++index] = [key, value];
    });
    return result2;
  }
  function setToArray(set2) {
    var index = -1, result2 = Array(set2.size);
    set2.forEach(function(value) {
      result2[++index] = value;
    });
    return result2;
  }
  var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
  var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag = "[object Error]", mapTag$4 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$4 = "[object Set]", stringTag$1 = "[object String]", symbolTag = "[object Symbol]";
  var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
  var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function equalByTag(object2, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object2.byteLength != other.byteLength || object2.byteOffset != other.byteOffset) {
          return false;
        }
        object2 = object2.buffer;
        other = other.buffer;
      case arrayBufferTag$1:
        if (object2.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object2), new Uint8Array$1(other))) {
          return false;
        }
        return true;
      case boolTag$1:
      case dateTag$1:
      case numberTag$1:
        return eq(+object2, +other);
      case errorTag:
        return object2.name == other.name && object2.message == other.message;
      case regexpTag$1:
      case stringTag$1:
        return object2 == other + "";
      case mapTag$4:
        var convert = mapToArray;
      case setTag$4:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
        convert || (convert = setToArray);
        if (object2.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object2);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$2;
        stack.set(object2, other);
        var result2 = equalArrays(convert(object2), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object2);
        return result2;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object2) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  var COMPARE_PARTIAL_FLAG$3 = 1;
  var objectProto$b = Object.prototype;
  var hasOwnProperty$a = objectProto$b.hasOwnProperty;
  function equalObjects(object2, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object2), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$a.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object2);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object2;
    }
    var result2 = true;
    stack.set(object2, other);
    stack.set(other, object2);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object2[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object2, stack) : customizer(objValue, othValue, key, object2, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result2 = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result2 && !skipCtor) {
      var objCtor = object2.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object2 && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result2 = false;
      }
    }
    stack["delete"](object2);
    stack["delete"](other);
    return result2;
  }
  var COMPARE_PARTIAL_FLAG$2 = 1;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
  var objectProto$a = Object.prototype;
  var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
  function baseIsEqualDeep(object2, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object2), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag$1(object2), othTag = othIsArr ? arrayTag : getTag$1(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer(object2)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object2) ? equalArrays(object2, other, bitmask, customizer, equalFunc, stack) : equalByTag(object2, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
      var objIsWrapped = objIsObj && hasOwnProperty$9.call(object2, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$9.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object2.value() : object2, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object2, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
  function baseIsMatch(object2, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object2 == null) {
      return !length;
    }
    object2 = Object(object2);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object2[data[0]] : !(data[0] in object2)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object2[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object2)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result2 = customizer(objValue, srcValue, key, object2, source, stack);
        }
        if (!(result2 === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result2)) {
          return false;
        }
      }
    }
    return true;
  }
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }
  function getMatchData(object2) {
    var result2 = keys(object2), length = result2.length;
    while (length--) {
      var key = result2[length], value = object2[key];
      result2[length] = [key, value, isStrictComparable(value)];
    }
    return result2;
  }
  function matchesStrictComparable(key, srcValue) {
    return function(object2) {
      if (object2 == null) {
        return false;
      }
      return object2[key] === srcValue && (srcValue !== void 0 || key in Object(object2));
    };
  }
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object2) {
      return object2 === source || baseIsMatch(object2, source, matchData);
    };
  }
  function baseHasIn(object2, key) {
    return object2 != null && key in Object(object2);
  }
  function hasPath(object2, path, hasFunc) {
    path = castPath(path, object2);
    var index = -1, length = path.length, result2 = false;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result2 = object2 != null && hasFunc(object2, key))) {
        break;
      }
      object2 = object2[key];
    }
    if (result2 || ++index != length) {
      return result2;
    }
    length = object2 == null ? 0 : object2.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray(object2) || isArguments(object2));
  }
  function hasIn(object2, path) {
    return object2 != null && hasPath(object2, path, baseHasIn);
  }
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object2) {
      var objValue = get(object2, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object2, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  function baseProperty(key) {
    return function(object2) {
      return object2 == null ? void 0 : object2[key];
    };
  }
  function basePropertyDeep(path) {
    return function(object2) {
      return baseGet(object2, path);
    };
  }
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  var FUNC_ERROR_TEXT$7 = "Expected a function";
  function cond(pairs) {
    var length = pairs == null ? 0 : pairs.length, toIteratee = baseIteratee;
    pairs = !length ? [] : arrayMap(pairs, function(pair) {
      if (typeof pair[1] != "function") {
        throw new TypeError(FUNC_ERROR_TEXT$7);
      }
      return [toIteratee(pair[0]), pair[1]];
    });
    return baseRest(function(args) {
      var index = -1;
      while (++index < length) {
        var pair = pairs[index];
        if (apply(pair[0], this, args)) {
          return apply(pair[1], this, args);
        }
      }
    });
  }
  function baseConformsTo(object2, source, props) {
    var length = props.length;
    if (object2 == null) {
      return !length;
    }
    object2 = Object(object2);
    while (length--) {
      var key = props[length], predicate = source[key], value = object2[key];
      if (value === void 0 && !(key in object2) || !predicate(value)) {
        return false;
      }
    }
    return true;
  }
  function baseConforms(source) {
    var props = keys(source);
    return function(object2) {
      return baseConformsTo(object2, source, props);
    };
  }
  var CLONE_DEEP_FLAG$4 = 1;
  function conforms(source) {
    return baseConforms(baseClone(source, CLONE_DEEP_FLAG$4));
  }
  function conformsTo(object2, source) {
    return source == null || baseConformsTo(object2, source, keys(source));
  }
  function arrayAggregator(array2, setter, iteratee2, accumulator) {
    var index = -1, length = array2 == null ? 0 : array2.length;
    while (++index < length) {
      var value = array2[index];
      setter(accumulator, value, iteratee2(value), array2);
    }
    return accumulator;
  }
  function createBaseFor(fromRight) {
    return function(object2, iteratee2, keysFunc) {
      var index = -1, iterable = Object(object2), props = keysFunc(object2), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee2(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object2;
    };
  }
  var baseFor = createBaseFor();
  function baseForOwn(object2, iteratee2) {
    return object2 && baseFor(object2, iteratee2, keys);
  }
  function createBaseEach(eachFunc, fromRight) {
    return function(collection2, iteratee2) {
      if (collection2 == null) {
        return collection2;
      }
      if (!isArrayLike(collection2)) {
        return eachFunc(collection2, iteratee2);
      }
      var length = collection2.length, index = fromRight ? length : -1, iterable = Object(collection2);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee2(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection2;
    };
  }
  var baseEach = createBaseEach(baseForOwn);
  function baseAggregator(collection2, setter, iteratee2, accumulator) {
    baseEach(collection2, function(value, key, collection3) {
      setter(accumulator, value, iteratee2(value), collection3);
    });
    return accumulator;
  }
  function createAggregator(setter, initializer) {
    return function(collection2, iteratee2) {
      var func2 = isArray(collection2) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
      return func2(collection2, setter, baseIteratee(iteratee2, 2), accumulator);
    };
  }
  var objectProto$9 = Object.prototype;
  var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
  var countBy = createAggregator(function(result2, value, key) {
    if (hasOwnProperty$8.call(result2, key)) {
      ++result2[key];
    } else {
      baseAssignValue(result2, key, 1);
    }
  });
  function create(prototype2, properties) {
    var result2 = baseCreate(prototype2);
    return properties == null ? result2 : baseAssign(result2, properties);
  }
  var WRAP_CURRY_FLAG$1 = 8;
  function curry(func2, arity, guard) {
    arity = guard ? void 0 : arity;
    var result2 = createWrap(func2, WRAP_CURRY_FLAG$1, void 0, void 0, void 0, void 0, void 0, arity);
    result2.placeholder = curry.placeholder;
    return result2;
  }
  curry.placeholder = {};
  var WRAP_CURRY_RIGHT_FLAG = 16;
  function curryRight(func2, arity, guard) {
    arity = guard ? void 0 : arity;
    var result2 = createWrap(func2, WRAP_CURRY_RIGHT_FLAG, void 0, void 0, void 0, void 0, void 0, arity);
    result2.placeholder = curryRight.placeholder;
    return result2;
  }
  curryRight.placeholder = {};
  var now = function() {
    return root.Date.now();
  };
  var FUNC_ERROR_TEXT$6 = "Expected a function";
  var nativeMax$b = Math.max, nativeMin$b = Math.min;
  function debounce(func2, wait, options) {
    var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func2 != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$6);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax$b(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result2 = func2.apply(thisArg, args);
      return result2;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result2;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin$b(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result2;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result2 : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result2;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  function defaultTo(value, defaultValue) {
    return value == null || value !== value ? defaultValue : value;
  }
  var objectProto$8 = Object.prototype;
  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
  var defaults = baseRest(function(object2, sources) {
    object2 = Object(object2);
    var index = -1;
    var length = sources.length;
    var guard = length > 2 ? sources[2] : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      var props = keysIn(source);
      var propsIndex = -1;
      var propsLength = props.length;
      while (++propsIndex < propsLength) {
        var key = props[propsIndex];
        var value = object2[key];
        if (value === void 0 || eq(value, objectProto$8[key]) && !hasOwnProperty$7.call(object2, key)) {
          object2[key] = source[key];
        }
      }
    }
    return object2;
  });
  function assignMergeValue(object2, key, value) {
    if (value !== void 0 && !eq(object2[key], value) || value === void 0 && !(key in object2)) {
      baseAssignValue(object2, key, value);
    }
  }
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  function safeGet(object2, key) {
    if (key === "constructor" && typeof object2[key] === "function") {
      return;
    }
    if (key == "__proto__") {
      return;
    }
    return object2[key];
  }
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }
  function baseMergeDeep(object2, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object2, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
    if (stacked) {
      assignMergeValue(object2, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + "", object2, source, stack) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack["delete"](srcValue);
    }
    assignMergeValue(object2, key, newValue);
  }
  function baseMerge(object2, source, srcIndex, customizer, stack) {
    if (object2 === source) {
      return;
    }
    baseFor(source, function(srcValue, key) {
      stack || (stack = new Stack());
      if (isObject(srcValue)) {
        baseMergeDeep(object2, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object2, key), srcValue, key + "", object2, source, stack) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue(object2, key, newValue);
      }
    }, keysIn);
  }
  function customDefaultsMerge(objValue, srcValue, key, object2, source, stack) {
    if (isObject(objValue) && isObject(srcValue)) {
      stack.set(srcValue, objValue);
      baseMerge(objValue, srcValue, void 0, customDefaultsMerge, stack);
      stack["delete"](srcValue);
    }
    return objValue;
  }
  var mergeWith = createAssigner(function(object2, source, srcIndex, customizer) {
    baseMerge(object2, source, srcIndex, customizer);
  });
  var defaultsDeep = baseRest(function(args) {
    args.push(void 0, customDefaultsMerge);
    return apply(mergeWith, void 0, args);
  });
  var FUNC_ERROR_TEXT$5 = "Expected a function";
  function baseDelay(func2, wait, args) {
    if (typeof func2 != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$5);
    }
    return setTimeout(function() {
      func2.apply(void 0, args);
    }, wait);
  }
  var defer = baseRest(function(func2, args) {
    return baseDelay(func2, 1, args);
  });
  var delay = baseRest(function(func2, wait, args) {
    return baseDelay(func2, toNumber(wait) || 0, args);
  });
  function arrayIncludesWith(array2, value, comparator) {
    var index = -1, length = array2 == null ? 0 : array2.length;
    while (++index < length) {
      if (comparator(value, array2[index])) {
        return true;
      }
    }
    return false;
  }
  var LARGE_ARRAY_SIZE$1 = 200;
  function baseDifference(array2, values2, iteratee2, comparator) {
    var index = -1, includes2 = arrayIncludes, isCommon = true, length = array2.length, result2 = [], valuesLength = values2.length;
    if (!length) {
      return result2;
    }
    if (iteratee2) {
      values2 = arrayMap(values2, baseUnary(iteratee2));
    }
    if (comparator) {
      includes2 = arrayIncludesWith;
      isCommon = false;
    } else if (values2.length >= LARGE_ARRAY_SIZE$1) {
      includes2 = cacheHas;
      isCommon = false;
      values2 = new SetCache(values2);
    }
    outer:
      while (++index < length) {
        var value = array2[index], computed = iteratee2 == null ? value : iteratee2(value);
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values2[valuesIndex] === computed) {
              continue outer;
            }
          }
          result2.push(value);
        } else if (!includes2(values2, computed, comparator)) {
          result2.push(value);
        }
      }
    return result2;
  }
  var difference = baseRest(function(array2, values2) {
    return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
  });
  function last(array2) {
    var length = array2 == null ? 0 : array2.length;
    return length ? array2[length - 1] : void 0;
  }
  var differenceBy = baseRest(function(array2, values2) {
    var iteratee2 = last(values2);
    if (isArrayLikeObject(iteratee2)) {
      iteratee2 = void 0;
    }
    return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true), baseIteratee(iteratee2, 2)) : [];
  });
  var differenceWith = baseRest(function(array2, values2) {
    var comparator = last(values2);
    if (isArrayLikeObject(comparator)) {
      comparator = void 0;
    }
    return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true), void 0, comparator) : [];
  });
  var divide = createMathOperation(function(dividend, divisor) {
    return dividend / divisor;
  }, 1);
  function drop(array2, n, guard) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger(n);
    return baseSlice(array2, n < 0 ? 0 : n, length);
  }
  function dropRight(array2, n, guard) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger(n);
    n = length - n;
    return baseSlice(array2, 0, n < 0 ? 0 : n);
  }
  function baseWhile(array2, predicate, isDrop, fromRight) {
    var length = array2.length, index = fromRight ? length : -1;
    while ((fromRight ? index-- : ++index < length) && predicate(array2[index], index, array2)) {
    }
    return isDrop ? baseSlice(array2, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array2, fromRight ? index + 1 : 0, fromRight ? length : index);
  }
  function dropRightWhile(array2, predicate) {
    return array2 && array2.length ? baseWhile(array2, baseIteratee(predicate, 3), true, true) : [];
  }
  function dropWhile(array2, predicate) {
    return array2 && array2.length ? baseWhile(array2, baseIteratee(predicate, 3), true) : [];
  }
  function castFunction(value) {
    return typeof value == "function" ? value : identity;
  }
  function forEach(collection2, iteratee2) {
    var func2 = isArray(collection2) ? arrayEach : baseEach;
    return func2(collection2, castFunction(iteratee2));
  }
  function arrayEachRight(array2, iteratee2) {
    var length = array2 == null ? 0 : array2.length;
    while (length--) {
      if (iteratee2(array2[length], length, array2) === false) {
        break;
      }
    }
    return array2;
  }
  var baseForRight = createBaseFor(true);
  function baseForOwnRight(object2, iteratee2) {
    return object2 && baseForRight(object2, iteratee2, keys);
  }
  var baseEachRight = createBaseEach(baseForOwnRight, true);
  function forEachRight(collection2, iteratee2) {
    var func2 = isArray(collection2) ? arrayEachRight : baseEachRight;
    return func2(collection2, castFunction(iteratee2));
  }
  function endsWith(string2, target, position) {
    string2 = toString(string2);
    target = baseToString(target);
    var length = string2.length;
    position = position === void 0 ? length : baseClamp(toInteger(position), 0, length);
    var end = position;
    position -= target.length;
    return position >= 0 && string2.slice(position, end) == target;
  }
  function baseToPairs(object2, props) {
    return arrayMap(props, function(key) {
      return [key, object2[key]];
    });
  }
  function setToPairs(set2) {
    var index = -1, result2 = Array(set2.size);
    set2.forEach(function(value) {
      result2[++index] = [value, value];
    });
    return result2;
  }
  var mapTag$3 = "[object Map]", setTag$3 = "[object Set]";
  function createToPairs(keysFunc) {
    return function(object2) {
      var tag = getTag$1(object2);
      if (tag == mapTag$3) {
        return mapToArray(object2);
      }
      if (tag == setTag$3) {
        return setToPairs(object2);
      }
      return baseToPairs(object2, keysFunc(object2));
    };
  }
  var toPairs = createToPairs(keys);
  var toPairsIn = createToPairs(keysIn);
  var htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  var escapeHtmlChar = basePropertyOf(htmlEscapes);
  var reUnescapedHtml = /[&<>"']/g, reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
  function escape(string2) {
    string2 = toString(string2);
    return string2 && reHasUnescapedHtml.test(string2) ? string2.replace(reUnescapedHtml, escapeHtmlChar) : string2;
  }
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
  function escapeRegExp(string2) {
    string2 = toString(string2);
    return string2 && reHasRegExpChar.test(string2) ? string2.replace(reRegExpChar, "\\$&") : string2;
  }
  function arrayEvery(array2, predicate) {
    var index = -1, length = array2 == null ? 0 : array2.length;
    while (++index < length) {
      if (!predicate(array2[index], index, array2)) {
        return false;
      }
    }
    return true;
  }
  function baseEvery(collection2, predicate) {
    var result2 = true;
    baseEach(collection2, function(value, index, collection3) {
      result2 = !!predicate(value, index, collection3);
      return result2;
    });
    return result2;
  }
  function every(collection2, predicate, guard) {
    var func2 = isArray(collection2) ? arrayEvery : baseEvery;
    if (guard && isIterateeCall(collection2, predicate, guard)) {
      predicate = void 0;
    }
    return func2(collection2, baseIteratee(predicate, 3));
  }
  var MAX_ARRAY_LENGTH$5 = 4294967295;
  function toLength(value) {
    return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH$5) : 0;
  }
  function baseFill(array2, value, start, end) {
    var length = array2.length;
    start = toInteger(start);
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = end === void 0 || end > length ? length : toInteger(end);
    if (end < 0) {
      end += length;
    }
    end = start > end ? 0 : toLength(end);
    while (start < end) {
      array2[start++] = value;
    }
    return array2;
  }
  function fill(array2, value, start, end) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return [];
    }
    if (start && typeof start != "number" && isIterateeCall(array2, value, start)) {
      start = 0;
      end = length;
    }
    return baseFill(array2, value, start, end);
  }
  function baseFilter(collection2, predicate) {
    var result2 = [];
    baseEach(collection2, function(value, index, collection3) {
      if (predicate(value, index, collection3)) {
        result2.push(value);
      }
    });
    return result2;
  }
  function filter(collection2, predicate) {
    var func2 = isArray(collection2) ? arrayFilter : baseFilter;
    return func2(collection2, baseIteratee(predicate, 3));
  }
  function createFind(findIndexFunc) {
    return function(collection2, predicate, fromIndex) {
      var iterable = Object(collection2);
      if (!isArrayLike(collection2)) {
        var iteratee2 = baseIteratee(predicate, 3);
        collection2 = keys(collection2);
        predicate = function(key) {
          return iteratee2(iterable[key], key, iterable);
        };
      }
      var index = findIndexFunc(collection2, predicate, fromIndex);
      return index > -1 ? iterable[iteratee2 ? collection2[index] : index] : void 0;
    };
  }
  var nativeMax$a = Math.max;
  function findIndex(array2, predicate, fromIndex) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax$a(length + index, 0);
    }
    return baseFindIndex(array2, baseIteratee(predicate, 3), index);
  }
  var find = createFind(findIndex);
  function baseFindKey(collection2, predicate, eachFunc) {
    var result2;
    eachFunc(collection2, function(value, key, collection3) {
      if (predicate(value, key, collection3)) {
        result2 = key;
        return false;
      }
    });
    return result2;
  }
  function findKey(object2, predicate) {
    return baseFindKey(object2, baseIteratee(predicate, 3), baseForOwn);
  }
  var nativeMax$9 = Math.max, nativeMin$a = Math.min;
  function findLastIndex(array2, predicate, fromIndex) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return -1;
    }
    var index = length - 1;
    if (fromIndex !== void 0) {
      index = toInteger(fromIndex);
      index = fromIndex < 0 ? nativeMax$9(length + index, 0) : nativeMin$a(index, length - 1);
    }
    return baseFindIndex(array2, baseIteratee(predicate, 3), index, true);
  }
  var findLast = createFind(findLastIndex);
  function findLastKey(object2, predicate) {
    return baseFindKey(object2, baseIteratee(predicate, 3), baseForOwnRight);
  }
  function head(array2) {
    return array2 && array2.length ? array2[0] : void 0;
  }
  function baseMap(collection2, iteratee2) {
    var index = -1, result2 = isArrayLike(collection2) ? Array(collection2.length) : [];
    baseEach(collection2, function(value, key, collection3) {
      result2[++index] = iteratee2(value, key, collection3);
    });
    return result2;
  }
  function map(collection2, iteratee2) {
    var func2 = isArray(collection2) ? arrayMap : baseMap;
    return func2(collection2, baseIteratee(iteratee2, 3));
  }
  function flatMap(collection2, iteratee2) {
    return baseFlatten(map(collection2, iteratee2), 1);
  }
  var INFINITY$2 = 1 / 0;
  function flatMapDeep(collection2, iteratee2) {
    return baseFlatten(map(collection2, iteratee2), INFINITY$2);
  }
  function flatMapDepth(collection2, iteratee2, depth) {
    depth = depth === void 0 ? 1 : toInteger(depth);
    return baseFlatten(map(collection2, iteratee2), depth);
  }
  var INFINITY$1 = 1 / 0;
  function flattenDeep(array2) {
    var length = array2 == null ? 0 : array2.length;
    return length ? baseFlatten(array2, INFINITY$1) : [];
  }
  function flattenDepth(array2, depth) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return [];
    }
    depth = depth === void 0 ? 1 : toInteger(depth);
    return baseFlatten(array2, depth);
  }
  var WRAP_FLIP_FLAG = 512;
  function flip(func2) {
    return createWrap(func2, WRAP_FLIP_FLAG);
  }
  var floor = createRound("floor");
  var FUNC_ERROR_TEXT$4 = "Expected a function";
  var WRAP_CURRY_FLAG = 8, WRAP_PARTIAL_FLAG$1 = 32, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG$1 = 256;
  function createFlow(fromRight) {
    return flatRest(function(funcs) {
      var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
      if (fromRight) {
        funcs.reverse();
      }
      while (index--) {
        var func2 = funcs[index];
        if (typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$4);
        }
        if (prereq && !wrapper && getFuncName(func2) == "wrapper") {
          var wrapper = new LodashWrapper([], true);
        }
      }
      index = wrapper ? index : length;
      while (++index < length) {
        func2 = funcs[index];
        var funcName = getFuncName(func2), data = funcName == "wrapper" ? getData(func2) : void 0;
        if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG$1 | WRAP_REARG_FLAG$1) && !data[4].length && data[9] == 1) {
          wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
        } else {
          wrapper = func2.length == 1 && isLaziable(func2) ? wrapper[funcName]() : wrapper.thru(func2);
        }
      }
      return function() {
        var args = arguments, value = args[0];
        if (wrapper && args.length == 1 && isArray(value)) {
          return wrapper.plant(value).value();
        }
        var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
        while (++index2 < length) {
          result2 = funcs[index2].call(this, result2);
        }
        return result2;
      };
    });
  }
  var flow = createFlow();
  var flowRight = createFlow(true);
  function forIn(object2, iteratee2) {
    return object2 == null ? object2 : baseFor(object2, castFunction(iteratee2), keysIn);
  }
  function forInRight(object2, iteratee2) {
    return object2 == null ? object2 : baseForRight(object2, castFunction(iteratee2), keysIn);
  }
  function forOwn(object2, iteratee2) {
    return object2 && baseForOwn(object2, castFunction(iteratee2));
  }
  function forOwnRight(object2, iteratee2) {
    return object2 && baseForOwnRight(object2, castFunction(iteratee2));
  }
  function fromPairs(pairs) {
    var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
    while (++index < length) {
      var pair = pairs[index];
      result2[pair[0]] = pair[1];
    }
    return result2;
  }
  function baseFunctions(object2, props) {
    return arrayFilter(props, function(key) {
      return isFunction(object2[key]);
    });
  }
  function functions(object2) {
    return object2 == null ? [] : baseFunctions(object2, keys(object2));
  }
  function functionsIn(object2) {
    return object2 == null ? [] : baseFunctions(object2, keysIn(object2));
  }
  var objectProto$7 = Object.prototype;
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
  var groupBy = createAggregator(function(result2, value, key) {
    if (hasOwnProperty$6.call(result2, key)) {
      result2[key].push(value);
    } else {
      baseAssignValue(result2, key, [value]);
    }
  });
  function baseGt(value, other) {
    return value > other;
  }
  function createRelationalOperation(operator) {
    return function(value, other) {
      if (!(typeof value == "string" && typeof other == "string")) {
        value = toNumber(value);
        other = toNumber(other);
      }
      return operator(value, other);
    };
  }
  var gt = createRelationalOperation(baseGt);
  var gte = createRelationalOperation(function(value, other) {
    return value >= other;
  });
  var objectProto$6 = Object.prototype;
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  function baseHas(object2, key) {
    return object2 != null && hasOwnProperty$5.call(object2, key);
  }
  function has(object2, path) {
    return object2 != null && hasPath(object2, path, baseHas);
  }
  var nativeMax$8 = Math.max, nativeMin$9 = Math.min;
  function baseInRange(number2, start, end) {
    return number2 >= nativeMin$9(start, end) && number2 < nativeMax$8(start, end);
  }
  function inRange(number2, start, end) {
    start = toFinite(start);
    if (end === void 0) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }
    number2 = toNumber(number2);
    return baseInRange(number2, start, end);
  }
  var stringTag = "[object String]";
  function isString(value) {
    return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
  }
  function baseValues(object2, props) {
    return arrayMap(props, function(key) {
      return object2[key];
    });
  }
  function values(object2) {
    return object2 == null ? [] : baseValues(object2, keys(object2));
  }
  var nativeMax$7 = Math.max;
  function includes(collection2, value, fromIndex, guard) {
    collection2 = isArrayLike(collection2) ? collection2 : values(collection2);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection2.length;
    if (fromIndex < 0) {
      fromIndex = nativeMax$7(length + fromIndex, 0);
    }
    return isString(collection2) ? fromIndex <= length && collection2.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection2, value, fromIndex) > -1;
  }
  var nativeMax$6 = Math.max;
  function indexOf(array2, value, fromIndex) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax$6(length + index, 0);
    }
    return baseIndexOf(array2, value, index);
  }
  function initial(array2) {
    var length = array2 == null ? 0 : array2.length;
    return length ? baseSlice(array2, 0, -1) : [];
  }
  var nativeMin$8 = Math.min;
  function baseIntersection(arrays, iteratee2, comparator) {
    var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = Infinity, result2 = [];
    while (othIndex--) {
      var array2 = arrays[othIndex];
      if (othIndex && iteratee2) {
        array2 = arrayMap(array2, baseUnary(iteratee2));
      }
      maxLength = nativeMin$8(array2.length, maxLength);
      caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array2.length >= 120) ? new SetCache(othIndex && array2) : void 0;
    }
    array2 = arrays[0];
    var index = -1, seen = caches[0];
    outer:
      while (++index < length && result2.length < maxLength) {
        var value = array2[index], computed = iteratee2 ? iteratee2(value) : value;
        value = comparator || value !== 0 ? value : 0;
        if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result2.push(value);
        }
      }
    return result2;
  }
  function castArrayLikeObject(value) {
    return isArrayLikeObject(value) ? value : [];
  }
  var intersection = baseRest(function(arrays) {
    var mapped = arrayMap(arrays, castArrayLikeObject);
    return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
  });
  var intersectionBy = baseRest(function(arrays) {
    var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
    if (iteratee2 === last(mapped)) {
      iteratee2 = void 0;
    } else {
      mapped.pop();
    }
    return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, baseIteratee(iteratee2, 2)) : [];
  });
  var intersectionWith = baseRest(function(arrays) {
    var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
    comparator = typeof comparator == "function" ? comparator : void 0;
    if (comparator) {
      mapped.pop();
    }
    return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, void 0, comparator) : [];
  });
  function baseInverter(object2, setter, iteratee2, accumulator) {
    baseForOwn(object2, function(value, key, object3) {
      setter(accumulator, iteratee2(value), key, object3);
    });
    return accumulator;
  }
  function createInverter(setter, toIteratee) {
    return function(object2, iteratee2) {
      return baseInverter(object2, setter, toIteratee(iteratee2), {});
    };
  }
  var objectProto$5 = Object.prototype;
  var nativeObjectToString$1 = objectProto$5.toString;
  var invert = createInverter(function(result2, value, key) {
    if (value != null && typeof value.toString != "function") {
      value = nativeObjectToString$1.call(value);
    }
    result2[value] = key;
  }, constant(identity));
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
  var nativeObjectToString = objectProto$4.toString;
  var invertBy = createInverter(function(result2, value, key) {
    if (value != null && typeof value.toString != "function") {
      value = nativeObjectToString.call(value);
    }
    if (hasOwnProperty$4.call(result2, value)) {
      result2[value].push(key);
    } else {
      result2[value] = [key];
    }
  }, baseIteratee);
  function parent(object2, path) {
    return path.length < 2 ? object2 : baseGet(object2, baseSlice(path, 0, -1));
  }
  function baseInvoke(object2, path, args) {
    path = castPath(path, object2);
    object2 = parent(object2, path);
    var func2 = object2 == null ? object2 : object2[toKey(last(path))];
    return func2 == null ? void 0 : apply(func2, object2, args);
  }
  var invoke = baseRest(baseInvoke);
  var invokeMap = baseRest(function(collection2, path, args) {
    var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection2) ? Array(collection2.length) : [];
    baseEach(collection2, function(value) {
      result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
    });
    return result2;
  });
  var arrayBufferTag = "[object ArrayBuffer]";
  function baseIsArrayBuffer(value) {
    return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
  }
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;
  var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
  var boolTag = "[object Boolean]";
  function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
  }
  var dateTag = "[object Date]";
  function baseIsDate(value) {
    return isObjectLike(value) && baseGetTag(value) == dateTag;
  }
  var nodeIsDate = nodeUtil && nodeUtil.isDate;
  var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
  function isElement(value) {
    return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
  }
  var mapTag$2 = "[object Map]", setTag$2 = "[object Set]";
  var objectProto$3 = Object.prototype;
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
  function isEmpty(value) {
    if (value == null) {
      return true;
    }
    if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
      return !value.length;
    }
    var tag = getTag$1(value);
    if (tag == mapTag$2 || tag == setTag$2) {
      return !value.size;
    }
    if (isPrototype(value)) {
      return !baseKeys(value).length;
    }
    for (var key in value) {
      if (hasOwnProperty$3.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  function isEqualWith(value, other, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    var result2 = customizer ? customizer(value, other) : void 0;
    return result2 === void 0 ? baseIsEqual(value, other, void 0, customizer) : !!result2;
  }
  var nativeIsFinite = root.isFinite;
  function isFinite(value) {
    return typeof value == "number" && nativeIsFinite(value);
  }
  function isInteger(value) {
    return typeof value == "number" && value == toInteger(value);
  }
  function isMatch(object2, source) {
    return object2 === source || baseIsMatch(object2, source, getMatchData(source));
  }
  function isMatchWith(object2, source, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return baseIsMatch(object2, source, getMatchData(source), customizer);
  }
  var numberTag = "[object Number]";
  function isNumber(value) {
    return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
  }
  function isNaN(value) {
    return isNumber(value) && value != +value;
  }
  var isMaskable = coreJsData ? isFunction : stubFalse;
  var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
  function isNative(value) {
    if (isMaskable(value)) {
      throw new Error(CORE_ERROR_TEXT);
    }
    return baseIsNative(value);
  }
  function isNil(value) {
    return value == null;
  }
  function isNull(value) {
    return value === null;
  }
  var regexpTag = "[object RegExp]";
  function baseIsRegExp(value) {
    return isObjectLike(value) && baseGetTag(value) == regexpTag;
  }
  var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
  var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
  var MAX_SAFE_INTEGER$3 = 9007199254740991;
  function isSafeInteger(value) {
    return isInteger(value) && value >= -MAX_SAFE_INTEGER$3 && value <= MAX_SAFE_INTEGER$3;
  }
  function isUndefined(value) {
    return value === void 0;
  }
  var weakMapTag = "[object WeakMap]";
  function isWeakMap(value) {
    return isObjectLike(value) && getTag$1(value) == weakMapTag;
  }
  var weakSetTag = "[object WeakSet]";
  function isWeakSet(value) {
    return isObjectLike(value) && baseGetTag(value) == weakSetTag;
  }
  var CLONE_DEEP_FLAG$3 = 1;
  function iteratee(func2) {
    return baseIteratee(typeof func2 == "function" ? func2 : baseClone(func2, CLONE_DEEP_FLAG$3));
  }
  var arrayProto$4 = Array.prototype;
  var nativeJoin = arrayProto$4.join;
  function join(array2, separator) {
    return array2 == null ? "" : nativeJoin.call(array2, separator);
  }
  var kebabCase = createCompounder(function(result2, word, index) {
    return result2 + (index ? "-" : "") + word.toLowerCase();
  });
  var keyBy = createAggregator(function(result2, value, key) {
    baseAssignValue(result2, key, value);
  });
  function strictLastIndexOf(array2, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array2[index] === value) {
        return index;
      }
    }
    return index;
  }
  var nativeMax$5 = Math.max, nativeMin$7 = Math.min;
  function lastIndexOf(array2, value, fromIndex) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return -1;
    }
    var index = length;
    if (fromIndex !== void 0) {
      index = toInteger(fromIndex);
      index = index < 0 ? nativeMax$5(length + index, 0) : nativeMin$7(index, length - 1);
    }
    return value === value ? strictLastIndexOf(array2, value, index) : baseFindIndex(array2, baseIsNaN, index, true);
  }
  var lowerCase = createCompounder(function(result2, word, index) {
    return result2 + (index ? " " : "") + word.toLowerCase();
  });
  var lowerFirst = createCaseFirst("toLowerCase");
  function baseLt(value, other) {
    return value < other;
  }
  var lt = createRelationalOperation(baseLt);
  var lte = createRelationalOperation(function(value, other) {
    return value <= other;
  });
  function mapKeys(object2, iteratee2) {
    var result2 = {};
    iteratee2 = baseIteratee(iteratee2, 3);
    baseForOwn(object2, function(value, key, object3) {
      baseAssignValue(result2, iteratee2(value, key, object3), value);
    });
    return result2;
  }
  function mapValues(object2, iteratee2) {
    var result2 = {};
    iteratee2 = baseIteratee(iteratee2, 3);
    baseForOwn(object2, function(value, key, object3) {
      baseAssignValue(result2, key, iteratee2(value, key, object3));
    });
    return result2;
  }
  var CLONE_DEEP_FLAG$2 = 1;
  function matches(source) {
    return baseMatches(baseClone(source, CLONE_DEEP_FLAG$2));
  }
  var CLONE_DEEP_FLAG$1 = 1;
  function matchesProperty(path, srcValue) {
    return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG$1));
  }
  function baseExtremum(array2, iteratee2, comparator) {
    var index = -1, length = array2.length;
    while (++index < length) {
      var value = array2[index], current = iteratee2(value);
      if (current != null && (computed === void 0 ? current === current && !isSymbol(current) : comparator(current, computed))) {
        var computed = current, result2 = value;
      }
    }
    return result2;
  }
  function max(array2) {
    return array2 && array2.length ? baseExtremum(array2, identity, baseGt) : void 0;
  }
  function maxBy(array2, iteratee2) {
    return array2 && array2.length ? baseExtremum(array2, baseIteratee(iteratee2, 2), baseGt) : void 0;
  }
  function baseSum(array2, iteratee2) {
    var result2, index = -1, length = array2.length;
    while (++index < length) {
      var current = iteratee2(array2[index]);
      if (current !== void 0) {
        result2 = result2 === void 0 ? current : result2 + current;
      }
    }
    return result2;
  }
  var NAN = 0 / 0;
  function baseMean(array2, iteratee2) {
    var length = array2 == null ? 0 : array2.length;
    return length ? baseSum(array2, iteratee2) / length : NAN;
  }
  function mean(array2) {
    return baseMean(array2, identity);
  }
  function meanBy(array2, iteratee2) {
    return baseMean(array2, baseIteratee(iteratee2, 2));
  }
  var merge = createAssigner(function(object2, source, srcIndex) {
    baseMerge(object2, source, srcIndex);
  });
  var method = baseRest(function(path, args) {
    return function(object2) {
      return baseInvoke(object2, path, args);
    };
  });
  var methodOf = baseRest(function(object2, args) {
    return function(path) {
      return baseInvoke(object2, path, args);
    };
  });
  function min(array2) {
    return array2 && array2.length ? baseExtremum(array2, identity, baseLt) : void 0;
  }
  function minBy(array2, iteratee2) {
    return array2 && array2.length ? baseExtremum(array2, baseIteratee(iteratee2, 2), baseLt) : void 0;
  }
  function mixin$1(object2, source, options) {
    var props = keys(source), methodNames = baseFunctions(source, props);
    var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object2);
    arrayEach(methodNames, function(methodName) {
      var func2 = source[methodName];
      object2[methodName] = func2;
      if (isFunc) {
        object2.prototype[methodName] = function() {
          var chainAll = this.__chain__;
          if (chain2 || chainAll) {
            var result2 = object2(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
            actions.push({ "func": func2, "args": arguments, "thisArg": object2 });
            result2.__chain__ = chainAll;
            return result2;
          }
          return func2.apply(object2, arrayPush([this.value()], arguments));
        };
      }
    });
    return object2;
  }
  var multiply = createMathOperation(function(multiplier, multiplicand) {
    return multiplier * multiplicand;
  }, 1);
  var FUNC_ERROR_TEXT$3 = "Expected a function";
  function negate(predicate) {
    if (typeof predicate != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$3);
    }
    return function() {
      var args = arguments;
      switch (args.length) {
        case 0:
          return !predicate.call(this);
        case 1:
          return !predicate.call(this, args[0]);
        case 2:
          return !predicate.call(this, args[0], args[1]);
        case 3:
          return !predicate.call(this, args[0], args[1], args[2]);
      }
      return !predicate.apply(this, args);
    };
  }
  function iteratorToArray(iterator) {
    var data, result2 = [];
    while (!(data = iterator.next()).done) {
      result2.push(data.value);
    }
    return result2;
  }
  var mapTag$1 = "[object Map]", setTag$1 = "[object Set]";
  var symIterator$1 = Symbol$1 ? Symbol$1.iterator : void 0;
  function toArray(value) {
    if (!value) {
      return [];
    }
    if (isArrayLike(value)) {
      return isString(value) ? stringToArray(value) : copyArray(value);
    }
    if (symIterator$1 && value[symIterator$1]) {
      return iteratorToArray(value[symIterator$1]());
    }
    var tag = getTag$1(value), func2 = tag == mapTag$1 ? mapToArray : tag == setTag$1 ? setToArray : values;
    return func2(value);
  }
  function wrapperNext() {
    if (this.__values__ === void 0) {
      this.__values__ = toArray(this.value());
    }
    var done = this.__index__ >= this.__values__.length, value = done ? void 0 : this.__values__[this.__index__++];
    return { "done": done, "value": value };
  }
  function baseNth(array2, n) {
    var length = array2.length;
    if (!length) {
      return;
    }
    n += n < 0 ? length : 0;
    return isIndex(n, length) ? array2[n] : void 0;
  }
  function nth(array2, n) {
    return array2 && array2.length ? baseNth(array2, toInteger(n)) : void 0;
  }
  function nthArg(n) {
    n = toInteger(n);
    return baseRest(function(args) {
      return baseNth(args, n);
    });
  }
  function baseUnset(object2, path) {
    path = castPath(path, object2);
    object2 = parent(object2, path);
    return object2 == null || delete object2[toKey(last(path))];
  }
  function customOmitClone(value) {
    return isPlainObject(value) ? void 0 : value;
  }
  var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
  var omit = flatRest(function(object2, paths) {
    var result2 = {};
    if (object2 == null) {
      return result2;
    }
    var isDeep = false;
    paths = arrayMap(paths, function(path) {
      path = castPath(path, object2);
      isDeep || (isDeep = path.length > 1);
      return path;
    });
    copyObject(object2, getAllKeysIn(object2), result2);
    if (isDeep) {
      result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
    }
    var length = paths.length;
    while (length--) {
      baseUnset(result2, paths[length]);
    }
    return result2;
  });
  function baseSet(object2, path, value, customizer) {
    if (!isObject(object2)) {
      return object2;
    }
    path = castPath(path, object2);
    var index = -1, length = path.length, lastIndex = length - 1, nested = object2;
    while (nested != null && ++index < length) {
      var key = toKey(path[index]), newValue = value;
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return object2;
      }
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : void 0;
        if (newValue === void 0) {
          newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
        }
      }
      assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object2;
  }
  function basePickBy(object2, paths, predicate) {
    var index = -1, length = paths.length, result2 = {};
    while (++index < length) {
      var path = paths[index], value = baseGet(object2, path);
      if (predicate(value, path)) {
        baseSet(result2, castPath(path, object2), value);
      }
    }
    return result2;
  }
  function pickBy(object2, predicate) {
    if (object2 == null) {
      return {};
    }
    var props = arrayMap(getAllKeysIn(object2), function(prop) {
      return [prop];
    });
    predicate = baseIteratee(predicate);
    return basePickBy(object2, props, function(value, path) {
      return predicate(value, path[0]);
    });
  }
  function omitBy(object2, predicate) {
    return pickBy(object2, negate(baseIteratee(predicate)));
  }
  function once(func2) {
    return before(2, func2);
  }
  function baseSortBy(array2, comparer) {
    var length = array2.length;
    array2.sort(comparer);
    while (length--) {
      array2[length] = array2[length].value;
    }
    return array2;
  }
  function compareAscending(value, other) {
    if (value !== other) {
      var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
      var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
      if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
        return 1;
      }
      if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
        return -1;
      }
    }
    return 0;
  }
  function compareMultiple(object2, other, orders) {
    var index = -1, objCriteria = object2.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
    while (++index < length) {
      var result2 = compareAscending(objCriteria[index], othCriteria[index]);
      if (result2) {
        if (index >= ordersLength) {
          return result2;
        }
        var order = orders[index];
        return result2 * (order == "desc" ? -1 : 1);
      }
    }
    return object2.index - other.index;
  }
  function baseOrderBy(collection2, iteratees, orders) {
    if (iteratees.length) {
      iteratees = arrayMap(iteratees, function(iteratee2) {
        if (isArray(iteratee2)) {
          return function(value) {
            return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
          };
        }
        return iteratee2;
      });
    } else {
      iteratees = [identity];
    }
    var index = -1;
    iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
    var result2 = baseMap(collection2, function(value, key, collection3) {
      var criteria = arrayMap(iteratees, function(iteratee2) {
        return iteratee2(value);
      });
      return { "criteria": criteria, "index": ++index, "value": value };
    });
    return baseSortBy(result2, function(object2, other) {
      return compareMultiple(object2, other, orders);
    });
  }
  function orderBy(collection2, iteratees, orders, guard) {
    if (collection2 == null) {
      return [];
    }
    if (!isArray(iteratees)) {
      iteratees = iteratees == null ? [] : [iteratees];
    }
    orders = guard ? void 0 : orders;
    if (!isArray(orders)) {
      orders = orders == null ? [] : [orders];
    }
    return baseOrderBy(collection2, iteratees, orders);
  }
  function createOver(arrayFunc) {
    return flatRest(function(iteratees) {
      iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
      return baseRest(function(args) {
        var thisArg = this;
        return arrayFunc(iteratees, function(iteratee2) {
          return apply(iteratee2, thisArg, args);
        });
      });
    });
  }
  var over = createOver(arrayMap);
  var castRest = baseRest;
  var nativeMin$6 = Math.min;
  var overArgs = castRest(function(func2, transforms) {
    transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(baseIteratee)) : arrayMap(baseFlatten(transforms, 1), baseUnary(baseIteratee));
    var funcsLength = transforms.length;
    return baseRest(function(args) {
      var index = -1, length = nativeMin$6(args.length, funcsLength);
      while (++index < length) {
        args[index] = transforms[index].call(this, args[index]);
      }
      return apply(func2, this, args);
    });
  });
  var overEvery = createOver(arrayEvery);
  var overSome = createOver(arraySome);
  var MAX_SAFE_INTEGER$2 = 9007199254740991;
  var nativeFloor$3 = Math.floor;
  function baseRepeat(string2, n) {
    var result2 = "";
    if (!string2 || n < 1 || n > MAX_SAFE_INTEGER$2) {
      return result2;
    }
    do {
      if (n % 2) {
        result2 += string2;
      }
      n = nativeFloor$3(n / 2);
      if (n) {
        string2 += string2;
      }
    } while (n);
    return result2;
  }
  var asciiSize = baseProperty("length");
  var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsVarRange = "\\ufe0e\\ufe0f";
  var rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d";
  var reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
  var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
  function unicodeSize(string2) {
    var result2 = reUnicode.lastIndex = 0;
    while (reUnicode.test(string2)) {
      ++result2;
    }
    return result2;
  }
  function stringSize(string2) {
    return hasUnicode(string2) ? unicodeSize(string2) : asciiSize(string2);
  }
  var nativeCeil$2 = Math.ceil;
  function createPadding(length, chars) {
    chars = chars === void 0 ? " " : baseToString(chars);
    var charsLength = chars.length;
    if (charsLength < 2) {
      return charsLength ? baseRepeat(chars, length) : chars;
    }
    var result2 = baseRepeat(chars, nativeCeil$2(length / stringSize(chars)));
    return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
  }
  var nativeCeil$1 = Math.ceil, nativeFloor$2 = Math.floor;
  function pad(string2, length, chars) {
    string2 = toString(string2);
    length = toInteger(length);
    var strLength = length ? stringSize(string2) : 0;
    if (!length || strLength >= length) {
      return string2;
    }
    var mid = (length - strLength) / 2;
    return createPadding(nativeFloor$2(mid), chars) + string2 + createPadding(nativeCeil$1(mid), chars);
  }
  function padEnd(string2, length, chars) {
    string2 = toString(string2);
    length = toInteger(length);
    var strLength = length ? stringSize(string2) : 0;
    return length && strLength < length ? string2 + createPadding(length - strLength, chars) : string2;
  }
  function padStart(string2, length, chars) {
    string2 = toString(string2);
    length = toInteger(length);
    var strLength = length ? stringSize(string2) : 0;
    return length && strLength < length ? createPadding(length - strLength, chars) + string2 : string2;
  }
  var reTrimStart$1 = /^\s+/;
  var nativeParseInt = root.parseInt;
  function parseInt$1(string2, radix, guard) {
    if (guard || radix == null) {
      radix = 0;
    } else if (radix) {
      radix = +radix;
    }
    return nativeParseInt(toString(string2).replace(reTrimStart$1, ""), radix || 0);
  }
  var WRAP_PARTIAL_FLAG = 32;
  var partial = baseRest(function(func2, partials) {
    var holders = replaceHolders(partials, getHolder(partial));
    return createWrap(func2, WRAP_PARTIAL_FLAG, void 0, partials, holders);
  });
  partial.placeholder = {};
  var WRAP_PARTIAL_RIGHT_FLAG = 64;
  var partialRight = baseRest(function(func2, partials) {
    var holders = replaceHolders(partials, getHolder(partialRight));
    return createWrap(func2, WRAP_PARTIAL_RIGHT_FLAG, void 0, partials, holders);
  });
  partialRight.placeholder = {};
  var partition = createAggregator(function(result2, value, key) {
    result2[key ? 0 : 1].push(value);
  }, function() {
    return [[], []];
  });
  function basePick(object2, paths) {
    return basePickBy(object2, paths, function(value, path) {
      return hasIn(object2, path);
    });
  }
  var pick = flatRest(function(object2, paths) {
    return object2 == null ? {} : basePick(object2, paths);
  });
  function wrapperPlant(value) {
    var result2, parent2 = this;
    while (parent2 instanceof baseLodash) {
      var clone2 = wrapperClone(parent2);
      clone2.__index__ = 0;
      clone2.__values__ = void 0;
      if (result2) {
        previous.__wrapped__ = clone2;
      } else {
        result2 = clone2;
      }
      var previous = clone2;
      parent2 = parent2.__wrapped__;
    }
    previous.__wrapped__ = value;
    return result2;
  }
  function propertyOf(object2) {
    return function(path) {
      return object2 == null ? void 0 : baseGet(object2, path);
    };
  }
  function baseIndexOfWith(array2, value, fromIndex, comparator) {
    var index = fromIndex - 1, length = array2.length;
    while (++index < length) {
      if (comparator(array2[index], value)) {
        return index;
      }
    }
    return -1;
  }
  var arrayProto$3 = Array.prototype;
  var splice$1 = arrayProto$3.splice;
  function basePullAll(array2, values2, iteratee2, comparator) {
    var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array2;
    if (array2 === values2) {
      values2 = copyArray(values2);
    }
    if (iteratee2) {
      seen = arrayMap(array2, baseUnary(iteratee2));
    }
    while (++index < length) {
      var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
      while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
        if (seen !== array2) {
          splice$1.call(seen, fromIndex, 1);
        }
        splice$1.call(array2, fromIndex, 1);
      }
    }
    return array2;
  }
  function pullAll(array2, values2) {
    return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2) : array2;
  }
  var pull = baseRest(pullAll);
  function pullAllBy(array2, values2, iteratee2) {
    return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2, baseIteratee(iteratee2, 2)) : array2;
  }
  function pullAllWith(array2, values2, comparator) {
    return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2, void 0, comparator) : array2;
  }
  var arrayProto$2 = Array.prototype;
  var splice = arrayProto$2.splice;
  function basePullAt(array2, indexes) {
    var length = array2 ? indexes.length : 0, lastIndex = length - 1;
    while (length--) {
      var index = indexes[length];
      if (length == lastIndex || index !== previous) {
        var previous = index;
        if (isIndex(index)) {
          splice.call(array2, index, 1);
        } else {
          baseUnset(array2, index);
        }
      }
    }
    return array2;
  }
  var pullAt = flatRest(function(array2, indexes) {
    var length = array2 == null ? 0 : array2.length, result2 = baseAt(array2, indexes);
    basePullAt(array2, arrayMap(indexes, function(index) {
      return isIndex(index, length) ? +index : index;
    }).sort(compareAscending));
    return result2;
  });
  var nativeFloor$1 = Math.floor, nativeRandom$1 = Math.random;
  function baseRandom(lower, upper) {
    return lower + nativeFloor$1(nativeRandom$1() * (upper - lower + 1));
  }
  var freeParseFloat = parseFloat;
  var nativeMin$5 = Math.min, nativeRandom = Math.random;
  function random(lower, upper, floating) {
    if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
      upper = floating = void 0;
    }
    if (floating === void 0) {
      if (typeof upper == "boolean") {
        floating = upper;
        upper = void 0;
      } else if (typeof lower == "boolean") {
        floating = lower;
        lower = void 0;
      }
    }
    if (lower === void 0 && upper === void 0) {
      lower = 0;
      upper = 1;
    } else {
      lower = toFinite(lower);
      if (upper === void 0) {
        upper = lower;
        lower = 0;
      } else {
        upper = toFinite(upper);
      }
    }
    if (lower > upper) {
      var temp = lower;
      lower = upper;
      upper = temp;
    }
    if (floating || lower % 1 || upper % 1) {
      var rand = nativeRandom();
      return nativeMin$5(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
    }
    return baseRandom(lower, upper);
  }
  var nativeCeil = Math.ceil, nativeMax$4 = Math.max;
  function baseRange(start, end, step, fromRight) {
    var index = -1, length = nativeMax$4(nativeCeil((end - start) / (step || 1)), 0), result2 = Array(length);
    while (length--) {
      result2[fromRight ? length : ++index] = start;
      start += step;
    }
    return result2;
  }
  function createRange(fromRight) {
    return function(start, end, step) {
      if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
        end = step = void 0;
      }
      start = toFinite(start);
      if (end === void 0) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      step = step === void 0 ? start < end ? 1 : -1 : toFinite(step);
      return baseRange(start, end, step, fromRight);
    };
  }
  var range = createRange();
  var rangeRight = createRange(true);
  var WRAP_REARG_FLAG = 256;
  var rearg = flatRest(function(func2, indexes) {
    return createWrap(func2, WRAP_REARG_FLAG, void 0, void 0, void 0, indexes);
  });
  function baseReduce(collection2, iteratee2, accumulator, initAccum, eachFunc) {
    eachFunc(collection2, function(value, index, collection3) {
      accumulator = initAccum ? (initAccum = false, value) : iteratee2(accumulator, value, index, collection3);
    });
    return accumulator;
  }
  function reduce(collection2, iteratee2, accumulator) {
    var func2 = isArray(collection2) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
    return func2(collection2, baseIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
  }
  function arrayReduceRight(array2, iteratee2, accumulator, initAccum) {
    var length = array2 == null ? 0 : array2.length;
    if (initAccum && length) {
      accumulator = array2[--length];
    }
    while (length--) {
      accumulator = iteratee2(accumulator, array2[length], length, array2);
    }
    return accumulator;
  }
  function reduceRight(collection2, iteratee2, accumulator) {
    var func2 = isArray(collection2) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
    return func2(collection2, baseIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
  }
  function reject(collection2, predicate) {
    var func2 = isArray(collection2) ? arrayFilter : baseFilter;
    return func2(collection2, negate(baseIteratee(predicate, 3)));
  }
  function remove(array2, predicate) {
    var result2 = [];
    if (!(array2 && array2.length)) {
      return result2;
    }
    var index = -1, indexes = [], length = array2.length;
    predicate = baseIteratee(predicate, 3);
    while (++index < length) {
      var value = array2[index];
      if (predicate(value, index, array2)) {
        result2.push(value);
        indexes.push(index);
      }
    }
    basePullAt(array2, indexes);
    return result2;
  }
  function repeat(string2, n, guard) {
    if (guard ? isIterateeCall(string2, n, guard) : n === void 0) {
      n = 1;
    } else {
      n = toInteger(n);
    }
    return baseRepeat(toString(string2), n);
  }
  function replace() {
    var args = arguments, string2 = toString(args[0]);
    return args.length < 3 ? string2 : string2.replace(args[1], args[2]);
  }
  var FUNC_ERROR_TEXT$2 = "Expected a function";
  function rest(func2, start) {
    if (typeof func2 != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$2);
    }
    start = start === void 0 ? start : toInteger(start);
    return baseRest(func2, start);
  }
  function result(object2, path, defaultValue) {
    path = castPath(path, object2);
    var index = -1, length = path.length;
    if (!length) {
      length = 1;
      object2 = void 0;
    }
    while (++index < length) {
      var value = object2 == null ? void 0 : object2[toKey(path[index])];
      if (value === void 0) {
        index = length;
        value = defaultValue;
      }
      object2 = isFunction(value) ? value.call(object2) : value;
    }
    return object2;
  }
  var arrayProto$1 = Array.prototype;
  var nativeReverse = arrayProto$1.reverse;
  function reverse(array2) {
    return array2 == null ? array2 : nativeReverse.call(array2);
  }
  var round = createRound("round");
  function arraySample(array2) {
    var length = array2.length;
    return length ? array2[baseRandom(0, length - 1)] : void 0;
  }
  function baseSample(collection2) {
    return arraySample(values(collection2));
  }
  function sample(collection2) {
    var func2 = isArray(collection2) ? arraySample : baseSample;
    return func2(collection2);
  }
  function shuffleSelf(array2, size2) {
    var index = -1, length = array2.length, lastIndex = length - 1;
    size2 = size2 === void 0 ? length : size2;
    while (++index < size2) {
      var rand = baseRandom(index, lastIndex), value = array2[rand];
      array2[rand] = array2[index];
      array2[index] = value;
    }
    array2.length = size2;
    return array2;
  }
  function arraySampleSize(array2, n) {
    return shuffleSelf(copyArray(array2), baseClamp(n, 0, array2.length));
  }
  function baseSampleSize(collection2, n) {
    var array2 = values(collection2);
    return shuffleSelf(array2, baseClamp(n, 0, array2.length));
  }
  function sampleSize(collection2, n, guard) {
    if (guard ? isIterateeCall(collection2, n, guard) : n === void 0) {
      n = 1;
    } else {
      n = toInteger(n);
    }
    var func2 = isArray(collection2) ? arraySampleSize : baseSampleSize;
    return func2(collection2, n);
  }
  function set(object2, path, value) {
    return object2 == null ? object2 : baseSet(object2, path, value);
  }
  function setWith(object2, path, value, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return object2 == null ? object2 : baseSet(object2, path, value, customizer);
  }
  function arrayShuffle(array2) {
    return shuffleSelf(copyArray(array2));
  }
  function baseShuffle(collection2) {
    return shuffleSelf(values(collection2));
  }
  function shuffle(collection2) {
    var func2 = isArray(collection2) ? arrayShuffle : baseShuffle;
    return func2(collection2);
  }
  var mapTag = "[object Map]", setTag = "[object Set]";
  function size(collection2) {
    if (collection2 == null) {
      return 0;
    }
    if (isArrayLike(collection2)) {
      return isString(collection2) ? stringSize(collection2) : collection2.length;
    }
    var tag = getTag$1(collection2);
    if (tag == mapTag || tag == setTag) {
      return collection2.size;
    }
    return baseKeys(collection2).length;
  }
  function slice(array2, start, end) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return [];
    }
    if (end && typeof end != "number" && isIterateeCall(array2, start, end)) {
      start = 0;
      end = length;
    } else {
      start = start == null ? 0 : toInteger(start);
      end = end === void 0 ? length : toInteger(end);
    }
    return baseSlice(array2, start, end);
  }
  var snakeCase = createCompounder(function(result2, word, index) {
    return result2 + (index ? "_" : "") + word.toLowerCase();
  });
  function baseSome(collection2, predicate) {
    var result2;
    baseEach(collection2, function(value, index, collection3) {
      result2 = predicate(value, index, collection3);
      return !result2;
    });
    return !!result2;
  }
  function some(collection2, predicate, guard) {
    var func2 = isArray(collection2) ? arraySome : baseSome;
    if (guard && isIterateeCall(collection2, predicate, guard)) {
      predicate = void 0;
    }
    return func2(collection2, baseIteratee(predicate, 3));
  }
  var sortBy = baseRest(function(collection2, iteratees) {
    if (collection2 == null) {
      return [];
    }
    var length = iteratees.length;
    if (length > 1 && isIterateeCall(collection2, iteratees[0], iteratees[1])) {
      iteratees = [];
    } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
      iteratees = [iteratees[0]];
    }
    return baseOrderBy(collection2, baseFlatten(iteratees, 1), []);
  });
  var MAX_ARRAY_LENGTH$4 = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH$4 - 1;
  var nativeFloor = Math.floor, nativeMin$4 = Math.min;
  function baseSortedIndexBy(array2, value, iteratee2, retHighest) {
    var low = 0, high = array2 == null ? 0 : array2.length;
    if (high === 0) {
      return 0;
    }
    value = iteratee2(value);
    var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === void 0;
    while (low < high) {
      var mid = nativeFloor((low + high) / 2), computed = iteratee2(array2[mid]), othIsDefined = computed !== void 0, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
      if (valIsNaN) {
        var setLow = retHighest || othIsReflexive;
      } else if (valIsUndefined) {
        setLow = othIsReflexive && (retHighest || othIsDefined);
      } else if (valIsNull) {
        setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
      } else if (valIsSymbol) {
        setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
      } else if (othIsNull || othIsSymbol) {
        setLow = false;
      } else {
        setLow = retHighest ? computed <= value : computed < value;
      }
      if (setLow) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return nativeMin$4(high, MAX_ARRAY_INDEX);
  }
  var MAX_ARRAY_LENGTH$3 = 4294967295, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH$3 >>> 1;
  function baseSortedIndex(array2, value, retHighest) {
    var low = 0, high = array2 == null ? low : array2.length;
    if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
      while (low < high) {
        var mid = low + high >>> 1, computed = array2[mid];
        if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return high;
    }
    return baseSortedIndexBy(array2, value, identity, retHighest);
  }
  function sortedIndex(array2, value) {
    return baseSortedIndex(array2, value);
  }
  function sortedIndexBy(array2, value, iteratee2) {
    return baseSortedIndexBy(array2, value, baseIteratee(iteratee2, 2));
  }
  function sortedIndexOf(array2, value) {
    var length = array2 == null ? 0 : array2.length;
    if (length) {
      var index = baseSortedIndex(array2, value);
      if (index < length && eq(array2[index], value)) {
        return index;
      }
    }
    return -1;
  }
  function sortedLastIndex(array2, value) {
    return baseSortedIndex(array2, value, true);
  }
  function sortedLastIndexBy(array2, value, iteratee2) {
    return baseSortedIndexBy(array2, value, baseIteratee(iteratee2, 2), true);
  }
  function sortedLastIndexOf(array2, value) {
    var length = array2 == null ? 0 : array2.length;
    if (length) {
      var index = baseSortedIndex(array2, value, true) - 1;
      if (eq(array2[index], value)) {
        return index;
      }
    }
    return -1;
  }
  function baseSortedUniq(array2, iteratee2) {
    var index = -1, length = array2.length, resIndex = 0, result2 = [];
    while (++index < length) {
      var value = array2[index], computed = iteratee2 ? iteratee2(value) : value;
      if (!index || !eq(computed, seen)) {
        var seen = computed;
        result2[resIndex++] = value === 0 ? 0 : value;
      }
    }
    return result2;
  }
  function sortedUniq(array2) {
    return array2 && array2.length ? baseSortedUniq(array2) : [];
  }
  function sortedUniqBy(array2, iteratee2) {
    return array2 && array2.length ? baseSortedUniq(array2, baseIteratee(iteratee2, 2)) : [];
  }
  var MAX_ARRAY_LENGTH$2 = 4294967295;
  function split(string2, separator, limit) {
    if (limit && typeof limit != "number" && isIterateeCall(string2, separator, limit)) {
      separator = limit = void 0;
    }
    limit = limit === void 0 ? MAX_ARRAY_LENGTH$2 : limit >>> 0;
    if (!limit) {
      return [];
    }
    string2 = toString(string2);
    if (string2 && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
      separator = baseToString(separator);
      if (!separator && hasUnicode(string2)) {
        return castSlice(stringToArray(string2), 0, limit);
      }
    }
    return string2.split(separator, limit);
  }
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  var nativeMax$3 = Math.max;
  function spread(func2, start) {
    if (typeof func2 != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    start = start == null ? 0 : nativeMax$3(toInteger(start), 0);
    return baseRest(function(args) {
      var array2 = args[start], otherArgs = castSlice(args, 0, start);
      if (array2) {
        arrayPush(otherArgs, array2);
      }
      return apply(func2, this, otherArgs);
    });
  }
  var startCase = createCompounder(function(result2, word, index) {
    return result2 + (index ? " " : "") + upperFirst(word);
  });
  function startsWith(string2, target, position) {
    string2 = toString(string2);
    position = position == null ? 0 : baseClamp(toInteger(position), 0, string2.length);
    target = baseToString(target);
    return string2.slice(position, position + target.length) == target;
  }
  function stubObject() {
    return {};
  }
  function stubString() {
    return "";
  }
  function stubTrue() {
    return true;
  }
  var subtract = createMathOperation(function(minuend, subtrahend) {
    return minuend - subtrahend;
  }, 0);
  function sum(array2) {
    return array2 && array2.length ? baseSum(array2, identity) : 0;
  }
  function sumBy(array2, iteratee2) {
    return array2 && array2.length ? baseSum(array2, baseIteratee(iteratee2, 2)) : 0;
  }
  function tail(array2) {
    var length = array2 == null ? 0 : array2.length;
    return length ? baseSlice(array2, 1, length) : [];
  }
  function take(array2, n, guard) {
    if (!(array2 && array2.length)) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger(n);
    return baseSlice(array2, 0, n < 0 ? 0 : n);
  }
  function takeRight(array2, n, guard) {
    var length = array2 == null ? 0 : array2.length;
    if (!length) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger(n);
    n = length - n;
    return baseSlice(array2, n < 0 ? 0 : n, length);
  }
  function takeRightWhile(array2, predicate) {
    return array2 && array2.length ? baseWhile(array2, baseIteratee(predicate, 3), false, true) : [];
  }
  function takeWhile(array2, predicate) {
    return array2 && array2.length ? baseWhile(array2, baseIteratee(predicate, 3)) : [];
  }
  function tap(value, interceptor) {
    interceptor(value);
    return value;
  }
  var objectProto$2 = Object.prototype;
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  function customDefaultsAssignIn(objValue, srcValue, key, object2) {
    if (objValue === void 0 || eq(objValue, objectProto$2[key]) && !hasOwnProperty$2.call(object2, key)) {
      return srcValue;
    }
    return objValue;
  }
  var stringEscapes = {
    "\\": "\\",
    "'": "'",
    "\n": "n",
    "\r": "r",
    "\u2028": "u2028",
    "\u2029": "u2029"
  };
  function escapeStringChar(chr) {
    return "\\" + stringEscapes[chr];
  }
  var reInterpolate = /<%=([\s\S]+?)%>/g;
  var reEscape = /<%-([\s\S]+?)%>/g;
  var reEvaluate = /<%([\s\S]+?)%>/g;
  var templateSettings = {
    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    "escape": reEscape,
    /**
     * Used to detect code to be evaluated.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    "evaluate": reEvaluate,
    /**
     * Used to detect `data` property values to inject.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    "interpolate": reInterpolate,
    /**
     * Used to reference the data object in the template text.
     *
     * @memberOf _.templateSettings
     * @type {string}
     */
    "variable": "",
    /**
     * Used to import variables into the compiled template.
     *
     * @memberOf _.templateSettings
     * @type {Object}
     */
    "imports": {
      /**
       * A reference to the `lodash` function.
       *
       * @memberOf _.templateSettings.imports
       * @type {Function}
       */
      "_": { "escape": escape }
    }
  };
  var INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
  var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
  var reNoMatch = /($^)/;
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function template(string2, options, guard) {
    var settings = templateSettings.imports._.templateSettings || templateSettings;
    if (guard && isIterateeCall(string2, options, guard)) {
      options = void 0;
    }
    string2 = toString(string2);
    options = assignInWith({}, options, settings, customDefaultsAssignIn);
    var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
    var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
    var reDelimiters = RegExp(
      (options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
      "g"
    );
    var sourceURL = hasOwnProperty$1.call(options, "sourceURL") ? "//# sourceURL=" + (options.sourceURL + "").replace(/\s/g, " ") + "\n" : "";
    string2.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
      interpolateValue || (interpolateValue = esTemplateValue);
      source += string2.slice(index, offset).replace(reUnescapedString, escapeStringChar);
      if (escapeValue) {
        isEscaping = true;
        source += "' +\n__e(" + escapeValue + ") +\n'";
      }
      if (evaluateValue) {
        isEvaluating = true;
        source += "';\n" + evaluateValue + ";\n__p += '";
      }
      if (interpolateValue) {
        source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";
    var variable = hasOwnProperty$1.call(options, "variable") && options.variable;
    if (!variable) {
      source = "with (obj) {\n" + source + "\n}\n";
    } else if (reForbiddenIdentifierChars.test(variable)) {
      throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
    }
    source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
    source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
    var result2 = attempt(function() {
      return Function(importsKeys, sourceURL + "return " + source).apply(void 0, importsValues);
    });
    result2.source = source;
    if (isError(result2)) {
      throw result2;
    }
    return result2;
  }
  var FUNC_ERROR_TEXT = "Expected a function";
  function throttle(func2, wait, options) {
    var leading = true, trailing = true;
    if (typeof func2 != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
      leading = "leading" in options ? !!options.leading : leading;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    return debounce(func2, wait, {
      "leading": leading,
      "maxWait": wait,
      "trailing": trailing
    });
  }
  function thru(value, interceptor) {
    return interceptor(value);
  }
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  var MAX_ARRAY_LENGTH$1 = 4294967295;
  var nativeMin$3 = Math.min;
  function times(n, iteratee2) {
    n = toInteger(n);
    if (n < 1 || n > MAX_SAFE_INTEGER$1) {
      return [];
    }
    var index = MAX_ARRAY_LENGTH$1, length = nativeMin$3(n, MAX_ARRAY_LENGTH$1);
    iteratee2 = castFunction(iteratee2);
    n -= MAX_ARRAY_LENGTH$1;
    var result2 = baseTimes(length, iteratee2);
    while (++index < n) {
      iteratee2(index);
    }
    return result2;
  }
  function wrapperToIterator() {
    return this;
  }
  function baseWrapperValue(value, actions) {
    var result2 = value;
    if (result2 instanceof LazyWrapper) {
      result2 = result2.value();
    }
    return arrayReduce(actions, function(result3, action) {
      return action.func.apply(action.thisArg, arrayPush([result3], action.args));
    }, result2);
  }
  function wrapperValue() {
    return baseWrapperValue(this.__wrapped__, this.__actions__);
  }
  function toLower(value) {
    return toString(value).toLowerCase();
  }
  function toPath(value) {
    if (isArray(value)) {
      return arrayMap(value, toKey);
    }
    return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
  }
  var MAX_SAFE_INTEGER = 9007199254740991;
  function toSafeInteger(value) {
    return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
  }
  function toUpper(value) {
    return toString(value).toUpperCase();
  }
  function transform(object2, iteratee2, accumulator) {
    var isArr = isArray(object2), isArrLike = isArr || isBuffer(object2) || isTypedArray(object2);
    iteratee2 = baseIteratee(iteratee2, 4);
    if (accumulator == null) {
      var Ctor = object2 && object2.constructor;
      if (isArrLike) {
        accumulator = isArr ? new Ctor() : [];
      } else if (isObject(object2)) {
        accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object2)) : {};
      } else {
        accumulator = {};
      }
    }
    (isArrLike ? arrayEach : baseForOwn)(object2, function(value, index, object3) {
      return iteratee2(accumulator, value, index, object3);
    });
    return accumulator;
  }
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;
    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
    }
    return index;
  }
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1, length = strSymbols.length;
    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
    }
    return index;
  }
  function trim(string2, chars, guard) {
    string2 = toString(string2);
    if (string2 && (guard || chars === void 0)) {
      return baseTrim(string2);
    }
    if (!string2 || !(chars = baseToString(chars))) {
      return string2;
    }
    var strSymbols = stringToArray(string2), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
    return castSlice(strSymbols, start, end).join("");
  }
  function trimEnd(string2, chars, guard) {
    string2 = toString(string2);
    if (string2 && (guard || chars === void 0)) {
      return string2.slice(0, trimmedEndIndex(string2) + 1);
    }
    if (!string2 || !(chars = baseToString(chars))) {
      return string2;
    }
    var strSymbols = stringToArray(string2), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
    return castSlice(strSymbols, 0, end).join("");
  }
  var reTrimStart = /^\s+/;
  function trimStart(string2, chars, guard) {
    string2 = toString(string2);
    if (string2 && (guard || chars === void 0)) {
      return string2.replace(reTrimStart, "");
    }
    if (!string2 || !(chars = baseToString(chars))) {
      return string2;
    }
    var strSymbols = stringToArray(string2), start = charsStartIndex(strSymbols, stringToArray(chars));
    return castSlice(strSymbols, start).join("");
  }
  var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
  var reFlags = /\w*$/;
  function truncate(string2, options) {
    var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
    if (isObject(options)) {
      var separator = "separator" in options ? options.separator : separator;
      length = "length" in options ? toInteger(options.length) : length;
      omission = "omission" in options ? baseToString(options.omission) : omission;
    }
    string2 = toString(string2);
    var strLength = string2.length;
    if (hasUnicode(string2)) {
      var strSymbols = stringToArray(string2);
      strLength = strSymbols.length;
    }
    if (length >= strLength) {
      return string2;
    }
    var end = length - stringSize(omission);
    if (end < 1) {
      return omission;
    }
    var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string2.slice(0, end);
    if (separator === void 0) {
      return result2 + omission;
    }
    if (strSymbols) {
      end += result2.length - end;
    }
    if (isRegExp(separator)) {
      if (string2.slice(end).search(separator)) {
        var match, substring = result2;
        if (!separator.global) {
          separator = RegExp(separator.source, toString(reFlags.exec(separator)) + "g");
        }
        separator.lastIndex = 0;
        while (match = separator.exec(substring)) {
          var newEnd = match.index;
        }
        result2 = result2.slice(0, newEnd === void 0 ? end : newEnd);
      }
    } else if (string2.indexOf(baseToString(separator), end) != end) {
      var index = result2.lastIndexOf(separator);
      if (index > -1) {
        result2 = result2.slice(0, index);
      }
    }
    return result2 + omission;
  }
  function unary(func2) {
    return ary(func2, 1);
  }
  var htmlUnescapes = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'"
  };
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reHasEscapedHtml = RegExp(reEscapedHtml.source);
  function unescape(string2) {
    string2 = toString(string2);
    return string2 && reHasEscapedHtml.test(string2) ? string2.replace(reEscapedHtml, unescapeHtmlChar) : string2;
  }
  var INFINITY = 1 / 0;
  var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function(values2) {
    return new Set(values2);
  };
  var LARGE_ARRAY_SIZE = 200;
  function baseUniq(array2, iteratee2, comparator) {
    var index = -1, includes2 = arrayIncludes, length = array2.length, isCommon = true, result2 = [], seen = result2;
    if (comparator) {
      isCommon = false;
      includes2 = arrayIncludesWith;
    } else if (length >= LARGE_ARRAY_SIZE) {
      var set2 = iteratee2 ? null : createSet(array2);
      if (set2) {
        return setToArray(set2);
      }
      isCommon = false;
      includes2 = cacheHas;
      seen = new SetCache();
    } else {
      seen = iteratee2 ? [] : result2;
    }
    outer:
      while (++index < length) {
        var value = array2[index], computed = iteratee2 ? iteratee2(value) : value;
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee2) {
            seen.push(computed);
          }
          result2.push(value);
        } else if (!includes2(seen, computed, comparator)) {
          if (seen !== result2) {
            seen.push(computed);
          }
          result2.push(value);
        }
      }
    return result2;
  }
  var union = baseRest(function(arrays) {
    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
  });
  var unionBy = baseRest(function(arrays) {
    var iteratee2 = last(arrays);
    if (isArrayLikeObject(iteratee2)) {
      iteratee2 = void 0;
    }
    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee2, 2));
  });
  var unionWith = baseRest(function(arrays) {
    var comparator = last(arrays);
    comparator = typeof comparator == "function" ? comparator : void 0;
    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), void 0, comparator);
  });
  function uniq(array2) {
    return array2 && array2.length ? baseUniq(array2) : [];
  }
  function uniqBy(array2, iteratee2) {
    return array2 && array2.length ? baseUniq(array2, baseIteratee(iteratee2, 2)) : [];
  }
  function uniqWith(array2, comparator) {
    comparator = typeof comparator == "function" ? comparator : void 0;
    return array2 && array2.length ? baseUniq(array2, void 0, comparator) : [];
  }
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter;
    return toString(prefix) + id;
  }
  function unset(object2, path) {
    return object2 == null ? true : baseUnset(object2, path);
  }
  var nativeMax$2 = Math.max;
  function unzip(array2) {
    if (!(array2 && array2.length)) {
      return [];
    }
    var length = 0;
    array2 = arrayFilter(array2, function(group) {
      if (isArrayLikeObject(group)) {
        length = nativeMax$2(group.length, length);
        return true;
      }
    });
    return baseTimes(length, function(index) {
      return arrayMap(array2, baseProperty(index));
    });
  }
  function unzipWith(array2, iteratee2) {
    if (!(array2 && array2.length)) {
      return [];
    }
    var result2 = unzip(array2);
    if (iteratee2 == null) {
      return result2;
    }
    return arrayMap(result2, function(group) {
      return apply(iteratee2, void 0, group);
    });
  }
  function baseUpdate(object2, path, updater, customizer) {
    return baseSet(object2, path, updater(baseGet(object2, path)), customizer);
  }
  function update(object2, path, updater) {
    return object2 == null ? object2 : baseUpdate(object2, path, castFunction(updater));
  }
  function updateWith(object2, path, updater, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return object2 == null ? object2 : baseUpdate(object2, path, castFunction(updater), customizer);
  }
  var upperCase = createCompounder(function(result2, word, index) {
    return result2 + (index ? " " : "") + word.toUpperCase();
  });
  function valuesIn(object2) {
    return object2 == null ? [] : baseValues(object2, keysIn(object2));
  }
  var without = baseRest(function(array2, values2) {
    return isArrayLikeObject(array2) ? baseDifference(array2, values2) : [];
  });
  function wrap(value, wrapper) {
    return partial(castFunction(wrapper), value);
  }
  var wrapperAt = flatRest(function(paths) {
    var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object2) {
      return baseAt(object2, paths);
    };
    if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
      return this.thru(interceptor);
    }
    value = value.slice(start, +start + (length ? 1 : 0));
    value.__actions__.push({
      "func": thru,
      "args": [interceptor],
      "thisArg": void 0
    });
    return new LodashWrapper(value, this.__chain__).thru(function(array2) {
      if (length && !array2.length) {
        array2.push(void 0);
      }
      return array2;
    });
  });
  function wrapperChain() {
    return chain(this);
  }
  function wrapperReverse() {
    var value = this.__wrapped__;
    if (value instanceof LazyWrapper) {
      var wrapped = value;
      if (this.__actions__.length) {
        wrapped = new LazyWrapper(this);
      }
      wrapped = wrapped.reverse();
      wrapped.__actions__.push({
        "func": thru,
        "args": [reverse],
        "thisArg": void 0
      });
      return new LodashWrapper(wrapped, this.__chain__);
    }
    return this.thru(reverse);
  }
  function baseXor(arrays, iteratee2, comparator) {
    var length = arrays.length;
    if (length < 2) {
      return length ? baseUniq(arrays[0]) : [];
    }
    var index = -1, result2 = Array(length);
    while (++index < length) {
      var array2 = arrays[index], othIndex = -1;
      while (++othIndex < length) {
        if (othIndex != index) {
          result2[index] = baseDifference(result2[index] || array2, arrays[othIndex], iteratee2, comparator);
        }
      }
    }
    return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
  }
  var xor = baseRest(function(arrays) {
    return baseXor(arrayFilter(arrays, isArrayLikeObject));
  });
  var xorBy = baseRest(function(arrays) {
    var iteratee2 = last(arrays);
    if (isArrayLikeObject(iteratee2)) {
      iteratee2 = void 0;
    }
    return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee2, 2));
  });
  var xorWith = baseRest(function(arrays) {
    var comparator = last(arrays);
    comparator = typeof comparator == "function" ? comparator : void 0;
    return baseXor(arrayFilter(arrays, isArrayLikeObject), void 0, comparator);
  });
  var zip = baseRest(unzip);
  function baseZipObject(props, values2, assignFunc) {
    var index = -1, length = props.length, valsLength = values2.length, result2 = {};
    while (++index < length) {
      var value = index < valsLength ? values2[index] : void 0;
      assignFunc(result2, props[index], value);
    }
    return result2;
  }
  function zipObject(props, values2) {
    return baseZipObject(props || [], values2 || [], assignValue);
  }
  function zipObjectDeep(props, values2) {
    return baseZipObject(props || [], values2 || [], baseSet);
  }
  var zipWith = baseRest(function(arrays) {
    var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : void 0;
    iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : void 0;
    return unzipWith(arrays, iteratee2);
  });
  const array = {
    chunk,
    compact,
    concat,
    difference,
    differenceBy,
    differenceWith,
    drop,
    dropRight,
    dropRightWhile,
    dropWhile,
    fill,
    findIndex,
    findLastIndex,
    first: head,
    flatten,
    flattenDeep,
    flattenDepth,
    fromPairs,
    head,
    indexOf,
    initial,
    intersection,
    intersectionBy,
    intersectionWith,
    join,
    last,
    lastIndexOf,
    nth,
    pull,
    pullAll,
    pullAllBy,
    pullAllWith,
    pullAt,
    remove,
    reverse,
    slice,
    sortedIndex,
    sortedIndexBy,
    sortedIndexOf,
    sortedLastIndex,
    sortedLastIndexBy,
    sortedLastIndexOf,
    sortedUniq,
    sortedUniqBy,
    tail,
    take,
    takeRight,
    takeRightWhile,
    takeWhile,
    union,
    unionBy,
    unionWith,
    uniq,
    uniqBy,
    uniqWith,
    unzip,
    unzipWith,
    without,
    xor,
    xorBy,
    xorWith,
    zip,
    zipObject,
    zipObjectDeep,
    zipWith
  };
  const collection = {
    countBy,
    each: forEach,
    eachRight: forEachRight,
    every,
    filter,
    find,
    findLast,
    flatMap,
    flatMapDeep,
    flatMapDepth,
    forEach,
    forEachRight,
    groupBy,
    includes,
    invokeMap,
    keyBy,
    map,
    orderBy,
    partition,
    reduce,
    reduceRight,
    reject,
    sample,
    sampleSize,
    shuffle,
    size,
    some,
    sortBy
  };
  const date = {
    now
  };
  const func = {
    after,
    ary,
    before,
    bind,
    bindKey,
    curry,
    curryRight,
    debounce,
    defer,
    delay,
    flip,
    memoize,
    negate,
    once,
    overArgs,
    partial,
    partialRight,
    rearg,
    rest,
    spread,
    throttle,
    unary,
    wrap
  };
  const lang = {
    castArray,
    clone,
    cloneDeep,
    cloneDeepWith,
    cloneWith,
    conformsTo,
    eq,
    gt,
    gte,
    isArguments,
    isArray,
    isArrayBuffer,
    isArrayLike,
    isArrayLikeObject,
    isBoolean,
    isBuffer,
    isDate,
    isElement,
    isEmpty,
    isEqual,
    isEqualWith,
    isError,
    isFinite,
    isFunction,
    isInteger,
    isLength,
    isMap,
    isMatch,
    isMatchWith,
    isNaN,
    isNative,
    isNil,
    isNull,
    isNumber,
    isObject,
    isObjectLike,
    isPlainObject,
    isRegExp,
    isSafeInteger,
    isSet,
    isString,
    isSymbol,
    isTypedArray,
    isUndefined,
    isWeakMap,
    isWeakSet,
    lt,
    lte,
    toArray,
    toFinite,
    toInteger,
    toLength,
    toNumber,
    toPlainObject,
    toSafeInteger,
    toString
  };
  const math = {
    add,
    ceil,
    divide,
    floor,
    max,
    maxBy,
    mean,
    meanBy,
    min,
    minBy,
    multiply,
    round,
    subtract,
    sum,
    sumBy
  };
  const number = {
    clamp,
    inRange,
    random
  };
  const object = {
    assign,
    assignIn,
    assignInWith,
    assignWith,
    at,
    create,
    defaults,
    defaultsDeep,
    entries: toPairs,
    entriesIn: toPairsIn,
    extend: assignIn,
    extendWith: assignInWith,
    findKey,
    findLastKey,
    forIn,
    forInRight,
    forOwn,
    forOwnRight,
    functions,
    functionsIn,
    get,
    has,
    hasIn,
    invert,
    invertBy,
    invoke,
    keys,
    keysIn,
    mapKeys,
    mapValues,
    merge,
    mergeWith,
    omit,
    omitBy,
    pick,
    pickBy,
    result,
    set,
    setWith,
    toPairs,
    toPairsIn,
    transform,
    unset,
    update,
    updateWith,
    values,
    valuesIn
  };
  const seq = {
    at: wrapperAt,
    chain,
    commit: wrapperCommit,
    lodash,
    next: wrapperNext,
    plant: wrapperPlant,
    reverse: wrapperReverse,
    tap,
    thru,
    toIterator: wrapperToIterator,
    toJSON: wrapperValue,
    value: wrapperValue,
    valueOf: wrapperValue,
    wrapperChain
  };
  const string = {
    camelCase,
    capitalize,
    deburr,
    endsWith,
    escape,
    escapeRegExp,
    kebabCase,
    lowerCase,
    lowerFirst,
    pad,
    padEnd,
    padStart,
    parseInt: parseInt$1,
    repeat,
    replace,
    snakeCase,
    split,
    startCase,
    startsWith,
    template,
    templateSettings,
    toLower,
    toUpper,
    trim,
    trimEnd,
    trimStart,
    truncate,
    unescape,
    upperCase,
    upperFirst,
    words
  };
  const util = {
    attempt,
    bindAll,
    cond,
    conforms,
    constant,
    defaultTo,
    flow,
    flowRight,
    identity,
    iteratee,
    matches,
    matchesProperty,
    method,
    methodOf,
    mixin: mixin$1,
    noop,
    nthArg,
    over,
    overEvery,
    overSome,
    property,
    propertyOf,
    range,
    rangeRight,
    stubArray,
    stubFalse,
    stubObject,
    stubString,
    stubTrue,
    times,
    toPath,
    uniqueId
  };
  function lazyClone() {
    var result2 = new LazyWrapper(this.__wrapped__);
    result2.__actions__ = copyArray(this.__actions__);
    result2.__dir__ = this.__dir__;
    result2.__filtered__ = this.__filtered__;
    result2.__iteratees__ = copyArray(this.__iteratees__);
    result2.__takeCount__ = this.__takeCount__;
    result2.__views__ = copyArray(this.__views__);
    return result2;
  }
  function lazyReverse() {
    if (this.__filtered__) {
      var result2 = new LazyWrapper(this);
      result2.__dir__ = -1;
      result2.__filtered__ = true;
    } else {
      result2 = this.clone();
      result2.__dir__ *= -1;
    }
    return result2;
  }
  var nativeMax$1 = Math.max, nativeMin$2 = Math.min;
  function getView(start, end, transforms) {
    var index = -1, length = transforms.length;
    while (++index < length) {
      var data = transforms[index], size2 = data.size;
      switch (data.type) {
        case "drop":
          start += size2;
          break;
        case "dropRight":
          end -= size2;
          break;
        case "take":
          end = nativeMin$2(end, start + size2);
          break;
        case "takeRight":
          start = nativeMax$1(start, end - size2);
          break;
      }
    }
    return { "start": start, "end": end };
  }
  var LAZY_FILTER_FLAG$1 = 1, LAZY_MAP_FLAG = 2;
  var nativeMin$1 = Math.min;
  function lazyValue() {
    var array2 = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array2), isRight = dir < 0, arrLength = isArr ? array2.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin$1(length, this.__takeCount__);
    if (!isArr || !isRight && arrLength == length && takeCount == length) {
      return baseWrapperValue(array2, this.__actions__);
    }
    var result2 = [];
    outer:
      while (length-- && resIndex < takeCount) {
        index += dir;
        var iterIndex = -1, value = array2[index];
        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG$1) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result2[resIndex++] = value;
      }
    return result2;
  }
  /**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */
  var VERSION = "4.17.21";
  var WRAP_BIND_KEY_FLAG = 2;
  var LAZY_FILTER_FLAG = 1, LAZY_WHILE_FLAG = 3;
  var MAX_ARRAY_LENGTH = 4294967295;
  var arrayProto = Array.prototype, objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var symIterator = Symbol$1 ? Symbol$1.iterator : void 0;
  var nativeMax = Math.max, nativeMin = Math.min;
  var mixin = /* @__PURE__ */ function(func2) {
    return function(object2, source, options) {
      if (options == null) {
        var isObj = isObject(source), props = isObj && keys(source), methodNames = props && props.length && baseFunctions(source, props);
        if (!(methodNames ? methodNames.length : isObj)) {
          options = source;
          source = object2;
          object2 = this;
        }
      }
      return func2(object2, source, options);
    };
  }(mixin$1);
  lodash.after = func.after;
  lodash.ary = func.ary;
  lodash.assign = object.assign;
  lodash.assignIn = object.assignIn;
  lodash.assignInWith = object.assignInWith;
  lodash.assignWith = object.assignWith;
  lodash.at = object.at;
  lodash.before = func.before;
  lodash.bind = func.bind;
  lodash.bindAll = util.bindAll;
  lodash.bindKey = func.bindKey;
  lodash.castArray = lang.castArray;
  lodash.chain = seq.chain;
  lodash.chunk = array.chunk;
  lodash.compact = array.compact;
  lodash.concat = array.concat;
  lodash.cond = util.cond;
  lodash.conforms = util.conforms;
  lodash.constant = util.constant;
  lodash.countBy = collection.countBy;
  lodash.create = object.create;
  lodash.curry = func.curry;
  lodash.curryRight = func.curryRight;
  lodash.debounce = func.debounce;
  lodash.defaults = object.defaults;
  lodash.defaultsDeep = object.defaultsDeep;
  lodash.defer = func.defer;
  lodash.delay = func.delay;
  lodash.difference = array.difference;
  lodash.differenceBy = array.differenceBy;
  lodash.differenceWith = array.differenceWith;
  lodash.drop = array.drop;
  lodash.dropRight = array.dropRight;
  lodash.dropRightWhile = array.dropRightWhile;
  lodash.dropWhile = array.dropWhile;
  lodash.fill = array.fill;
  lodash.filter = collection.filter;
  lodash.flatMap = collection.flatMap;
  lodash.flatMapDeep = collection.flatMapDeep;
  lodash.flatMapDepth = collection.flatMapDepth;
  lodash.flatten = array.flatten;
  lodash.flattenDeep = array.flattenDeep;
  lodash.flattenDepth = array.flattenDepth;
  lodash.flip = func.flip;
  lodash.flow = util.flow;
  lodash.flowRight = util.flowRight;
  lodash.fromPairs = array.fromPairs;
  lodash.functions = object.functions;
  lodash.functionsIn = object.functionsIn;
  lodash.groupBy = collection.groupBy;
  lodash.initial = array.initial;
  lodash.intersection = array.intersection;
  lodash.intersectionBy = array.intersectionBy;
  lodash.intersectionWith = array.intersectionWith;
  lodash.invert = object.invert;
  lodash.invertBy = object.invertBy;
  lodash.invokeMap = collection.invokeMap;
  lodash.iteratee = util.iteratee;
  lodash.keyBy = collection.keyBy;
  lodash.keys = keys;
  lodash.keysIn = object.keysIn;
  lodash.map = collection.map;
  lodash.mapKeys = object.mapKeys;
  lodash.mapValues = object.mapValues;
  lodash.matches = util.matches;
  lodash.matchesProperty = util.matchesProperty;
  lodash.memoize = func.memoize;
  lodash.merge = object.merge;
  lodash.mergeWith = object.mergeWith;
  lodash.method = util.method;
  lodash.methodOf = util.methodOf;
  lodash.mixin = mixin;
  lodash.negate = negate;
  lodash.nthArg = util.nthArg;
  lodash.omit = object.omit;
  lodash.omitBy = object.omitBy;
  lodash.once = func.once;
  lodash.orderBy = collection.orderBy;
  lodash.over = util.over;
  lodash.overArgs = func.overArgs;
  lodash.overEvery = util.overEvery;
  lodash.overSome = util.overSome;
  lodash.partial = func.partial;
  lodash.partialRight = func.partialRight;
  lodash.partition = collection.partition;
  lodash.pick = object.pick;
  lodash.pickBy = object.pickBy;
  lodash.property = util.property;
  lodash.propertyOf = util.propertyOf;
  lodash.pull = array.pull;
  lodash.pullAll = array.pullAll;
  lodash.pullAllBy = array.pullAllBy;
  lodash.pullAllWith = array.pullAllWith;
  lodash.pullAt = array.pullAt;
  lodash.range = util.range;
  lodash.rangeRight = util.rangeRight;
  lodash.rearg = func.rearg;
  lodash.reject = collection.reject;
  lodash.remove = array.remove;
  lodash.rest = func.rest;
  lodash.reverse = array.reverse;
  lodash.sampleSize = collection.sampleSize;
  lodash.set = object.set;
  lodash.setWith = object.setWith;
  lodash.shuffle = collection.shuffle;
  lodash.slice = array.slice;
  lodash.sortBy = collection.sortBy;
  lodash.sortedUniq = array.sortedUniq;
  lodash.sortedUniqBy = array.sortedUniqBy;
  lodash.split = string.split;
  lodash.spread = func.spread;
  lodash.tail = array.tail;
  lodash.take = array.take;
  lodash.takeRight = array.takeRight;
  lodash.takeRightWhile = array.takeRightWhile;
  lodash.takeWhile = array.takeWhile;
  lodash.tap = seq.tap;
  lodash.throttle = func.throttle;
  lodash.thru = thru;
  lodash.toArray = lang.toArray;
  lodash.toPairs = object.toPairs;
  lodash.toPairsIn = object.toPairsIn;
  lodash.toPath = util.toPath;
  lodash.toPlainObject = lang.toPlainObject;
  lodash.transform = object.transform;
  lodash.unary = func.unary;
  lodash.union = array.union;
  lodash.unionBy = array.unionBy;
  lodash.unionWith = array.unionWith;
  lodash.uniq = array.uniq;
  lodash.uniqBy = array.uniqBy;
  lodash.uniqWith = array.uniqWith;
  lodash.unset = object.unset;
  lodash.unzip = array.unzip;
  lodash.unzipWith = array.unzipWith;
  lodash.update = object.update;
  lodash.updateWith = object.updateWith;
  lodash.values = object.values;
  lodash.valuesIn = object.valuesIn;
  lodash.without = array.without;
  lodash.words = string.words;
  lodash.wrap = func.wrap;
  lodash.xor = array.xor;
  lodash.xorBy = array.xorBy;
  lodash.xorWith = array.xorWith;
  lodash.zip = array.zip;
  lodash.zipObject = array.zipObject;
  lodash.zipObjectDeep = array.zipObjectDeep;
  lodash.zipWith = array.zipWith;
  lodash.entries = object.toPairs;
  lodash.entriesIn = object.toPairsIn;
  lodash.extend = object.assignIn;
  lodash.extendWith = object.assignInWith;
  mixin(lodash, lodash);
  lodash.add = math.add;
  lodash.attempt = util.attempt;
  lodash.camelCase = string.camelCase;
  lodash.capitalize = string.capitalize;
  lodash.ceil = math.ceil;
  lodash.clamp = number.clamp;
  lodash.clone = lang.clone;
  lodash.cloneDeep = lang.cloneDeep;
  lodash.cloneDeepWith = lang.cloneDeepWith;
  lodash.cloneWith = lang.cloneWith;
  lodash.conformsTo = lang.conformsTo;
  lodash.deburr = string.deburr;
  lodash.defaultTo = util.defaultTo;
  lodash.divide = math.divide;
  lodash.endsWith = string.endsWith;
  lodash.eq = lang.eq;
  lodash.escape = string.escape;
  lodash.escapeRegExp = string.escapeRegExp;
  lodash.every = collection.every;
  lodash.find = collection.find;
  lodash.findIndex = array.findIndex;
  lodash.findKey = object.findKey;
  lodash.findLast = collection.findLast;
  lodash.findLastIndex = array.findLastIndex;
  lodash.findLastKey = object.findLastKey;
  lodash.floor = math.floor;
  lodash.forEach = collection.forEach;
  lodash.forEachRight = collection.forEachRight;
  lodash.forIn = object.forIn;
  lodash.forInRight = object.forInRight;
  lodash.forOwn = object.forOwn;
  lodash.forOwnRight = object.forOwnRight;
  lodash.get = object.get;
  lodash.gt = lang.gt;
  lodash.gte = lang.gte;
  lodash.has = object.has;
  lodash.hasIn = object.hasIn;
  lodash.head = array.head;
  lodash.identity = identity;
  lodash.includes = collection.includes;
  lodash.indexOf = array.indexOf;
  lodash.inRange = number.inRange;
  lodash.invoke = object.invoke;
  lodash.isArguments = lang.isArguments;
  lodash.isArray = isArray;
  lodash.isArrayBuffer = lang.isArrayBuffer;
  lodash.isArrayLike = lang.isArrayLike;
  lodash.isArrayLikeObject = lang.isArrayLikeObject;
  lodash.isBoolean = lang.isBoolean;
  lodash.isBuffer = lang.isBuffer;
  lodash.isDate = lang.isDate;
  lodash.isElement = lang.isElement;
  lodash.isEmpty = lang.isEmpty;
  lodash.isEqual = lang.isEqual;
  lodash.isEqualWith = lang.isEqualWith;
  lodash.isError = lang.isError;
  lodash.isFinite = lang.isFinite;
  lodash.isFunction = lang.isFunction;
  lodash.isInteger = lang.isInteger;
  lodash.isLength = lang.isLength;
  lodash.isMap = lang.isMap;
  lodash.isMatch = lang.isMatch;
  lodash.isMatchWith = lang.isMatchWith;
  lodash.isNaN = lang.isNaN;
  lodash.isNative = lang.isNative;
  lodash.isNil = lang.isNil;
  lodash.isNull = lang.isNull;
  lodash.isNumber = lang.isNumber;
  lodash.isObject = isObject;
  lodash.isObjectLike = lang.isObjectLike;
  lodash.isPlainObject = lang.isPlainObject;
  lodash.isRegExp = lang.isRegExp;
  lodash.isSafeInteger = lang.isSafeInteger;
  lodash.isSet = lang.isSet;
  lodash.isString = lang.isString;
  lodash.isSymbol = lang.isSymbol;
  lodash.isTypedArray = lang.isTypedArray;
  lodash.isUndefined = lang.isUndefined;
  lodash.isWeakMap = lang.isWeakMap;
  lodash.isWeakSet = lang.isWeakSet;
  lodash.join = array.join;
  lodash.kebabCase = string.kebabCase;
  lodash.last = last;
  lodash.lastIndexOf = array.lastIndexOf;
  lodash.lowerCase = string.lowerCase;
  lodash.lowerFirst = string.lowerFirst;
  lodash.lt = lang.lt;
  lodash.lte = lang.lte;
  lodash.max = math.max;
  lodash.maxBy = math.maxBy;
  lodash.mean = math.mean;
  lodash.meanBy = math.meanBy;
  lodash.min = math.min;
  lodash.minBy = math.minBy;
  lodash.stubArray = util.stubArray;
  lodash.stubFalse = util.stubFalse;
  lodash.stubObject = util.stubObject;
  lodash.stubString = util.stubString;
  lodash.stubTrue = util.stubTrue;
  lodash.multiply = math.multiply;
  lodash.nth = array.nth;
  lodash.noop = util.noop;
  lodash.now = date.now;
  lodash.pad = string.pad;
  lodash.padEnd = string.padEnd;
  lodash.padStart = string.padStart;
  lodash.parseInt = string.parseInt;
  lodash.random = number.random;
  lodash.reduce = collection.reduce;
  lodash.reduceRight = collection.reduceRight;
  lodash.repeat = string.repeat;
  lodash.replace = string.replace;
  lodash.result = object.result;
  lodash.round = math.round;
  lodash.sample = collection.sample;
  lodash.size = collection.size;
  lodash.snakeCase = string.snakeCase;
  lodash.some = collection.some;
  lodash.sortedIndex = array.sortedIndex;
  lodash.sortedIndexBy = array.sortedIndexBy;
  lodash.sortedIndexOf = array.sortedIndexOf;
  lodash.sortedLastIndex = array.sortedLastIndex;
  lodash.sortedLastIndexBy = array.sortedLastIndexBy;
  lodash.sortedLastIndexOf = array.sortedLastIndexOf;
  lodash.startCase = string.startCase;
  lodash.startsWith = string.startsWith;
  lodash.subtract = math.subtract;
  lodash.sum = math.sum;
  lodash.sumBy = math.sumBy;
  lodash.template = string.template;
  lodash.times = util.times;
  lodash.toFinite = lang.toFinite;
  lodash.toInteger = toInteger;
  lodash.toLength = lang.toLength;
  lodash.toLower = string.toLower;
  lodash.toNumber = lang.toNumber;
  lodash.toSafeInteger = lang.toSafeInteger;
  lodash.toString = lang.toString;
  lodash.toUpper = string.toUpper;
  lodash.trim = string.trim;
  lodash.trimEnd = string.trimEnd;
  lodash.trimStart = string.trimStart;
  lodash.truncate = string.truncate;
  lodash.unescape = string.unescape;
  lodash.uniqueId = util.uniqueId;
  lodash.upperCase = string.upperCase;
  lodash.upperFirst = string.upperFirst;
  lodash.each = collection.forEach;
  lodash.eachRight = collection.forEachRight;
  lodash.first = array.head;
  mixin(lodash, function() {
    var source = {};
    baseForOwn(lodash, function(func2, methodName) {
      if (!hasOwnProperty.call(lodash.prototype, methodName)) {
        source[methodName] = func2;
      }
    });
    return source;
  }(), { "chain": false });
  lodash.VERSION = VERSION;
  (lodash.templateSettings = string.templateSettings).imports._ = lodash;
  arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
    lodash[methodName].placeholder = lodash;
  });
  arrayEach(["drop", "take"], function(methodName, index) {
    LazyWrapper.prototype[methodName] = function(n) {
      n = n === void 0 ? 1 : nativeMax(toInteger(n), 0);
      var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
      if (result2.__filtered__) {
        result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
      } else {
        result2.__views__.push({
          "size": nativeMin(n, MAX_ARRAY_LENGTH),
          "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
        });
      }
      return result2;
    };
    LazyWrapper.prototype[methodName + "Right"] = function(n) {
      return this.reverse()[methodName](n).reverse();
    };
  });
  arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
    var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
    LazyWrapper.prototype[methodName] = function(iteratee2) {
      var result2 = this.clone();
      result2.__iteratees__.push({
        "iteratee": baseIteratee(iteratee2, 3),
        "type": type
      });
      result2.__filtered__ = result2.__filtered__ || isFilter;
      return result2;
    };
  });
  arrayEach(["head", "last"], function(methodName, index) {
    var takeName = "take" + (index ? "Right" : "");
    LazyWrapper.prototype[methodName] = function() {
      return this[takeName](1).value()[0];
    };
  });
  arrayEach(["initial", "tail"], function(methodName, index) {
    var dropName = "drop" + (index ? "" : "Right");
    LazyWrapper.prototype[methodName] = function() {
      return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
    };
  });
  LazyWrapper.prototype.compact = function() {
    return this.filter(identity);
  };
  LazyWrapper.prototype.find = function(predicate) {
    return this.filter(predicate).head();
  };
  LazyWrapper.prototype.findLast = function(predicate) {
    return this.reverse().find(predicate);
  };
  LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
    if (typeof path == "function") {
      return new LazyWrapper(this);
    }
    return this.map(function(value) {
      return baseInvoke(value, path, args);
    });
  });
  LazyWrapper.prototype.reject = function(predicate) {
    return this.filter(negate(baseIteratee(predicate)));
  };
  LazyWrapper.prototype.slice = function(start, end) {
    start = toInteger(start);
    var result2 = this;
    if (result2.__filtered__ && (start > 0 || end < 0)) {
      return new LazyWrapper(result2);
    }
    if (start < 0) {
      result2 = result2.takeRight(-start);
    } else if (start) {
      result2 = result2.drop(start);
    }
    if (end !== void 0) {
      end = toInteger(end);
      result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
    }
    return result2;
  };
  LazyWrapper.prototype.takeRightWhile = function(predicate) {
    return this.reverse().takeWhile(predicate).reverse();
  };
  LazyWrapper.prototype.toArray = function() {
    return this.take(MAX_ARRAY_LENGTH);
  };
  baseForOwn(LazyWrapper.prototype, function(func2, methodName) {
    var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
    if (!lodashFunc) {
      return;
    }
    lodash.prototype[methodName] = function() {
      var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
      var interceptor = function(value2) {
        var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
        return isTaker && chainAll ? result3[0] : result3;
      };
      if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
        isLazy = useLazy = false;
      }
      var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
      if (!retUnwrapped && useLazy) {
        value = onlyLazy ? value : new LazyWrapper(this);
        var result2 = func2.apply(value, args);
        result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": void 0 });
        return new LodashWrapper(result2, chainAll);
      }
      if (isUnwrapped && onlyLazy) {
        return func2.apply(this, args);
      }
      result2 = this.thru(interceptor);
      return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
    };
  });
  arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
    var func2 = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
    lodash.prototype[methodName] = function() {
      var args = arguments;
      if (retUnwrapped && !this.__chain__) {
        var value = this.value();
        return func2.apply(isArray(value) ? value : [], args);
      }
      return this[chainName](function(value2) {
        return func2.apply(isArray(value2) ? value2 : [], args);
      });
    };
  });
  baseForOwn(LazyWrapper.prototype, function(func2, methodName) {
    var lodashFunc = lodash[methodName];
    if (lodashFunc) {
      var key = lodashFunc.name + "";
      if (!hasOwnProperty.call(realNames, key)) {
        realNames[key] = [];
      }
      realNames[key].push({ "name": methodName, "func": lodashFunc });
    }
  });
  realNames[createHybrid(void 0, WRAP_BIND_KEY_FLAG).name] = [{
    "name": "wrapper",
    "func": void 0
  }];
  LazyWrapper.prototype.clone = lazyClone;
  LazyWrapper.prototype.reverse = lazyReverse;
  LazyWrapper.prototype.value = lazyValue;
  lodash.prototype.at = seq.at;
  lodash.prototype.chain = seq.wrapperChain;
  lodash.prototype.commit = seq.commit;
  lodash.prototype.next = seq.next;
  lodash.prototype.plant = seq.plant;
  lodash.prototype.reverse = seq.reverse;
  lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = seq.value;
  lodash.prototype.first = lodash.prototype.head;
  if (symIterator) {
    lodash.prototype[symIterator] = seq.toIterator;
  }
  /**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */
  class CacheManage {
    constructor() {
      __publicField(this, "_handle");
      /** 获取 */
      __publicField(this, "get");
      /** 设置 */
      __publicField(this, "set");
      __publicField(this, "_cacheRecord", /* @__PURE__ */ new Map());
      this._handle = {
        get: (key) => {
          if (!this._cacheRecord.has(key)) {
            return null;
          }
          return this._cacheRecord.get(key);
        },
        set: (key, value) => {
          this._cacheRecord.set(key, value);
        }
      };
      const getProxy = (key) => {
        this._handle.get(key);
      };
      getProxy.use = (fn) => {
        this._handle.get = fn;
      };
      this.get = getProxy;
      const setProxy = (key, value) => {
        this._handle.set(key, value);
      };
      setProxy.use = (fn) => {
        this._handle.set = fn;
      };
      this.set = setProxy;
    }
  }
  class CryptoManage {
    constructor() {
      __publicField(this, "_handle");
      /** 加密 */
      __publicField(this, "encrypt");
      /** 解密 */
      __publicField(this, "decrypt");
      this._handle = {
        encrypt: (config, timestamp) => {
          return;
        },
        decrypt: (response, options) => {
          return null;
        }
      };
      const encryptProxy = (config, timestamp) => {
        this._handle.encrypt(config, timestamp);
      };
      encryptProxy.use = (fn) => {
        this._handle.encrypt = fn;
      };
      this.encrypt = encryptProxy;
      const decryptProxy = (response, options) => {
        return this._handle.decrypt(response, options);
      };
      decryptProxy.use = (fn) => {
        this._handle.decrypt = fn;
      };
      this.decrypt = decryptProxy;
    }
  }
  class InterceptorsManage {
    constructor() {
      __publicField(this, "_handle");
      /** 请求拦截器 */
      __publicField(this, "request");
      /** 响应拦截器 */
      __publicField(this, "response");
      /** 响应错误处理 */
      __publicField(this, "responseError");
      this._handle = {
        request: (config) => {
          return;
        },
        response: (response, options) => {
          return null;
        },
        responseError: (error, options) => {
          return null;
        }
      };
      const requestProxy = (config) => {
        this._handle.request(config);
      };
      requestProxy.use = (fn) => {
        this._handle.request = fn;
      };
      this.request = requestProxy;
      const responseProxy = (response, options) => {
        this._handle.response(response, options);
      };
      responseProxy.use = (fn) => {
        this._handle.response = fn;
      };
      this.response = responseProxy;
      const responseErrorProxy = (error, options) => {
        this._handle.responseError(error, options);
      };
      responseErrorProxy.use = (fn) => {
        this._handle.responseError = fn;
      };
      this.responseError = responseErrorProxy;
    }
  }
  class LoadingManage {
    constructor() {
      __publicField(this, "_handle");
      /** 显示 */
      __publicField(this, "show");
      /** 关闭 */
      __publicField(this, "close");
      this._handle = {
        show: (text) => {
          return;
        },
        close: (options) => {
          return;
        }
      };
      const showProxy = (text) => {
        this._handle.show(text);
      };
      showProxy.use = (fn) => {
        this._handle.show = fn;
      };
      this.show = showProxy;
      const closeProxy = (options) => {
        this._handle.close(options);
      };
      closeProxy.use = (fn) => {
        this._handle.close = fn;
      };
      this.close = closeProxy;
    }
  }
  class MessageManage {
    constructor() {
      __publicField(this, "_handle");
      /** 成功 */
      __publicField(this, "success");
      /** 警告 */
      __publicField(this, "warning");
      /** 信息 */
      __publicField(this, "info");
      /** 错误 */
      __publicField(this, "error");
      this._handle = {
        success: (message) => {
          console.log(`[Fast.Axios] ${message}`);
        },
        warning: (message) => {
          console.warn(`[Fast.Axios] ${message}`);
        },
        info: (message) => {
          console.log(`[Fast.Axios] ${message}`);
        },
        error: (message) => {
          console.error(`[Fast.Axios] ${message}`);
        }
      };
      const successProxy = (message) => {
        this._handle.success(message);
      };
      successProxy.use = (fn) => {
        this._handle.success = fn;
      };
      this.success = successProxy;
      const warningProxy = (message) => {
        this._handle.warning(message);
      };
      warningProxy.use = (fn) => {
        this._handle.warning = fn;
      };
      this.warning = warningProxy;
      const infoProxy = (message) => {
        this._handle.info(message);
      };
      infoProxy.use = (fn) => {
        this._handle.info = fn;
      };
      this.info = infoProxy;
      const errorProxy = (message) => {
        this._handle.error(message);
      };
      errorProxy.use = (fn) => {
        this._handle.error = fn;
      };
      this.error = errorProxy;
    }
  }
  class MessageBoxManage {
    constructor() {
      __publicField(this, "_handle");
      /** 确认弹窗 */
      __publicField(this, "confirm");
      this._handle = {
        confirm: (options) => {
          if (typeof uni !== "undefined") {
            return new Promise((resolve, reject2) => {
              uni.showModal({
                title: "温馨提示",
                content: options.message,
                cancelText: options.cancelButtonText,
                confirmText: options.confirmButtonText,
                success: (res) => {
                  if (res.confirm) {
                    resolve();
                  } else {
                    reject2();
                  }
                },
                fail: (res) => {
                  res && console.error(res);
                  throw new Error("'uni.showModal' Api调用异常。");
                }
              });
            });
          } else {
            return new Promise((resolve, reject2) => {
              if (typeof window.confirm === "undefined") {
                throw new Error("'window.confirm' Api调用异常。");
              }
              if (window.confirm(options.message)) {
                resolve();
              } else {
                reject2();
              }
            });
          }
        }
      };
      const confirmProxy = (options) => {
        return this._handle.confirm(options);
      };
      confirmProxy.use = (fn) => {
        this._handle.confirm = fn;
      };
      this.confirm = confirmProxy;
    }
  }
  class FastAxios2 {
    constructor(options) {
      /** 请求域名或者Base路径 */
      __publicField(this, "baseUrl");
      /**
       * 超时时间，单位毫秒
       * @default 60000
       */
      __publicField(this, "timeout");
      /** 默认头部 */
      __publicField(this, "headers");
      /**
       * 请求加密解密
       * @default true
       */
      __publicField(this, "requestCipher");
      /** 错误Code */
      __publicField(this, "errorCode");
      /** 加载 @description 需要自行处理多次调用的问题 */
      __publicField(this, "loading");
      /** 消息提示 */
      __publicField(this, "message");
      /** 消息提示框 */
      __publicField(this, "messageBox");
      /** 缓存 */
      __publicField(this, "cache");
      /** 加密解密 */
      __publicField(this, "crypto");
      /** 拦截器 */
      __publicField(this, "interceptors");
      this.baseUrl = options == null ? void 0 : options.baseUrl;
      this.timeout = (options == null ? void 0 : options.timeout) ?? 6e4;
      this.headers = (options == null ? void 0 : options.headers) ?? {};
      this.requestCipher = isNil(options.requestCipher) ? true : false;
      this.errorCode = {
        cancelDuplicate: "重复请求，自动取消！",
        offLine: "您断网了！",
        fileDownloadError: "文件下载失败或此文件不存在！",
        302: "接口重定向了！",
        400: "参数不正确！",
        401: "您没有权限操作（令牌、用户名、密码错误）！",
        403: "您的访问是被禁止的！",
        404: "请求的资源不存在！",
        405: "请求的格式不正确！",
        408: "请求超时！",
        409: "系统已存在相同数据！",
        410: "请求的资源被永久删除，且不会再得到的！",
        422: "当创建一个对象时，发生一个验证错误！",
        429: "请求过于频繁，请稍后再试！",
        500: "服务器内部错误！",
        501: "服务未实现！",
        502: "网关错误！",
        503: "服务不可用，服务器暂时过载或维护！",
        504: "服务暂时无法访问，请稍后再试！",
        505: "HTTP版本不受支持！",
        [axios2.AxiosError.ETIMEDOUT]: "请求超时！",
        [axios2.AxiosError.ECONNABORTED]: "连接中断，服务器暂时过载或维护！",
        [axios2.AxiosError.ERR_NETWORK]: "网关错误，服务不可用，服务器暂时过载或维护！"
      };
      this.loading = new LoadingManage();
      this.message = new MessageManage();
      this.messageBox = new MessageBoxManage();
      this.cache = new CacheManage();
      this.crypto = new CryptoManage();
      this.interceptors = new InterceptorsManage();
    }
    addErrorCode(arg, message) {
      if (typeof arg === "string" || typeof arg === "number") {
        this.errorCode[arg] = message;
      } else {
        for (const key in arg) {
          this.errorCode[key] = arg[key];
        }
      }
      return this;
    }
  }
  // eslint-disable-next-line no-use-before-define
  __publicField(FastAxios2, "instance");
  const createFastAxios = (options, newInstance = false) => {
    if (newInstance) {
      return new FastAxios2(options);
    } else {
      if (!FastAxios2.instance) {
        const fastAxios = new FastAxios2(options);
        FastAxios2.instance = fastAxios;
      }
      return FastAxios2.instance;
    }
  };
  const useFastAxios = () => {
    if (!FastAxios2.instance) {
      throw new Error("请先调用 'createFastAxios' 初始化 'fast-axios'。");
    }
    return FastAxios2.instance;
  };
  const axiosOptions = {
    cancelDuplicateRequest: true,
    loading: false,
    loadingText: "加载中...",
    cache: false,
    getMethodCacheHandle: true,
    simpleDataFormat: true,
    showErrorMessage: true,
    showCodeMessage: true,
    autoDownloadFile: true,
    restfulResult: true
  };
  const pendingMap = /* @__PURE__ */ new Map();
  const getPendingKey = (axiosConfig) => {
    let { data } = axiosConfig;
    const { url, method: method2, params } = axiosConfig;
    if (isString(data)) data = JSON.parse(data);
    return [url, method2, JSON.stringify(params), JSON.stringify(data)].join("&");
  };
  const addPending = (pendingKey, axiosConfig) => {
    axiosConfig.cancelToken = axiosConfig.cancelToken || new axios2.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
  };
  const removePending = (pendingKey) => {
    if (pendingMap.has(pendingKey)) {
      const cancelToken = pendingMap.get(pendingKey);
      cancelToken(pendingKey);
      pendingMap.delete(pendingKey);
    }
  };
  const httpErrorStatusHandle = async (error) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    let message = "";
    const code = ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.code) || ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.status) || (error == null ? void 0 : error.code) || "default";
    if (((_d = error == null ? void 0 : error.request) == null ? void 0 : _d.responseType) === "blob") {
      try {
        message = (_g = JSON.parse(await ((_f = (_e = error == null ? void 0 : error.response) == null ? void 0 : _e.data) == null ? void 0 : _f.text()))) == null ? void 0 : _g.message;
      } catch {
        message = ((_i = (_h = error == null ? void 0 : error.response) == null ? void 0 : _h.data) == null ? void 0 : _i.message) || useFastAxios().errorCode[code];
      }
    } else {
      message = ((_k = (_j = error == null ? void 0 : error.response) == null ? void 0 : _j.data) == null ? void 0 : _k.message) || useFastAxios().errorCode[code];
    }
    return message;
  };
  const downloadFile = (response) => {
    if (typeof uni !== "undefined") {
    } else {
      const blob = new Blob([response.data], { type: "application/octet-stream;charset=UTF-8" });
      const contentDisposition = response.headers["content-disposition"];
      const result2 = /filename=([^;]+\.[^.;]+);*/.exec(contentDisposition);
      const filename = result2[1];
      const downloadElement = document.createElement("a");
      const href = window.URL.createObjectURL(blob);
      const reg = /^"(.*)"$/g;
      downloadElement.style.display = "none";
      downloadElement.href = href;
      downloadElement.download = decodeURI(filename.replace(reg, "$1"));
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);
    }
  };
  const createAxios = (axiosConfig) => {
    var _a;
    const fastAxios = useFastAxios();
    const options = { ...axiosOptions, ...axiosConfig };
    if (isNil(options.requestCipher)) {
      options.requestCipher = fastAxios.requestCipher;
    }
    if (options.cache && options.method.toUpperCase() === "GET" && options.restfulResult && options.simpleDataFormat) {
      if (options.params) {
        console.warn("[Fast.Axios] 如果使用 Http Cache，则不能存在任何 'params' 参数");
      }
      if ((_a = fastAxios.cache) == null ? void 0 : _a.get) {
        const cacheRes = fastAxios.cache.get(options.url);
        if (cacheRes) {
          return Promise.resolve(cacheRes);
        }
      }
    } else {
      options.cache = false;
    }
    const pendingKey = getPendingKey(axiosConfig);
    const timestamp = Date.now();
    const Axios = axios2.create({
      /** 如果是 UniApp 则默认使用适配器 */
      adapter: typeof uni !== "undefined" ? createUniAppAxiosAdapter() : void 0,
      baseURL: fastAxios.baseUrl,
      timeout: fastAxios.timeout,
      headers: fastAxios.headers,
      responseType: "json"
    });
    Axios.interceptors.request.use(
      (config) => {
        var _a2, _b, _c;
        removePending(pendingKey);
        options.cancelDuplicateRequest && addPending(pendingKey, config);
        (_a2 = fastAxios.interceptors) == null ? void 0 : _a2.request(config);
        options.loading && ((_b = fastAxios.loading) == null ? void 0 : _b.show(options.loadingText));
        if (config.responseType === "json") {
          if (options.requestCipher) {
            (_c = fastAxios.crypto) == null ? void 0 : _c.encrypt(config, timestamp);
          } else {
            if (options.getMethodCacheHandle && config.method.toUpperCase() === "GET") {
              config.params = config.params || {};
              config.params._ = timestamp;
            }
          }
        }
        return config;
      },
      (error) => {
        console.error("[Fast.Axios]", error);
        return Promise.reject(error);
      }
    );
    Axios.interceptors.response.use(
      (response) => {
        var _a2, _b, _c, _d, _e, _f, _g;
        removePending(pendingKey);
        options.loading && ((_a2 = fastAxios.loading) == null ? void 0 : _a2.close(options));
        if ((_b = fastAxios.interceptors) == null ? void 0 : _b.response) {
          try {
            const result2 = fastAxios.interceptors.response(response, options);
            if (!isNil(result2)) {
              return Promise.resolve(result2);
            }
          } catch (error) {
            console.error("[Fast.Axios]", error);
            return Promise.reject(error);
          }
        }
        if (response.config.responseType === "blob" || options.method.toUpperCase() === "DOWNLOAD") {
          if (response.status === 200) {
            if (options.autoDownloadFile) {
              downloadFile(response);
            }
            return Promise.resolve(response);
          } else {
            (_c = fastAxios.message) == null ? void 0 : _c.error(fastAxios.errorCode["fileDownloadError"]);
            return Promise.reject(response);
          }
        } else if (response.config.responseType === "json") {
          let responseData = response.data;
          if (options.restfulResult) {
            const restfulData = responseData;
            const code = (restfulData == null ? void 0 : restfulData.code) ?? response.status;
            if (code < 200 || code > 299 || (restfulData == null ? void 0 : restfulData.success) === false) {
              if (options.showCodeMessage) {
                if (restfulData == null ? void 0 : restfulData.message) {
                  if (isObject(restfulData == null ? void 0 : restfulData.message)) {
                    (_d = fastAxios.message) == null ? void 0 : _d.error(JSON.stringify(restfulData == null ? void 0 : restfulData.message));
                  } else {
                    (_e = fastAxios.message) == null ? void 0 : _e.error(restfulData == null ? void 0 : restfulData.message);
                  }
                }
              }
              console.error("[Fast.Axios]", new axios2.AxiosError((restfulData == null ? void 0 : restfulData.message) ?? "服务器内部错误！"));
              return Promise.reject(new axios2.AxiosError((restfulData == null ? void 0 : restfulData.message) ?? "服务器内部错误！"));
            }
          }
          if (options.requestCipher) {
            responseData = (_f = fastAxios.crypto) == null ? void 0 : _f.decrypt(response, options);
          }
          if (options.cache && options.restfulResult && options.simpleDataFormat) {
            (_g = fastAxios.cache) == null ? void 0 : _g.set(options.url, responseData == null ? void 0 : responseData.data);
          }
          if (options.simpleDataFormat) {
            return Promise.resolve(responseData == null ? void 0 : responseData.data);
          } else {
            return Promise.resolve(responseData);
          }
        } else {
          if (options.simpleDataFormat) {
            return Promise.resolve(response.data);
          } else {
            return Promise.resolve(response);
          }
        }
      },
      async (error) => {
        var _a2, _b, _c, _d;
        removePending(pendingKey);
        options.loading && ((_a2 = fastAxios.loading) == null ? void 0 : _a2.close(options));
        if (axios2.isCancel(error)) {
          console.warn(`[Fast.Axios] ${fastAxios.errorCode["cancelDuplicate"]}`);
          return Promise.reject();
        }
        if (!globalThis.navigator.onLine) {
          (_b = fastAxios.message) == null ? void 0 : _b.error(fastAxios.errorCode["offLine"]);
          return Promise.reject();
        }
        if ((_c = fastAxios.interceptors) == null ? void 0 : _c.responseError) {
          try {
            const result2 = fastAxios.interceptors.responseError(error, options);
            if (!isNil(result2)) {
              return Promise.reject(result2);
            }
          } catch (error2) {
            console.error("[Fast.Axios]", error2);
            return Promise.reject(error2);
          }
        }
        if (options.showErrorMessage) {
          const message = await httpErrorStatusHandle(error);
          (_d = fastAxios.message) == null ? void 0 : _d.error(message);
        }
        console.error("[Fast.Axios]", error);
        return Promise.reject(error);
      }
    );
    return Axios(options);
  };
  const axiosUtil = {
    /**
     * 请求
     * @param axiosConfig axios 请求配置
     * @param loading loading配置
     */
    request: createAxios,
    /**
     * 下载文件
     */
    downloadFile
  };
  exports.axiosUtil = axiosUtil;
  exports.createFastAxios = createFastAxios;
  exports.createUniAppAxiosAdapter = createUniAppAxiosAdapter;
  exports.useFastAxios = useFastAxios;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
}({}, axios);
//# sourceMappingURL=index.global.js.map
