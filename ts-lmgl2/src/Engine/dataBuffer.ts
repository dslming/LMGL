/**
 * Class used to store gfx data (like WebGLBuffer)
 * 不可直接使用, 被 webGLDataBuffer 继承
 */
export class DataBuffer {
  /**
   * Gets or sets the number of objects referencing this buffer
   */
  public references: number = 0;
  /** Gets or sets the size of the underlying buffer */
  public capacity: number = 0;
  /**
   * Gets or sets a boolean indicating if the buffer contains 32bits indices
   */
  public is32Bits: boolean = false;

  /**
   * Gets the underlying buffer
   */
  public get underlyingResource(): any {
    return null;
  }
}
