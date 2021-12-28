import { FILTER } from '../core/constants.js'
import { FileLoader } from './FileLoader.js';
import { Loader } from './Loader.js';
import { ImageTexture } from '../core/ImageTexture.js'
/**
 * Abstract Base class to block based textures loader (dds, pvr, ...)
 *
 * Sub classes have to implement the parse() method which will be used in load().
 */

class CompressedTextureLoader extends Loader {

	constructor() {
		super();
	}

	load( url) {

		const scope = this;

		const images = [];

		const loader = new FileLoader();
		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( scope.withCredentials );

		const image = {
			data: null,
			width: 1,
			height: 1,
			isDataImage: true,
		}

		return new Promise((resolve, reject) => {
			loader.load(url).then(buffer => {
				const texDatas = scope.parse(buffer, true);
				if (texDatas.isCubemap) {
					const faces = texDatas.mipmaps.length / texDatas.mipmapCount;
					for (let f = 0; f < faces; f++) {
						images[f] = { mipmaps: [] };
						for (let i = 0; i < texDatas.mipmapCount; i++) {
							images[f].mipmaps.push(texDatas.mipmaps[f * texDatas.mipmapCount + i]);
							images[f].format = texDatas.format;
							images[f].width = texDatas.width;
							images[f].height = texDatas.height;
						}
					}
					texture.image = images;
				} else {
					const texture = new ImageTexture(image);
					texture.image.width = texDatas.width;
					texture.image.height = texDatas.height;
					texture.mipmaps = texDatas.mipmaps;
				}

				if (texDatas.mipmapCount === 1) {
					texture.minFilter = FILTER.LinearFilter;
				}
				texture.format = texDatas.format;
				resolve(texture)
			}).catch(err => {
			  reject(err);
			});
		})
	}

}


export { CompressedTextureLoader };
