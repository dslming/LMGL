import { Effect } from "../Materials/effect";
import { Material } from "../Materials/material";
import { Matrix } from "../Maths/math";
import { Observable } from "../Misc/observable";
import { Scene } from "../Scene/scene";
import { Nullable } from "../types";
import { Geometry } from "./geometry";
import { iGeometryBuilder } from "./GeometryBuilders/iGeometryBuilder";
// import { MeshGeometry } from "./mesh.geometry";
import { TransformNode } from "./transformNode";
import { VertexData } from "./vertexData";

class _InternalAbstractMeshDataInfo {
  public _hasVertexAlpha = false;
  public _useVertexColors = true;
  public _numBoneInfluencers = 4;
  public _applyFog = true;
  public _receiveShadows = false;
  // public _facetData = new _FacetDataStorage();
  public _visibility = 1.0;
  // public _skeleton: Nullable<Skeleton> = null;
  public _layerMask: number = 0x0fffffff;
  public _computeBonesUsingShaders = true;
  public _isActive = false;
  public _onlyForInstances = false;
  public _isActiveIntermediate = false;
  public _onlyForInstancesIntermediate = false;
  public _actAsRegularMesh = false;
  // public _currentLOD: Nullable<AbstractMesh> = null;
  // public _currentLODIsUpToDate: boolean = false;
}

export class _InternalMeshDataInfo {
  // Events
  public _onBeforeRenderObservable: Nullable<Observable<Mesh>>;
  public _onBeforeBindObservable: Nullable<Observable<Mesh>>;
  public _onAfterRenderObservable: Nullable<Observable<Mesh>>;
  public _onBeforeDrawObservable: Nullable<Observable<Mesh>>;

  public _areNormalsFrozen: boolean = false; // Will be used by ribbons mainly
  public _sourcePositions: Float32Array; // Will be used to save original positions when using software skinning
  public _sourceNormals: Float32Array; // Will be used to save original normals when using software skinning

  // Will be used to save a source mesh reference, If any
  public _source: Nullable<Mesh> = null;
  // Will be used to for fast cloned mesh lookup
  public meshMap: Nullable<{ [id: string]: Mesh | undefined }> = null;

  public _preActivateId: number = -1;
}

export class Mesh extends TransformNode {
  public verticesStart: number;
  /** vertices count */
  public verticesCount: number;
  /** index start */
  public indexStart: number;
  public indexCount: number;

  isVisible: boolean = true;
  // 没有顶点索引
  public _unIndexed = false;
  public material: Nullable<Material>;
  public _internalAbstractMeshDataInfo = new _InternalAbstractMeshDataInfo();
  public _internalMeshDataInfo = new _InternalMeshDataInfo();
  // meshGeometry: MeshGeometry;
  public _geometry: Geometry;
  private _renderId: number;

  /**
   * Gets or sets mesh visibility between 0 and 1 (default is 1)
   */
  public get visibility(): number {
    return this._internalAbstractMeshDataInfo._visibility;
  }

  /**
   * Gets or sets mesh visibility between 0 and 1 (default is 1)
   */
  public set visibility(value: number) {
    if (this._internalAbstractMeshDataInfo._visibility === value) {
      return;
    }

    this._internalAbstractMeshDataInfo._visibility = value;
    // this._markSubMeshesAsMiscDirty();
  }

  /** Gets or sets a boolean indicating that this mesh contains vertex color data with alpha values */
  public get hasVertexAlpha(): boolean {
    return this._internalAbstractMeshDataInfo._hasVertexAlpha;
  }

  public _activate(renderId: number, intermediateRendering: boolean): boolean {
    this._renderId = renderId;
    return true;
  }

  public set hasVertexAlpha(value: boolean) {
    if (this._internalAbstractMeshDataInfo._hasVertexAlpha === value) {
      return;
    }

    this._internalAbstractMeshDataInfo._hasVertexAlpha = value;
    // this._markSubMeshesAsAttributesDirty();
    // this._markSubMeshesAsMiscDirty();
  }

  // private _markSubMeshesAsDirty(func: (defines: MaterialDefines) => void) {
  //   if (!this.subMeshes) {
  //     return;
  //   }

  //   for (var subMesh of this.subMeshes) {
  //     if (subMesh._materialDefines) {
  //       func(subMesh._materialDefines);
  //     }
  //   }
  // }

  // public _markSubMeshesAsMiscDirty() {
  //   this._markSubMeshesAsDirty((defines) => defines.markAsMiscDirty());
  // }

  constructor(name: string, scene: Scene, geometryData: iGeometryBuilder) {
    super(name, scene);

    var vertexData = new VertexData();
    vertexData.indices = geometryData.indices;
    vertexData.positions = geometryData.position;
    vertexData.normals = geometryData.normal;
    vertexData.uvs = geometryData.uv;

    // this.meshGeometry = new MeshGeometry(this);
    this._geometry = new Geometry(Geometry.RandomId(), scene, vertexData, false, this);
    this.getVertexInfo(false);

    scene.sceneNode.addMesh(this);
    // vertexData._applyTo(this.meshGeometry, false);
  }

