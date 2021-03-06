// WebGLIndexedBufferRenderer.js

import {Camera} from "../cameras/camera";
import {Engine} from "../engines/engine";
import {UniformsType} from "../engines/engine.enum";
import {Material} from "../material";
import {Color4} from "../maths/math.color";
import {Mat4} from "../maths/math.mat4";
import {Mesh} from "../mesh/mesh";
import {ParticleSystem} from "../particles";
import {Scene} from "../scene/scene";
import {RenderTarget} from "./render.target";

export default class Renderer {
    private _engine: Engine;
    currentPrograme: null;
    currentRenderTarget: null;
    clearColor: Color4;
    private _target: RenderTarget | null;

    constructor(engine: Engine) {
        this._engine = engine;
        this.currentPrograme = null;
        this.currentRenderTarget = null;
        this.clearColor = new Color4(0.2, 0.19, 0.3, 1.0);
    }

    /**
     * 更新内置的uniform
     * @param program
     * @param mesh
     * @param camera
     */
    private _setMeshUniform(program: any, mesh: Mesh, camera: Camera) {
        camera.updateMatrix();
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
        mesh.updateMatrix();

        this._engine.engineUniform.setUniform(program, "matrix_projection", camera.projectionMatrix.data, UniformsType.Mat4);

        // const modelViewMatrix = new Mat4();
        // modelViewMatrix.mul2(camera.matrixWorldInverse, mesh.matrix);
        // this._engine.engineUniform.setUniform(program, "modelViewMatrix", modelViewMatrix.data, UniformsType.Mat4);
        this._engine.engineUniform.setUniform(program, "matrix_model", mesh.matrix.data, UniformsType.Mat4);
        this._engine.engineUniform.setUniform(program, "matrix_view", camera.matrixWorldInverse.data, UniformsType.Mat4);

        // this._engine.engineUniform.setUniform(program, "world", mesh.matrix.data, UniformsType.Mat4);

        // 法线: world -> eye
        // mesh.normalMatrix.getNormalMatrix(modelViewMatrix);
        // this._engine.engineUniform.setUniform(program, "normalMatrix", mesh.normalMatrix.data, UniformsType.Mat4);

        // this._engine.engineUniform.setUniform(program, "modelMatrix", mesh.matrix.data, UniformsType.Mat4);

        // 与mesh无关的uniform变量
        this._engine.engineUniform.setSystemUniform(program, camera);
    }

    renderMesh(mesh: Mesh, camera: Camera) {
        if (mesh.visible == false) return;
        if (!mesh.material.program) return;
        const {geometry, material} = mesh;
        const program = material.program;

        mesh.setBuffers();

        this._engine.enginePrograms.useProgram(program);
        this._setMeshUniform(program, mesh, camera);
        material.setUniform();
        this._engine.engineDraw.readMaterial(material);
        this._engine.engineDraw.draw(geometry.getDrawInfo());
    }

    setRenderTarget(target: RenderTarget | null) {
        this._target = target;
        this._engine.engineRenderTarget.setRenderTarget(target);
        this._engine.engineRenderTarget.updateBegin();
    }

    clear() {
        this._engine.engineState.clear({
            color: this.clearColor
        });
    }

    viewport() {
        let width = this._engine.renderingCanvas.clientWidth;
        let height = this._engine.renderingCanvas.clientHeight;

        if (this._target) {
            width = this._target.width;
            height = this._target.height;
        }

        this._engine.engineViewPort.setViewport({
            x: 0,
            y: 0,
            width,
            height
        });
    }

    renderScene(scene: Scene, camera: Camera) {
        this.clear();
        this.viewport();
        this._engine.engineRenderTarget.updateBegin();
        for (let i = 0; i < scene.childrenMesh.length; i++) {
            const child: Mesh = scene.childrenMesh[i];
            this.renderMesh(child, camera);
        }

        for (let i = 0; i < scene.childrenParticleSystem.length; i++) {
            const child: ParticleSystem = scene.childrenParticleSystem[i];
            this.renderParticleSystem(child, camera);
        }
    }

    renderParticleSystem(particleSystem: ParticleSystem, camera: Camera) {
        if (particleSystem.visible == false) return;
        if (!particleSystem.isReady()) return;

        const {geometry, material} = particleSystem.mesh;
        const program = material.program;

        particleSystem.mesh.setBuffers();
        this._setMeshUniform(program, particleSystem.mesh, camera);
        this._engine.engineDraw.readMaterial(material);
        this._engine.engineDraw.draw(geometry.getDrawInfo());
    }
}
