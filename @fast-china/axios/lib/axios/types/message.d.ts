type MessageHandle = (message: string) => void;
type MessageUseHandle = {
    use: (fn: MessageHandle) => void;
};
export declare class MessageManage {
    private _handle;
    /** 成功 */
    readonly success: MessageHandle & MessageUseHandle;
    /** 警告 */
    readonly warning: MessageHandle & MessageUseHandle;
    /** 信息 */
    readonly info: MessageHandle & MessageUseHandle;
    /** 错误 */
    readonly error: MessageHandle & MessageUseHandle;
    constructor();
}
export {};
