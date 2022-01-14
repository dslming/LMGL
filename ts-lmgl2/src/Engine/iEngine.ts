import { IViewportLike } from "../Maths/math.like";

export interface EngineOptions extends WebGLContextAttributes {
  /**
   * Defines that engine should compile shaders with high precision floats (if supported). True by default
   */
  useHighPrecisionFloats?: boolean;

  /**
   * Make the matrix computations to be performed in 64 bits instead of 32 bits. False by default
   */
  useHighPrecisionMatrix?: boolean;

  /**
   * Defines if animations should run using a deterministic lock step
   * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
   */
  deterministicLockstep?: boolean;
  /** Defines the maximum steps to use with deterministic lock step mode */
  lockstepMaxSteps?: number;
  /** Defines the seconds between each deterministic lock step */
  timeStep?: number;
}

/**
 * Information about the current host
 */
export interface HostInformation {
  /**
   * Defines if the current host is a mobile
   */
  isMobile: boolean;
}

export interface ISceneLike {
  _addPendingData(data: any): void;
  _removePendingData(data: any): void;
}

export interface IViewportOwnerLike {
  /**
   * Gets or sets the viewport
   */
  viewport: IViewportLike;
}
