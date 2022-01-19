import { Nullable, IndicesArray, DeepImmutable, FloatArray } from "../types";
import { Matrix, Vector3 } from "../Maths/math.vector";
import { Engine } from "../Engine/engine";
import { VertexBuffer } from "./vertexBuffer";
import { ICullable, BoundingInfo } from "../Culling/boundingInfo";
import { Effect } from "../Materials/effect";
import { DataBuffer } from "../Engine/dataBuffer";
import { extractMinAndMaxIndexed } from "../Maths/math.functions";
import { Plane } from "../Maths/math.plane";

declare type Material = import("../Materials/material").Material;
declare type MaterialDefines =
  import("../Materials/materialDefines").MaterialDefines;
declare type AbstractMesh = import("./abstractMesh").AbstractMesh;
declare type Mesh = import("./mesh").Mesh;

/**
 * Defines a subdivision inside a mesh
 */
export class SubMesh implements ICullable {
  /** @hidden */
  public _materialDefines: Nullable<MaterialDefines> = null;
  /** @hidden */
  public _materialEffect: Nullable<Effect> = null;
  /** @hidden */
  public _effectOverride: Nullable<Effect> = null;

  /**
   * Gets material defines used by the effect associated to the sub mesh
   */
  public get materialDefines(): Nullable<MaterialDefines> {
    return this._materialDefines;
  }

  /**
   * Sets material defines used by the effect associated to the sub mesh
   */
  public set materialDefines(defines: Nullable<MaterialDefines>) {
    this._materialDefines = defines;
  }

  /**
   * Gets associated effect
   */
  public get effect(): Nullable<Effect> {
    return this._effectOverride ?? this._materialEffect;
  }

  /**
   * Sets associated effect (effect used to render this submesh)
   * @param effect defines the effect to associate with
   * @param defines defines the set of defines used to compile this effect
   */
  public setEffect(
    effect: Nullable<Effect>,
    defines: Nullable<MaterialDefines> = null
  ) {
    if (this._materialEffect === effect) {
      if (!effect) {
        this._materialDefines = null;
      }
      return;
    }
    this._materialDefines = defines;
    this._materialEffect = effect;
  }

  /** @hidden */
  public _linesIndexCount: number = 0;
  private _mesh: AbstractMesh;
  private _renderingMesh: Mesh;
  private _boundingInfo: BoundingInfo;
  private _linesIndexBuffer: Nullable<DataBuffer> = null;
  /** @hidden */
  public _lastColliderWorldVertices: Nullable<Vector3[]> = null;
  /** @hidden */
  public _trianglePlanes: Plane[];
  /** @hidden */
  public _lastColliderTransformMatrix: Nullable<Matrix> = null;

  /** @hidden */
  public _renderId = 0;
  /** @hidden */
  public _alphaIndex: number = 0;
  /** @hidden */
  public _distanceToCamera: number = 0;
  /** @hidden */
  public _id: number;

  // private _currentMaterial: Nullable<Material> = null;

  /**
   * Add a new submesh to a mesh
   * @param materialIndex defines the material index to use
   * @param verticesStart defines vertex index start
   * @param verticesCount defines vertices count
   * @param indexStart defines index start
   * @param indexCount defines indices count
   * @param mesh defines the parent mesh
   * @param renderingMesh defines an optional rendering mesh
   * @param createBoundingBox defines if bounding box should be created for this submesh
   * @returns the new submesh
   */
  public static AddToMesh(
    materialIndex: number,
    verticesStart: number,
    verticesCount: number,
    indexStart: number,
    indexCount: number,
    mesh: AbstractMesh,
    renderingMesh?: Mesh,
    createBoundingBox: boolean = true
  ): SubMesh {
    return new SubMesh(
      materialIndex,
      verticesStart,
      verticesCount,
      indexStart,
      indexCount,
      mesh,
      renderingMesh,
      createBoundingBox
    );
  }

  /**
   * Creates a new submesh
   * @param materialIndex defines the material index to use
   * @param verticesStart defines vertex index start
   * @param verticesCount defines vertices count
   * @param indexStart defines index start
   * @param indexCount defines indices count
   * @param mesh defines the parent mesh
   * @param renderingMesh defines an optional rendering mesh
   * @param createBoundingBox defines if bounding box should be created for this submesh
   * @param addToMesh defines a boolean indicating that the submesh must be added to the mesh.subMeshes array (true by default)
   */
  constructor(
    /** the material index to use */
    public materialIndex: number,
    /** vertex index start */
    public verticesStart: number,
    /** vertices count */
    public verticesCount: number,
    /** index start */
    public indexStart: number,
    /** indices count */
    public indexCount: number,
    mesh: AbstractMesh,
    renderingMesh?: Mesh,
    createBoundingBox: boolean = true,
    addToMesh = true
  ) {
    this._mesh = mesh;
    this._renderingMesh = renderingMesh || <Mesh>mesh;
    if (addToMesh) {
      mesh.subMeshes.push(this);
    }

    this._trianglePlanes = [];

    this._id = mesh.subMeshes.length - 1;

    if (createBoundingBox) {
      this.refreshBoundingInfo();
      mesh.computeWorldMatrix(true);
    }
  }

