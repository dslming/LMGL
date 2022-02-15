import { Engine } from "./engine";
import { IndexFormat } from "./index.format";
import { WebglIndexBuffer } from "./webgl/webgl-index-buffer";
import { WebglVertexBuffer } from "./webgl/webgl-vertex-buffer";

export class EngineBuffer {
  private _engine: Engine;
  public boundVao: any;
  public buffers: Array<any>;
  public indexBuffer: any;
  constructor(engine: Engine) {
    this._engine = engine;
  }

  // provide webgl implementation for the index buffer
  createIndexBufferImpl(format: IndexFormat) {
    return new WebglIndexBuffer(this._engine, format);
  }

  // provide webgl implementation for the vertex buffer
  createVertexBufferImpl() {
    return new WebglVertexBuffer();
  }
}
