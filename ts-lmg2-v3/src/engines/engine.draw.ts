import { IColor4Like } from "../maths/math.like";
import { Nullable } from "../types";
import { Engine } from "./engine";
import { PrimitiveType } from "./engine.enum";

export interface Primitive {
    type?: PrimitiveType;
    indexed?: boolean | undefined | any[];
    count?: number;
    base?: number;
    instanceCount?: number;
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
        const instanceCount = primitive.instanceCount !== undefined ? primitive.instanceCount : 1;

        if (!primitive.type) {
            throw new Error("error primitive type");
        }

        if (primitive.count === undefined) {
            throw new Error("error primitive count");
        }

        const mode = this._glPrimitive[primitive.type];
        const count = primitive.count;
        const { gl } = this._engine;
        if (primitive.indexed) {
            if (instanceCount > 0) {
                gl.drawElementsInstanced(mode, count, gl.UNSIGNED_SHORT, 0, instanceCount);
            } else {
                gl.drawElements(mode, count, gl.UNSIGNED_SHORT, 0);
            }
        } else if (primitive.type === PrimitiveType.PRIMITIVE_LINES) {
            gl.lineWidth(1);
            gl.drawArrays(gl.LINES, 0, count);
        } else {
            if (instanceCount > 0) {
                gl.drawArraysInstanced(mode, 0, count, instanceCount);
            } else {
                gl.drawArrays(mode, 0, count);
            }
        }
    }
}
