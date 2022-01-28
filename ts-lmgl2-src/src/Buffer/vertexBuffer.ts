import { Nullable, DataArray } from "../types";
import { WebGLEngine } from '../Engines/webglEngine'
import { WebGLDataBuffer } from "./webGLDataBuffer";

export class VertexBuffer {
  private _engine: WebGLEngine;
  public _data: Nullable<DataArray>;
  private _buffer: Nullable<WebGLDataBuffer>;
  private _updatable: boolean;

  constructor(engine: any, data: DataArray, updatable: boolean = false) {
    this._data = data;
    this._updatable = updatable;
    this._engine = engine;
    this.create();
  }

  public create(data: Nullable<DataArray> = null, ): void {
    if (!data && this._buffer) {
      return; // nothing to do
    }

    data = data || this._data;
    if (!data) {
      return;
    }

    if (!this._buffer) {
      // create buffer
      if (this._updatable) {
        this._buffer =
          this._engine.engineVertex.createDynamicVertexBuffer(data);
        this._data = data;
      } else {
        this._buffer = this._engine.engineVertex.createVertexBuffer(data);
      }
    } else if (this._updatable) {
      // todo
      this._data = data;
    }
  }
}
