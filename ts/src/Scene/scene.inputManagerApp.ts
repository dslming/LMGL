import { PickingInfo } from "../Collisions/pickingInfo";
import { Vector2 } from "../Maths/math";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Nullable } from "../types";
import { Scene } from "./scene";
import { InputManager } from "./scene.inputManager";

export class InputManagerApp {
  /** @hidden */
  public _inputManager: InputManager = new InputManager(this as any);

  /**
     * Use this method to simulate a pointer move on a mesh
     * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
     * @param pickResult pickingInfo of the object wished to simulate pointer event on
     * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
     * @returns the current scene
     */
  public simulatePointerMove(pickResult: PickingInfo, pointerEventInit?: PointerEventInit): Scene {
    this._inputManager.simulatePointerMove(pickResult, pointerEventInit);
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
    this._inputManager.simulatePointerDown(pickResult, pointerEventInit);
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
    this._inputManager.simulatePointerUp(pickResult, pointerEventInit, doubleTap);
    return this as any;
  }

  /**
   * Gets a boolean indicating if the current pointer event is captured (meaning that the scene has already handled the pointer down)
   * @param pointerId defines the pointer id to use in a multi-touch scenario (0 by default)
   * @returns true if the pointer was captured
   */
  public isPointerCaptured(pointerId = 0): boolean {
    return this._inputManager.isPointerCaptured(pointerId);
  }

  /**
  * Attach events to the canvas (To handle actionManagers triggers and raise onPointerMove, onPointerDown and onPointerUp
  * @param attachUp defines if you want to attach events to pointerup
  * @param attachDown defines if you want to attach events to pointerdown
  * @param attachMove defines if you want to attach events to pointermove
  */
  public attachControl(attachUp = true, attachDown = true, attachMove = true): void {
    this._inputManager.attachControl(attachUp, attachDown, attachMove);
  }

  /** Detaches all event handlers*/
  public detachControl() {
    this._inputManager.detachControl();
  }

  /**
     * Force the value of meshUnderPointer
     * @param mesh defines the mesh to use
     * @param pointerId optional pointer id when using more than one pointer
     */
  public setPointerOverMesh(mesh: Nullable<AbstractMesh>, pointerId?: number): void {
    this._inputManager.setPointerOverMesh(mesh, pointerId);
  }

  /**
   * Gets the mesh under the pointer
   * @returns a Mesh or null if no mesh is under the pointer
   */
  public getPointerOverMesh(): Nullable<AbstractMesh> {
    return this._inputManager.getPointerOverMesh();
  }

  /**
 * Gets the pointer coordinates without any translation (ie. straight out of the pointer event)
 */
  public get unTranslatedPointer(): Vector2 {
    return this._inputManager.unTranslatedPointer;
  }

  /**
    * Gets the mesh that is currently under the pointer
    */
  public get meshUnderPointer(): Nullable<AbstractMesh> {
    return this._inputManager.meshUnderPointer;
  }

  /**
   * Gets or sets the current on-screen X position of the pointer
   */
  public get pointerX(): number {
    return this._inputManager.pointerX;
  }

  public set pointerX(value: number) {
    this._inputManager.pointerX = value;
  }

  /**
   * Gets or sets the current on-screen Y position of the pointer
   */
  public get pointerY(): number {
    return this._inputManager.pointerY;
  }

  public set pointerY(value: number) {
    this._inputManager.pointerY = value;
  }
}
