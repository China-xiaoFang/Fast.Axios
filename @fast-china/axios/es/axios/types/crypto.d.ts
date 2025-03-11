import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { FastAxiosRequestConfig } from './options';
type CryptoEncryptHandle = <Input>(config: InternalAxiosRequestConfig<Input>, timestamp: number) => void;
type CryptoEncryptUseHandle = {
    use: (fn: CryptoEncryptHandle) => void;
};
type CryptoDecryptHandle = <Output = any, Input = any>(response: AxiosResponse<Output, Input>, options: FastAxiosRequestConfig<Input>) => any | void;
type CryptoDecryptUseHandle = {
    use: (fn: CryptoDecryptHandle) => void;
};
export declare class CryptoManage {
    private _handle;
    /** 加密 */
    readonly encrypt: CryptoEncryptHandle & CryptoEncryptUseHandle;
    /** 解密 */
    readonly decrypt: CryptoDecryptHandle & CryptoDecryptUseHandle;
    constructor();
}
export {};
