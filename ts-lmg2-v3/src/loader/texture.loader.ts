import { Engine } from "../engines/engine";
import { FileTools } from "../misc/fileTools";
import { Texture } from "../texture";
import { Loader } from "./loader";

export class TextureLoader extends Loader {
    constructor(engine: Engine) {
        super(engine);
    }

    async load(url: string) {
        return new Promise(async (resolve, reject) => {
            const image = await FileTools.LoadImage({ url });
            const texture = new Texture(this.engine);
            texture.source = image;
            return resolve(texture);
        });
    }
}
