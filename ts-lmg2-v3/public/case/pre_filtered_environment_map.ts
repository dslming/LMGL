import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;

    // prettier-ignore
    const envLighting = new lmgl.EnvLighting(app);

    envLighting.gen({
        urls: [
            "public/images/pisa/px.png",
            "public/images/pisa/nx.png",
            "public/images/pisa/py.png",
            "public/images/pisa/ny.png",
            "public/images/pisa/pz.png",
            "public/images/pisa/nz.png"
        ],
        cb: (res: any) => {
            // app.engine.engineRenderTarget.setRenderTarget(null);
            // app.engine.engineTexture.unbindTexture(res.glTarget);
            const mesh = new lmgl.MeshSkybox(engine, {
                cubeMap: res
            }).mesh;
            mesh.name = "skyBox";
            scene.add(mesh);
            app.addUpdate("loop", () => {
                // if (envLighting.isReady) {
                //     // plane.material.uniforms.uTexture.value = envLighting.result;
                    // app.renderer.renderScene(scene, app.camera);
                // }
                app.renderer.renderScene(scene, app.camera);
                // app.renderer.renderMesh(mesh,app.camera)
            });
         }
    });



    // const plane = getPlane(engine, scene, app);

    // app.addUpdate("loop", () => {
    //     if (envLighting.isReady) {
    //         // plane.material.uniforms.uTexture.value = envLighting.result;
    //         // app.renderer.renderScene(scene, app.camera);
    //     }
    // });
}
