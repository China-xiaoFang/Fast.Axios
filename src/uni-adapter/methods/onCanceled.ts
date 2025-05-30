import { CanceledError } from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export default class OnCanceled<T> {
	config: AxiosRequestConfig<T>;
	private onCanceled?: (cancel?: any) => void;
	constructor(config: AxiosRequestConfig<T>) {
		this.config = config;
	}

	subscribe(task: any, reject: any): void {
		if (this.config.cancelToken || this.config.signal) {
			this.onCanceled = (cancel?: any): void => {
				if (!task) return;

				reject(!cancel || cancel.type ? new CanceledError(undefined, undefined, this.config as InternalAxiosRequestConfig, task) : cancel);
				task.abort();
				task = null;
			};
			if (this.config.cancelToken) {
				// @ts-expect-error ignore
				this.config.cancelToken.subscribe(this.onCanceled);
			}

			if (this.config.signal && this.config.signal.addEventListener) {
				this.config.signal.aborted ? this.onCanceled() : this.config.signal.addEventListener("abort", this.onCanceled);
			}
		}
	}

	unsubscribe(): void {
		if (this.config.cancelToken) {
			// @ts-expect-error ignore
			this.config.cancelToken.unsubscribe(this.onCanceled);
		}

		if (this.config.signal && this.config.signal.removeEventListener) this.config.signal.removeEventListener("abort", this.onCanceled);
	}
}
