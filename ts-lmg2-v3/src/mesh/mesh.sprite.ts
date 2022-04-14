import { Engine } from "../engines/engine";
import { UniformsType } from "../engines/engine.enum";
import { Geometry, iGeometryData } from "../geometry/geometry";
import { Material } from "../material/material";
import { IColor4Like } from "../maths/math.like";
import { Mesh } from "./mesh";

export interface iMeshSpriteOptions {
    color?: IColor4Like;
}
export class MeshSprite {
    private engine: any;
    private _options: iMeshSpriteOptions | undefined;
    mesh: Mesh;

    constructor(engine: Engine, options?: iMeshSpriteOptions) {
        this.engine = engine;
        this._options = options;
        const geometry = new Geometry(engine, this.getGeometryData());
        this.mesh = new Mesh(engine, geometry, this.getMat(this?._options?.color));
    }
    getGeometryData(): iGeometryData {
        return {
            indices: {
                value: [0, 1, 2, 0, 2, 3],
            },
            attributes: [
                {
                    name: "aPosition",
                    value: [-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0],
                    itemSize: 3,
                },
                {
                    name: "aUv",
                    value: [0, 0, 0, 1, 1, 1, 0, 1],
                    itemSize: 2,
                },
            ],
        };
    }

    getMat(color?: IColor4Like): Material {
        const vertexShader = `
      in vec3 aPosition;
      in vec2 aUv;
      out vec2 vUv;
      uniform float rotation;
      uniform mat4 modelViewMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;

      void main() {
        // vec3 viewPos = (viewMatrix * vec4(aPosition.xyz, 1.0)).xyz;
        vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );

        vec2 scale = vec2(1.,1.);
        vec2 center = vec2(0.5,0.5);
        vec2 alignedPosition = ( aPosition.xy - ( center - vec2( 0.5 ) ) ) * scale;

        vec2 rotatedPosition;
        rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
        rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;

        mvPosition.xy += rotatedPosition;

        gl_Position = projectionMatrix * mvPosition;
        vUv = aUv;
      }
    `;

        const fragmentShader = `
      uniform vec4 uColor;
      out vec4 FragColor;

      void main() {
        FragColor = uColor;
      }
      `;

        if (!color) {
            color = { r: 1, g: 1, b: 1, a: 1 };
        }
        const mat = new Material(this.engine, {
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor: { type: UniformsType.Vec4, value: { x: color.r, y: color.g, z: color.b, w: color.a } },
            },
        });
        return mat;
    }
}
