import { _DevTools } from "../Misc/devTools";
import { IFileRequest } from "../Misc/fileRequest";
import { LoadFileError } from "../Misc/fileTools";
import { IWebRequest } from "../Misc/interfaces/iWebRequest";
import { WebRequest } from "../Misc/webRequest";
import { Nullable } from "../types";
import { Engine } from "./engine";

export class EngineFile {
  private _activeRequests = new Array<IFileRequest>();

  /** ---------------------------------------- 抽象接口 --------------------------------------------------------- */
  /**
   * Loads an image as an HTMLImageElement.
   * @param input url string, ArrayBuffer, or Blob to load
   * @param onLoad callback called when the image successfully loads
   * @param onError callback called when the image fails to load
   * @param offlineProvider offline provider for caching
   * @param mimeType optional mime type
   * @returns the HTMLImageElement of the loaded image
   * @hidden
   */
  public static _FileToolsLoadImage(
    input: string | ArrayBuffer | ArrayBufferView | Blob,
    onLoad: (img: HTMLImageElement | ImageBitmap) => void,
    onError: (message?: string, exception?: any) => void,
    mimeType?: string
  ): Nullable<HTMLImageElement> {
    throw _DevTools.WarnImport("FileTools");
  }
  /**
   * Loads a file from a url
   * @param url url to load
   * @param onSuccess callback called when the file successfully loads
   * @param onProgress callback called while file is loading (if the server supports this mode)
   * @param offlineProvider defines the offline provider for caching
   * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
   * @param onError callback called when the file fails to load
   * @returns a file request object
   * @hidden
   */
  public static _FileToolsLoadFile(
    url: string,
    onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void,
    onProgress?: (ev: ProgressEvent) => void,
    useArrayBuffer?: boolean,
    onError?: (request?: WebRequest, exception?: LoadFileError) => void
  ): IFileRequest {
    throw _DevTools.WarnImport("FileTools");
  }

  public _loadFile(
    url: string,
    onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void,
    onProgress?: (data: any) => void,
    useArrayBuffer?: boolean,
    onError?: (request?: IWebRequest, exception?: any) => void
  ): IFileRequest {
    let request = EngineFile._FileToolsLoadFile(
      url,
      onSuccess,
      onProgress,
      useArrayBuffer,
      onError
    );
    this._activeRequests.push(request);
    request.onCompleteObservable.add((request) => {
      this._activeRequests.splice(this._activeRequests.indexOf(request), 1);
    });
    return request;
  }
}
