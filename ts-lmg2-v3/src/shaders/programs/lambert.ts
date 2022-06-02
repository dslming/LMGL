import { Engine } from "../../engines/engine";
import { versionCode } from "../common";
import { shaderChunks as chunks } from "../chunks";

export function getShaderVS(engine: Engine, options?: any):string {
  let vsShader = "";
  vsShader += versionCode(engine);
  vsShader + chunks.baseVS;
  return vsShader;
}

export function getShaderFS(engine: Engine, options?: any):string {
  let fsShader = ""
  fsShader += versionCode(engine);
  return fsShader;
}
