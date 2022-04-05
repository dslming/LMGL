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
    type?: PrimitiveType;
    indexed?: boolean | undefined | any[];
    count?: number;
    base?: number;
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
        if (!primitive.type) {
            throw new Error("error primitive type");
        }

        if (primitive.count === undefined) {
            throw new Error("error primitive count");
        }

        const mode = this._glPrimitive[primitive.type];
        const count = primitive.count;
        const { gl } = this._engine;
        if (primitive.indexed && primitive.type === PrimitiveType.PRIMITIVE_TRIANGLES) {
            gl.drawElements(mode, count, gl.UNSIGNED_SHORT, 0);
        } else if (primitive.type === PrimitiveType.PRIMITIVE_LINES) {
            gl.lineWidth(1);
            gl.drawArrays(gl.LINES, 0, count);
        }
    }
}
