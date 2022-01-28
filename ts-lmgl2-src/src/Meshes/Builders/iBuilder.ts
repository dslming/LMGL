import { DataArray } from "../../types"

export interface iBuilder {
  position: DataArray,
  normal: DataArray,
  vertexTextureCoords: DataArray,
  indices: DataArray,
}
