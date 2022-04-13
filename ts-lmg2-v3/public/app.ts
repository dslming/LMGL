import * as lmgl from "../src/index";

(window as any).lmgl = lmgl;

let canvas: any;
let engine: lmgl.Engine;
let scene: lmgl.Scene;

class Triangle {
    constructor() {
        const vertexShader = `
in vec3 aPosition;
in vec4 aColor;
out vec4 vColor;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
}
`;

        const fragmentShader = `
in vec4 vColor;
out vec4 FragColor;

void main() {
FragColor = vColor;
}
`;

        const geoData = {
            indices: [0, 1, 2],
            attributes: [
                {
                    name: "aPosition",
                    value: [-2, -2, 0, 2, -2, 0, 0, 1.5, 0],
                    itemSize: 3,
                },
                {
                    name: "aColor",
                    value: [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
                    itemSize: 4,
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
        scene.add(mesh);
        // mesh.rotation.y = -Math.PI;
    }
}

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new lmgl.Engine(canvas);
    scene = new lmgl.Scene(engine);

    new Triangle();

    const app = new lmgl.Application(engine, scene);
    app.loop();
};