  getMaterial() {
    return this.material;
  }

  /**
   * ref: _createGlobalSubMesh
   */
  private getVertexInfo(force: boolean): any {
    var totalVertices = this._geometry.getTotalVertices();
    if (!totalVertices || !this._geometry.getIndices()) {
      return null;
    }

    let ib = this._geometry.getIndices();
    if (!ib) {
      return null;
    }
    var totalIndices = ib.length;
    this.verticesStart = 0;
    this.verticesCount = totalVertices;
    this.indexStart = 0;
    this.indexCount = totalIndices;
    // this
  }

  render(): Mesh {
    var scene = this.getScene();

    // Checking geometry state
    if (!this._geometry || !this._geometry.getVertexBuffers() || (!this._unIndexed && !this._geometry.getIndexBuffer())) {
      return this;
    }
    var engine = scene.getEngine();
    let material = this.getMaterial();
    if (!material) {
      return this;
    }
    if (material._storeEffectOnSubMeshes) {
      if (!material.isReadyForSubMesh(this, false)) {
        return this;
      }
    } else if (!material.isReady(this, false)) {
      return this;
    }

    // Alpha mode
    const enableAlphaMode = true;
    if (enableAlphaMode && material) {
      engine.engineAlpha.setAlphaMode(material.alphaMode);
    }

    const effect: Nullable<Effect> = material.getEffect();
    if (!effect) return this;

    const fillMode = material.fillMode;
    this._bindGeometry(effect, fillMode);

    const world = this.getWorldMatrix();
    if (material._storeEffectOnSubMeshes) {
      material.bindForSubMesh(world, this);
    } else {
      // bind ubo
      material.bind(world, this);
    }

    this._processRendering(this, effect, fillMode, false, this._onBeforeDraw, material);
    return this;
  }

  private _onBeforeDraw(isInstance: boolean, world: Matrix, effectiveMaterial?: Material): void {
    if (isInstance && effectiveMaterial) {
      effectiveMaterial.bindOnlyWorldMatrix(world);
    }
  }

  private _bindGeometry(effect: Effect, fillMode: number): Mesh {
    if (!this._geometry) {
      return this;
    }

    var engine = this.getScene().getEngine();

    // Wireframe
    var indexToBind;

    if (this._unIndexed) {
      indexToBind = null;
    } else {
      switch (fillMode) {
        case Material.PointFillMode:
          indexToBind = null;
          break;
        case Material.WireFrameFillMode:
          // indexToBind = subMesh._getLinesIndexBuffer(<IndicesArray>this.getIndices(), engine);
          break;
        default:
        case Material.TriangleFillMode:
          indexToBind = this._geometry.getIndexBuffer();
          break;
      }
    }

    // VBOs
    this._geometry._bind(effect, indexToBind);
    return this;
  }

  public _processRendering(
    renderingMesh: Mesh,
    effect: Effect,
    fillMode: number,
    hardwareInstancedRendering: boolean,
    onBeforeDraw: (isInstance: boolean, world: Matrix, effectiveMaterial?: Material) => void,
    effectiveMaterial?: Material
  ): Mesh {
    var scene = this.getScene();
    var engine = scene.getEngine();

    if (onBeforeDraw) {
      onBeforeDraw(false, renderingMesh.getWorldMatrix(), effectiveMaterial);
    }
    this._draw(this, fillMode);
    // scene.sceneRender._activeIndices.addCount(subMesh.indexCount * instanceCount, false);

    return this;
  }

  public _draw(subMesh: Mesh, fillMode: number, instancesCount?: number): Mesh {
    if (!this._geometry || !this._geometry.getVertexBuffers() || (!this._unIndexed && !this._geometry.getIndexBuffer())) {
      return this;
    }

    if (this._internalMeshDataInfo._onBeforeDrawObservable) {
      this._internalMeshDataInfo._onBeforeDrawObservable.notifyObservers(this);
    }

    let scene = this.getScene();
    let engine = scene.getEngine();

    if (this._unIndexed || fillMode == Material.PointFillMode) {
      // or triangles as points
      // engine.engineDraw.drawArraysType(fillMode, subMesh.verticesStart, subMesh.verticesCount, instancesCount);
    } else if (fillMode == Material.WireFrameFillMode) {
      // Triangles as wireframe
      // engine.engineDraw.drawElementsType(fillMode, 0, subMesh._linesIndexCount, instancesCount);
    } else {
      engine.engineDraw.drawElementsType(fillMode, subMesh.indexStart, subMesh.indexCount, instancesCount);
    }

    return this;
  }
}
