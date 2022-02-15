import { Usage } from "../engine.interface.js";
import { Engine } from "../engine.js";
import { WebglBuffer } from "./webgl-buffer.js";

/**
 * A WebGL implementation of the VertexBuffer.
 *
 * @ignore
 */
class WebglVertexBuffer extends WebglBuffer {
  // vertex array object
  vao = null;

  destroy(device: Engine) {
    super.destroy(device);

    // clear up bound vertex buffers
    device.engineBuffer.boundVao = null;
    device.gl.bindVertexArray(null);
  }

  loseContext() {
    super.loseContext();
    this.vao = null;
  }

  unlock(device: Engine, usage: Usage, storage: ArrayBuffer) {
    super._unlock(device, usage, device.gl.ARRAY_BUFFER, storage);
  }
}

export { WebglVertexBuffer };
