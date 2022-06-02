import * as lmgl from "../../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const particleSystem = new lmgl.ParticleSystem(engine, {
        name: "test",
        capacity: 100,
        size: new lmgl.Vec2(0.5, 0.5),
    });
    particleSystem.particleTexture = new lmgl.Texture(engine, {
        url: "./public/images/snowflake2.png",
    });
    scene.add(particleSystem);
    (window as any).particleSystem = particleSystem;
}
