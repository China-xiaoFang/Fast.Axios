type MessageHandle = (message: string) => void;
type MessageUseHandle = { use: (fn: MessageHandle) => void };

export class MessageManage {
	private _handle: {
		success: MessageHandle;
		warning: MessageHandle;
		info: MessageHandle;
		error: MessageHandle;
	};

	/** 成功 */
	readonly success: MessageHandle & MessageUseHandle;
	/** 警告 */
	readonly warning: MessageHandle & MessageUseHandle;
	/** 信息 */
	readonly info: MessageHandle & MessageUseHandle;
	/** 错误 */
	readonly error: MessageHandle & MessageUseHandle;

	constructor() {
		this._handle = {
			success: (message: string): void => {
				// eslint-disable-next-line no-console
				console.log(`[Fast.Axios] ${message}`);
			},
			warning: (message: string): void => {
				console.warn(`[Fast.Axios] ${message}`);
			},
			info: (message: string): void => {
				// eslint-disable-next-line no-console
				console.log(`[Fast.Axios] ${message}`);
			},
			error: (message: string): void => {
				console.error(`[Fast.Axios] ${message}`);
			},
		};

		const successProxy: MessageHandle & MessageUseHandle = (message: string): void => {
			this._handle.success(message);
		};
		successProxy.use = (fn: MessageHandle): void => {
			this._handle.success = fn;
		};
		this.success = successProxy;

		const warningProxy: MessageHandle & MessageUseHandle = (message: string): void => {
			this._handle.warning(message);
		};
		warningProxy.use = (fn: MessageHandle): void => {
			this._handle.warning = fn;
		};
		this.warning = warningProxy;

		const infoProxy: MessageHandle & MessageUseHandle = (message: string): void => {
			this._handle.info(message);
		};
		infoProxy.use = (fn: MessageHandle): void => {
			this._handle.info = fn;
		};
		this.info = infoProxy;

		const errorProxy: MessageHandle & MessageUseHandle = (message: string): void => {
			this._handle.error(message);
		};
		errorProxy.use = (fn: MessageHandle): void => {
			this._handle.error = fn;
		};
		this.error = errorProxy;
	}
}
