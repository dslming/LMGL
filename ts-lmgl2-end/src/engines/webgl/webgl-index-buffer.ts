import { Engine } from "../engine";
import { IndexFormat } from "../index.format";
import { BufferUsage, WebglBuffer } from "./webgl-buffer";

/**
 * A WebGL implementation of the IndexBuffer.
 *
 * @ignore
 */
class WebglIndexBuffer extends WebglBuffer {
  public glFormat: IndexFormat;

  constructor(engine: Engine, format: IndexFormat) {
    super();

    const gl = engine.gl;
    // const format = indexBuffer.format;
    if (format === IndexFormat.UINT8) {
      this.glFormat = gl.UNSIGNED_BYTE;
    } else if (format === IndexFormat.UINT16) {
      this.glFormat = gl.UNSIGNED_SHORT;
    } else if (format === IndexFormat.UINT32) {
      this.glFormat = gl.UNSIGNED_INT;
    }
  }

  unlock(device: Engine, usage: BufferUsage, storage: ArrayBuffer) {
    super._unlock(device, usage, device.gl.ELEMENT_ARRAY_BUFFER, storage);
  }
}

export { WebglIndexBuffer };
