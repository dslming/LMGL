import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const particleSystem = new lmgl.ParticleSystem("123", 10, engine);
    particleSystem.particleTexture = new lmgl.Texture(engine, {
        url: "./public/images/test.png",
    });

    scene.add(particleSystem);
    (window as any).particleSystem = particleSystem;
}
