import { Vector3 } from "../Maths/math";
import { FloatArray, IndicesArray, Nullable } from "../types";
import { AbstractMesh } from "./abstractMesh";
import { Geometry } from "./geometry";
import { Mesh } from "./mesh";
import { IGetSetVerticesData, VertexData } from "./mesh.vertexData";
import { VertexBuffer } from "./vertexBuffer";

export class MeshGeometry implements IGetSetVerticesData{
  public mesh: Mesh;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
  }

  public _geometry: Nullable<Geometry> = null;
  public _delayInfo: Array<string>;

  // Cache

  /** @hidden */
  public get _positions(): Nullable<Vector3[]> {
    if (this._geometry) {
      return this._geometry._positions;
    }
    return null;
  }

  /** @hidden */
  public _resetPointsArrayCache(): Mesh {
    if (this._geometry) {
      this._geometry._resetPointsArrayCache();
    }
    return this.mesh;
  }

  /** @hidden */
  public _generatePointsArray(): boolean {
    if (this._geometry) {
      return this._geometry._generatePointsArray();
    }
    return false;
  }

  /**
   * Gets the mesh internal Geometry object
   */
  public get geometry(): Nullable<Geometry> {
    return this._geometry;
  }

  /**
   * Returns the total number of vertices within the mesh geometry or zero if the mesh has no geometry.
   * @returns the total number of vertices
   */
  public getTotalVertices(): number {
    if (this._geometry === null || this._geometry === undefined) {
      return 0;
    }
    return this._geometry.getTotalVertices();
  }

  /**
   * Returns the content of an associated vertex buffer
   * @param kind defines which buffer to read from (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param copyWhenShared defines a boolean indicating that if the mesh geometry is shared among some other meshes, the returned array is a copy of the internal one
   * @param forceCopy defines a boolean forcing the copy of the buffer no matter what the value of copyWhenShared is
   * @returns a FloatArray or null if the mesh has no geometry or no vertex buffer for this kind.
   */
  public getVerticesData(kind: string, copyWhenShared?: boolean, forceCopy?: boolean): Nullable<FloatArray> {
    if (!this._geometry) {
      return null;
    }
    return this._geometry.getVerticesData(kind, copyWhenShared, forceCopy);
  }

  /**
   * Returns the mesh VertexBuffer object from the requested `kind`
   * @param kind defines which buffer to read from (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.NormalKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @returns a FloatArray or null if the mesh has no vertex buffer for this kind.
   */
  public getVertexBuffer(kind: string): Nullable<VertexBuffer> {
    if (!this._geometry) {
      return null;
    }
    return this._geometry.getVertexBuffer(kind);
  }

  /**
   * Tests if a specific vertex buffer is associated with this mesh
   * @param kind defines which buffer to check (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.NormalKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @returns a boolean
   */
  public isVerticesDataPresent(kind: string): boolean {
    if (!this._geometry) {
      if (this._delayInfo) {
        return this._delayInfo.indexOf(kind) !== -1;
      }
      return false;
    }
    return this._geometry.isVerticesDataPresent(kind);
  }

  /**
   * Returns a boolean defining if the vertex data for the requested `kind` is updatable.
   * @param kind defines which buffer to check (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @returns a boolean
   */
  public isVertexBufferUpdatable(kind: string): boolean {
    if (!this._geometry) {
      if (this._delayInfo) {
        return this._delayInfo.indexOf(kind) !== -1;
      }
      return false;
    }
    return this._geometry.isVertexBufferUpdatable(kind);
  }

  /**
   * Returns a string which contains the list of existing `kinds` of Vertex Data associated with this mesh.
   * @param kind defines which buffer to read from (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.NormalKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @returns an array of strings
   */
  public getVerticesDataKinds(): string[] {
    if (!this._geometry) {
      var result = new Array<string>();
      if (this._delayInfo) {
        this._delayInfo.forEach(function (kind) {
          result.push(kind);
        });
      }
      return result;
    }
    return this._geometry.getVerticesDataKinds();
  }

  /**
   * Returns a positive integer : the total number of indices in this mesh geometry.
   * @returns the numner of indices or zero if the mesh has no geometry.
   */
  public getTotalIndices(): number {
    if (!this._geometry) {
      return 0;
    }
    return this._geometry.getTotalIndices();
  }

  /**
   * Copy a FloatArray into a specific associated vertex buffer
   * @param kind defines which buffer to write to (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param data defines the data source
   * @param updatable defines if the updated vertex buffer must be flagged as updatable
   * @param stride defines the data stride size (can be null)
   * @returns the current mesh
   */
  public setVerticesData(kind: string, data: FloatArray, updatable: boolean = false, stride?: number): AbstractMesh {
    if (!this._geometry) {
      var vertexData = new VertexData();
      vertexData.set(data, kind);

      var scene = this.mesh.getScene();

      new Geometry(Geometry.RandomId(), scene, vertexData, updatable, this.mesh);
    } else {
      this._geometry.setVerticesData(kind, data, updatable, stride);
    }
    return this.mesh;
  }

  /**
   * Delete a vertex buffer associated with this mesh
   * @param kind defines which buffer to delete (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   */
  public removeVerticesData(kind: string) {
    if (!this._geometry) {
      return;
    }

    this._geometry.removeVerticesData(kind);
  }

  /**
   * Creates a un-shared specific occurence of the geometry for the mesh.
   * @returns the current mesh
   */
  public makeGeometryUnique(): Mesh {
    if (!this._geometry) {
      return this.mesh;
    }

    if (this._geometry.meshes.length === 1) {
      return this.mesh;
    }

    var oldGeometry = this._geometry;
    var geometry = this._geometry.copy(Geometry.RandomId());
    oldGeometry.releaseForMesh(this.mesh, true);
    geometry.applyToMesh(this.mesh);
    return this.mesh;
  }

  /**
  * Set the index buffer of this mesh
  * @param indices defines the source data
  * @param totalVertices defines the total number of vertices referenced by this index data (can be null)
  * @param updatable defines if the updated index buffer must be flagged as updatable (default is false)
  * @returns the current mesh
  */
  public setIndices(indices: IndicesArray, totalVertices: Nullable<number> = null, updatable: boolean = false): AbstractMesh {
    if (!this._geometry) {
      var vertexData = new VertexData();
      vertexData.indices = indices;

      var scene = this.mesh.getScene();

      new Geometry(Geometry.RandomId(), scene, vertexData, updatable, this.mesh);
    } else {
      this._geometry.setIndices(indices, totalVertices, updatable);
    }
    return this.mesh;
  }

  /**
   * Update the current index buffer
   * @param indices defines the source data
   * @param offset defines the offset in the index buffer where to store the new data (can be null)
   * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
   * @returns the current mesh
   */
  public updateIndices(indices: IndicesArray, offset?: number, gpuMemoryOnly = false): AbstractMesh {
    if (!this._geometry) {
      return this.mesh;
    }

    this._geometry.updateIndices(indices, offset, gpuMemoryOnly);
    return this.mesh;
  }

  /**
   * Invert the geometry to move from a right handed system to a left handed one.
   * @returns the current mesh
   */
  public toLeftHanded(): Mesh {
    if (!this._geometry) {
      return this.mesh;
    }
    this._geometry.toLeftHanded();
    return this.mesh;
  }

  /**
  * Returns an array of integers or a typed array (Int32Array, Uint32Array, Uint16Array) populated with the mesh indices.
  * @param copyWhenShared If true (default false) and and if the mesh geometry is shared among some other meshes, the returned array is a copy of the internal one.
  * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
  * @returns the indices array or an empty array if the mesh has no geometry
  */
  public getIndices(copyWhenShared?: boolean, forceCopy?: boolean): Nullable<IndicesArray> {
    if (!this._geometry) {
      return [];
    }
    return this._geometry.getIndices(copyWhenShared, forceCopy);
  }

  /**
   * Update a specific associated vertex buffer
   * @param kind defines which buffer to write to (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param data defines the data source
   * @param updateExtends defines if extends info of the mesh must be updated (can be null). This is mostly useful for "position" kind
   * @param makeItUnique defines if the geometry associated with the mesh must be cloned to make the change only for this mesh (and not all meshes associated with the same geometry)
   * @returns the current mesh
   */
  public updateVerticesData(kind: string, data: FloatArray, updateExtends?: boolean, makeItUnique?: boolean): AbstractMesh {
    if (!this._geometry) {
      return this.mesh;
    }
    if (!makeItUnique) {
      this._geometry.updateVerticesData(kind, data, updateExtends);
    } else {
      this.makeGeometryUnique();
      this.updateVerticesData(kind, data, updateExtends, false);
    }
    return this.mesh;
  }
}
