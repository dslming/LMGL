import * as lmgl from "../src/index";
(window as any).lmgl = lmgl;

export function getGeometry(width=10, height=10) {
    if (width == undefined) {
        width = 1;
    }
    if (height == undefined) {
        height = 1;
    }

    const vert = [-width, height, 0, -width, -height, 0, width, -height, 0, width, height, 0];
    const indices = [0, 1, 2, 2, 3, 0];
    const normal = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

    return {
        positions: vert,
        normal: normal,
        uv: [0, 1, 0, 0, 1, 0, 1, 1],
        indices: indices,
    };
}


class Demo {
    private app: any;

    constructor() {
        const canvas = document.getElementById("renderCanvas");
        const engine = new lmgl.Engine(canvas);
        const scene = new lmgl.Scene(engine);

      const model = getGeometry(2,2);


      const geoInfo = {
          indices: model.indices,
          attributes: {
              aPosition: {
                  value: model.positions,
                  itemSize: 3,
              },
          },
      };
        const geometry = new lmgl.Geometry(engine, geoInfo);

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
        FragColor = vec4(1.,0.,0.,1.);
      }
    `;
        const material = new lmgl.Material(engine, {
            vertexShader,
            fragmentShader,
        });
      const mesh = new lmgl.Mesh(engine, geometry, material);
      mesh.position.set(0, 0, 0)
        scene.add(mesh);

        const app = new lmgl.Application(engine, scene);
        app.loop();
        this.app = app;
    }
}

window.onload = () => {
  const app = new Demo();
  (window as any).lm = app;
};
