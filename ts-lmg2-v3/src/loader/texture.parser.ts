import { Engine } from "../engines/engine";
import { iTextureOptions, Texture } from "../texture";
import { iLoadOptions } from "./texture.loader";

export interface iTextureParser {
    load(options: iLoadOptions): any;
    createTexture(url: string, data: any, engine: Engine, textureOptions: iTextureOptions):Texture;
}
