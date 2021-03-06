import { SmartArray } from "../Misc/smartArray";
import { SubMesh } from "../Meshes/subMesh";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Nullable, DeepImmutable } from "../types";
import { Vector3 } from "../Maths/math.vector";
import { Constants } from "../Engine/constants";
import { Material } from "../Materials/material";
import { Scene } from "../Scene/scene";
import { Camera } from "../Cameras/camera";

/**
 * This represents the object necessary to create a rendering group.
 * This is exclusively used and created by the rendering manager.
 * To modify the behavior, you use the available helpers in your scene or meshes.
 * 这表示创建渲染组所需的对象。
 * 这是由渲染管理器专门使用和创建的。
 * 若要修改行为，请使用场景或网格中的可用辅助对象。
 * @hidden
 */
export class RenderingGroup {
  private static _zeroVector: DeepImmutable<Vector3> = Vector3.Zero();
  private _scene: Scene;
  private _opaqueSubMeshes = new SmartArray<SubMesh>(256);
  private _transparentSubMeshes = new SmartArray<SubMesh>(256);
  private _alphaTestSubMeshes = new SmartArray<SubMesh>(256);
  private _depthOnlySubMeshes = new SmartArray<SubMesh>(256);

  private _opaqueSortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number>;
  private _alphaTestSortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number>;
  private _transparentSortCompareFn: (a: SubMesh, b: SubMesh) => number;

  private _renderOpaque: (subMeshes: SmartArray<SubMesh>) => void;
  private _renderAlphaTest: (subMeshes: SmartArray<SubMesh>) => void;
  private _renderTransparent: (subMeshes: SmartArray<SubMesh>) => void;

  /** @hidden */
  // public _edgesRenderers = new SmartArrayNoDuplicate<IEdgesRenderer>(16);

  public onBeforeTransparentRendering: () => void;

  /**
   * Set the opaque sort comparison function.
   * If null the sub meshes will be render in the order they were created
   */
  public set opaqueSortCompareFn(value: Nullable<(a: SubMesh, b: SubMesh) => number>) {
    this._opaqueSortCompareFn = value;
    if (value) {
      this._renderOpaque = this.renderOpaqueSorted;
    } else {
      this._renderOpaque = RenderingGroup.renderUnsorted;
    }
  }

  /**
   * Set the alpha test sort comparison function.
   * If null the sub meshes will be render in the order they were created
   */
  public set alphaTestSortCompareFn(value: Nullable<(a: SubMesh, b: SubMesh) => number>) {
    this._alphaTestSortCompareFn = value;
    if (value) {
      this._renderAlphaTest = this.renderAlphaTestSorted;
    } else {
      this._renderAlphaTest = RenderingGroup.renderUnsorted;
    }
  }

  /**
   * Set the transparent sort comparison function.
   * If null the sub meshes will be render in the order they were created
   */
  public set transparentSortCompareFn(value: Nullable<(a: SubMesh, b: SubMesh) => number>) {
    if (value) {
      this._transparentSortCompareFn = value;
    } else {
      this._transparentSortCompareFn = RenderingGroup.defaultTransparentSortCompare;
    }
    this._renderTransparent = this.renderTransparentSorted;
  }

  /**
   * Creates a new rendering group.
   * @param index The rendering group index
   * @param opaqueSortCompareFn The opaque sort comparison function. If null no order is applied
   * @param alphaTestSortCompareFn The alpha test sort comparison function. If null no order is applied
   * @param transparentSortCompareFn The transparent sort comparison function. If null back to front + alpha index sort is applied
   */
  constructor(
    public index: number,
    scene: Scene,
    opaqueSortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number> = null,
    alphaTestSortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number> = null,
    transparentSortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number> = null
  ) {
    this._scene = scene;

    this.opaqueSortCompareFn = opaqueSortCompareFn;
    this.alphaTestSortCompareFn = alphaTestSortCompareFn;
    this.transparentSortCompareFn = transparentSortCompareFn;
  }

