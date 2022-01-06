import { Effect } from "../Materials/effect";
import { Material } from "../Materials/material";
import { Nullable } from "../types";

export interface iSceneCatch {
  _cachedMaterial: Nullable<Material>;
  _cachedEffect: Nullable<Effect>;
  _cachedVisibility: Nullable<number>;
}

export class SceneCatch implements iSceneCatch {
   /** @hidden */
    public _cachedMaterial: Nullable<Material>;
    /** @hidden */
    public _cachedEffect: Nullable<Effect>;
    /** @hidden */
  public _cachedVisibility: Nullable<number>;

  constructor() {

  }
}
