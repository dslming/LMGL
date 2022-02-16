import { BlendMode, BlendeEquation } from "../../engines/engine.alpha";
import { CullFaceMode } from "../../engines/engine.state";
import { Logger } from "../../misc/logger";
import { Mesh } from "../mesh";

const { BLENDMODE_ONE, BLENDMODE_ZERO, BLENDMODE_SRC_ALPHA, BLENDMODE_ONE_MINUS_SRC_ALPHA, BLENDMODE_DST_COLOR, BLENDMODE_SRC_COLOR, BLENDMODE_ONE_MINUS_DST_COLOR } = BlendMode;
const { BLENDEQUATION_ADD, BLENDEQUATION_MIN, BLENDEQUATION_MAX } = BlendeEquation;

let id = 0;

export enum MaterialBlend {
  BLEND_NONE,
  BLEND_NORMAL,
  BLEND_PREMULTIPLIED,
  BLEND_ADDITIVE,
  BLEND_ADDITIVEALPHA,
  BLEND_MULTIPLICATIVE2X,
  BLEND_SCREEN,
  BLEND_MULTIPLICATIVE,
  BLEND_MIN,
  BLEND_MAX,
}

export class Material {
  name: string;
  id: number;
  _shader: any;
  variants: {};
  parameters: any;
  alphaTest: number;
  alphaToCoverage: boolean;
  blend: boolean;
  blendSrc: any;
  blendDst: any;
  blendEquation: any;
  separateAlphaBlend: boolean;
  blendSrcAlpha: any;
  blendDstAlpha: any;
  blendAlphaEquation: any;
  cull: any;
  depthTest: boolean;
  depthWrite: boolean;
  stencilFront: null;
  stencilBack: null;
  depthBias: number;
  slopeDepthBias: number;
  redWrite: boolean;
  greenWrite: boolean;
  blueWrite: boolean;
  alphaWrite: boolean;
  meshInstances: Mesh[];
  _shaderVersion: number;
  _scene: null;
  _dirtyBlend: boolean;
  dirty: boolean;

  /**
   * Create a new Material instance.
   */
  constructor() {
    this.name = "Untitled";
    this.id = id++;

    this._shader = null;
    this.variants = {};
    this.parameters = {};

    // Render states
    this.alphaTest = 0;
    this.alphaToCoverage = false;

    this.blend = false;
    this.blendSrc = BLENDMODE_ONE;
    this.blendDst = BLENDMODE_ZERO;
    this.blendEquation = BLENDEQUATION_ADD;

    this.separateAlphaBlend = false;
    this.blendSrcAlpha = BLENDMODE_ONE;
    this.blendDstAlpha = BLENDMODE_ZERO;
    this.blendAlphaEquation = BLENDEQUATION_ADD;

    this.cull = CullFaceMode.CULLFACE_BACK;

    this.depthTest = true;
    this.depthWrite = true;
    this.stencilFront = null;
    this.stencilBack = null;

    this.depthBias = 0;
    this.slopeDepthBias = 0;

    this.redWrite = true;
    this.greenWrite = true;
    this.blueWrite = true;
    this.alphaWrite = true;

    this.meshInstances = []; // The mesh instances referencing this material

    this._shaderVersion = 0;
    this._scene = null;
    this._dirtyBlend = false;

    this.dirty = true;
  }

  set shader(shader) {
    this._shader = shader;
  }

  get shader() {
    return this._shader;
  }

  // returns boolean depending on material being transparent
  get transparent() {
    return this.blend || this.blendSrc !== BLENDMODE_ONE || this.blendDst !== BLENDMODE_ZERO || this.blendEquation !== BLENDEQUATION_ADD;
  }

