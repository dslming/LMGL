/**
 * @hidden
 */
export class FileTools {
    static LoadImage(options: {url: string; rootPath?: string}) {
        if (options.rootPath === undefined) options.rootPath = "";
        return new Promise(function (resolve, reject) {
            let img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                const msg = "error load image," + options.url;
                reject(msg);
            };
            img.src = options.rootPath + options.url;
        });
    }

    static LoadCubeImages(options: {urls: string[]}) {
        return new Promise(function (resolve, reject) {
            let ct = 0;
            let img = new Array(6);

            for (let i = 0; i < 6; i++) {
                img[i] = new Image();
                img[i].onload = function () {
                    ct++;
                    if (ct == 6) {
                        resolve(img);
                    }
                };
                img[i].onerror = function () {
                    const msg = "ERROR WHILE TRYING TO LOAD SKYBOX TEXTURE" + options.urls[i];
                    reject(msg);
                };
                img[i].src = options.urls[i];
            }
        });
    }

    static LoadTextFiles(filenames: string[], rootPath?: string) {
        if (rootPath === undefined) rootPath = "";

        return new Promise((resolve, reject) => {
            var loadedSoFar = 0;
            var results: any = {};
            for (var i = 0; i < filenames.length; ++i) {
                var filename = filenames[i];
                (function () {
                    var name = rootPath + filename;

                    var request = new XMLHttpRequest();
                    request.onreadystatechange = function () {
                        if (request.readyState === 4) {
                            //if this reqest is done
                            //add this file to the results object
                            var text = request.responseText;
                            results[name] = text;

                            loadedSoFar += 1;
                            if (loadedSoFar === filenames.length) {
                                //if we've loaded all of the files
                                return resolve(results);
                            }
                        }
                    };
                    request.open("GET", name, true);
                    request.send();
                })();
            }
        });
    }
}
