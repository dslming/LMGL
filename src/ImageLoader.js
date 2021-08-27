export function loadImage(src, callback) {
  let img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    callback && callback(img);
  };
  img.src = src;
}
