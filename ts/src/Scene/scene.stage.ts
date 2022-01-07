import { CameraStageAction, CameraStageFrameBufferAction, EvaluateSubMeshStageAction, MeshStageAction, PointerMoveStageAction, PointerUpDownStageAction, PreActiveMeshStageAction, RenderingGroupStageAction, RenderingMeshStageAction, RenderTargetsStageAction, RenderTargetStageAction, SimpleStageAction, Stage } from "./sceneComponent";

export class SceneStage {

    /**
     * @hidden
     * Defines the actions happening before camera updates.
     */
    public _beforeCameraUpdateStage = Stage.Create<SimpleStageAction>();
    /**
     * @hidden
     * Defines the actions happening before clear the canvas.
     */
    public _beforeClearStage = Stage.Create<SimpleStageAction>();
    /**
     * @hidden
     * Defines the actions when collecting render targets for the frame.
     */
    public _gatherRenderTargetsStage = Stage.Create<RenderTargetsStageAction>();
    /**
     * @hidden
     * Defines the actions happening for one camera in the frame.
     */
    public _gatherActiveCameraRenderTargetsStage = Stage.Create<RenderTargetsStageAction>();
    /**
     * @hidden
     * Defines the actions happening during the per mesh ready checks.
     */
    public _isReadyForMeshStage = Stage.Create<MeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening before evaluate active mesh checks.
     */
    public _beforeEvaluateActiveMeshStage = Stage.Create<SimpleStageAction>();
    /**
     * @hidden
     * Defines the actions happening during the evaluate sub mesh checks.
     */
    public _evaluateSubMeshStage = Stage.Create<EvaluateSubMeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening during the active mesh stage.
     */
    public _preActiveMeshStage = Stage.Create<PreActiveMeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening during the per camera render target step.
     */
    public _cameraDrawRenderTargetStage = Stage.Create<CameraStageFrameBufferAction>();
    /**
     * @hidden
     * Defines the actions happening just before the active camera is drawing.
     */
    public _beforeCameraDrawStage = Stage.Create<CameraStageAction>();
    /**
     * @hidden
     * Defines the actions happening just before a render target is drawing.
     */
    public _beforeRenderTargetDrawStage = Stage.Create<RenderTargetStageAction>();
    /**
     * @hidden
     * Defines the actions happening just before a rendering group is drawing.
     */
    public _beforeRenderingGroupDrawStage = Stage.Create<RenderingGroupStageAction>();
    /**
     * @hidden
     * Defines the actions happening just before a mesh is drawing.
     */
    public _beforeRenderingMeshStage = Stage.Create<RenderingMeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after a mesh has been drawn.
     */
    public _afterRenderingMeshStage = Stage.Create<RenderingMeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after a rendering group has been drawn.
     */
    public _afterRenderingGroupDrawStage = Stage.Create<RenderingGroupStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after the active camera has been drawn.
     */
    public _afterCameraDrawStage = Stage.Create<CameraStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after a render target has been drawn.
     */
    public _afterRenderTargetDrawStage = Stage.Create<RenderTargetStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after rendering all cameras and computing intersections.
     */
    public _afterRenderStage = Stage.Create<SimpleStageAction>();
    /**
     * @hidden
     * Defines the actions happening when a pointer move event happens.
     */
    public _pointerMoveStage = Stage.Create<PointerMoveStageAction>();
    /**
     * @hidden
     * Defines the actions happening when a pointer down event happens.
     */
    public _pointerDownStage = Stage.Create<PointerUpDownStageAction>();
    /**
     * @hidden
     * Defines the actions happening when a pointer up event happens.
     */
    public _pointerUpStage = Stage.Create<PointerUpDownStageAction>();


  clear() {
    this._isReadyForMeshStage.clear();
    this._beforeEvaluateActiveMeshStage.clear();
    this._evaluateSubMeshStage.clear();
    this._preActiveMeshStage.clear();
    this._cameraDrawRenderTargetStage.clear();
    this._beforeCameraDrawStage.clear();
    this._beforeRenderTargetDrawStage.clear();
    this._beforeRenderingGroupDrawStage.clear();
    this._beforeRenderingMeshStage.clear();
    this._afterRenderingMeshStage.clear();
    this._afterRenderingGroupDrawStage.clear();
    this._afterCameraDrawStage.clear();
    this._afterRenderTargetDrawStage.clear();
    this._afterRenderStage.clear();
    this._beforeCameraUpdateStage.clear();
    this._beforeClearStage.clear();
    this._gatherRenderTargetsStage.clear();
    this._gatherActiveCameraRenderTargetsStage.clear();
    this._pointerMoveStage.clear();
    this._pointerDownStage.clear();
    this._pointerUpStage.clear();
  }
}
