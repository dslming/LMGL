import { IFileRequest } from "../Misc/fileRequest";
import { FileTools, LoadFileError, ReadFileError, RequestFileError } from "../Misc/fileTools";
import { WebRequest } from "../Misc/webRequest";

export class SceneFile {
    private _activeRequests = new Array<IFileRequest>();


    /** @hidden */
    public _loadFile(url: string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (ev: ProgressEvent) => void, useOfflineSupport?: boolean, useArrayBuffer?: boolean, onError?: (request?: WebRequest, exception?: LoadFileError) => void): IFileRequest {
        const request = FileTools.LoadFile(url, onSuccess, onProgress, useArrayBuffer, onError);
        this._activeRequests.push(request);
        request.onCompleteObservable.add((request) => {
            this._activeRequests.splice(this._activeRequests.indexOf(request), 1);
        });
        return request;
    }

    /** @hidden */
    public _loadFileAsync(url: string, onProgress?: (data: any) => void, useOfflineSupport?: boolean, useArrayBuffer?: boolean): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            this._loadFile(url, (data) => {
                resolve(data);
            }, onProgress, useOfflineSupport, useArrayBuffer, (request, exception) => {
                reject(exception);
            });
        });
    }

    /** @hidden */
    public _requestFile(url: string, onSuccess: (data: string | ArrayBuffer, request?: WebRequest) => void, onProgress?: (ev: ProgressEvent) => void, useOfflineSupport?: boolean, useArrayBuffer?: boolean, onError?: (error: RequestFileError) => void, onOpened?: (request: WebRequest) => void): IFileRequest {
        const request = FileTools.RequestFile(url, onSuccess, onProgress, useArrayBuffer, onError, onOpened);
        this._activeRequests.push(request);
        request.onCompleteObservable.add((request) => {
            this._activeRequests.splice(this._activeRequests.indexOf(request), 1);
        });
        return request;
    }

    /** @hidden */
    public _requestFileAsync(url: string, onProgress?: (ev: ProgressEvent) => void, useOfflineSupport?: boolean, useArrayBuffer?: boolean, onOpened?: (request: WebRequest) => void): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            this._requestFile(url, (data) => {
                resolve(data);
            }, onProgress, useOfflineSupport, useArrayBuffer, (error) => {
                reject(error);
            }, onOpened);
        });
    }

    /** @hidden */
    public _readFile(file: File, onSuccess: (data: string | ArrayBuffer) => void, onProgress?: (ev: ProgressEvent) => any, useArrayBuffer?: boolean, onError?: (error: ReadFileError) => void): IFileRequest {
        const request = FileTools.ReadFile(file, onSuccess, onProgress, useArrayBuffer, onError);
        this._activeRequests.push(request);
        request.onCompleteObservable.add((request) => {
            this._activeRequests.splice(this._activeRequests.indexOf(request), 1);
        });
        return request;
    }

    /** @hidden */
    public _readFileAsync(file: File, onProgress?: (ev: ProgressEvent) => any, useArrayBuffer?: boolean): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            this._readFile(file, (data) => {
                resolve(data);
            }, onProgress, useArrayBuffer, (error) => {
                reject(error);
            });
        });
    }

  dispose() {
    // Abort active requests
    for (let request of this._activeRequests) {
        request.abort();
    }
  }
}
