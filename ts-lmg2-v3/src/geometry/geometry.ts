// import { Sphere } from '../math/Sphere.js';
// import { Box3 } from '../math/Box3.js';
// import { Vector3 } from '../math/Vector3.js';
// import Attribute from './Attribute.js'

import { Engine } from "../engines/engine";
import { PrimitiveType } from "../engines/engine.draw";
import { Nullable } from "../types";

export interface iGeometryInfo {
    positions: number[];
    normals: Nullable<number[]>;
    indices: number[];
    uvs: Nullable<number[]>;
}

export  class Geometry {
    geoInfo: any;
    type: PrimitiveType;
    attributeBuffer = new Map();
    private _engine: Engine;
    indicesBuffer: WebGLBuffer | null;
    count: number;
    VAO: any;

    constructor(engine: Engine, geoInfo: any) {
        this._engine = engine;
        this.geoInfo = geoInfo;
        // this.count = geoInfo.count;

        // this.type = geoInfo.type;
        // this.indices = geoInfo.indices || [];
        // this.boundingSphere = null;
        // this.boundingBox = null;

        // 三角形数量
        if (this.geoInfo.indices) {
            this.count = this.geoInfo.indices.length;
        } else {
            this.count = 0;
        }
        this._createVertexArray();
    }

    /**
     * 创建VAO
     */
    private _createVertexArray() {
        this.VAO = this._engine.engineVertex.createVertexArray();
        this._engine.engineVertex.bindVertexArray(this.VAO);
        for (let name in this.geoInfo.attributes) {
            this.attributeBuffer.set(name, this._engine.engineVertex.createBuffer());
        }

        // 创建顶点缓冲区
        this.indicesBuffer = this._engine.engineVertex.createBuffer();
        this._engine.engineVertex.bindVertexArray(null);
    }


    public setBuffers(program: any) {
        // 绑定VAO
        this._engine.engineVertex.bindVertexArray(this.VAO);
        const { attributeBuffer, indicesBuffer } = this;
        for (let name in this.geoInfo.attributes) {
            const attribute = this.geoInfo.attributes[name];
            const { value, itemSize } = attribute;
            this._engine.engineVertex.setAttribBuffer(program, attributeBuffer.get(name), {
                attribureName: name,
                attriburData: value,
                itemSize: itemSize,
            });
        }

        // 绑定顶点索引
        if (this.geoInfo.indices.length > 0) {
            this._engine.engineVertex.setIndicesBuffer(indicesBuffer, this.geoInfo.indices);
        }
    }

    public disableVertexAttrib(program: any) {
        for (let name in this.geoInfo.attributes) {
            const { attribureName } = this.geoInfo.attributes[name];
            const attribure = this._engine.engineVertex.getAttribLocation(program, attribureName);
            attribure != -1 && this._engine.engineVertex.disableVertexAttribArray(attribure);
        }
    }
}
