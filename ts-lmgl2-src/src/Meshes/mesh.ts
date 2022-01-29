import { Material } from "../Materials/material";
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

export class Mesh extends TransformNode{
  // 没有顶点索引
  public _unIndexed = false;
  public material: Nullable<Material>;
  public _internalAbstractMeshDataInfo = new _InternalAbstractMeshDataInfo();
  public _internalMeshDataInfo = new _InternalMeshDataInfo();
  // meshGeometry: MeshGeometry;
  private _geometry: Geometry;

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
    // vertexData._applyTo(this.meshGeometry, false);
  }
}
