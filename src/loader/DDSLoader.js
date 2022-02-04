import { CompressedTextureLoader } from './CompressedTextureLoader.js';
import { IMAGE_TYPE } from '../core/constants.js';
import { DDSTools } from './dds.js'
import { SphericalPolynomial } from '../math/sphericalPolynomial.js'
import dao from '../core/Dao.js';
import { InternalTexture, InternalTextureSource } from './internalTexture.js'

export const RGBA_S3TC_DXT3_Format = 33778;
export const RGBA_S3TC_DXT5_Format = 33779;
export const RGB_ETC1_Format = 36196;
export const RGB_ETC2_Format = 37492;
export const RGB_S3TC_DXT1_Format = 33776;

class DDSLoader extends CompressedTextureLoader {

	constructor(w, h) {
		super();
		this.width = w;
		this.height = h;
	}

	parse(buffer, loadMipmaps) {
		const gl = dao.getData("gl");
		const engine = dao.getData("engine");

		const data = new Uint8Array(buffer)
		var info = DDSTools.GetDDSInfo(data);
		info.sphericalPolynomial = new SphericalPolynomial();
		const loadMipmap = true;
		const texture = new InternalTexture(engine, InternalTextureSource.Cube);
		texture.isCube = true;
		texture.width = this.width || info.width;
		texture.height = this.height || info.height;
		// texture.url = rootUrl;
		texture.generateMipMaps = true;
		texture._lodGenerationScale = 0.8;
		texture._lodGenerationOffset = 0;

		engine._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
		DDSTools.UploadDDSLevels(engine, texture, data, info, loadMipmap, 6);
		// texture.width = info.width;
		// texture.height = info.height;
		return texture;
	}
}

export { DDSLoader };
