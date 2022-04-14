import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const spriteGreen = new lmgl.MeshSprite(engine, {
        color: { r: 0, g: 0.5, b: 0, a: 1 },
    }).mesh;
    spriteGreen.position.x += 1;
    // spriteGreen.material.depthTest = false;
    scene.add(spriteGreen);

    const spriteRed = new lmgl.MeshSprite(engine, {
        color: { r: 0.5, g: 0.0, b: 0, a: 1 },
    }).mesh;
    spriteRed.position.x -= 1;
    // spriteRed.material.depthTest = false;
    scene.add(spriteRed);

    app.autoRender = false;

    setInterval(() => {
        app.renderer.renderMesh(spriteGreen, app.camera);
        app.renderer.renderMesh(spriteRed, app.camera);
    }, 1);
}
