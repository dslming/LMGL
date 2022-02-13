import { Engine } from "./engine";
// prettier-ignore
import {
  PRIMITIVE_POINTS,
  PRIMITIVE_LINES,
  PRIMITIVE_LINELOOP,
  PRIMITIVE_LINESTRIP,
  PRIMITIVE_TRIANGLES,
  PRIMITIVE_TRISTRIP,
  PRIMITIVE_TRIFAN
} from "./constants";

export enum PrimitiveType {
  POINTS = PRIMITIVE_POINTS,
  LINES = PRIMITIVE_LINES,
  LINELOOP = PRIMITIVE_LINELOOP,
  LINESTRIP = PRIMITIVE_LINESTRIP,
  TRIANGLES = PRIMITIVE_TRIANGLES,
  TRISTRIP = PRIMITIVE_TRISTRIP,
  TRIFAN = PRIMITIVE_TRIFAN,
}

export interface Primitive {
  type: PrimitiveType;
  indexed: boolean;
  count: number
}

export class EngineDraw {
  private _engine: Engine;
  private _glPrimitive: number[];

  constructor(engine: Engine) {
    this._engine = engine;
    const { gl } = this._engine;

    this._glPrimitive = [gl.POINTS, gl.LINES, gl.LINE_LOOP, gl.LINE_STRIP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN];
  }

  /**
   * Gets the current render width
   * @param useScreen defines if screen size must be used (or the current render target if any)
   * @returns a number defining the current render width
   */
  public getRenderWidth(): number {
    return this._engine.gl.drawingBufferWidth;
  }

  /**
   * Gets the current render height
   * @returns a number defining the current render height
   */
  public getRenderHeight(): number {
    return this._engine.gl.drawingBufferHeight;
  }

  public draw(primitive: Primitive) {
    const mode = this._glPrimitive[primitive.type];
    const count = primitive.count;
    const { gl } = this._engine;

    if (primitive.indexed) {
      // const indexBuffer = this.indexBuffer;
      // const format = indexBuffer.glFormat;
      const offset = 0;
      // gl.drawElements(mode, count, format, offset);
    }
  }
}
