const state = {
  timeout: 6e4,
  requestCipher: true,
  loading: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    show: (text) => {
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close: (options) => {
    }
  },
  message: {
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
  },
  messageBox: {
    confirm: (options) => {
      if (typeof uni !== "undefined") {
        return new Promise((resolve, reject) => {
          uni.showModal({
            title: "温馨提示",
            content: options.message,
            cancelText: options.cancelButtonText,
            confirmText: options.confirmButtonText,
            success: (res) => {
              if (res.confirm) {
                resolve();
              } else {
                reject();
              }
            },
            fail: (res) => {
              res && console.error(res);
              throw new Error("'uni.showModal' Api调用异常。");
            }
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          if (typeof window.confirm === "undefined") {
            throw new Error("'window.confirm' Api调用异常。");
          }
          if (window.confirm(options.message)) {
            resolve();
          } else {
            reject();
          }
        });
      }
    }
  }
};
const useAxios = () => {
  return {
    ...state,
    /** 配置选项 */
    setOptions: (options) => {
      for (const key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          if (typeof options[key] === "object" && options[key] !== null && state[key] && typeof state[key] === "object") {
            state[key] = { ...state[key], ...options[key] };
          } else {
            state[key] = options[key];
          }
        }
      }
    }
  };
};
export {
  useAxios
};
//# sourceMappingURL=useAxios.mjs.map
