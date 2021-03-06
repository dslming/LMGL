import { Effect } from "../Materials/effect";
import { Material } from "../Materials/material";
import { Matrix, Vector2, Vector3 } from "../Maths/math";
import { CanvasGenerator } from "../Misc/canvasGenerator";
import { Logger } from "../Misc/logger";
import { AsyncLoop, Tools } from "../Misc/tools";
import { FloatArray, IndicesArray, Nullable } from "../types";
import { AbstractMesh } from "./abstractMesh";
import { Geometry } from "./geometry";
import { Mesh } from "./mesh";
import { IGetSetVerticesData, VertexData } from "./mesh.vertexData";
import { SubMesh } from "./subMesh";
import { VertexBuffer } from "./vertexBuffer";

export class MeshGeometry implements IGetSetVerticesData {
  public mesh: Mesh;

  /**
   * Gets a boolean indicating if the normals aren't to be recomputed on next mesh `positions` array update. This property is pertinent only for updatable parametric shapes.
   */
  public get areNormalsFrozen(): boolean {
    return this.mesh._internalMeshDataInfo._areNormalsFrozen;
  }

  /**
   * This function affects parametric shapes on vertex position update only : ribbons, tubes, etc. It has no effect at all on other shapes. It prevents the mesh normals from being recomputed on next `positions` array update.
   * @returns the current mesh
   */
  public freezeNormals(): Mesh {
    this.mesh._internalMeshDataInfo._areNormalsFrozen = true;
    return this.mesh;
  }

  /**
   * This function affects parametric shapes on vertex position update only : ribbons, tubes, etc. It has no effect at all on other shapes. It reactivates the mesh normals computation if it was previously frozen
   * @returns the current mesh
   */
  public unfreezeNormals(): Mesh {
    this.mesh._internalMeshDataInfo._areNormalsFrozen = false;
    return this.mesh;
  }

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

  /**
   * Sets the mesh global Vertex Buffer
   * @param buffer defines the buffer to use
   * @returns the current mesh
   */
  public setVerticesBuffer(buffer: VertexBuffer): Mesh {
    if (!this._geometry) {
      this._geometry = Geometry.CreateGeometryForMesh(this.mesh);
    }

    this._geometry.setVerticesBuffer(buffer);
    return this.mesh;
  }

