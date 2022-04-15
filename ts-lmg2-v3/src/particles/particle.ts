import { Color4 } from "../maths/math.color";
import { Vec2 } from "../maths/math.vec2";
import { Vec3 } from "../maths/math.vec3";
import { ParticleSystem } from "./particle.system";

export class Particle {
    public particleSystem: ParticleSystem;
    public id: number;
    public position = Vec3.Zero();
    public direction = Vec3.Zero();
    public color = new Color4(0, 0, 0, 0);
    public colorStep = new Color4(0, 0, 0, 0);
    public lifeTime = 1.0;
    public age = 0;
    public size = 0;
    public scale = new Vec2(1, 1);

    constructor(particleSystem: ParticleSystem) {
        this.particleSystem = particleSystem;
    }
}
