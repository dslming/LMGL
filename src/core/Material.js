import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'
import { SIDE, BLENDING_TYPE, BLENDING_FACTOR } from './constants.js';
import PhysicalDecorate from '../MaterialDecorate/PhysicalDecorate.js'
export class Material {
  constructor(uniform, shader) {
    let mat = Object.assign(uniform, shader || {});
    if (!uniform.uniforms) {
      // 深拷贝对象
      //  mat = JSON.parse(JSON.stringify(mat))
    }
    if (mat.type === "physical") {
      new PhysicalDecorate(mat.uniforms, this, mat.param);
    }

    this.uniformBlockIndex = 0;
    this.uniformBlockCatch = new Map();
    this.program = this._buildMaterial(mat);
    this.uniforms = mat.uniforms || {};

    this.blending = false;
    this.blendingType = BLENDING_TYPE.RGBA;
    this.blendRGBASrc = BLENDING_FACTOR.ONE;
    this.blendRGBADst = BLENDING_FACTOR.ONE;
    this.blendRGB_ASrc = BLENDING_FACTOR.SRC_ALPHA
    this.blendRGB_ADst = BLENDING_FACTOR.ONE_MINUS_SRC_ALPHA;

    this.depthTest = true;
    this.side = SIDE.FrontSide;
    // 是否需要每帧更新uniform变量
    this.needUpdate = true;
    this.setUniform();
  }

  _buildMaterial(mat) {
    const gl = dao.getData("gl")
    return WebGLInterface.createProgram(gl, mat);
  }

  _handleUniformStruct(structName, obj) {
    const gl = dao.getData("gl")
    const { program } = this

    structName = structName.charAt(0).toLowerCase() + structName.slice(1);

    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const propName = keys[i];
      const { value, type } = obj[propName]
      const fullName = `${structName}.${propName}`
      WebGLInterface.setUniform(gl, program, fullName, value, type)
    }
  }

  // 参考例子022.html
  // eg: name=pointLights, content=pointLights.value
  // uniforms = {
  //   pointLights: {
  //     type: "array",
  //     value: (2)[{…}, {…}]
  //   }
  // }
  _handleUniformArray(name, content) {
    const gl = dao.getData("gl")
    const { program } = this

    const array = content;
    for (let i = 0; i < array.length; i++) {
      let baseName = `${name}[${i}]`;
      const item = array[i];
      if (item.type == "struct") {
        const keys = Object.keys(item.value)
        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          const properties = item.value[key]
          const { value, type } = properties;
          const addrName = baseName + `.${key}`
          WebGLInterface.setUniform(gl, program, addrName, value, type)
        }
      } else {
        const addrName = baseName
        WebGLInterface.setUniform(gl, program, addrName, item.value, item.type)
      }
    }
  }

  _getUniformBlockCatch(name) {
    const gl = dao.getData("gl")
    if (!this.uniformBlockCatch.has(name)) {
      const ubb = this.uniformBlockIndex;
      const ubo = gl.createBuffer();
      this.uniformBlockCatch.set(name, {
        ubb,
        ubo
      });
      this.uniformBlockIndex += 1;
    }
    return this.uniformBlockCatch.get(name)
  }

  _getBufferData(keys, content) {
    let len = 0;
    let offset = [0];

     for (let i = 0; i < keys.length; i++) {
       const propName = keys[i];
       const { type } = content[propName]
       if (type == "f") {
         len += 4;
       }
       if (type == "v2") {
         len += 4;
       }
       if (type == "v3") {
         len += 4;
       }
       if (type == "v4") {
         len += 4;
       }
       offset.push(len);
     }
     const result = new Float32Array(len);
     for (let i = 0; i < keys.length; i++) {
       const propName = keys[i];
       const { value, type } = content[propName]
       if (type == "f") {
         result.set([0, 0, 0, value.x], offset[i])
       }
       if (type == "v2") {
         result.set([0, 0, value.x, value.y], offset[i])
       }
       if (type == "v3") {
         result.set([0, value.x, value.y, value.z], offset[i])
       }
       if (type == "v4") {
         result.set([value.x, value.y, value.z, value.w], offset[i])
       }
     }
     return result;
  }
  _handleUniformBlock(name, content) {
    const gl = dao.getData("gl")
    const { program } = this
    const ubi = gl.getUniformBlockIndex(program, name);
    const { ubb, ubo } = this._getUniformBlockCatch(name)
    gl.uniformBlockBinding(program, ubi, ubb);
    gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);

    const keys = Object.keys(content);
    const result = this._getBufferData(keys, content);

    gl.bufferData(gl.UNIFORM_BUFFER, result, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, ubb, ubo);
  }
  _handleUniform(obj) {
    const gl = dao.getData("gl")
    const { program } = this

    let textureId = 0;
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      const { value, type } = obj[name]
     if (type == "struct") {
        this._handleUniformStruct(name, value);
      } else if (type == "array") {
       this._handleUniformArray(name, value);
     } else if (type == "block") {
       this._handleUniformBlock(name, value);
     }else {
        WebGLInterface.setUniform(gl, program, name, value, type, textureId)
      }

      if (type == "t" || type === "tcube") {
        textureId += 1;
      }
    }
  }

  setUniform() {
    const { program, uniforms } = this
    const gl = dao.getData("gl");
    WebGLInterface.useProgram(gl, program);
    this._handleUniform(uniforms);
  }
}