  /**
   * Render all the sub meshes contained in the group.
   * @param customRenderFunction Used to override the default render behaviour of the group.
   * @returns true if rendered some submeshes.
   */
  public render(
    customRenderFunction: Nullable<
      (
        opaqueSubMeshes: SmartArray<SubMesh>,
        transparentSubMeshes: SmartArray<SubMesh>,
        alphaTestSubMeshes: SmartArray<SubMesh>,
        depthOnlySubMeshes: SmartArray<SubMesh>
      ) => void
    >,
    renderSprites: boolean,
    renderParticles: boolean,
    activeMeshes: Nullable<AbstractMesh[]>
  ): void {
    if (customRenderFunction) {
      customRenderFunction(this._opaqueSubMeshes, this._alphaTestSubMeshes, this._transparentSubMeshes, this._depthOnlySubMeshes);
      return;
    }

    var engine = this._scene.getEngine();

    // Depth only
    if (this._depthOnlySubMeshes.length !== 0) {
      engine.engineState.setColorWrite(false);
      this._renderAlphaTest(this._depthOnlySubMeshes);
      engine.engineState.setColorWrite(true);
    }

    // Opaque
    if (this._opaqueSubMeshes.length !== 0) {
      this._renderOpaque(this._opaqueSubMeshes);
    }

    // Alpha test
    if (this._alphaTestSubMeshes.length !== 0) {
      this._renderAlphaTest(this._alphaTestSubMeshes);
    }

    var stencilState = engine.engineState.getStencilBuffer();
    engine.engineState.setStencilBuffer(false);

    if (this.onBeforeTransparentRendering) {
      this.onBeforeTransparentRendering();
    }

    // Transparent
    if (this._transparentSubMeshes.length !== 0) {
      engine.engineState.setStencilBuffer(stencilState);
      this._renderTransparent(this._transparentSubMeshes);
      engine.engineAlpha.setAlphaMode(Constants.ALPHA_DISABLE);
    }

    // Set back stencil to false in case it changes before the edge renderer.
    engine.engineState.setStencilBuffer(false);

    // Restore Stencil state.
    engine.engineState.setStencilBuffer(stencilState);
  }

  /**
   * Renders the opaque submeshes in the order from the opaqueSortCompareFn.
   * @param subMeshes The submeshes to render
   */
  private renderOpaqueSorted(subMeshes: SmartArray<SubMesh>): void {
    return RenderingGroup.renderSorted(subMeshes, this._opaqueSortCompareFn, this._scene.sceneRender.activeCamera, false);
  }

  /**
   * Renders the opaque submeshes in the order from the alphatestSortCompareFn.
   * @param subMeshes The submeshes to render
   */
  private renderAlphaTestSorted(subMeshes: SmartArray<SubMesh>): void {
    return RenderingGroup.renderSorted(subMeshes, this._alphaTestSortCompareFn, this._scene.sceneRender.activeCamera, false);
  }

  /**
   * Renders the opaque submeshes in the order from the transparentSortCompareFn.
   * @param subMeshes The submeshes to render
   */
  private renderTransparentSorted(subMeshes: SmartArray<SubMesh>): void {
    return RenderingGroup.renderSorted(subMeshes, this._transparentSortCompareFn, this._scene.sceneRender.activeCamera, true);
  }

  /**
   * Renders the submeshes in a specified order.
   * @param subMeshes The submeshes to sort before render
   * @param sortCompareFn The comparison function use to sort
   * @param cameraPosition The camera position use to preprocess the submeshes to help sorting
   * @param transparent Specifies to activate blending if true
   */
  private static renderSorted(
    subMeshes: SmartArray<SubMesh>,
    sortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number>,
    camera: Nullable<Camera>,
    transparent: boolean
  ): void {
    let subIndex = 0;
    let subMesh: SubMesh;
    let cameraPosition = camera ? camera.globalPosition : RenderingGroup._zeroVector;
    for (; subIndex < subMeshes.length; subIndex++) {
      subMesh = subMeshes.data[subIndex];
      subMesh._alphaIndex = subMesh.getMesh().alphaIndex;
      subMesh._distanceToCamera = Vector3.Distance(subMesh.getBoundingInfo().boundingSphere.centerWorld, cameraPosition);
    }

    let sortedArray = subMeshes.data.slice(0, subMeshes.length);

    if (sortCompareFn) {
      sortedArray.sort(sortCompareFn);
    }

    for (subIndex = 0; subIndex < sortedArray.length; subIndex++) {
      subMesh = sortedArray[subIndex];

      if (transparent) {
        let material = subMesh.getMaterial();

        if (material && material.needDepthPrePass) {
          let engine = material.getScene().getEngine();
          //   engine.setColorWrite(false);
          //   engine.setAlphaMode(Constants.ALPHA_DISABLE);
          subMesh.render(false);
          //   engine.setColorWrite(true);
        }
      }

      subMesh.render(transparent);
    }
  }

