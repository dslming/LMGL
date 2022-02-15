import { Nullable } from "../../types.js";
import { Engine } from "../engine.js";

export enum BufferUsage {
  DYNAMIC = 0,
  STATIC = 1,
  STREAM = 2,
  GPUDYNAMIC =3
}

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

  protected _unlock(device: Engine, usage: BufferUsage, target: number, storage: ArrayBuffer) {
    const gl = device.gl;

    if (!this.bufferId) {
      this.bufferId = gl.createBuffer();
    }

    let glUsage: number;
    switch (usage) {
      case BufferUsage.STATIC:
        glUsage = gl.STATIC_DRAW;
        break;
      case BufferUsage.DYNAMIC:
        glUsage = gl.DYNAMIC_DRAW;
        break;
      case BufferUsage.STREAM:
        glUsage = gl.STREAM_DRAW;
        break;
      case BufferUsage.GPUDYNAMIC:
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
