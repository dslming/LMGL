import {
    ADDRESS_CLAMP_TO_EDGE,
    TEXTURETYPE_DEFAULT, TEXTURETYPE_RGBM
} from './constants.js';

import { Texture } from './texture.js';

/**
 * @class
 * @name CubemapHandler
 * @implements {ResourceHandler}
 * @classdesc Resource handler used for loading cubemap {@link Texture} resources.
 * @param {GraphicsDevice} device - The graphics device.
 * @param {AssetRegistry} assets - The asset registry.
 * @param {ResourceLoader} loader - The resource loader.
 */
class CubemapHandler {
    static _device = {};

    // update the cubemap resources given a newly loaded set of assets with their corresponding ids
    static update(cubemapAsset) {
        // var assetData = cubemapAsset.data || {};
        var tex = cubemapAsset,
          mip, i;

        // faces, prelit cubemap 128, 64, 32, 16, 8, 4
        var resources = [null, null, null, null, null, null];

        // texture type used for faces and prelit cubemaps are both taken from
        // cubemap.data.rgbm
        var getType = function () {
            // if (assetData.hasOwnProperty('type')) {
            //     return assetData.type;
            // }
            // if (assetData.hasOwnProperty('rgbm')) {
            //     return assetData.rgbm ? TEXTURETYPE_RGBM : TEXTURETYPE_DEFAULT;
            // }
            return TEXTURETYPE_RGBM;
        };

         for (i = 0; i < 6; ++i) {
           var prelitLevels = [tex._levels[i]];

           // construct full prem chain on highest prefilter cubemap on ios
           if (i === 0 && this._device.useTexCubeLod) {
             for (mip = 1; mip < tex._levels.length; ++mip) {
               prelitLevels[mip] = tex._levels[mip];
             }
           }

           var prelit = new Texture(this._device, {
             name: "texture" + '_prelitCubemap' + (tex.width >> i),
             cubemap: true,
             type: getType() || tex.type,
             width: tex.width >> i,
             height: tex.height >> i,
             format: tex.format,
             levels: prelitLevels,
             fixCubemapSeams: true,
             addressU: ADDRESS_CLAMP_TO_EDGE,
             addressV: ADDRESS_CLAMP_TO_EDGE
           });

           resources[i] = prelit;
         }

        return resources;
    }
}

export { CubemapHandler };