  /**
   * Force adjacent facets to share vertices and remove any facets that have all vertices in a line
   * This will undo any application of covertToFlatShadedMesh
   * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
   */
  public forceSharedVertices(): void {
    var vertex_data = VertexData.ExtractFromMesh(this.mesh);
    var currentUVs = vertex_data.uvs;
    var currentIndices = vertex_data.indices;
    var currentPositions = vertex_data.positions;
    var currentColors = vertex_data.colors;

    if (currentIndices === void 0 || currentPositions === void 0 || currentIndices === null || currentPositions === null) {
      Logger.Warn("VertexData contains empty entries");
    } else {
      var positions: Array<number> = new Array();
      var indices: Array<number> = new Array();
      var uvs: Array<number> = new Array();
      var colors: Array<number> = new Array();
      var pstring: Array<string> = new Array(); //lists facet vertex positions (a,b,c) as string "a|b|c"

      var indexPtr: number = 0; // pointer to next available index value
      var uniquePositions: { [key: string]: number } = {}; // unique vertex positions
      var ptr: number; // pointer to element in uniquePositions
      var facet: Array<number>;

      for (var i = 0; i < currentIndices.length; i += 3) {
        facet = [currentIndices[i], currentIndices[i + 1], currentIndices[i + 2]]; //facet vertex indices
        pstring = new Array();
        for (var j = 0; j < 3; j++) {
          pstring[j] = "";
          for (var k = 0; k < 3; k++) {
            //small values make 0
            if (Math.abs(currentPositions[3 * facet[j] + k]) < 0.00000001) {
              currentPositions[3 * facet[j] + k] = 0;
            }
            pstring[j] += currentPositions[3 * facet[j] + k] + "|";
          }
        }
        //check facet vertices to see that none are repeated
        // do not process any facet that has a repeated vertex, ie is a line
        if (!(pstring[0] == pstring[1] || pstring[0] == pstring[2] || pstring[1] == pstring[2])) {
          //for each facet position check if already listed in uniquePositions
          // if not listed add to uniquePositions and set index pointer
          // if listed use its index in uniquePositions and new index pointer
          for (var j = 0; j < 3; j++) {
            ptr = uniquePositions[pstring[j]];
            if (ptr === undefined) {
              uniquePositions[pstring[j]] = indexPtr;
              ptr = indexPtr++;
              //not listed so add individual x, y, z coordinates to positions
              for (var k = 0; k < 3; k++) {
                positions.push(currentPositions[3 * facet[j] + k]);
              }
              if (currentColors !== null && currentColors !== void 0) {
                for (var k = 0; k < 4; k++) {
                  colors.push(currentColors[4 * facet[j] + k]);
                }
              }
              if (currentUVs !== null && currentUVs !== void 0) {
                for (var k = 0; k < 2; k++) {
                  uvs.push(currentUVs[2 * facet[j] + k]);
                }
              }
            }
            // add new index pointer to indices array
            indices.push(ptr);
          }
        }
      }

      var normals: Array<number> = new Array();
      VertexData.ComputeNormals(positions, indices, normals);

      //create new vertex data object and update
      vertex_data.positions = positions;
      vertex_data.indices = indices;
      vertex_data.normals = normals;
      if (currentUVs !== null && currentUVs !== void 0) {
        vertex_data.uvs = uvs;
      }
      if (currentColors !== null && currentColors !== void 0) {
        vertex_data.colors = colors;
      }

      vertex_data.applyToMesh(this.mesh, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    }
  }

  /**
   * Increase the number of facets and hence vertices in a mesh
   * Vertex normals are interpolated from existing vertex normals
   * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
   * @param numberPerEdge the number of new vertices to add to each edge of a facet, optional default 1
   */
  public increaseVertices(numberPerEdge: number): void {
    var vertex_data = VertexData.ExtractFromMesh(this.mesh);
    var uvs = vertex_data.uvs;
    var currentIndices = vertex_data.indices;
    var positions = vertex_data.positions;
    var normals = vertex_data.normals;

    if (!currentIndices || !positions || !normals || !uvs) {
      Logger.Warn("VertexData contains null entries");
    } else {
      var segments: number = numberPerEdge + 1; //segments per current facet edge, become sides of new facets
      var tempIndices: Array<Array<number>> = new Array();
      for (var i = 0; i < segments + 1; i++) {
        tempIndices[i] = new Array();
      }
      var a: number; //vertex index of one end of a side
      var b: number; //vertex index of other end of the side
      var deltaPosition: Vector3 = new Vector3(0, 0, 0);
      var deltaNormal: Vector3 = new Vector3(0, 0, 0);
      var deltaUV: Vector2 = new Vector2(0, 0);
      var indices: number[] = new Array();
      var vertexIndex: number[] = new Array();
      var side: Array<Array<Array<number>>> = new Array();
      var len: number;
      var positionPtr: number = positions.length;
      var uvPtr: number = uvs.length;

      for (var i = 0; i < currentIndices.length; i += 3) {
        vertexIndex[0] = currentIndices[i];
        vertexIndex[1] = currentIndices[i + 1];
        vertexIndex[2] = currentIndices[i + 2];
        for (var j = 0; j < 3; j++) {
          a = vertexIndex[j];
          b = vertexIndex[(j + 1) % 3];
          if (side[a] === undefined && side[b] === undefined) {
            side[a] = new Array();
            side[b] = new Array();
          } else {
            if (side[a] === undefined) {
              side[a] = new Array();
            }
            if (side[b] === undefined) {
              side[b] = new Array();
            }
          }
          if (side[a][b] === undefined && side[b][a] === undefined) {
            side[a][b] = [];
            deltaPosition.x = (positions[3 * b] - positions[3 * a]) / segments;
            deltaPosition.y = (positions[3 * b + 1] - positions[3 * a + 1]) / segments;
            deltaPosition.z = (positions[3 * b + 2] - positions[3 * a + 2]) / segments;
            deltaNormal.x = (normals[3 * b] - normals[3 * a]) / segments;
            deltaNormal.y = (normals[3 * b + 1] - normals[3 * a + 1]) / segments;
            deltaNormal.z = (normals[3 * b + 2] - normals[3 * a + 2]) / segments;
            deltaUV.x = (uvs[2 * b] - uvs[2 * a]) / segments;
            deltaUV.y = (uvs[2 * b + 1] - uvs[2 * a + 1]) / segments;
            side[a][b].push(a);
            for (var k = 1; k < segments; k++) {
              side[a][b].push(positions.length / 3);
              positions[positionPtr] = positions[3 * a] + k * deltaPosition.x;
              normals[positionPtr++] = normals[3 * a] + k * deltaNormal.x;
              positions[positionPtr] = positions[3 * a + 1] + k * deltaPosition.y;
              normals[positionPtr++] = normals[3 * a + 1] + k * deltaNormal.y;
              positions[positionPtr] = positions[3 * a + 2] + k * deltaPosition.z;
              normals[positionPtr++] = normals[3 * a + 2] + k * deltaNormal.z;
              uvs[uvPtr++] = uvs[2 * a] + k * deltaUV.x;
              uvs[uvPtr++] = uvs[2 * a + 1] + k * deltaUV.y;
            }
            side[a][b].push(b);
            side[b][a] = new Array();
            len = side[a][b].length;
            for (var idx = 0; idx < len; idx++) {
              side[b][a][idx] = side[a][b][len - 1 - idx];
            }
          }
        }
        //Calculate positions, normals and uvs of new internal vertices
        tempIndices[0][0] = currentIndices[i];
        tempIndices[1][0] = side[currentIndices[i]][currentIndices[i + 1]][1];
        tempIndices[1][1] = side[currentIndices[i]][currentIndices[i + 2]][1];
        for (var k = 2; k < segments; k++) {
          tempIndices[k][0] = side[currentIndices[i]][currentIndices[i + 1]][k];
          tempIndices[k][k] = side[currentIndices[i]][currentIndices[i + 2]][k];
          deltaPosition.x = (positions[3 * tempIndices[k][k]] - positions[3 * tempIndices[k][0]]) / k;
          deltaPosition.y = (positions[3 * tempIndices[k][k] + 1] - positions[3 * tempIndices[k][0] + 1]) / k;
          deltaPosition.z = (positions[3 * tempIndices[k][k] + 2] - positions[3 * tempIndices[k][0] + 2]) / k;
          deltaNormal.x = (normals[3 * tempIndices[k][k]] - normals[3 * tempIndices[k][0]]) / k;
          deltaNormal.y = (normals[3 * tempIndices[k][k] + 1] - normals[3 * tempIndices[k][0] + 1]) / k;
          deltaNormal.z = (normals[3 * tempIndices[k][k] + 2] - normals[3 * tempIndices[k][0] + 2]) / k;
          deltaUV.x = (uvs[2 * tempIndices[k][k]] - uvs[2 * tempIndices[k][0]]) / k;
          deltaUV.y = (uvs[2 * tempIndices[k][k] + 1] - uvs[2 * tempIndices[k][0] + 1]) / k;
          for (var j = 1; j < k; j++) {
            tempIndices[k][j] = positions.length / 3;
            positions[positionPtr] = positions[3 * tempIndices[k][0]] + j * deltaPosition.x;
            normals[positionPtr++] = normals[3 * tempIndices[k][0]] + j * deltaNormal.x;
            positions[positionPtr] = positions[3 * tempIndices[k][0] + 1] + j * deltaPosition.y;
            normals[positionPtr++] = normals[3 * tempIndices[k][0] + 1] + j * deltaNormal.y;
            positions[positionPtr] = positions[3 * tempIndices[k][0] + 2] + j * deltaPosition.z;
            normals[positionPtr++] = normals[3 * tempIndices[k][0] + 2] + j * deltaNormal.z;
            uvs[uvPtr++] = uvs[2 * tempIndices[k][0]] + j * deltaUV.x;
            uvs[uvPtr++] = uvs[2 * tempIndices[k][0] + 1] + j * deltaUV.y;
          }
        }
        tempIndices[segments] = side[currentIndices[i + 1]][currentIndices[i + 2]];

        // reform indices
        indices.push(tempIndices[0][0], tempIndices[1][0], tempIndices[1][1]);
        for (var k = 1; k < segments; k++) {
          for (var j = 0; j < k; j++) {
            indices.push(tempIndices[k][j], tempIndices[k + 1][j], tempIndices[k + 1][j + 1]);
            indices.push(tempIndices[k][j], tempIndices[k + 1][j + 1], tempIndices[k][j + 1]);
          }
          indices.push(tempIndices[k][j], tempIndices[k + 1][j], tempIndices[k + 1][j + 1]);
        }
      }

      vertex_data.indices = indices;
      vertex_data.applyToMesh(this.mesh, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    }
  }

  /**
   * This function will subdivide the mesh into multiple submeshes
   * @param count defines the expected number of submeshes
   */
  public subdivide(count: number): void {
    if (count < 1) {
      return;
    }

    var totalIndices = this.getTotalIndices();
    var subdivisionSize = (totalIndices / count) | 0;
    var offset = 0;

    // Ensure that subdivisionSize is a multiple of 3
    while (subdivisionSize % 3 !== 0) {
      subdivisionSize++;
    }

    this.mesh.releaseSubMeshes();
    for (var index = 0; index < count; index++) {
      if (offset >= totalIndices) {
        break;
      }

      SubMesh.CreateFromIndices(0, offset, index === count - 1 ? totalIndices - offset : subdivisionSize, this.mesh);

      offset += subdivisionSize;
    }

    // this.synchronizeInstances();
  }

  /**
   * Flags an associated vertex buffer as updatable
   * @param kind defines which buffer to use (positions, indices, normals, etc). Possible `kind` values :
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
   * @param updatable defines if the updated vertex buffer must be flagged as updatable
   */
  public markVerticesDataAsUpdatable(kind: string, updatable = true) {
    let vb = this.getVertexBuffer(kind);

    if (!vb || vb.isUpdatable() === updatable) {
      return;
    }

    this.setVerticesData(kind, <FloatArray>this.getVerticesData(kind), updatable);
  }

  /**
   * This method updates the vertex positions of an updatable mesh according to the `positionFunction` returned values.
   * @see https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#other-shapes-updatemeshpositions
   * @param positionFunction is a simple JS function what is passed the mesh `positions` array. It doesn't need to return anything
   * @param computeNormals is a boolean (default true) to enable/disable the mesh normal recomputation after the vertex position update
   * @returns the current mesh
   */
  public updateMeshPositions(positionFunction: (data: FloatArray) => void, computeNormals: boolean = true): Mesh {
    var positions = this.getVerticesData(VertexBuffer.PositionKind);
    if (!positions) {
      return this.mesh;
    }

    positionFunction(positions);
    this.updateVerticesData(VertexBuffer.PositionKind, positions, false, false);

    if (computeNormals) {
      var indices = this.getIndices();
      var normals = this.getVerticesData(VertexBuffer.NormalKind);

      if (!normals) {
        return this.mesh;
      }

      VertexData.ComputeNormals(positions, indices, normals);
      this.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
    }
    return this.mesh;
  }

  /** @hidden */
  public _bind(subMesh: SubMesh, effect: Effect, fillMode: number): Mesh {
    if (!this._geometry) {
      return this.mesh;
    }

    var engine = this.mesh.getScene().getEngine();

    // Wireframe
    var indexToBind;

    if (this.mesh._unIndexed) {
      indexToBind = null;
    } else {
      switch (fillMode) {
        case Material.PointFillMode:
          indexToBind = null;
          break;
        case Material.WireFrameFillMode:
          indexToBind = subMesh._getLinesIndexBuffer(<IndicesArray>this.getIndices(), engine);
          break;
        default:
        case Material.TriangleFillMode:
          indexToBind = this._geometry.getIndexBuffer();
          break;
      }
    }

    // VBOs
    this._geometry._bind(effect, indexToBind);
    return this.mesh;
  }

  /**
   * This method recomputes and sets a new BoundingInfo to the mesh unless it is locked.
   * This means the mesh underlying bounding box and sphere are recomputed.
   * @param applySkeleton defines whether to apply the skeleton before computing the bounding info
   * @returns the current mesh
   */
  public refreshBoundingInfo(applySkeleton: boolean = false): Mesh {
    if (this.mesh._boundingInfo && this.mesh._boundingInfo.isLocked) {
      return this.mesh;
    }

    const bias = this.geometry ? this.geometry.boundingBias : null;
    this.mesh._refreshBoundingInfo(this.mesh._getPositionData(applySkeleton), bias);
    return this.mesh;
  }

  /**
   *   Renormalize the mesh and patch it up if there are no weights
   *   Similar to normalization by adding the weights compute the reciprocal and multiply all elements, this wil ensure that everything adds to 1.
   *   However in the case of zero weights then we set just a single influence to 1.
   *   We check in the function for extra's present and if so we use the normalizeSkinWeightsWithExtras rather than the FourWeights version.
   */
  public cleanMatrixWeights(): void {
    if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
      if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsExtraKind)) {
        // this.normalizeSkinWeightsAndExtra();
      } else {
        this.normalizeSkinFourWeights();
      }
    }
  }

  // faster 4 weight version.
  private normalizeSkinFourWeights(): void {
    let matricesWeights = <FloatArray>this.getVerticesData(VertexBuffer.MatricesWeightsKind);
    let numWeights = matricesWeights.length;

    for (var a = 0; a < numWeights; a += 4) {
      // accumulate weights
      var t = matricesWeights[a] + matricesWeights[a + 1] + matricesWeights[a + 2] + matricesWeights[a + 3];
      // check for invalid weight and just set it to 1.
      if (t === 0) {
        matricesWeights[a] = 1;
      } else {
        // renormalize so everything adds to 1 use reciprical
        let recip = 1 / t;
        matricesWeights[a] *= recip;
        matricesWeights[a + 1] *= recip;
        matricesWeights[a + 2] *= recip;
        matricesWeights[a + 3] *= recip;
      }
    }
    this.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeights);
  }

  /**
 * Inverses facet orientations.
 * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
 * @param flipNormals will also inverts the normals
 * @returns current mesh
 */
  public flipFaces(flipNormals: boolean = false): Mesh {
    var vertex_data = VertexData.ExtractFromMesh(this.mesh);
    var i: number;
    if (flipNormals && this.isVerticesDataPresent(VertexBuffer.NormalKind) && vertex_data.normals) {
      for (i = 0; i < vertex_data.normals.length; i++) {
        vertex_data.normals[i] *= -1;
      }
    }

    if (vertex_data.indices) {
      var temp;
      for (i = 0; i < vertex_data.indices.length; i += 3) {
        // reassign indices
        temp = vertex_data.indices[i + 1];
        vertex_data.indices[i + 1] = vertex_data.indices[i + 2];
        vertex_data.indices[i + 2] = temp;
      }
    }

    vertex_data.applyToMesh(this.mesh, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    return this.mesh;
  }

  /**
   * Modifies the mesh geometry according to the passed transformation matrix.
   * This method returns nothing but it really modifies the mesh even if it's originally not set as updatable.
   * The mesh normals are modified using the same transformation.
   * Note that, under the hood, this method sets a new VertexBuffer each call.
   * @param transform defines the transform matrix to use
   * @see https://doc.babylonjs.com/resources/baking_transformations
   * @returns the current mesh
   */
  public bakeTransformIntoVertices(transform: Matrix): Mesh {
    // Position
    if (!this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
      return this.mesh;
    }

    var submeshes = this.mesh.subMeshes.splice(0);

    this._resetPointsArrayCache();

    var data = <FloatArray>this.getVerticesData(VertexBuffer.PositionKind);

    var temp = new Array<number>();
    var index: number;
    for (index = 0; index < data.length; index += 3) {
      Vector3.TransformCoordinates(Vector3.FromArray(data, index), transform).toArray(temp, index);
    }

    this.setVerticesData(VertexBuffer.PositionKind, temp, (<VertexBuffer>this.getVertexBuffer(VertexBuffer.PositionKind)).isUpdatable());

    // Normals
    if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
      data = <FloatArray>this.getVerticesData(VertexBuffer.NormalKind);
      temp = [];
      for (index = 0; index < data.length; index += 3) {
        Vector3.TransformNormal(Vector3.FromArray(data, index), transform).normalize().toArray(temp, index);
      }
      this.setVerticesData(VertexBuffer.NormalKind, temp, (<VertexBuffer>this.getVertexBuffer(VertexBuffer.NormalKind)).isUpdatable());
    }

    // flip faces?
    if (transform.m[0] * transform.m[5] * transform.m[10] < 0) {
      this.flipFaces();
    }

    // Restore submeshes
    this.mesh.releaseSubMeshes();
    this.mesh.subMeshes = submeshes;
    return this.mesh;
  }

  /**
   * Modifies the mesh geometry according to its own current World Matrix.
   * The mesh World Matrix is then reset.
   * This method returns nothing but really modifies the mesh even if it's originally not set as updatable.
   * Note that, under the hood, this method sets a new VertexBuffer each call.
   * @see https://doc.babylonjs.com/resources/baking_transformations
   * @param bakeIndependenlyOfChildren indicates whether to preserve all child nodes' World Matrix during baking
   * @returns the current mesh
   */
  public bakeCurrentTransformIntoVertices(bakeIndependenlyOfChildren: boolean = true): Mesh {
    this.bakeTransformIntoVertices(this.mesh.computeWorldMatrix(true));
    this.mesh.resetLocalMatrix(bakeIndependenlyOfChildren);
    return this.mesh;
  }

  /**
   * Optimization of the mesh's indices, in case a mesh has duplicated vertices.
   * The function will only reorder the indices and will not remove unused vertices to avoid problems with submeshes.
   * This should be used together with the simplification to avoid disappearing triangles.
   * @param successCallback an optional success callback to be called after the optimization finished.
   * @returns the current mesh
   */
  public optimizeIndices(successCallback?: (mesh?: Mesh) => void): Mesh {
    var indices = <IndicesArray>this.getIndices();
    var positions = this.getVerticesData(VertexBuffer.PositionKind);

    if (!positions || !indices) {
      return this.mesh;
    }

    var vectorPositions = new Array<Vector3>();
    for (var pos = 0; pos < positions.length; pos = pos + 3) {
      vectorPositions.push(Vector3.FromArray(positions, pos));
    }
    var dupes = new Array<number>();

    AsyncLoop.SyncAsyncForLoop(
      vectorPositions.length,
      40,
      (iteration) => {
        var realPos = vectorPositions.length - 1 - iteration;
        var testedPosition = vectorPositions[realPos];
        for (var j = 0; j < realPos; ++j) {
          var againstPosition = vectorPositions[j];
          if (testedPosition.equals(againstPosition)) {
            dupes[realPos] = j;
            break;
          }
        }
      },
      () => {
        for (var i = 0; i < indices.length; ++i) {
          indices[i] = dupes[indices[i]] || indices[i];
        }

        //indices are now reordered
        var originalSubMeshes = this.mesh.subMeshes.slice(0);
        this.setIndices(indices);
        this.mesh.subMeshes = originalSubMeshes;
        if (successCallback) {
          successCallback(this.mesh);
        }
      }
    );
    return this.mesh;
  }

  /**
   * Modify the mesh to get a flat shading rendering.
   * This means each mesh facet will then have its own normals. Usually new vertices are added in the mesh geometry to get this result.
   * Warning : the mesh is really modified even if not set originally as updatable and, under the hood, a new VertexBuffer is allocated.
   * @returns current mesh
   */
  public convertToFlatShadedMesh(): Mesh {
    var kinds = this.getVerticesDataKinds();
    var vbs: { [key: string]: VertexBuffer } = {};
    var data: { [key: string]: FloatArray } = {};
    var newdata: { [key: string]: Array<number> } = {};
    var updatableNormals = false;
    var kindIndex: number;
    var kind: string;
    for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
      kind = kinds[kindIndex];
      var vertexBuffer = <VertexBuffer>this.getVertexBuffer(kind);

      if (kind === VertexBuffer.NormalKind) {
        updatableNormals = vertexBuffer.isUpdatable();
        kinds.splice(kindIndex, 1);
        kindIndex--;
        continue;
      }

      vbs[kind] = vertexBuffer;
      data[kind] = <FloatArray>vbs[kind].getData();
      newdata[kind] = [];
    }

    // Save previous submeshes
    var previousSubmeshes = this.mesh.subMeshes.slice(0);

    var indices = <IndicesArray>this.getIndices();
    var totalIndices = this.getTotalIndices();

    // Generating unique vertices per face
    var index: number;
    for (index = 0; index < totalIndices; index++) {
      var vertexIndex = indices[index];

      for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
        kind = kinds[kindIndex];
        var stride = vbs[kind].getStrideSize();

        for (var offset = 0; offset < stride; offset++) {
          newdata[kind].push(data[kind][vertexIndex * stride + offset]);
        }
      }
    }

    // Updating faces & normal
    var normals = [];
    var positions = newdata[VertexBuffer.PositionKind];
    for (index = 0; index < totalIndices; index += 3) {
      indices[index] = index;
      indices[index + 1] = index + 1;
      indices[index + 2] = index + 2;

      var p1 = Vector3.FromArray(positions, index * 3);
      var p2 = Vector3.FromArray(positions, (index + 1) * 3);
      var p3 = Vector3.FromArray(positions, (index + 2) * 3);

      var p1p2 = p1.subtract(p2);
      var p3p2 = p3.subtract(p2);

      var normal = Vector3.Normalize(Vector3.Cross(p1p2, p3p2));

      // Store same normals for every vertex
      for (var localIndex = 0; localIndex < 3; localIndex++) {
        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);
      }
    }

    this.setIndices(indices);
    this.setVerticesData(VertexBuffer.NormalKind, normals, updatableNormals);

    // Updating vertex buffers
    for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
      kind = kinds[kindIndex];
      this.setVerticesData(kind, newdata[kind], vbs[kind].isUpdatable());
    }

    // Updating submeshes
    this.mesh.releaseSubMeshes();
    for (var submeshIndex = 0; submeshIndex < previousSubmeshes.length; submeshIndex++) {
      var previousOne = previousSubmeshes[submeshIndex];
      SubMesh.AddToMesh(
        previousOne.materialIndex,
        previousOne.indexStart,
        previousOne.indexCount,
        previousOne.indexStart,
        previousOne.indexCount,
        this.mesh
      );
    }

    // this.synchronizeInstances();
    return this.mesh;
  }

  /**
   * This method removes all the mesh indices and add new vertices (duplication) in order to unfold facets into buffers.
   * In other words, more vertices, no more indices and a single bigger VBO.
   * The mesh is really modified even if not set originally as updatable. Under the hood, a new VertexBuffer is allocated.
   * @returns current mesh
   */
  public convertToUnIndexedMesh(): Mesh {
    var kinds = this.getVerticesDataKinds();
    var vbs: { [key: string]: VertexBuffer } = {};
    var data: { [key: string]: FloatArray } = {};
    var newdata: { [key: string]: Array<number> } = {};
    var kindIndex: number;
    var kind: string;
    for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
      kind = kinds[kindIndex];
      var vertexBuffer = <VertexBuffer>this.getVertexBuffer(kind);
      vbs[kind] = vertexBuffer;
      data[kind] = <FloatArray>vbs[kind].getData();
      newdata[kind] = [];
    }

    // Save previous submeshes
    var previousSubmeshes = this.mesh.subMeshes.slice(0);

    var indices = <IndicesArray>this.getIndices();
    var totalIndices = this.getTotalIndices();

    // Generating unique vertices per face
    var index: number;
    for (index = 0; index < totalIndices; index++) {
      var vertexIndex = indices[index];

      for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
        kind = kinds[kindIndex];
        var stride = vbs[kind].getStrideSize();

        for (var offset = 0; offset < stride; offset++) {
          newdata[kind].push(data[kind][vertexIndex * stride + offset]);
        }
      }
    }

    // Updating indices
    for (index = 0; index < totalIndices; index += 3) {
      indices[index] = index;
      indices[index + 1] = index + 1;
      indices[index + 2] = index + 2;
    }

    this.setIndices(indices);

    // Updating vertex buffers
    for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
      kind = kinds[kindIndex];
      this.setVerticesData(kind, newdata[kind], vbs[kind].isUpdatable());
    }

    // Updating submeshes
    this.mesh.releaseSubMeshes();
    for (var submeshIndex = 0; submeshIndex < previousSubmeshes.length; submeshIndex++) {
      var previousOne = previousSubmeshes[submeshIndex];
      SubMesh.AddToMesh(
        previousOne.materialIndex,
        previousOne.indexStart,
        previousOne.indexCount,
        previousOne.indexStart,
        previousOne.indexCount,
        this.mesh
      );
    }

    this.mesh._unIndexed = true;

    // this.synchronizeInstances();
    return this.mesh;
  }

  /**
   * Modifies the mesh geometry according to a displacementMap buffer.
   * A displacement map is a colored image. Each pixel color value (actually a gradient computed from red, green, blue values) will give the displacement to apply to each mesh vertex.
   * The mesh must be set as updatable. Its internal geometry is directly modified, no new buffer are allocated.
   * @param buffer is a `Uint8Array` buffer containing series of `Uint8` lower than 255, the red, green, blue and alpha values of each successive pixel.
   * @param heightMapWidth is the width of the buffer image.
   * @param heightMapHeight is the height of the buffer image.
   * @param minHeight is the lower limit of the displacement.
   * @param maxHeight is the upper limit of the displacement.
   * @param onSuccess is an optional Javascript function to be called just after the mesh is modified. It is passed the modified mesh and must return nothing.
   * @param uvOffset is an optional vector2 used to offset UV.
   * @param uvScale is an optional vector2 used to scale UV.
   * @param forceUpdate defines whether or not to force an update of the generated buffers. This is useful to apply on a deserialized model for instance.
   * @returns the Mesh.
   */
  public applyDisplacementMapFromBuffer(
    buffer: Uint8Array,
    heightMapWidth: number,
    heightMapHeight: number,
    minHeight: number,
    maxHeight: number,
    uvOffset?: Vector2,
    uvScale?: Vector2,
    forceUpdate = false
  ): Mesh {
    if (
      !this.isVerticesDataPresent(VertexBuffer.PositionKind) ||
      !this.isVerticesDataPresent(VertexBuffer.NormalKind) ||
      !this.isVerticesDataPresent(VertexBuffer.UVKind)
    ) {
      Logger.Warn("Cannot call applyDisplacementMap: Given mesh is not complete. Position, Normal or UV are missing");
      return this.mesh;
    }

    var positions = <FloatArray>this.getVerticesData(VertexBuffer.PositionKind, true, true);
    var normals = <FloatArray>this.getVerticesData(VertexBuffer.NormalKind);
    var uvs = <number[]>this.getVerticesData(VertexBuffer.UVKind);
    var position = Vector3.Zero();
    var normal = Vector3.Zero();
    var uv = Vector2.Zero();

    uvOffset = uvOffset || Vector2.Zero();
    uvScale = uvScale || new Vector2(1, 1);

    for (var index = 0; index < positions.length; index += 3) {
      Vector3.FromArrayToRef(positions, index, position);
      Vector3.FromArrayToRef(normals, index, normal);
      Vector2.FromArrayToRef(uvs, (index / 3) * 2, uv);

      // Compute height
      var u = (Math.abs(uv.x * uvScale.x + (uvOffset.x % 1)) * (heightMapWidth - 1)) % heightMapWidth | 0;
      var v = (Math.abs(uv.y * uvScale.y + (uvOffset.y % 1)) * (heightMapHeight - 1)) % heightMapHeight | 0;

      var pos = (u + v * heightMapWidth) * 4;
      var r = buffer[pos] / 255.0;
      var g = buffer[pos + 1] / 255.0;
      var b = buffer[pos + 2] / 255.0;

      var gradient = r * 0.3 + g * 0.59 + b * 0.11;

      normal.normalize();
      normal.scaleInPlace(minHeight + (maxHeight - minHeight) * gradient);
      position = position.add(normal);

      position.toArray(positions, index);
    }

    VertexData.ComputeNormals(positions, this.getIndices(), normals);

    if (forceUpdate) {
      this.setVerticesData(VertexBuffer.PositionKind, positions);
      this.setVerticesData(VertexBuffer.NormalKind, normals);
    } else {
      this.updateVerticesData(VertexBuffer.PositionKind, positions);
      this.updateVerticesData(VertexBuffer.NormalKind, normals);
    }
    return this.mesh;
  }

  /**
   * Modifies the mesh geometry according to a displacement map.
   * A displacement map is a colored image. Each pixel color value (actually a gradient computed from red, green, blue values) will give the displacement to apply to each mesh vertex.
   * The mesh must be set as updatable. Its internal geometry is directly modified, no new buffer are allocated.
   * @param url is a string, the URL from the image file is to be downloaded.
   * @param minHeight is the lower limit of the displacement.
   * @param maxHeight is the upper limit of the displacement.
   * @param onSuccess is an optional Javascript function to be called just after the mesh is modified. It is passed the modified mesh and must return nothing.
   * @param uvOffset is an optional vector2 used to offset UV.
   * @param uvScale is an optional vector2 used to scale UV.
   * @param forceUpdate defines whether or not to force an update of the generated buffers. This is useful to apply on a deserialized model for instance.
   * @returns the Mesh.
   */
  public applyDisplacementMap(
    url: string,
    minHeight: number,
    maxHeight: number,
    onSuccess?: (mesh: Mesh) => void,
    uvOffset?: Vector2,
    uvScale?: Vector2,
    forceUpdate = false
  ): Mesh {
    // var scene = this.getScene();

    var onload = (img: HTMLImageElement | ImageBitmap) => {
      // Getting height map data
      var heightMapWidth = img.width;
      var heightMapHeight = img.height;
      var canvas = CanvasGenerator.CreateCanvas(heightMapWidth, heightMapHeight);
      var context = <CanvasRenderingContext2D>canvas.getContext("2d");

      context.drawImage(img, 0, 0);

      // Create VertexData from map data
      //Cast is due to wrong definition in lib.d.ts from ts 1.3 - https://github.com/Microsoft/TypeScript/issues/949
      var buffer = <Uint8Array>(<any>context.getImageData(0, 0, heightMapWidth, heightMapHeight).data);

      this.applyDisplacementMapFromBuffer(buffer, heightMapWidth, heightMapHeight, minHeight, maxHeight, uvOffset, uvScale, forceUpdate);
      //execute success callback, if set
      if (onSuccess) {
        onSuccess(this.mesh);
      }
    };

    Tools.LoadImage(url, onload, () => { });
    return this.mesh;
  }
}
