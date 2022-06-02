import { BlendType, BufferStore, Engine, PrimitiveType, UniformsType } from "../engines";
import { Geometry } from "../geometry";
import { Vec3 } from "../maths/math.vec3";
import { Texture } from "../texture/texture";
import { Nullable } from "../types";
import { Particle } from "./particle";

import vs from "../shaders/chunks/particles.vert";
import fs from "../shaders/chunks/particles.frag";
import { Material } from "../material";
import { Mesh } from "../mesh";
import { Vec2 } from "../maths";
import { iGeometryAttribute } from "../geometry/vertex-array-buffer";

export interface iParticleOptions {
    name?: string;
    capacity: number;
    size?: Vec2;
}
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
    public mesh: Mesh;
    public size: Vec2;

    constructor(engine: Engine, options: iParticleOptions) {
        this.name = options.name !== undefined ? options.name : "default";
        this._capacity = options.capacity !== undefined ? options.capacity : 200;
        this.size = options.size !== undefined ? options.size : new Vec2(1, 1);
        this._engine = engine;
        // this._vertexBufferSize = 10;
        this.visible = true;
        this.material = null;
        this.emitRate = 1;
    }

    public getClassName(): string {
        return "ParticleSystem";
    }

    public isReady(): boolean {
        if (!this.particleTexture || !this.particleTexture.needsUpload) {
            return false;
        }

        if (!this.material) {
            this.material = new Material(this._engine, {
                fragmentShader: fs,
                vertexShader: vs,
                uniforms: {
                    uSize: { type: UniformsType.Vec2, value: this.size },
                    uTexture: { type: UniformsType.Texture, value: this.particleTexture },
                },
            });
            this.material.blendType = BlendType.BLEND_ADDITIVEALPHA;
        }

        if (!this.geometry) {
            this.geometry = new Geometry(this._engine, {
                instanceCount: this._capacity,
                attributes: [
                    {
                        name: "position",
                        value: [-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0],
                        itemSize: 3,
                        usage: BufferStore.BUFFER_DYNAMIC,
                    },
                    {
                        name: "aUv",
                        value: [0, 0, 0, 1, 1, 1, 0, 1],
                        itemSize: 2,
                    },
                    {
                        name: "offsets",
                        value: new Array(3 * this._capacity).fill(0),
                        itemSize: 3,
                        usage: BufferStore.BUFFER_DYNAMIC,
                        divisor: 1,
                    },
                ],
                drawType: PrimitiveType.PRIMITIVE_TRIFAN,
            });
        }

        if (!this.mesh) {
            this.mesh = new Mesh(this._engine, this.geometry, this.material);
        }
        return true;
    }

    private _setAttributeXYZ(name: string, index: number, value: Vec3) {
        if (!this.isReady()) return;

        const attribute: iGeometryAttribute = this.mesh.geometry.getAttribute(name);
        index *= attribute.itemSize as any;

        attribute.value[index + 0] = value.x;
        attribute.value[index + 1] = value.y;
        attribute.value[index + 2] = value.z;
        this.mesh.geometry.updateAttribure(name);
    }

    updateFunction(particles: Particle[]) {
        let scaledUpdateSpeed = 0.1;

        for (var index = 0; index < particles.length; index++) {
            var particle = particles[index];
            particle.age += scaledUpdateSpeed;
            particle.position.y += 0.01;

            if (particle.position.y > 10) {
                particle.position.y = -5;
            }

            // Evaluate step to death
            // if (particle.age > particle.lifeTime) {
            //     particle.age = particle.lifeTime;
            //     this.recycleParticle(particle);
            // }
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
        particle.position.x = Math.random() * 20 - 10;
        particle.position.y = -Math.random() * 10;
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

        // let rate = this.emitRate;
        let newParticles = 1;
        this._update(newParticles);
        this._particles.forEach((item, index) => {
            this._setAttributeXYZ("offsets", index, item.position);
        });
    }

    // render(): number {
    //     // Check
    //     if (!this.isReady() || !this._particles.length) {
    //         return 0;
    //     }
    //     return 0;
    // }

    // start() {}
}
