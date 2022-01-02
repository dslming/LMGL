export interface IDisposable {
    /**
     * Releases all held resources
     */
    dispose(): void;
}

/** Interface defining initialization parameters for Scene class */
export interface SceneOptions {
    /**
     * Defines that scene should keep up-to-date a map of geometry to enable fast look-up by uniqueId
     * It will improve performance when the number of geometries becomes important.
     */
    useGeometryUniqueIdsMap?: boolean;

    /**
     * Defines that each material of the scene should keep up-to-date a map of referencing meshes for fast diposing
     * It will improve performance when the number of mesh becomes important, but might consume a bit more memory
     */
    useMaterialMeshMap?: boolean;

    /**
     * Defines that each mesh of the scene should keep up-to-date a map of referencing cloned meshes for fast diposing
     * It will improve performance when the number of mesh becomes important, but might consume a bit more memory
     */
    useClonedMeshMap?: boolean;

    /** Defines if the creation of the scene should impact the engine (Eg. UtilityLayer's scene) */
    virtual?: boolean;
}
