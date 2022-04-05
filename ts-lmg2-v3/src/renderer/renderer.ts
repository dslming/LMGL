// WebGLIndexedBufferRenderer.js

import { Camera } from "../cameras/camera";
import { Engine } from "../engines/engine";
import { UniformsType } from "../engines/engine.enum";
import { Color4 } from "../maths/math.color";
import { IColor4Like } from "../maths/math.like";
import { Mat3 } from "../maths/math.mat3";
import { Mat4 } from "../maths/math.mat4";
import { Vec3 } from "../maths/math.vec3";
import { Mesh } from "../mesh/mesh";
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
    private _updateSystemUniform(program: any, mesh: Mesh, camera: Camera) {
        camera.updateMatrix();
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
        mesh.updateMatrix();

        this._engine.engineUniform.setUniform(program, "projectionMatrix", camera.projectionMatrix.data, UniformsType.Matrix4);

        const modelViewMatrix = new Mat4();
        modelViewMatrix.mul2(camera.matrixWorldInverse, mesh.matrix);
        this._engine.engineUniform.setUniform(program, "modelViewMatrix", modelViewMatrix.data, UniformsType.Matrix4);

        this._engine.engineUniform.setUniform(program, "world", mesh.matrix.data, UniformsType.Matrix4);

        // 法线: world -> eye
        mesh.normalMatrix.getNormalMatrix(modelViewMatrix);
        this._engine.engineUniform.setUniform(program, "normalMatrix", mesh.normalMatrix.data, UniformsType.Matrix4);

        let _vector3 = new Vec3();
        _vector3 = _vector3.setFromMatrixPosition(camera.matrixWorld);
        // vEyePosition/cameraPosition
        this._engine.engineUniform.setUniform(program, "vEyePosition", _vector3, UniformsType.Vector3);

        this._engine.engineUniform.setUniform(program, "viewMatrix", camera.matrixWorldInverse.data, UniformsType.Matrix4);

        let _tempMat3 = new Mat3();
        _tempMat3.setFromMatrix4(camera.matrixWorldInverse).invert();
        this._engine.engineUniform.setUniform(program, "inverseViewTransform", _tempMat3.data, UniformsType.Matrix3);

        this._engine.engineUniform.setUniform(program, "modelMatrix", mesh.matrix.data, UniformsType.Matrix4);
    }

    // 根据材质设置webgl状态
    // _readMaterial(material) {
    //     const gl = dao.getData("gl");
    //     const { blending, depthTest, side } = material;
    //     const { blendingType, blendRGBASrc, blendRGBADst, blendRGB_ASrc, blendRGB_ADst } = material;
    //     WebGLInterface.setDepthTest(gl, depthTest);
    //     WebGLInterface.setBlend(gl, blending, blendingType, blendRGBASrc, blendRGBADst, blendRGB_ASrc, blendRGB_ADst);
    //     WebGLInterface.setSide(gl, side);
    //     WebGLInterface.cullFace(gl, false);
    // }

    renderMesh(mesh: Mesh, camera: Camera) {
        if (mesh.visible == false) return;

        const { geometry, material } = mesh;
        const { geometryInfo } = geometry;
        const program = material.program;

        mesh.active();
        this._updateSystemUniform(program, mesh, camera);

        this._engine.engineDraw.draw({
            type: geometryInfo.type,
            indexed: geometryInfo.indices,
            count: geometryInfo.count,
        });

        // 多采样帧缓冲区
        // if (this.currentRenderTarget && this.currentRenderTarget.isMultisample) {
        //     const { width, height } = this.currentRenderTarget;
        //     gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.currentRenderTarget.multiSampleFrameBuffer);
        //     gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.currentRenderTarget.normalFrameBuffer);
        //     gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        // }
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
        for (let i = 0; i < scene.children.length; i++) {
            const mesh = scene.children[i];
            this.renderMesh(mesh, camera);
        }
    }
}
