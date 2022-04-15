import { BufferStore, Engine } from "../engines";
import { Geometry } from "../geometry";
import { Vec3 } from "../maths/math.vec3";
import { Texture } from "../texture/texture";
import { Nullable } from "../types";
import { Particle } from "./particle";

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

    private _particles = new Array<Particle>();
    private _capacity: number;
    private _engine: Engine;
    private _vertexBufferSize: number;

    constructor(name: string, capacity: number, engine: Engine) {
        this.name = name;
        this._capacity = capacity;
        this._engine = engine;
        this._vertexBufferSize = 10;
    }

    _createGeometry() {
        this.geometry = new Geometry(this._engine, {
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

    public isReady(): boolean {
        if (!this.particleTexture || !this.particleTexture.isReady()) {
            return false;
        }

        return true;
    }
}
