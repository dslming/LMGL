import { AbstractMesh } from '../Meshes/abstractMesh';
import { Node } from '../node'

export class Light extends Node{
  public renderPriority: number = 0;

  /**
     * Specifies if the light will affect the passed mesh.
     * @param mesh The mesh to test against the light
     * @return true the mesh is affected otherwise, false.
     */
  public canAffectMesh(mesh: AbstractMesh): boolean {
    // if (!mesh) {
    //   return true;
    // }

    // if (this.includedOnlyMeshes && this.includedOnlyMeshes.length > 0 && this.includedOnlyMeshes.indexOf(mesh) === -1) {
    //   return false;
    // }

    // if (this.excludedMeshes && this.excludedMeshes.length > 0 && this.excludedMeshes.indexOf(mesh) !== -1) {
    //   return false;
    // }

    // if (this.includeOnlyWithLayerMask !== 0 && (this.includeOnlyWithLayerMask & mesh.layerMask) === 0) {
    //   return false;
    // }

    // if (this.excludeWithLayerMask !== 0 && this.excludeWithLayerMask & mesh.layerMask) {
    //   return false;
    // }

    return true;
  }

  /**
 * Sort function to order lights for rendering.
 * @param a First Light object to compare to second.
 * @param b Second Light object to compare first.
 * @return -1 to reduce's a's index relative to be, 0 for no change, 1 to increase a's index relative to b.
 */
  public static CompareLightsPriority(a: Light, b: Light): number {
    //shadow-casting lights have priority over non-shadow-casting lights
    //the renderPrioirty is a secondary sort criterion
    // if (a.shadowEnabled !== b.shadowEnabled) {
    //   return (b.shadowEnabled ? 1 : 0) - (a.shadowEnabled ? 1 : 0);
    // }
    return b.renderPriority - a.renderPriority;
  }
}
