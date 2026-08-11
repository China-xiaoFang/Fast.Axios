/** 确认框调用参数，由错误提示和业务确认流程共同使用。 */
interface MessageBoxOptions {
	/** 确认框正文。 */
	message: string;
	/** 交给自定义确认框处理器的视觉类型；原生 confirm/showModal 不使用该字段。 */
	type?: "success" | "warning" | "info" | "error";
	/** 取消按钮文字；浏览器原生 confirm 无法自定义。 */
	cancelButtonText?: string;
	/** 确认按钮文字；浏览器原生 confirm 无法自定义。 */
	confirmButtonText?: string;
}
/** 打开确认框并等待用户选择；确认时完成，取消或失败时拒绝。 */
type MessageBoxHandle = (options: MessageBoxOptions) => Promise<void>;
/** 为确认框函数附加实现替换入口。 */
interface MessageBoxUseHandle {
	/** 使用新的确认框函数替换当前实现。 */
	use: (fn: MessageBoxHandle) => void;
}

/**
 * 跨浏览器和 uni-app 的确认框处理器。
 *
 * 用户确认时 Promise resolve，用户取消或平台 API 调用失败时 Promise reject。
 */
export class MessageBoxManage {
	/** 当前实际执行的确认框函数。 */
	private _handle: {
		confirm: MessageBoxHandle;
	};

	/** 打开确认框；`.use(fn)` 可替换为 Fast 项目自己的 UI 组件。 */
	readonly confirm: MessageBoxHandle & MessageBoxUseHandle;

	/** 创建优先使用 uni-app、其次使用浏览器原生 confirm 的确认框处理器。 */
	constructor() {
		this._handle = {
			confirm: (options): Promise<void> => {
				// uni 是 uni-app 注入的全局对象；存在时使用跨端 showModal，不能访问浏览器 DOM。
				if (typeof uni !== "undefined") {
					return new Promise((resolve, reject) => {
						uni.showModal({
							// 默认标题保持与 Fast 项目现有交互提示一致。
							title: "温馨提示",
							content: options.message,
							cancelText: options.cancelButtonText,
							confirmText: options.confirmButtonText,
							success: (res) => {
								// showModal 成功只表示弹窗正常结束，仍要根据 confirm 判断用户选择。
								if (res.confirm) {
									resolve();
								} else {
									reject(new Error("用户取消了确认操作。"));
								}
							},
							fail: (res: UniNamespace.GeneralCallbackResult) => {
								// 异步回调中必须 reject 当前 Promise，直接 throw 无法让调用方捕获失败结果。
								reject(new Error(res.errMsg ?? "'uni.showModal' API 调用异常。"));
							},
						});
					});
				}

				// SSR、Node.js 等环境既没有 uni，也没有 window.confirm，需要返回可捕获的失败 Promise。
				if (typeof window === "undefined" || typeof window.confirm !== "function") {
					return Promise.reject(new Error("当前运行环境不支持 'window.confirm' API。"));
				}

				// 原生 confirm 只返回 boolean，转换为 Promise 后与 uni-app 和自定义实现保持相同调用方式。
				// 这是有意提供的默认浏览器交互，因此只在下一行关闭 no-alert 规则。
				// eslint-disable-next-line no-alert
				return window.confirm(options.message) ? Promise.resolve() : Promise.reject(new Error("用户取消了确认操作。"));
			},
		};

		// 代理函数保持对外引用稳定，每次调用都转发给最新注册的确认框实现。
		const confirmProxy: MessageBoxHandle & MessageBoxUseHandle = (options): Promise<void> => {
			return this._handle.confirm(options);
		};
		// 替换后续确认框实现，例如接入 Element Plus；不会立即打开确认框。
		confirmProxy.use = (fn: MessageBoxHandle): void => {
			this._handle.confirm = fn;
		};
		this.confirm = confirmProxy;
	}
}