  set blendType(type) {
    const prevBlend = this.blend;
    switch (type) {
      case MaterialBlend.BLEND_NONE:
        this.blend = false;
        this.blendSrc = BLENDMODE_ONE;
        this.blendDst = BLENDMODE_ZERO;
        this.blendEquation = BLENDEQUATION_ADD;
        break;
      case MaterialBlend.BLEND_NORMAL:
        this.blend = true;
        this.blendSrc = BLENDMODE_SRC_ALPHA;
        this.blendDst = BLENDMODE_ONE_MINUS_SRC_ALPHA;
        this.blendEquation = BLENDEQUATION_ADD;
        break;
      case MaterialBlend.BLEND_PREMULTIPLIED:
        this.blend = true;
        this.blendSrc = BLENDMODE_ONE;
        this.blendDst = BLENDMODE_ONE_MINUS_SRC_ALPHA;
        this.blendEquation = BLENDEQUATION_ADD;
        break;
      case MaterialBlend.BLEND_ADDITIVE:
        this.blend = true;
        this.blendSrc = BLENDMODE_ONE;
        this.blendDst = BLENDMODE_ONE;
        this.blendEquation = BLENDEQUATION_ADD;
        break;
      case MaterialBlend.BLEND_ADDITIVEALPHA:
        this.blend = true;
        this.blendSrc = BLENDMODE_SRC_ALPHA;
        this.blendDst = BLENDMODE_ONE;
        this.blendEquation = BLENDEQUATION_ADD;
        break;
      case MaterialBlend.BLEND_MULTIPLICATIVE2X:
        this.blend = true;
        this.blendSrc = BLENDMODE_DST_COLOR;
        this.blendDst = BLENDMODE_SRC_COLOR;
        this.blendEquation = BLENDEQUATION_ADD;
        break;
      case MaterialBlend.BLEND_SCREEN:
        this.blend = true;
        this.blendSrc = BLENDMODE_ONE_MINUS_DST_COLOR;
        this.blendDst = BLENDMODE_ONE;
        this.blendEquation = BLENDEQUATION_ADD;
        break;
      case MaterialBlend.BLEND_MULTIPLICATIVE:
        this.blend = true;
        this.blendSrc = BLENDMODE_DST_COLOR;
        this.blendDst = BLENDMODE_ZERO;
        this.blendEquation = BLENDEQUATION_ADD;
        break;
      case MaterialBlend.BLEND_MIN:
        this.blend = true;
        this.blendSrc = BLENDMODE_ONE;
        this.blendDst = BLENDMODE_ONE;
        this.blendEquation = BLENDEQUATION_MIN;
        break;
      case MaterialBlend.BLEND_MAX:
        this.blend = true;
        this.blendSrc = BLENDMODE_ONE;
        this.blendDst = BLENDMODE_ONE;
        this.blendEquation = BLENDEQUATION_MAX;
        break;
    }
    if (prevBlend !== this.blend) {
      if (this._scene) {
        // this._scene.layers._dirtyBlend = true;
      } else {
        this._dirtyBlend = true;
      }
    }
    this._updateMeshInstanceKeys();
  }

  get blendType() {
    if (!this.transparent) {
      return MaterialBlend.BLEND_NONE;
    } else if (this.blend && this.blendSrc === BLENDMODE_SRC_ALPHA && this.blendDst === BLENDMODE_ONE_MINUS_SRC_ALPHA && this.blendEquation === BLENDEQUATION_ADD) {
      return MaterialBlend.BLEND_NORMAL;
    } else if (this.blend && this.blendSrc === BLENDMODE_ONE && this.blendDst === BLENDMODE_ONE && this.blendEquation === BLENDEQUATION_ADD) {
      return MaterialBlend.BLEND_ADDITIVE;
    } else if (this.blend && this.blendSrc === BLENDMODE_SRC_ALPHA && this.blendDst === BLENDMODE_ONE && this.blendEquation === BLENDEQUATION_ADD) {
      return MaterialBlend.BLEND_ADDITIVEALPHA;
    } else if (this.blend && this.blendSrc === BLENDMODE_DST_COLOR && this.blendDst === BLENDMODE_SRC_COLOR && this.blendEquation === BLENDEQUATION_ADD) {
      return MaterialBlend.BLEND_MULTIPLICATIVE2X;
    } else if (this.blend && this.blendSrc === BLENDMODE_ONE_MINUS_DST_COLOR && this.blendDst === BLENDMODE_ONE && this.blendEquation === BLENDEQUATION_ADD) {
      return MaterialBlend.BLEND_SCREEN;
    } else if (this.blend && this.blendSrc === BLENDMODE_ONE && this.blendDst === BLENDMODE_ONE && this.blendEquation === BLENDEQUATION_MIN) {
      return MaterialBlend.BLEND_MIN;
    } else if (this.blend && this.blendSrc === BLENDMODE_ONE && this.blendDst === BLENDMODE_ONE && this.blendEquation === BLENDEQUATION_MAX) {
      return MaterialBlend.BLEND_MAX;
    } else if (this.blend && this.blendSrc === BLENDMODE_DST_COLOR && this.blendDst === BLENDMODE_ZERO && this.blendEquation === BLENDEQUATION_ADD) {
      return MaterialBlend.BLEND_MULTIPLICATIVE;
    } else if (this.blend && this.blendSrc === BLENDMODE_ONE && this.blendDst === BLENDMODE_ONE_MINUS_SRC_ALPHA && this.blendEquation === BLENDEQUATION_ADD) {
      return MaterialBlend.BLEND_PREMULTIPLIED;
    }
    return MaterialBlend.BLEND_NORMAL;
  }

