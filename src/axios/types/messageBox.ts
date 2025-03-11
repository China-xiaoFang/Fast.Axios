type MessageBoxHandle = (options: {
	/** 消息 */
	message: string;
	/** 类型 */
	type?: "success" | "warning" | "info" | "error";
	/** 取消按钮文字 */
	cancelButtonText?: string;
	/** 确认按钮文字 */
	confirmButtonText?: string;
}) => Promise<void>;
type MessageBoxUseHandle = { use: (fn: MessageBoxHandle) => void };

export class MessageBoxManage {
	private _handle: {
		confirm: MessageBoxHandle;
	};

	/** 确认弹窗 */
	readonly confirm: MessageBoxHandle & MessageBoxUseHandle;

	constructor() {
		this._handle = {
			confirm: (options): Promise<void> => {
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
							},
						});
					});
				} else {
					return new Promise((resolve, reject) => {
						if (typeof window.confirm === "undefined") {
							throw new Error("'window.confirm' Api调用异常。");
						}
						// eslint-disable-next-line no-alert
						if (window.confirm(options.message)) {
							resolve();
						} else {
							reject();
						}
					});
				}
			},
		};

		const confirmProxy: MessageBoxHandle & MessageBoxUseHandle = (options): Promise<void> => {
			return this._handle.confirm(options);
		};
		confirmProxy.use = (fn: MessageBoxHandle): void => {
			this._handle.confirm = fn;
		};
		this.confirm = confirmProxy;
	}
}
