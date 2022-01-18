import { Effect } from "../Materials/effect";
import { Material } from "../Materials/material";
import { Texture } from "../Materials/Textures/texture";
import { Mesh } from "../Meshes/mesh";
import { Nullable } from "../types";
import { Scene } from "./scene";

export interface iSceneCatch {
  _cachedMaterial: Nullable<Material>;
  _cachedEffect: Nullable<Effect>;
  _cachedVisibility: Nullable<number>;
}

export class SceneCatch implements iSceneCatch {
   /** @hidden */
    public _cachedMaterial: Nullable<Material>;
    /** @hidden */
    public _cachedEffect: Nullable<Effect>;
    /** @hidden */
  public _cachedVisibility: Nullable<number>;
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

   /**
     * Call this function to reduce memory footprint of the scene.
     * Vertex buffers will not store CPU data anymore (this will prevent picking, collisions or physics to work correctly)
     */
    public clearCachedVertexData(): void {
        for (var meshIndex = 0; meshIndex < this.scene.meshes.length; meshIndex++) {
            var mesh = this.scene.meshes[meshIndex];
            var geometry = (<Mesh>mesh).meshGeometry.geometry;

            if (geometry) {
                geometry._indices = [];

                for (var vbName in geometry._vertexBuffers) {
                    if (!geometry._vertexBuffers.hasOwnProperty(vbName)) {
                        continue;
                    }
                    geometry._vertexBuffers[vbName]._buffer._data = null;
                }
            }
        }
    }

    /**
     * This function will remove the local cached buffer data from texture.
     * It will save memory but will prevent the texture from being rebuilt
     */
    public cleanCachedTextureBuffer(): void {
        for (var baseTexture of this.scene.textures) {
            let buffer = (<Texture>baseTexture)._buffer;

            if (buffer) {
                (<Texture>baseTexture)._buffer = null;
            }
        }
    }

    /**
     * Gets the cached material (ie. the latest rendered one)
     * @returns the cached material
     */
    public getCachedMaterial(): Nullable<Material> {
        return this._cachedMaterial;
    }

    /**
     * Gets the cached effect (ie. the latest rendered one)
     * @returns the cached effect
     */
    public getCachedEffect(): Nullable<Effect> {
        return this._cachedEffect;
    }

    /**
     * Gets the cached visibility state (ie. the latest rendered one)
     * @returns the cached visibility state
     */
    public getCachedVisibility(): Nullable<number> {
        return this._cachedVisibility;
    }

    /**
     * Gets a boolean indicating if the current material / effect / visibility must be bind again
     * @param material defines the current material
     * @param effect defines the current effect
     * @param visibility defines the current visibility state
     * @returns true if one parameter is not cached
     */
    public isCachedMaterialInvalid(material: Material, effect: Effect, visibility: number = 1) {
        return this._cachedEffect !== effect || this._cachedMaterial !== material || this._cachedVisibility !== visibility;
    }


     /** Resets all cached information relative to material (including effect and visibility) */
    public resetCachedMaterial(): void {
        this._cachedMaterial = null;
        this._cachedEffect = null;
        this._cachedVisibility = null;
    }
}