  /**
   * Returns true if this submesh covers the entire parent mesh
   * @ignorenaming
   */
  public get IsGlobal(): boolean {
    return (
      this.verticesStart === 0 &&
      this.verticesCount === this._mesh.meshGeometry.getTotalVertices()
    );
  }

  /**
   * Returns the submesh BoudingInfo object
   * @returns current bounding info (or mesh's one if the submesh is global)
   */
  public getBoundingInfo(): BoundingInfo {
    if (this.IsGlobal) {
      return this._mesh.getBoundingInfo();
    }

    return this._boundingInfo;
  }

  /**
   * Sets the submesh BoundingInfo
   * @param boundingInfo defines the new bounding info to use
   * @returns the SubMesh
   */
  public setBoundingInfo(boundingInfo: BoundingInfo): SubMesh {
    this._boundingInfo = boundingInfo;
    return this;
  }

  /**
   * Returns the mesh of the current submesh
   * @return the parent mesh
   */
  public getMesh(): AbstractMesh {
    return this._mesh;
  }

  /**
   * Returns the rendering mesh of the submesh
   * @returns the rendering mesh (could be different from parent mesh)
   */
  public getRenderingMesh(): Mesh {
    return this._renderingMesh;
  }

  /**
   * Returns the replacement mesh of the submesh
   * @returns the replacement mesh (could be different from parent mesh)
   */
  public getReplacementMesh(): Nullable<AbstractMesh> {
    return this._mesh._internalAbstractMeshDataInfo._actAsRegularMesh
      ? this._mesh
      : null;
  }

  /**
   * Returns the effective mesh of the submesh
   * @returns the effective mesh (could be different from parent mesh)
   */
  public getEffectiveMesh(): AbstractMesh {
    const replacementMesh = this._mesh._internalAbstractMeshDataInfo
      ._actAsRegularMesh
      ? this._mesh
      : null;

    return replacementMesh ? replacementMesh : this._renderingMesh;
  }

  /**
   * Returns the submesh material
   * @returns null or the current material
   */
  public getMaterial(): Nullable<Material> {
    var rootMaterial = this._renderingMesh.material;

    // if (rootMaterial === null || rootMaterial === undefined) {
    //   return this._mesh.getScene().defaultMaterial;
    // }
    // else if (this._IsMultiMaterial(rootMaterial)) {
    //     var effectiveMaterial = rootMaterial.getSubMaterial(this.materialIndex);

    //     if (this._currentMaterial !== effectiveMaterial) {
    //         this._currentMaterial = effectiveMaterial;
    //         this._materialDefines = null;
    //     }

    //     return effectiveMaterial;
    // }

    return rootMaterial;
  }

  /**
   * Sets a new updated BoundingInfo object to the submesh
   * @param data defines an optional position array to use to determine the bounding info
   * @returns the SubMesh
   */
  public refreshBoundingInfo(data: Nullable<FloatArray> = null): SubMesh {
    this._lastColliderWorldVertices = null;

    if (
      this.IsGlobal ||
      !this._renderingMesh ||
      !this._renderingMesh.meshGeometry.geometry
    ) {
      return this;
    }

    if (!data) {
      data = this._renderingMesh.meshGeometry.getVerticesData(VertexBuffer.PositionKind);
    }

    if (!data) {
      this._boundingInfo = this._mesh.getBoundingInfo();
      return this;
    }

    var indices = <IndicesArray>this._renderingMesh.meshGeometry.getIndices();
    var extend: { minimum: Vector3; maximum: Vector3 };

    //is this the only submesh?
    if (this.indexStart === 0 && this.indexCount === indices.length) {
      let boundingInfo = this._renderingMesh.getBoundingInfo();

      //the rendering mesh's bounding info can be used, it is the standard submesh for all indices.
      extend = {
        minimum: boundingInfo.minimum.clone(),
        maximum: boundingInfo.maximum.clone(),
      };
    } else {
      extend = extractMinAndMaxIndexed(
        data,
        indices,
        this.indexStart,
        this.indexCount,
        this._renderingMesh.meshGeometry.geometry.boundingBias
      );
    }

    if (this._boundingInfo) {
      this._boundingInfo.reConstruct(extend.minimum, extend.maximum);
    } else {
      this._boundingInfo = new BoundingInfo(extend.minimum, extend.maximum);
    }
    return this;
  }

  /**
   * Updates the submesh BoundingInfo
   * @param world defines the world matrix to use to update the bounding info
   * @returns the submesh
   */
  public updateBoundingInfo(world: DeepImmutable<Matrix>): SubMesh {
    let boundingInfo = this.getBoundingInfo();

    if (!boundingInfo) {
      this.refreshBoundingInfo();
      boundingInfo = this.getBoundingInfo();
    }
    if (boundingInfo) {
      (<BoundingInfo>boundingInfo).update(world);
    }
    return this;
  }

