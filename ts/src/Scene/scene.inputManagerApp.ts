import { PickingInfo } from "../Collisions/pickingInfo";
import { PointerEventTypes } from "../Events/pointerEvents";
import { Vector2 } from "../Maths/math";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Nullable } from "../types";
import { Scene } from "./scene";
import { InputManager } from "./scene.inputManager";

export class SceneInputManagerApp {
   /**
     * Gets or sets the distance in pixel that you have to move to prevent some events. Default is 10 pixels
     */
    public static get DragMovementThreshold() {
        return InputManager.DragMovementThreshold;
    }

    public static set DragMovementThreshold(value: number) {
        InputManager.DragMovementThreshold = value;
    }

    /**
     * Time in milliseconds to wait to raise long press events if button is still pressed. Default is 500 ms
     */
    public static get LongPressDelay() {
        return InputManager.LongPressDelay;
    }

    public static set LongPressDelay(value: number) {
        InputManager.LongPressDelay = value;
    }

    /**
     * Time in milliseconds to wait to raise long press events if button is still pressed. Default is 300 ms
     */
    public static get DoubleClickDelay() {
        return InputManager.DoubleClickDelay;
    }

    public static set DoubleClickDelay(value: number) {
        InputManager.DoubleClickDelay = value;
    }

    /** If you need to check double click without raising a single click at first click, enable this flag */
    public static get ExclusiveDoubleClickMode() {
        return InputManager.ExclusiveDoubleClickMode;
    }

    public static set ExclusiveDoubleClickMode(value: boolean) {
        InputManager.ExclusiveDoubleClickMode = value;
    }

  // Pointers
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer down event
     */
    public pointerDownPredicate: (Mesh: AbstractMesh) => boolean;
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer up event
     */
    public pointerUpPredicate: (Mesh: AbstractMesh) => boolean;
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer move event
     */
    public pointerMovePredicate: (Mesh: AbstractMesh) => boolean;

    /** Callback called when a pointer move is detected */
    public onPointerMove: (evt: PointerEvent, pickInfo: PickingInfo, type: PointerEventTypes) => void;
    /** Callback called when a pointer down is detected  */
    public onPointerDown: (evt: PointerEvent, pickInfo: PickingInfo, type: PointerEventTypes) => void;
    /** Callback called when a pointer up is detected  */
    public onPointerUp: (evt: PointerEvent, pickInfo: Nullable<PickingInfo>, type: PointerEventTypes) => void;
    /** Callback called when a pointer pick is detected */
    public onPointerPick: (evt: PointerEvent, pickInfo: PickingInfo) => void;



  public inputManager: InputManager;

  constructor(scene:Scene) {
    this.inputManager = new InputManager(scene);
  }


  /**
     * Use this method to simulate a pointer move on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @returns the current scene
     */
  public simulatePointerMove(pickResult: PickingInfo, pointerEventInit?: PointerEventInit): Scene {
    this.inputManager.simulatePointerMove(pickResult, pointerEventInit);
    return this as any;
  }

  /**
   * Use this method to simulate a pointer down on a mesh
   * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
   * @param pickResult pickingInfo of the object wished to simulate pointer event on
   * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
   * @returns the current scene
   */
  public simulatePointerDown(pickResult: PickingInfo, pointerEventInit?: PointerEventInit): Scene {
    this.inputManager.simulatePointerDown(pickResult, pointerEventInit);
    return this as any;
  }

  /**
   * Use this method to simulate a pointer up on a mesh
   * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
   * @param pickResult pickingInfo of the object wished to simulate pointer event on
   * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
   * @param doubleTap indicates that the pointer up event should be considered as part of a double click (false by default)
   * @returns the current scene
   */
  public simulatePointerUp(pickResult: PickingInfo, pointerEventInit?: PointerEventInit, doubleTap?: boolean): Scene {
    this.inputManager.simulatePointerUp(pickResult, pointerEventInit, doubleTap);
    return this as any;
  }

  /**
   * Gets a boolean indicating if the current pointer event is captured (meaning that the scene has already handled the pointer down)
   * @param pointerId defines the pointer id to use in a multi-touch scenario (0 by default)
   * @returns true if the pointer was captured
   */
  public isPointerCaptured(pointerId = 0): boolean {
    return this.inputManager.isPointerCaptured(pointerId);
  }

  /**
  * Attach events to the canvas (To handle actionManagers triggers and raise onPointerMove, onPointerDown and onPointerUp
  * @param attachUp defines if you want to attach events to pointerup
  * @param attachDown defines if you want to attach events to pointerdown
  * @param attachMove defines if you want to attach events to pointermove
  */
  public attachControl(attachUp = true, attachDown = true, attachMove = true): void {
    this.inputManager.attachControl(attachUp, attachDown, attachMove);
  }

  /** Detaches all event handlers*/
  public detachControl() {
    this.inputManager.detachControl();
  }

  /**
     * Force the value of meshUnderPointer
     * @param mesh defines the mesh to use
     * @param pointerId optional pointer id when using more than one pointer
     */
  public setPointerOverMesh(mesh: Nullable<AbstractMesh>, pointerId?: number): void {
    this.inputManager.setPointerOverMesh(mesh, pointerId);
  }

  /**
   * Gets the mesh under the pointer
   * @returns a Mesh or null if no mesh is under the pointer
   */
  public getPointerOverMesh(): Nullable<AbstractMesh> {
    return this.inputManager.getPointerOverMesh();
  }

  /**
 * Gets the pointer coordinates without any translation (ie. straight out of the pointer event)
 */
  public get unTranslatedPointer(): Vector2 {
    return this.inputManager.unTranslatedPointer;
  }

  /**
    * Gets the mesh that is currently under the pointer
    */
  public get meshUnderPointer(): Nullable<AbstractMesh> {
    return this.inputManager.meshUnderPointer;
  }

  /**
   * Gets or sets the current on-screen X position of the pointer
   */
  public get pointerX(): number {
    return this.inputManager.pointerX;
  }

  public set pointerX(value: number) {
    this.inputManager.pointerX = value;
  }

  /**
   * Gets or sets the current on-screen Y position of the pointer
   */
  public get pointerY(): number {
    return this.inputManager.pointerY;
  }

  public set pointerY(value: number) {
    this.inputManager.pointerY = value;
  }
}
