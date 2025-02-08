import { AxiosRequestConfig } from 'axios';
export default class OnCanceled<T> {
    config: AxiosRequestConfig<T>;
    private onCanceled?;
    constructor(config: AxiosRequestConfig<T>);
    subscribe(task: any, reject: any): void;
    unsubscribe(): void;
}
