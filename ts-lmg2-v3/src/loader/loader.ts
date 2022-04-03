class Loader {
    crossOrigin: string;
    withCredentials: boolean;
    path: string;
    resourcePath: string;
    requestHeader: {};

    constructor() {
        this.crossOrigin = "anonymous";
        this.withCredentials = false;
        this.path = "";
        this.resourcePath = "";
        this.requestHeader = {};
    }

    load(/* url, onLoad, onProgress, onError */) {}

    loadAsync(url: any, onProgress: any) {
        const scope = this;

        return new Promise(function (resolve, reject) {
            // scope.load(url, resolve, onProgress, reject);
        });
    }

    parse(/* data */) {}

    setCrossOrigin(crossOrigin: string) {
        this.crossOrigin = crossOrigin;
        return this;
    }

    setWithCredentials(value: boolean) {
        this.withCredentials = value;
        return this;
    }

    setPath(path: string) {
        this.path = path;
        return this;
    }

    setResourcePath(resourcePath: string) {
        this.resourcePath = resourcePath;
        return this;
    }

    setRequestHeader(requestHeader: {}) {
        this.requestHeader = requestHeader;
        return this;
    }
}

export { Loader };
