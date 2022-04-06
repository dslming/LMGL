import { Engine, UniformsType } from "../engines";
import { PrimitiveType } from "../engines/engine.draw";
import { Geometry, iGeometryInfo } from "../geometry";
import { Material } from "../material/material";
import { Mesh } from "./mesh";

export class MeshAxis {
    meshX: Mesh;
    meshY: Mesh;
    meshZ: Mesh;
    private _engine: Engine;

    constructor(engine: Engine, size: number) {
        this._engine = engine;
        const geoX = this.getGeoX(size);
        const geoY = this.getGeoX(size);
        const geoZ = this.getGeoX(size);

        geoY.attributes.aPosition.value = [0, 0, 0, 0, 1 * size, 0];

        geoZ.attributes.aPosition.value = [0, 0, 0, 0, 0, 1 * size];

        const matX = this.getMat({ x: 1, y: 0, z: 0, w: 1 });
        const matY = this.getMat({ x: 0, y: 1, z: 0, w: 1 });
        const matZ = this.getMat({ x: 0, y: 0, z: 1, w: 1 });

        this.meshX = new Mesh(this._engine, new Geometry(engine, geoX), matX);
        this.meshY = new Mesh(this._engine, new Geometry(engine, geoY), matY);
        this.meshZ = new Mesh(this._engine, new Geometry(engine, geoZ), matZ);
    }

    getMat(color: any): Material {
        const vertexShader = `
      in vec3 aPosition;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;

      void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
      }
    `;

        const fragmentShader = `
      uniform vec4 uColor;
      out vec4 FragColor;

      void main() {
        FragColor = uColor;
      }
      `;

        const mat = new Material(this._engine, {
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor: { type: UniformsType.Vec4, value: color },
            },
        });
        return mat;
    }

    getGeoX(size: number): iGeometryInfo {
        return {
            count: 2,
            attributes: {
                aPosition: {
                    value: [0, 0, 0, 1 * size, 0, 0],
                    itemSize: 3,
                },
            },
            type: PrimitiveType.PRIMITIVE_LINES,
        };
    }
}