  /**
   * Renders the submeshes in the order they were dispatched (no sort applied).
   * @param subMeshes The submeshes to render
   */
  private static renderUnsorted(subMeshes: SmartArray<SubMesh>): void {
    for (var subIndex = 0; subIndex < subMeshes.length; subIndex++) {
      let submesh = subMeshes.data[subIndex];
      submesh.render(false);
    }
  }

  /**
   * Build in function which can be applied to ensure meshes of a special queue (opaque, alpha test, transparent)
   * are rendered back to front if in the same alpha index.
   *
   * @param a The first submesh
   * @param b The second submesh
   * @returns The result of the comparison
   */
  public static defaultTransparentSortCompare(a: SubMesh, b: SubMesh): number {
    // Alpha index first
    if (a._alphaIndex > b._alphaIndex) {
      return 1;
    }
    if (a._alphaIndex < b._alphaIndex) {
      return -1;
    }

    // Then distance to camera
    return RenderingGroup.backToFrontSortCompare(a, b);
  }

  /**
   * Build in function which can be applied to ensure meshes of a special queue (opaque, alpha test, transparent)
   * are rendered back to front.
   *
   * @param a The first submesh
   * @param b The second submesh
   * @returns The result of the comparison
   */
  public static backToFrontSortCompare(a: SubMesh, b: SubMesh): number {
    // Then distance to camera
    if (a._distanceToCamera < b._distanceToCamera) {
      return 1;
    }
    if (a._distanceToCamera > b._distanceToCamera) {
      return -1;
    }

    return 0;
  }

  /**
   * Build in function which can be applied to ensure meshes of a special queue (opaque, alpha test, transparent)
   * are rendered front to back (prevent overdraw).
   *
   * @param a The first submesh
   * @param b The second submesh
   * @returns The result of the comparison
   */
  public static frontToBackSortCompare(a: SubMesh, b: SubMesh): number {
    // Then distance to camera
    if (a._distanceToCamera < b._distanceToCamera) {
      return -1;
    }
    if (a._distanceToCamera > b._distanceToCamera) {
      return 1;
    }

    return 0;
  }

  /**
   * Resets the different lists of submeshes to prepare a new frame.
   */
  public prepare(): void {
    this._opaqueSubMeshes.reset();
    this._transparentSubMeshes.reset();
    this._alphaTestSubMeshes.reset();
    this._depthOnlySubMeshes.reset();
  }

  public dispose(): void {
    this._opaqueSubMeshes.dispose();
    this._transparentSubMeshes.dispose();
    this._alphaTestSubMeshes.dispose();
    this._depthOnlySubMeshes.dispose();
  }

  /**
   * Inserts the submesh in its correct queue depending on its material.
   * @param subMesh The submesh to dispatch
   * @param [mesh] Optional reference to the submeshes's mesh. Provide if you have an exiting reference to improve performance.
   * @param [material] Optional reference to the submeshes's material. Provide if you have an exiting reference to improve performance.
   */
  public dispatch(subMesh: SubMesh, mesh?: AbstractMesh, material?: Nullable<Material>): void {
    // Get mesh and materials if not provided
    if (mesh === undefined) {
      mesh = subMesh.getMesh();
    }
    if (material === undefined) {
      material = subMesh.getMaterial();
    }

    if (material === null || material === undefined) {
      return;
    }

    if (material.needAlphaBlendingForMesh(mesh)) {
      // Transparent
      this._transparentSubMeshes.push(subMesh);
    } else if (material.needAlphaTesting()) {
      // Alpha test
      if (material.needDepthPrePass) {
        this._depthOnlySubMeshes.push(subMesh);
      }

      this._alphaTestSubMeshes.push(subMesh);
    } else {
      if (material.needDepthPrePass) {
        this._depthOnlySubMeshes.push(subMesh);
      }

      // Opaque
      this._opaqueSubMeshes.push(subMesh);
    }

    mesh._renderingGroup = this;
  }
}
