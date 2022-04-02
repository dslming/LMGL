// import { Sphere } from '../math/Sphere.js';
// import { Box3 } from '../math/Box3.js';
// import { Vector3 } from '../math/Vector3.js';
// import Attribute from './Attribute.js'

import { Engine } from "../engines/engine";
import { PrimitiveType } from "../engines/engine.draw";
import { Logger } from "../misc/logger";

export interface iGeometryAttributes {
    [name: string]: {
        value: any[];
        itemSize: number;
    };
}

/**
 * 几何体信息
 * eg:
 * ```js
 *  const geoInfo = {
        indices: model.indices,
        attributes: {
            aPosition: {
                value: model.positions,
                itemSize: 3,
            },
        },
      };
 * ```
 */
export interface iGeometryInfo {
    // 几何体的顶点索引
    indices: any[];
    // 几何体的顶点属性
    attributes: iGeometryAttributes;
    // 绘制类型,默认是三角形
    type?: PrimitiveType;
    // 数量, 默认是顶点索引的长度
    count?: number;
}

export class Geometry {
    private _geometryInfo: iGeometryInfo;
    private _attributeBuffer = new Map();
    private _engine: Engine;
    private _indicesBuffer: WebGLBuffer | null;
    private _VAO: any;

    constructor(engine: Engine, geometryInfo: iGeometryInfo) {
        this._engine = engine;

        this._geometryInfo = geometryInfo;
        if (!this._geometryInfo.attributes) {
            Logger.Warn("geometry no attributes");
        }

        if (!this._geometryInfo.type) {
            this._geometryInfo.type = PrimitiveType.PRIMITIVE_TRIANGLES;
        }

        // 三角形数量
        if (this._geometryInfo.indices) {
            this._geometryInfo.count = this._geometryInfo.indices.length;
        } else {
            this._geometryInfo.count = 0;
        }
        this._createVertexArray();
    }

    get geometryInfo() {
        return this._geometryInfo;
    }

    /**
     * 创建VAO
     */
    private _createVertexArray() {
        this._VAO = this._engine.engineVertex.createVertexArray();
        this._engine.engineVertex.bindVertexArray(this._VAO);
        for (let name in this._geometryInfo.attributes) {
            this._attributeBuffer.set(name, this._engine.engineVertex.createBuffer());
        }

        // 创建顶点缓冲区
        this._indicesBuffer = this._engine.engineVertex.createBuffer();
        this._engine.engineVertex.bindVertexArray(null);
    }

    public setBuffers(program: any) {
        // 绑定VAO
        this._engine.engineVertex.bindVertexArray(this._VAO);
        const { _attributeBuffer, _indicesBuffer } = this;
        for (let name in this._geometryInfo.attributes) {
            const attribute = this._geometryInfo.attributes[name];
            const { value, itemSize } = attribute;
            this._engine.engineVertex.setAttribBuffer(program, _attributeBuffer.get(name), {
                attribureName: name,
                attriburData: value,
                itemSize: itemSize,
            });
        }

        // 绑定顶点索引
        if (this._geometryInfo.indices.length > 0) {
            this._engine.engineVertex.setIndicesBuffer(_indicesBuffer, this._geometryInfo.indices);
        }
    }

    public disableVertexAttrib(program: any) {
        for (let name in this._geometryInfo.attributes) {
            const attribure = this._engine.engineVertex.getAttribLocation(program, name);
            attribure != -1 && this._engine.engineVertex.disableVertexAttribArray(attribure);
        }
    }
}
