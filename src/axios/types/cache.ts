type CacheGetHandle = (key: string) => any;
type CacheGetUseHandle = { use: (fn: CacheGetHandle) => void };
type CacheSetHandle = (key: string, value: any) => void;
type CacheSetUseHandle = { use: (fn: CacheSetHandle) => void };

export class CacheManage {
	private _handle: {
		get: CacheGetHandle;
		set: CacheSetHandle;
	};

	/** 获取 */
	readonly get: CacheGetHandle & CacheGetUseHandle;
	/** 设置 */
	readonly set: CacheSetHandle & CacheSetUseHandle;

	private _cacheRecord: Map<string, any> = new Map();

	constructor() {
		this._handle = {
			get: (key: string): void => {
				if (!this._cacheRecord.has(key)) {
					return null;
				}

				return this._cacheRecord.get(key);
			},
			set: (key: string, value: any): void => {
				this._cacheRecord.set(key, value);
			},
		};

		const getProxy: CacheGetHandle & CacheGetUseHandle = (key: string): void => {
			this._handle.get(key);
		};
		getProxy.use = (fn: CacheGetHandle): void => {
			this._handle.get = fn;
		};
		this.get = getProxy;

		const setProxy: CacheSetHandle & CacheSetUseHandle = (key: string, value: any): void => {
			this._handle.set(key, value);
		};
		setProxy.use = (fn: CacheSetHandle): void => {
			this._handle.set = fn;
		};
		this.set = setProxy;
	}
}
