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
            var geometry = (<Mesh>mesh).geometry;

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
}
