type CacheGetHandle = (key: string) => any;
type CacheGetUseHandle = {
    use: (fn: CacheGetHandle) => void;
};
type CacheSetHandle = (key: string, value: any) => void;
type CacheSetUseHandle = {
    use: (fn: CacheSetHandle) => void;
};
export declare class CacheManage {
    private _handle;
    /** 获取 */
    readonly get: CacheGetHandle & CacheGetUseHandle;
    /** 设置 */
    readonly set: CacheSetHandle & CacheSetUseHandle;
    private _cacheRecord;
    constructor();
}
export {};
