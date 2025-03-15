import type { FastAxiosRequestConfig } from "./options";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

type CryptoEncryptHandle = <Input>(config: InternalAxiosRequestConfig<Input>, timestamp: number) => void;
type CryptoEncryptUseHandle = { use: (fn: CryptoEncryptHandle) => void };
type CryptoDecryptHandle = <Output = any, Input = any>(response: AxiosResponse<Output, Input>, options: FastAxiosRequestConfig<Input>) => any | void;
type CryptoDecryptUseHandle = { use: (fn: CryptoDecryptHandle) => void };

export class CryptoManage {
	private _handle: {
		encrypt: CryptoEncryptHandle;
		decrypt: CryptoDecryptHandle;
	};

	/** 加密 */
	readonly encrypt: CryptoEncryptHandle & CryptoEncryptUseHandle;
	/** 解密 */
	readonly decrypt: CryptoDecryptHandle & CryptoDecryptUseHandle;

	constructor() {
		this._handle = {
			encrypt: <Input>(config: InternalAxiosRequestConfig<Input>, timestamp: number): void => {
				return;
			},
			decrypt: <Output = any, Input = any>(response: AxiosResponse<Output, Input>, options: FastAxiosRequestConfig<Input>): any | void => {
				return null;
			},
		};

		const encryptProxy: CryptoEncryptHandle & CryptoEncryptUseHandle = <Input>(
			config: InternalAxiosRequestConfig<Input>,
			timestamp: number
		): void => {
			this._handle.encrypt<Input>(config, timestamp);
		};
		encryptProxy.use = (fn: CryptoEncryptHandle): void => {
			this._handle.encrypt = fn;
		};
		this.encrypt = encryptProxy;

		const decryptProxy: CryptoDecryptHandle & CryptoDecryptUseHandle = <Output = any, Input = any>(
			response: AxiosResponse<Output, Input>,
			options: FastAxiosRequestConfig<Input>
		): any | void => {
			return this._handle.decrypt<Output, Input>(response, options);
		};
		decryptProxy.use = (fn: CryptoDecryptHandle): void => {
			this._handle.decrypt = fn;
		};
		this.decrypt = decryptProxy;
	}
}
