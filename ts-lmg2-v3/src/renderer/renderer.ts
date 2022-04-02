
// WebGLIndexedBufferRenderer.js

import { Camera } from "../cameras/camera";
import { Engine } from "../engines/engine";
import { Color4 } from "../maths/math.color";
import { IColor4Like } from "../maths/math.like";
import { Mat3 } from "../maths/math.mat3";
import { Mat4 } from "../maths/math.mat4";
import { Vec3 } from "../maths/math.vec3";
import { Mesh } from "../mesh/mesh";
import { Scene } from "../scene/scene";


// import { GEOMETRY_TYPE, SIDE } from './constants.js.js'
// import dao from './Dao.js.js'
// import * as WebGLInterface from '../webgl/index.js'
// import { Matrix4 } from '../math/Matrix4.js'
// import { Matrix3 } from '../math/Matrix3.js'
// import { Vector3 } from '../math/Vector3.js'

let flag = false;
export default class Renderer {
    private _engine: Engine;
    currentPrograme: null;
    currentRenderTarget: null;
    clearColor: Color4;

    constructor(engine: Engine) {
        this._engine = engine;
        this.currentPrograme = null;
        this.currentRenderTarget = null;
        this.clearColor = new Color4(0.2, 0.19, 0.3, 1.0);
    }

    private _updateUniformMatrix(program:any, mesh:Mesh, camera:Camera) {
        // const gl = dao.getData("gl");
        // camera = camera || dao.getData("camera");

        camera.updateMatrix();
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
        mesh.updateMatrix();
        // camera.updateWorldMatrix()
        // camera.updateProjectionMatrix()
        // camera.updateMatrix()

        this._engine.engineUniform.setUniform(program, "projectionMatrix", camera.projectionMatrix.data, "m4");

        const modelViewMatrix = new Mat4();
        modelViewMatrix.mul2(camera.matrixWorldInverse, mesh.matrix);
        this._engine.engineUniform.setUniform(program, "modelViewMatrix", modelViewMatrix.data, "m4");

        // const world = new Matrix4()
        this._engine.engineUniform.setUniform(program, "world", mesh.matrix.data, "m4");

        // 法线: world -> eye
        mesh.normalMatrix.getNormalMatrix(modelViewMatrix);
        this._engine.engineUniform.setUniform(program, "normalMatrix", mesh.normalMatrix.data, "m3");

        let _vector3 = new Vec3();
        _vector3 = _vector3.setFromMatrixPosition(camera.matrixWorld);
        // vEyePosition/cameraPosition
        this._engine.engineUniform.setUniform( program, "vEyePosition", _vector3, "v3");

        this._engine.engineUniform.setUniform(program, "viewMatrix", camera.matrixWorldInverse.data, "m4");

        let _tempMat3 = new Mat3();
        _tempMat3.setFromMatrix4(camera.matrixWorldInverse).invert();
        this._engine.engineUniform.setUniform( program, "inverseViewTransform", _tempMat3.data, "m3");

        this._engine.engineUniform.setUniform(program, "modelMatrix", mesh.matrix.data, "m4");
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

    renderMesh(mesh:Mesh, camera:Camera) {
      if (mesh.visible == false) return;

      const { geometry, material } = mesh ;
      const program = material.program;

      this._engine.engineVertex.bindVertexArray(mesh.VAO);

      this._updateUniformMatrix(program, mesh, camera);
      material.needUpdate && material.setUniform();
      this._engine.engineDraw.draw({
          type: geometry.type,
          indexed: true,
        count: geometry.count,
      });
        // const geoType = geometry.type;
        // let count = geometry.indices.length;
        // let noIndex = false;
        // if (count === 0) {
        //     noIndex = true;
        // }
        // count = noIndex ? geometry.count : count;
        // this._readMaterial(material);

        // if (geoType == GEOMETRY_TYPE.POINTS) {
        //     gl.drawArrays(gl.POINTS, 0, 1);
        // } else if (geoType == GEOMETRY_TYPE.TRIANGLES && noIndex === false) {
        //     gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
        // } else if (geoType == GEOMETRY_TYPE.TRIANGLES) {
        //     gl.drawArrays(gl.TRIANGLES, 0, count);
        // } else if (geoType == GEOMETRY_TYPE.TRIANGLE_FAN) {
        //     gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
        // } else if (geoType == GEOMETRY_TYPE.LINE_LOOP) {
        //     gl.lineWidth(1);
        //     gl.drawArrays(gl.LINE_LOOP, 0, count);
        // } else if (geoType == GEOMETRY_TYPE.LINES) {
        //     gl.lineWidth(1);
        //     gl.drawArrays(gl.LINES, 0, count);
        // } else if (geoType == GEOMETRY_TYPE.LINE_STRIP) {
        //     gl.lineWidth(1);
        //     gl.drawArrays(gl.LINE_STRIP, 0, count);
        // }

        // 多采样帧缓冲区
        // if (this.currentRenderTarget && this.currentRenderTarget.isMultisample) {
        //     const { width, height } = this.currentRenderTarget;
        //     gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.currentRenderTarget.multiSampleFrameBuffer);
        //     gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.currentRenderTarget.normalFrameBuffer);
        //     gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        // }
        // mesh.renderAfter();
    }

    // getContext() {
    //     return this.canvas.getContext("webgl2", {
    //         antialias: true,
    //     });
    // }

    // setVertexLength(v) {
    //     this.vertexLength = v;
    // }



    // clear() {

    //     // const gl = dao.getData("gl");
    //     // //  gl.clearColor(0.2, 0.19, 0.3, 1.0);
    //     // // gl.clearColor(0.9254901960784314, 0.9372549019607843, 0.9529411764705882, 1.0);
    //     // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // }

    // setRenderTarget(renderTarget) {
    //     const gl = dao.getData("gl");
    //     if (renderTarget) {
    //         if (renderTarget.isMultisample) {
    //             gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.multiSampleFrameBuffer);
    //             gl.bindRenderbuffer(gl.RENDERBUFFER, renderTarget.renderBufferDepth);
    //         } else {
    //             renderTarget.framebuffer && gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.framebuffer);
    //             renderTarget.renderbuffer && gl.bindRenderbuffer(gl.RENDERBUFFER, renderTarget.renderbuffer);
    //             if (renderTarget.drawBuffers) {
    //                 gl.drawBuffers(renderTarget.drawBuffers);
    //             }
    //         }

    //         // gl.drawBuffers(drawBuffers);
    //         this.currentRenderTarget = renderTarget;
    //     } else if (this.currentRenderTarget) {
    //         this.currentRenderTarget.framebuffer && gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //         this.currentRenderTarget.renderbuffer && gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    //         this.currentRenderTarget = null;
    //         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //     } else {
    //         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //     }
    // }

    renderScene(scene:Scene, camera: Camera) {
      this._engine.engineDraw.clear(this.clearColor);
      this._engine.engineViewPort.setViewport({
          x: 0,
          y: 0,
          width: this._engine.renderingCanvas.clientWidth,
          height: this._engine.renderingCanvas.clientHeight,
      });
      for (let i = 0; i < scene.children.length; i++) {
          const mesh = scene.children[i];
          this.renderMesh(mesh, camera);
      }
    }
}
