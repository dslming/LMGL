import * as lmgl from "../src/index";
(window as any).lmgl = lmgl;

class Demo {
    private app: any;

    constructor() {
        const canvas = document.getElementById("renderCanvas");
        const engine = new lmgl.Engine(canvas);
        const scene = new lmgl.Scene(engine);

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

        const vertexShader = `
      in vec3 aPosition;
      in vec2 aUv;
      in vec4 aColor;
      out vec2 vUv;
      out vec4 vColor;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;

      void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
      vColor = aColor;
      vUv = aUv;
      }
    `;
        const fragmentShader = `
      in vec2 vUv;
      out vec4 FragColor;
      uniform sampler2D uTexture;

      struct Light0 {
        vec4 diffuse;
        vec4 specular;
      };

    //   uniform float Colors[2];
      uniform Light0 LightArr[1];


      void main() {
        // FragColor = vec4(vUv.x,vUv.y,0.,1.);
        // FragColor = texture(uTexture, vUv);
        // FragColor = texture(uTexture, vec2(vUv.x, vUv.y));
        // FragColor.r += light0.diffuse.r;
        // FragColor.g += light0.specular.g;

        // FragColor = vec4(Colors[0],Colors[1],0.,1.);
        // FragColor = vec4(Colors[0],Colors[1],0.,1.);
        //    FragColor = LightArr[0].diffuse;
        FragColor = LightArr[0].specular + LightArr[0].diffuse;

      }
    `;
        const material = new lmgl.Material(engine, {
            vertexShader,
            fragmentShader,
            uniforms: {
                uTexture: {
                    value: null,
                    type: lmgl.UniformsType.Texture,
                },

                LightArr: {
                    type: lmgl.UniformsType.Array,
                    value: [
                        {
                            type: lmgl.UniformsType.Struct,
                            value: {
                                diffuse: {
                                    type: lmgl.UniformsType.Vector4,
                                    value: { x: 0, y: 1, z: 0, w: 1 },
                                },
                                specular: {
                                    type: lmgl.UniformsType.Vector4,
                                    value: { x: 1, y: 0, z: 0, w: 1 },
                                },
                            },
                        },
                    ],
                },
            },
        });
        const mesh1 = new lmgl.Mesh(engine, geometry, material);
        mesh1.position.set(-3, 0, 0);
        mesh1.name = "1";
        scene.add(mesh1);

        const mesh2 = new lmgl.Mesh(engine, geometry, material.clone());
        mesh2.position.set(3, 0, 0);
        mesh2.name = "2";
        scene.add(mesh2);

        new lmgl.TextureLoader(engine).load("./public/images/test.png").then(texture => {
            mesh1.material.uniforms.uTexture.value = texture;
        });

        new lmgl.TextureLoader(engine).load("./public/images/book.png").then(texture => {
            mesh2.material.uniforms.uTexture.value = texture;
        });
        const app = new lmgl.Application(engine, scene);
        app.loop();

        this.app = app;
        (window as any).lm = app;
    }
}

window.onload = () => {
    new Demo();
};
