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
type MessageBoxUseHandle = {
    use: (fn: MessageBoxHandle) => void;
};
export declare class MessageBoxManage {
    private _handle;
    /** 确认弹窗 */
    readonly confirm: MessageBoxHandle & MessageBoxUseHandle;
    constructor();
}
export {};
