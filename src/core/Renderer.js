
// WebGLIndexedBufferRenderer.js


import { GEOMETRY_TYPE, SIDE } from './constants.js'
import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'
import { Matrix4 } from '../math/Matrix4.js'
import { Matrix3 } from '../math/Matrix3.js'
import { Vector3 } from '../math/Vector3.js'

let flag = false;
export default class Renderer {
  constructor(dom, width, height) {
    const canvas = dom
    this.canvas = canvas
    this.handleResize(width, height)
    this.currentPrograme = null
    this.currentRenderTarget = null;
    this.autoClear = false;
  }

  _updateUniformMatrix(program, mesh, camera) {
    const gl = dao.getData("gl")
    camera = camera || dao.getData("camera")

    camera.updateMatrix()
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
    mesh.updateMatrix();
    // camera.updateWorldMatrix()
    // camera.updateProjectionMatrix()
    // camera.updateMatrix()

    WebGLInterface.setUniform(gl, program, "projectionMatrix", camera.projectionMatrix.elements, "m4")

    const modelViewMatrix = new Matrix4()
    modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, mesh.matrix);
    WebGLInterface.setUniform(gl, program, "modelViewMatrix", modelViewMatrix.elements, "m4")

    // const world = new Matrix4()
    WebGLInterface.setUniform(gl, program, "world", mesh.matrix.elements, "m4")

    // 法线: world -> eye
    mesh.normalMatrix.getNormalMatrix(modelViewMatrix);
    WebGLInterface.setUniform(gl, program, "normalMatrix", mesh.normalMatrix.elements, "m3")

    let _vector3 = new Vector3();
    _vector3 = _vector3.setFromMatrixPosition(camera.matrixWorld)
    // vEyePosition/cameraPosition
    WebGLInterface.setUniform(gl, program, "vEyePosition", _vector3, "v3");


    WebGLInterface.setUniform(gl, program, 'viewMatrix', camera.matrixWorldInverse.elements, "m4");

    let _tempMat3 = new Matrix3();
    _tempMat3.setFromMatrix4(camera.matrixWorldInverse).invert();
    WebGLInterface.setUniform(gl, program, 'inverseViewTransform', _tempMat3.elements, "m3");

    WebGLInterface.setUniform(gl, program, 'modelMatrix', camera.matrix.elements, "m4");
  }

  // 根据材质设置webgl状态
  _readMaterial(material) {
    const gl = dao.getData("gl")
    const { blending, depthTest, side} = material;
    const { blendingType, blendRGBASrc, blendRGBADst, blendRGB_ASrc, blendRGB_ADst } = material
    WebGLInterface.setDepthTest(gl, depthTest);
    WebGLInterface.setBlend(gl, blending, blendingType, blendRGBASrc, blendRGBADst, blendRGB_ASrc, blendRGB_ADst);
    WebGLInterface.setSide(gl, side);
  }

  renderMesh(mesh, camera) {
    const gl = dao.getData("gl")
    const { geometry, material } = mesh || {};
    if (!geometry || !material) {
      flag == false && console.error("no mesh");
      flag = true;
      return;
    }

    const program = material.program;
    WebGLInterface.useProgram(gl, program);

    // mesh.setAttributesBuffer();
    mesh.render();
    this._updateUniformMatrix(program, mesh, camera);
    material.needUpdate && material.setUniform()

    const geoType = geometry.type;
    let count = geometry.indices.length;
    count = count == 0 ? geometry.count : count;
    this._readMaterial(material);

    if (geoType == GEOMETRY_TYPE.POINTS) {
      gl.drawArrays(gl.POINTS, 0, 1);
    } else if (geoType == GEOMETRY_TYPE.TRIANGLES) {
      gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    } else if (geoType == GEOMETRY_TYPE.TRIANGLE_FAN) {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
    } else if (geoType == GEOMETRY_TYPE.LINE_LOOP) {
      gl.lineWidth(1);
      gl.drawArrays(gl.LINE_LOOP, 0, count);
    } else if (geoType == GEOMETRY_TYPE.LINES) {
      gl.lineWidth(1);
      gl.drawArrays(gl.LINES, 0, count);
    }

    // 多采样帧缓冲区
    if (this.currentRenderTarget && this.currentRenderTarget.isMultisample) {
      const { width, height } = this.currentRenderTarget
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.currentRenderTarget.multiSampleFrameBuffer);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.currentRenderTarget.normalFrameBuffer);
      gl.blitFramebuffer(0,0,width, height, 0,0,width,height,gl.COLOR_BUFFER_BIT,gl.NEAREST);
    }
    mesh.renderAfter()
  }

  getContext() {
    return this.canvas.getContext("webgl2", {
      antialias: true
    });
  }

  setVertexLength(v) {
    this.vertexLength = v
  }

  handleResize(width, height) {
    const { canvas} = this
    const ratio = window.devicePixelRatio
    canvas.width = width * ratio
    canvas.height = height * ratio;

    const camera = dao.getData("camera")
    camera && (camera.aspect = width / height);
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"
  }

  clear() {
     const gl = dao.getData("gl")
     gl.clearColor(0.2, 0.19, 0.3, 1.0);
     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  setRenderTarget(renderTarget) {
    const gl = dao.getData("gl")
    if (renderTarget) {
      if (renderTarget.isMultisample) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.multiSampleFrameBuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderTarget.renderBufferDepth);
      } else {
        renderTarget.framebuffer && gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.framebuffer);
        renderTarget.renderbuffer && gl.bindRenderbuffer(gl.RENDERBUFFER, renderTarget.renderbuffer);
        if (renderTarget.drawBuffers) {
          gl.drawBuffers(renderTarget.drawBuffers);
        }
      }

      // gl.drawBuffers(drawBuffers);
      this.currentRenderTarget = renderTarget;
    } else if (this.currentRenderTarget) {
      this.currentRenderTarget.framebuffer && gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      this.currentRenderTarget.renderbuffer && gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      this.currentRenderTarget = null;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }

  render() {
    const allMesh = dao.getData("allMesh")|| []
    this.clear()
    const gl = dao.getData("gl")
    const camera = dao.getData("camera")
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    for (let i = 0; i < allMesh.length; i++) {
      const mesh = allMesh[i]
      this.renderMesh(mesh, camera)
    }
  }
}
