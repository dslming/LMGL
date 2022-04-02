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
    }

    public buildGeometry() {

        for (let name in this.geoInfo.attributes) {
            this.attributeBuffer.set(name, this._engine.engineVertex.createBuffer());
        }

        // 创建顶点缓冲区
        this.indicesBuffer = this._engine.engineVertex.createBuffer();
    }

    // 设置VBO
    public setAttributesBuffer(program: any) {
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

    // getGeometryInfo() {
    //     return this.geoInfo;
    // }

    // computeBoundingBox() {
    //     if (this.boundingBox === null) {
    //         this.boundingBox = new Box3();
    //     }
    //     const position = new Attribute(this.attribute.aPosition);
    //     if (position !== undefined) {
    //         this.boundingBox.setFromBufferAttribute(position);
    //     }

    //     if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
    //         console.error('Geometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
    //     }
    // }

    // computeBoundingSphere() {
    //     if (this.boundingSphere === null) {
    //         this.boundingSphere = new Sphere();
    //     }

    //     const _vector = new Vector3();
    //     const _box = new Box3();

    //     const position = new Attribute(this.attribute.aPosition);

    //     if (position != undefined) {
    //         // first, find the center of the bounding sphere
    //         const center = this.boundingSphere.center;
    //         _box.setFromBufferAttribute(position);
    //         _box.getCenter(center);

    //         // second, try to find a boundingSphere with a radius smaller than the
    //         // boundingSphere of the boundingBox: sqrt(3) smaller in the best case
    //         let maxRadiusSq = 0;
    //         for (let i = 0, il = position.count; i < il; i++) {
    //             _vector.fromBufferAttribute(position, i);
    //             maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
    //         }

    //         this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
    //         if (isNaN(this.boundingSphere.radius)) {
    //             console.error('Geometry.computeBoundingSphere(): Computed radius is NaN. The "aPosition" attribute is likely to have NaN values.', this);
    //         }
    //     }
    // }
}
