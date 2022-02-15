import { BUFFER_DYNAMIC, BUFFER_GPUDYNAMIC, BUFFER_STATIC, BUFFER_STREAM } from "../../constants.js";
import { Nullable } from "../../types.js";
import { Usage } from "../engine.interface.js";
import { Engine } from "../engine.js";

/**
 * A WebGL implementation of the Buffer.
 *
 * @ignore
 */
class WebglBuffer {
  bufferId: Nullable<WebGLBuffer> = null;

  destroy(engine: Engine) {
    if (this.bufferId) {
      engine.gl.deleteBuffer(this.bufferId);
      this.bufferId = null;
    }
  }

  loseContext() {
    this.bufferId = null;
  }

  protected _unlock(device: Engine, usage: Usage, target: number, storage: ArrayBuffer) {
    const gl = device.gl;

    if (!this.bufferId) {
      this.bufferId = gl.createBuffer();
    }

    let glUsage: number;
    switch (usage) {
      case BUFFER_STATIC:
        glUsage = gl.STATIC_DRAW;
        break;
      case BUFFER_DYNAMIC:
        glUsage = gl.DYNAMIC_DRAW;
        break;
      case BUFFER_STREAM:
        glUsage = gl.STREAM_DRAW;
        break;
      case BUFFER_GPUDYNAMIC:
        if (device.webgl2) {
          glUsage = gl.DYNAMIC_COPY;
        } else {
          glUsage = gl.STATIC_DRAW;
        }
        break;
      default:
        glUsage = gl.STATIC_DRAW;
    }

    gl.bindBuffer(target, this.bufferId);
    gl.bufferData(target, storage, glUsage);
  }
}

export { WebglBuffer };
