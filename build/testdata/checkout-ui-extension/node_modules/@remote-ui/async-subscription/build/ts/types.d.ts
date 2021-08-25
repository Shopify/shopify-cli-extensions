import type { MaybePromise } from '@remote-ui/rpc';
export declare type Subscriber<T> = (value: T) => void;
export declare type RemoteSubscribeResult<T> = [() => void, T];
export interface SyncSubscribable<T> {
    readonly current: T;
    subscribe(subscriber: Subscriber<T>): () => void;
}
export interface RemoteSubscribable<T> {
    readonly initial: T;
    subscribe(subscriber: Subscriber<T>): MaybePromise<RemoteSubscribeResult<T>>;
}
export interface StatefulRemoteSubscribable<T> extends SyncSubscribable<T> {
    destroy(): Promise<void>;
}
//# sourceMappingURL=types.d.ts.map