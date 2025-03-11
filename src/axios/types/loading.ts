import type { AxiosOptions } from "./options";

type LoadingShowHandle = (text: string) => void;
type LoadingShowUseHandle = { use: (fn: LoadingShowHandle) => void };
type LoadingCloseHandle = (options: AxiosOptions) => void;
type LoadingCloseUseHandle = { use: (fn: LoadingCloseHandle) => void };

export class LoadingManage {
	private _handle: {
		show: LoadingShowHandle;
		close: LoadingCloseHandle;
	};

	/** 显示 */
	readonly show: LoadingShowHandle & LoadingShowUseHandle;
	/** 关闭 */
	readonly close: LoadingCloseHandle & LoadingCloseUseHandle;

	constructor() {
		this._handle = {
			show: (text: string): void => {
				return;
			},
			close: (options: AxiosOptions): void => {
				return;
			},
		};

		const showProxy: LoadingShowHandle & LoadingShowUseHandle = (text: string): void => {
			this._handle.show(text);
		};
		showProxy.use = (fn: LoadingShowHandle): void => {
			this._handle.show = fn;
		};
		this.show = showProxy;

		const closeProxy: LoadingCloseHandle & LoadingCloseUseHandle = (options: AxiosOptions): void => {
			this._handle.close(options);
		};
		closeProxy.use = (fn: LoadingCloseHandle): void => {
			this._handle.close = fn;
		};
		this.close = closeProxy;
	}
}
