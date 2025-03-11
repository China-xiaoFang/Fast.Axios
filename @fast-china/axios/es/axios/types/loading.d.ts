import { AxiosOptions } from './options';
type LoadingShowHandle = (text: string) => void;
type LoadingShowUseHandle = {
    use: (fn: LoadingShowHandle) => void;
};
type LoadingCloseHandle = (options: AxiosOptions) => void;
type LoadingCloseUseHandle = {
    use: (fn: LoadingCloseHandle) => void;
};
export declare class LoadingManage {
    private _handle;
    /** 显示 */
    readonly show: LoadingShowHandle & LoadingShowUseHandle;
    /** 关闭 */
    readonly close: LoadingCloseHandle & LoadingCloseUseHandle;
    constructor();
}
export {};
