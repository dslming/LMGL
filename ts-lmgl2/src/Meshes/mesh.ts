import { Scene } from "../Scene/scene";
import { Nullable, FloatArray, IndicesArray } from "../types";
import { AbstractMesh } from "./abstractMesh";
import { Geometry } from "./geometry";
import { IGetSetVerticesData, VertexData } from "./mesh.vertexData";

export class Mesh extends AbstractMesh implements IGetSetVerticesData {
  public _geometry: Nullable<Geometry> = null;
  public _delayInfo: Array<string>;
  public _scene: Scene;

  isVerticesDataPresent(kind: string): boolean {
    if (!this._geometry) {
      if (this._delayInfo) {
        return this._delayInfo.indexOf(kind) !== -1;
      }
      return false;
    }
    return this._geometry.isVerticesDataPresent(kind);
  }

  getVerticesData(kind: string, copyWhenShared?: boolean, forceCopy?: boolean): Nullable<FloatArray> {
    if (!this._geometry) {
      return null;
    }
    return this._geometry.getVerticesData(kind, copyWhenShared, forceCopy);
  }
  getIndices(copyWhenShared?: boolean, forceCopy?: boolean): Nullable<IndicesArray> {
    if (!this._geometry) {
      return [];
    }
    return this._geometry.getIndices(copyWhenShared, forceCopy);
  }
  public setVerticesData(kind: string, data: FloatArray, updatable: boolean = false, stride?: number): AbstractMesh {
    if (!this._geometry) {
      var vertexData = new VertexData();
      vertexData.set(data, kind);

      var scene = this.getScene();

      new Geometry(Geometry.RandomId(), scene, vertexData, updatable, this);
    }
    else {
      this._geometry.setVerticesData(kind, data, updatable, stride);
    }
    return this;
  }

  updateVerticesData(kind: string, data: FloatArray, updateExtends?: boolean, makeItUnique?: boolean): AbstractMesh {
    if (!this._geometry) {
      return this;
    }
    if (!makeItUnique) {
      this._geometry.updateVerticesData(kind, data, updateExtends);
    }
    else {
      this.makeGeometryUnique();
      this.updateVerticesData(kind, data, updateExtends, false);
    }
    return this;
  }
  setIndices(indices: IndicesArray, totalVertices: Nullable<number>, updatable?: boolean): AbstractMesh {
    if (!this._geometry) {
      var vertexData = new VertexData();
      vertexData.indices = indices;

      var scene = this.getScene();

      new Geometry(Geometry.RandomId(), scene, vertexData, updatable, this);
    }
    else {
      this._geometry.setIndices(indices, totalVertices, updatable);
    }
    return this;
  }

  public getScene(): Scene {
    return this._scene;
  }
  /**
     * Creates a un-shared specific occurence of the geometry for the mesh.
     * @returns the current mesh
     */
  public makeGeometryUnique(): Mesh {
    if (!this._geometry) {
      return this;
    }

    if (this._geometry.meshes.length === 1) {
      return this;
    }

    var oldGeometry = this._geometry;
    var geometry = this._geometry.copy(Geometry.RandomId());
    oldGeometry.releaseForMesh(this, true);
    geometry.applyToMesh(this);
    return this;
  }
}

