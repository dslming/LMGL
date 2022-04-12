import { Texture } from "../texture/texture";

function downLoad(blob:any) {
    let url = "";
    let fileReader = new FileReader();
    fileReader.readAsDataURL(blob); //读取文件保存在result中
    fileReader.onload = function (e:any) {
        url = e.target.result; //读取的结果在result中
        if (url.length < 6) {
            return;
        }
        let domA = document.createElement("a");
        domA.download = new Date().getTime() + ".jpg";
        domA.href = url;
        document.body.appendChild(domA);
        domA.click();
        domA.remove();
    };
}

export function showImage(texture: Texture) {
    var canvas: any = document.createElement("canvas");
    canvas.width = texture.width;
    canvas.height = texture.height;
    var ctx = canvas.getContext("2d");

    var imgData = ctx.createImageData(texture.width, texture.height);
    for (var i = 0; i < texture.source.length; i += 4) {
        imgData.data[i + 0] = texture.source[i+0];
        imgData.data[i + 1] = texture.source[i + 1];
        imgData.data[i + 2] = texture.source[i + 2];
        imgData.data[i + 3] = texture.source[i + 3];
    }
    ctx.putImageData(imgData, 0, 0);
    canvas.toBlob((blob:any) => {
        downLoad(blob);
    });
}
