import * as lmgl from "../src/index";
(window as any).lmgl = lmgl;

class Demo {
    private app: any;

    constructor() {
        const canvas = document.getElementById("renderCanvas");
        const engine = new lmgl.Engine(canvas);
        const scene = new lmgl.Scene(engine);
        const app = new lmgl.Application(engine, scene);
        (window as any).lm = app;

        const model = lmgl.planeBuilder(2, 2);
        const geoInfo = {
            indices: model.indices,
            attributes: {
                aPosition: {
                    value: model.positions,
                    itemSize: 3,
                },
                aUv: {
                    value: model.uvs,
                    itemSize: 2,
                },
            },
        };

        const geometry = new lmgl.Geometry(engine, geoInfo);

        const vertexShader1 = `
            in vec3 aPosition;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            in vec2 aUv;
            out vec2 vUv;

            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
                vUv = aUv;
            }
        `;
        const fragmentShader1 = `
            in vec2 vUv;
            out vec4 FragColor;

            void main() {
               FragColor = vec4(vUv.x, vUv.y, 0., 1.);
            }
            `;

        const vertexShader2 = `
            in vec3 aPosition;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            in vec2 aUv;
            out vec2 vUv;

            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
                vUv = aUv;
            }
        `;
        const fragmentShader2 = `
            in vec2 vUv;
            out vec4 FragColor;
            uniform sampler2D uTexture;

            void main() {
                FragColor = vec4(0.5, 0., 0., 1.);
                FragColor += texture(uTexture, vUv);
            }
            `;

        const material1 = new lmgl.Material(engine, {
            vertexShader: vertexShader1,
            fragmentShader: fragmentShader1,
        });

        const material2 = new lmgl.Material(engine, {
            vertexShader: vertexShader2,
            fragmentShader: fragmentShader2,
            uniforms: {
                uTexture: {
                    value: null,
                    type: lmgl.UniformsType.Texture,
                },
            },
        });

        const mesh1 = new lmgl.Mesh(engine, geometry, material1);
        const mesh2 = new lmgl.Mesh(engine, geometry, material2);
        scene.add(mesh1);
        scene.add(mesh2);

        const target = new lmgl.RenderTarget(engine, {
            width: 512,
            height: 512,
        });

        var loop = () => {
            app.renderer.setRenderTarget(target);
            app.renderer.clear();
            app.renderer.setViewPort();
            app.renderer.renderMesh(mesh1, app.camera);
            mesh1.rotation.y += 0.5;

            app.renderer.setRenderTarget(null);
            mesh2.material.uniforms.uTexture.value = target.colorBuffer;
            app.renderer.setViewPort();
            app.renderer.clear();
            app.renderer.renderMesh(mesh2, app.camera);
            window.requestAnimationFrame(loop);
        };
        loop();
    }
}

window.onload = () => {
    new Demo();
};
