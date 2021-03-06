export function loadImage(src, callback) {
  return new Promise(function (resolve, reject) {
      let img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function() {
        callback && callback(img);
        resolve(img);
      };
      img.onerror = function () {
        callback && callback(null);
        reject("ERROR WHILE TRYING TO LOAD SKYBOX TEXTURE");
      };
      img.src = src;
  })
}

export function loadCubeImages(urls) {
  return new Promise(function (resolve, reject) {
     let ct = 0;
     let img = new Array(6);

     for (let i = 0; i < 6; i++) {
       img[i] = new Image();
       img[i].onload = function() {
         ct++;
         if (ct == 6) {
           resolve(img)
         }
       };
       img[i].onerror = function() {
         reject("ERROR WHILE TRYING TO LOAD SKYBOX TEXTURE");
       };
       img[i].src = urls[i];
     }
  })
}
