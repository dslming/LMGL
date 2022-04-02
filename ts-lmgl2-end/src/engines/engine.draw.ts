import { IColor4Like } from "../maths/math.like";
import { Nullable } from "../types";
import { Engine } from "./engine";

export enum PrimitiveType {
    PRIMITIVE_POINTS = 0,
    PRIMITIVE_LINES = 1,
    PRIMITIVE_LINELOOP = 2,
    PRIMITIVE_LINESTRIP = 3,
    PRIMITIVE_TRIANGLES = 4,
    PRIMITIVE_TRISTRIP = 5,
    PRIMITIVE_TRIFAN = 6,
}

export interface Primitive {
    type: PrimitiveType;
    indexed?: boolean;
    count: number;
    base: number;
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

    /**
     * Clear the current render buffer or the current render target (if any is set up)
     * @param color defines the color to use
     * @param backBuffer defines if the back buffer must be cleared
     * @param depth defines if the depth buffer must be cleared
     * @param stencil defines if the stencil buffer must be cleared
     */
    public clear(color: Nullable<IColor4Like>, backBuffer: boolean, depth: boolean, stencil: boolean = false): void {
        this._engine.engineState.applyStates();
        const { gl } = this._engine;
        var mode = 0;
        if (backBuffer && color) {
            gl.clearColor(color.r, color.g, color.b, color.a !== undefined ? color.a : 1.0);
            mode |= gl.COLOR_BUFFER_BIT;
        }

        if (depth) {
            // if (this.useReverseDepthBuffer) {
            //   this._depthCullingState.depthFunc = this._gl.GREATER;
            //   this._gl.clearDepth(0.0);
            // } else {
            //   this._gl.clearDepth(1.0);
            // }
            mode |= gl.DEPTH_BUFFER_BIT;
        }
        if (stencil) {
            gl.clearStencil(0);
            mode |= gl.STENCIL_BUFFER_BIT;
        }
        gl.clear(mode);
    }
}
