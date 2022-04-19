import { BufferStore, Engine } from "../engines";
import { Geometry } from "../geometry";
import { Vec3 } from "../maths/math.vec3";
import { Texture } from "../texture/texture";
import { Nullable } from "../types";
import { Particle } from "./particle";

import vs from "../shaders/particles.vs";
import fs from "../shaders/particles.fs";
import { Material } from "../material";

// console.error(vs);
// console.error(fs);

/**
   // Create a particle system
    const particleSystem = new BABYLON.ParticleSystem("particles", 2000);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png");

    // Position where the particles are emitted from
    particleSystem.emitter = new BABYLON.Vector3(0, 0.5, 0);
    particleSystem.start();

    particleSystem.minSize = 0.25;
    particleSystem.maxSize = 0.25

    particleSystem.emitRate = 5;
 */

export class ParticleSystem {
    public name: string;
    public id: string;
    public geometry: Geometry;
    /**
     * You can use gravity if you want to give an orientation to your particles.
     */
    public gravity = Vec3.Zero();
    /**
     * The texture used to render each particle. (this can be a spritesheet)
     */
    public particleTexture: Nullable<Texture>;
    public visible: boolean;
    public material: Nullable<Material>;

    private _particles = new Array<Particle>();
    private _capacity: number;
    private _engine: Engine;
    private _vertexBufferSize: number;
    public emitRate: number;
    private _stockParticles = new Array<Particle>();

    constructor(name: string, capacity: number, engine: Engine) {
        this.name = name;
        this._capacity = capacity;
        this._engine = engine;
        this._vertexBufferSize = 10;
        this.visible = true;
        this.material = null;
        this.emitRate = 1;
    }

    public getClassName(): string {
        return "ParticleSystem";
    }

    public isReady(): boolean {
        if (!this.particleTexture || !this.particleTexture.isReady()) {
            return false;
        }

        if (!this.material) {
            this.material = new Material(this._engine, {
                fragmentShader: fs,
                vertexShader: vs,
            });
        }

        if (!this.geometry) {
            this.geometry = new Geometry(this._engine, {
                instancing: true,
                attributes: [
                    {
                        name: "aPosition",
                        value: new Float32Array(this._vertexBufferSize * this._capacity),
                        itemSize: 3,
                        usage: BufferStore.BUFFER_DYNAMIC,
                    },
                ],
            });
        }
        return true;
    }

    updateFunction(particles: Particle[]) {
        let scaledUpdateSpeed = 0.1;

        for (var index = 0; index < particles.length; index++) {
            var particle = particles[index];
            particle.age += scaledUpdateSpeed;

            // Evaluate step to death
            if (particle.age > particle.lifeTime) {
                particle.age = particle.lifeTime;
                this.recycleParticle(particle);
            }
        }
    }

    /**
     * "Recycles" one of the particle by copying it back to the "stock" of particles and removing it from the active list.
     * Its lifetime will start back at 0.
     */
    public recycleParticle: (particle: Particle) => void = particle => {
        // move particle from activeParticle list to stock particles
        // var lastParticle = <Particle>this._particles.pop();
        // if (lastParticle !== particle) {
        //     lastParticle.copyTo(particle);
        // }
        this._stockParticles.push(particle);
    };

    private _createParticle: () => Particle = () => {
        var particle: Particle;
        // if (this._stockParticles.length !== 0) {
        //     particle = <Particle>this._stockParticles.pop();
        //     particle.reset();
        // } else {
        // }
        particle = new Particle(this);
        return particle;
    };

    private _update(newParticles: number) {
        this.updateFunction(this._particles);

        var particle: Particle;
        for (var index = 0; index < newParticles; index++) {
            if (this._particles.length === this._capacity) {
                break;
            }

            particle = this._createParticle();

            this._particles.push(particle);
        }
    }

    public animate() {
        if (!this.isReady()) {
            return;
        }

        let rate = this.emitRate;
        let newParticles = 1;
        this._update(newParticles);
    }

    render(): number {
        // Check
        if (!this.isReady() || !this._particles.length) {
            return 0;
        }
        return 0;
    }

    start() {}
}
