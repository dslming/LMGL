// WebGLIndexedBufferRenderer.js

import { Camera } from "../cameras/camera";
import { Engine } from "../engines/engine";
import { UniformsType } from "../engines/engine.enum";
import { Material } from "../material";
import { Color4 } from "../maths/math.color";
import { Mat4 } from "../maths/math.mat4";
import { Mesh } from "../mesh/mesh";
import { ParticleSystem } from "../particles";
import { Scene } from "../scene/scene";
import { RenderTarget } from "./render.target";

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

        this._engine.engineUniform.setUniform(program, "projectionMatrix", camera.projectionMatrix.data, UniformsType.Mat4);

        const modelViewMatrix = new Mat4();
        modelViewMatrix.mul2(camera.matrixWorldInverse, mesh.matrix);
        this._engine.engineUniform.setUniform(program, "modelViewMatrix", modelViewMatrix.data, UniformsType.Mat4);

        this._engine.engineUniform.setUniform(program, "world", mesh.matrix.data, UniformsType.Mat4);

        // 法线: world -> eye
        mesh.normalMatrix.getNormalMatrix(modelViewMatrix);
        this._engine.engineUniform.setUniform(program, "normalMatrix", mesh.normalMatrix.data, UniformsType.Mat4);

        this._engine.engineUniform.setUniform(program, "modelMatrix", mesh.matrix.data, UniformsType.Mat4);

        // 与mesh无关的uniform变量
        this._engine.engineUniform.setSystemUniform(program, camera);
    }

    // 根据材质设置webgl状态
    private _readMaterial(material: Material) {
        this._engine.engineState.setBlending(material.blend);
        if (material.blend) {
            if (material.separateAlphaBlend) {
                this._engine.engineState.setBlendFunctionSeparate(material.blendSrc, material.blendDst, material.blendSrcAlpha, material.blendDstAlpha);
                this._engine.engineState.setBlendEquationSeparate(material.blendEquation, material.blendAlphaEquation);
            } else {
                this._engine.engineState.setBlendFunction(material.blendSrc, material.blendDst);
                this._engine.engineState.setBlendEquation(material.blendEquation);
            }
        }
        this._engine.engineState.setCullMode(material.cull);
        this._engine.engineState.setDepthWrite(material.depthWrite);
        this._engine.engineState.setDepthFunc(material.depthFunc);
        this._engine.engineState.setDepthTest(material.depthTest);
    }

    renderMesh(mesh: Mesh, camera: Camera) {
        if (mesh.visible == false) return;
        if (!mesh.material.isReady()) return;
        const { geometry, material } = mesh;
        const program = material.program;

        mesh.setBuffers();
        this._setMeshUniform(program, mesh, camera);
        this._readMaterial(material);
        this._engine.engineDraw.draw(geometry.getDrawInfo());
    }

    setRenderTarget(target: RenderTarget | null) {
        this._target = target;
        this._engine.engineRenderTarget.setRenderTarget(target);
    }

    clear() {
        this._engine.engineState.clear({
            color: this.clearColor,
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
            height: height,
        });
    }

    renderScene(scene: Scene, camera: Camera) {
        this.clear();
        this.viewport();

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

        // const { geometry, material } = particleSystem;
        // const program = material.program;

        // particleSystem.setBuffers();
        // this._setMeshUniform(program, particleSystem, camera);
        // this._readMaterial(material);
        // this._engine.engineDraw.draw(geometry.getDrawInfo());
    }
}
