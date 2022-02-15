import { INDEXFORMAT_UINT8, INDEXFORMAT_UINT16, INDEXFORMAT_UINT32 } from "../../constants.js";
import { IndexFormat, Usage } from "../engine.interface.js";
import { Engine } from "../engine.js";
import { WebglBuffer } from "./webgl-buffer.js";

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
    if (format === INDEXFORMAT_UINT8) {
      this.glFormat = gl.UNSIGNED_BYTE;
    } else if (format === INDEXFORMAT_UINT16) {
      this.glFormat = gl.UNSIGNED_SHORT;
    } else if (format === INDEXFORMAT_UINT32) {
      this.glFormat = gl.UNSIGNED_INT;
    }
  }

  unlock(device: Engine, usage: Usage, storage: ArrayBuffer) {
    super._unlock(device, usage, device.gl.ELEMENT_ARRAY_BUFFER, storage);
  }
}

export { WebglIndexBuffer };
