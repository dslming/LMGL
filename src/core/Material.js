import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'
import { SIDE, BLENDING_TYPE, BLENDING_FACTOR } from './constants.js'
export class Material {
  constructor(uniform, shader) {
    let mat = Object.assign(uniform, shader || {});
    if (!uniform.uniforms) {
      // 深拷贝对象
      //  mat = JSON.parse(JSON.stringify(mat))
    }


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
      } else {
        WebGLInterface.setUniform(gl, program, name, value, type, textureId)
      }

      if (type == "t") {
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
