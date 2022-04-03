import { Engine } from "../engines/engine";
import { FileTools } from "../misc/fileTools";
import { Texture } from "../texture";

export class TextureLoader {
    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;
    }

    async load(url: string) {
        return new Promise(async (resolve, reject) => {
            const image = await FileTools.LoadImage(url);
            const texture = new Texture(this._engine);
            texture.source = image;
            return resolve(texture);
        });
    }
}