  /**
   * True is the submesh bounding box intersects the frustum defined by the passed array of planes.
   * @param frustumPlanes defines the frustum planes
   * @returns true if the submesh is intersecting with the frustum
   */
  public isInFrustum(frustumPlanes: Plane[]): boolean {
    let boundingInfo = this.getBoundingInfo();

    if (!boundingInfo) {
      return false;
    }
    return boundingInfo.isInFrustum(frustumPlanes, this._mesh.cullingStrategy);
  }

  /**
   * True is the submesh bounding box is completely inside the frustum defined by the passed array of planes
   * @param frustumPlanes defines the frustum planes
   * @returns true if the submesh is inside the frustum
   */
  public isCompletelyInFrustum(frustumPlanes: Plane[]): boolean {
    let boundingInfo = this.getBoundingInfo();

    if (!boundingInfo) {
      return false;
    }
    return boundingInfo.isCompletelyInFrustum(frustumPlanes);
  }

  /**
   * Renders the submesh
   * @param enableAlphaMode defines if alpha needs to be used
   * @returns the submesh
   */
  public render(enableAlphaMode: boolean): SubMesh {
    this._renderingMesh.render(
      this,
      enableAlphaMode,
      this._mesh._internalAbstractMeshDataInfo._actAsRegularMesh
        ? this._mesh
        : undefined
    );
    return this;
  }

  /**
   * @hidden
   */
  public _getLinesIndexBuffer(
    indices: IndicesArray,
    engine: Engine
  ): DataBuffer {
    if (!this._linesIndexBuffer) {
      var linesIndices = [];

      for (
        var index = this.indexStart;
        index < this.indexStart + this.indexCount;
        index += 3
      ) {
        linesIndices.push(
          indices[index],
          indices[index + 1],
          indices[index + 1],
          indices[index + 2],
          indices[index + 2],
          indices[index]
        );
      }

      this._linesIndexBuffer =
        engine.engineVertex.createIndexBuffer(linesIndices);
      this._linesIndexCount = linesIndices.length;
    }
    return this._linesIndexBuffer;
  }

  /** @hidden */
  public _rebuild(): void {
    if (this._linesIndexBuffer) {
      this._linesIndexBuffer = null;
    }
  }

  // Clone
  /**
   * Creates a new submesh from the passed mesh
   * @param newMesh defines the new hosting mesh
   * @param newRenderingMesh defines an optional rendering mesh
   * @returns the new submesh
   */
  public clone(newMesh: AbstractMesh, newRenderingMesh?: Mesh): SubMesh {
    var result = new SubMesh(
      this.materialIndex,
      this.verticesStart,
      this.verticesCount,
      this.indexStart,
      this.indexCount,
      newMesh,
      newRenderingMesh,
      false
    );

    if (!this.IsGlobal) {
      let boundingInfo = this.getBoundingInfo();

      if (!boundingInfo) {
        return result;
      }

      result._boundingInfo = new BoundingInfo(
        boundingInfo.minimum,
        boundingInfo.maximum
      );
    }

    return result;
  }

  // Dispose
  /**
   * Release associated resources
   */
  public dispose(): void {
    if (this._linesIndexBuffer) {
      this._mesh.getScene().getEngine()._releaseBuffer(this._linesIndexBuffer);
      this._linesIndexBuffer = null;
    }

    // Remove from mesh
    var index = this._mesh.subMeshes.indexOf(this);
    this._mesh.subMeshes.splice(index, 1);
  }

  /**
   * Gets the class name
   * @returns the string "SubMesh".
   */
  public getClassName(): string {
    return "SubMesh";
  }

  // Statics
  /**
   * Creates a new submesh from indices data
   * @param materialIndex the index of the main mesh material
   * @param startIndex the index where to start the copy in the mesh indices array
   * @param indexCount the number of indices to copy then from the startIndex
   * @param mesh the main mesh to create the submesh from
   * @param renderingMesh the optional rendering mesh
   * @returns a new submesh
   */
  public static CreateFromIndices(
    materialIndex: number,
    startIndex: number,
    indexCount: number,
    mesh: AbstractMesh,
    renderingMesh?: Mesh
  ): SubMesh {
    var minVertexIndex = Number.MAX_VALUE;
    var maxVertexIndex = -Number.MAX_VALUE;

    const whatWillRender = renderingMesh || mesh;
    var indices = whatWillRender!.meshGeometry.getIndices()!;

    for (var index = startIndex; index < startIndex + indexCount; index++) {
      var vertexIndex = indices[index];

      if (vertexIndex < minVertexIndex) {
        minVertexIndex = vertexIndex;
      }
      if (vertexIndex > maxVertexIndex) {
        maxVertexIndex = vertexIndex;
      }
    }

    return new SubMesh(
      materialIndex,
      minVertexIndex,
      maxVertexIndex - minVertexIndex + 1,
      startIndex,
      indexCount,
      mesh,
      renderingMesh
    );
  }
}
