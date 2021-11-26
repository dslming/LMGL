import { Loader } from './Loader.js';

class FileLoader extends Loader {
  constructor() {
    super();
  }

  load(url, onProgress) {
    return new Promise((resolve, reject) => {
         if (url === undefined) url = '';
         if (this.path !== undefined) url = this.path + url;

         // create request
         const req = new Request(url, {
           headers: new Headers(this.requestHeader),
           credentials: this.withCredentials ? 'include' : 'same-origin',
           // An abort controller could be added within a future PR
         });

         // start the fetch
         fetch(req)
           .then(response => {
             if (response.status === 200 || response.status === 0) {
               // Some browsers return HTTP Status 0 when using non-http protocol
               // e.g. 'file://' or 'data://'. Handle as success.
               if (response.status === 0) {
                 console.warn('THREE.FileLoader: HTTP Status 0 received.');
               }

               const reader = response.body.getReader();
               const contentLength = response.headers.get('Content-Length');
               const total = contentLength ? parseInt(contentLength) : 0;
               const lengthComputable = total !== 0;
               let loaded = 0;

               // periodically read data into the new stream tracking while download progress
               return new ReadableStream({
                 start(controller) {
                   readData();
                   function readData() {
                     reader.read().then(({ done, value }) => {
                       if (done) {
                         controller.close();
                       } else {
                         loaded += value.byteLength;
                         const event = new ProgressEvent('progress', { lengthComputable, loaded, total });
                         onProgress && onProgress(event)
                         controller.enqueue(value);
                         readData();
                       }
                     });
                   }
                 }
               });
             } else {
               throw Error(`fetch for "${response.url}" responded with ${response.status}: ${response.statusText}`);
             }
           })
           .then(stream => {
             const response = new Response(stream);

             switch (this.responseType) {
               case 'arraybuffer':
                 return response.arrayBuffer();

               case 'blob':
                 return response.blob();

               case 'document':
                 return response.text()
                   .then(text => {
                     const parser = new DOMParser();
                     return parser.parseFromString(text, this.mimeType);
                   });

               case 'json':
                 return response.json();

               default:
                 return response.text();

             }

           })
           .then(data => {
             resolve(data)
           })
           .catch(err => {
             reject(err);
           });
    })
  }

  setResponseType(value) {
    this.responseType = value;
    return this;
  }

  setMimeType(value) {
    this.mimeType = value;
    return this;
  }
}

export { FileLoader };
