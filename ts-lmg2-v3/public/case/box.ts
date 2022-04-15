import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const vertexShader = `
in vec3 aPosition;
in vec4 aColor;
out vec4 vColor;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
}
`;

    const fragmentShader = `
out vec4 FragColor;

void main() {
FragColor = vec4(vec3(0.5), .5);
}
`;

    const model = lmgl.boxBuilder();
    const geoData = {
        indices: {
            value: model.indices,
        },
        attributes: [
            {
                name: "aPosition",
                value: model.positions,
                itemSize: 3,
            },
        ],
    };

    const matInfo = {
        vertexShader,
        fragmentShader,
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    mesh.material.blendType = lmgl.BlendType.BLEND_NORMAL;
    scene.add(mesh);
    // mesh.rotation.y = -Math.PI;
}