  _updateMeshInstanceKeys() {
    const meshInstances = this.meshInstances;
    for (let i = 0; i < meshInstances.length; i++) {
      meshInstances[i].updateKey();
    }
  }

  updateUniforms(device: any, scene: any) {}

  updateShader(device: any, scene: any, objDefs: any) {
    // For vanilla materials, the shader can only be set by the user
  }

  /**
   * Applies any changes made to the material's properties.
   */
  update() {
    this.dirty = true;
    if (this._shader) this._shader.failed = false;
  }

  // Parameter management
  clearParameters() {
    this.parameters = {};
  }

  getParameters() {
    return this.parameters;
  }

  clearVariants() {
    this.variants = {};
    for (let i = 0; i < this.meshInstances.length; i++) {
      const meshInstance = this.meshInstances[i];
      for (let j = 0; j < meshInstance._shader.length; j++) {
        meshInstance._shader[j] = null;
      }
    }
  }

  /**
   * Retrieves the specified shader parameter from a material.
   *
   * @param {string} name - The name of the parameter to query.
   * @returns {object} The named parameter.
   */
  getParameter(name: string) {
    return this.parameters[name];
  }

  /**
   * Sets a shader parameter on a material.
   *
   * @param {string} name - The name of the parameter to set.
   * @param {number|number[]|Texture} data - The value for the specified parameter.
   */
  setParameter(name: string | number[], data: undefined) {
    // if (data === undefined && typeof name === "object") {
    //   const uniformObject = name;
    //   if (uniformObject.length) {
    //     for (let i = 0; i < uniformObject.length; i++) {
    //       this.setParameter(uniformObject[i]);
    //     }
    //     return;
    //   }
    //   name = uniformObject.name;
    //   data = uniformObject.value;
    // }
    // const param = this.parameters[name];
    // if (param) {
    //   param.data = data;
    // } else {
    //   this.parameters[name] = {
    //     scopeId: null,
    //     data: data,
    //   };
    // }
  }

  /**
   * Deletes a shader parameter on a material.
   *
   * @param {string} name - The name of the parameter to delete.
   */
  deleteParameter(name: string | number) {
    if (this.parameters[name]) {
      delete this.parameters[name];
    }
  }

  // used to apply parameters from this material into scope of uniforms, called internally by forward-renderer
  // optional list of parameter names to be set can be specified, otherwise all parameters are set
  // setParameters(device, names) {
  //   const parameters = this.parameters;
  //   if (names === undefined) names = parameters;
  //   for (const paramName in names) {
  //     const parameter = parameters[paramName];
  //     if (parameter) {
  //       if (!parameter.scopeId) {
  //         parameter.scopeId = device.scope.resolve(paramName);
  //       }
  //       parameter.scopeId.setValue(parameter.data);
  //     }
  //   }
  // }

  /**
   * Removes this material from the scene and possibly frees up memory from its shaders (if there
   * are no other materials using it).
   */
  destroy() {
    this.variants = {};
    this.shader = null;

    for (let i = 0; i < this.meshInstances.length; i++) {
      const meshInstance = this.meshInstances[i];
      for (let j = 0; j < meshInstance._shader.length; j++) {
        meshInstance._shader[j] = null;
      }
      meshInstance._material = null;

      // if (meshInstance.mesh) {
      //   const defaultMaterial = DefaultMaterial.get(meshInstance.mesh.device);
      //   if (this !== defaultMaterial) {
      //     meshInstance.material = defaultMaterial;
      //   }
      // } else {
      //   Logger.Warn("pc.Material: MeshInstance mesh is null, default material cannot be assigned to the MeshInstance");
      // }
    }
  }

  // registers mesh instance as referencing the material
  addMeshInstanceRef(meshInstance: Mesh) {
    this.meshInstances.push(meshInstance);
  }

  // de-registers mesh instance as referencing the material
  removeMeshInstanceRef(meshInstance: Mesh) {
    const meshInstances = this.meshInstances;
    const i = meshInstances.indexOf(meshInstance);
    if (i !== -1) {
      meshInstances.splice(i, 1);
    }
  }
}
