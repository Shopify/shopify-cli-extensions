import { FileOrModuleResolver } from './utilities';
export interface PlainWorkerCreator {
    readonly url?: URL;
    (): Worker;
}
export declare function createPlainWorkerFactory(script: FileOrModuleResolver<unknown>): PlainWorkerCreator;
//# sourceMappingURL=plain-worker.d.ts.map