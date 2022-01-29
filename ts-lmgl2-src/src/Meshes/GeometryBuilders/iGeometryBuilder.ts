import { DataArray, FloatArray, IndicesArray, Nullable } from "../../types"

export interface iGeometryBuilder {
  position: Nullable<FloatArray>,
  normal: Nullable<FloatArray>,
  vertexTextureCoords: DataArray,
  indices: Nullable<IndicesArray>,
  uv: Nullable<FloatArray>
}
