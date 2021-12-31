export class Constants {}

/** Explicit coordinates mode */
Constants.TEXTURE_EXPLICIT_MODE = 0;
/** Spherical coordinates mode */
Constants.TEXTURE_SPHERICAL_MODE = 1;
/** Planar coordinates mode */
Constants.TEXTURE_PLANAR_MODE = 2;
/** Cubic coordinates mode */
Constants.TEXTURE_CUBIC_MODE = 3;
/** Projection coordinates mode */
Constants.TEXTURE_PROJECTION_MODE = 4;
/** Skybox coordinates mode */
Constants.TEXTURE_SKYBOX_MODE = 5;
/** Inverse Cubic coordinates mode */
Constants.TEXTURE_INVCUBIC_MODE = 6;
/** Equirectangular coordinates mode */
Constants.TEXTURE_EQUIRECTANGULAR_MODE = 7;
/** Equirectangular Fixed coordinates mode */
Constants.TEXTURE_FIXED_EQUIRECTANGULAR_MODE = 8;
/** Equirectangular Fixed Mirrored coordinates mode */
Constants.TEXTURE_FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
/** Offline (baking) quality for texture filtering */
Constants.TEXTURE_FILTERING_QUALITY_OFFLINE = 4096;
/** High quality for texture filtering */
Constants.TEXTURE_FILTERING_QUALITY_HIGH = 64;
/** Medium quality for texture filtering */
Constants.TEXTURE_FILTERING_QUALITY_MEDIUM = 16;
/** Low quality for texture filtering */
Constants.TEXTURE_FILTERING_QUALITY_LOW = 8;
// Texture rescaling mode
/** Defines that texture rescaling will use a floor to find the closer power of 2 size */
Constants.SCALEMODE_FLOOR = 1;
/** Defines that texture rescaling will look for the nearest power of 2 size */
Constants.SCALEMODE_NEAREST = 2;
/** Defines that texture rescaling will use a ceil to find the closer power of 2 size */
Constants.SCALEMODE_CEILING = 3;
/**
 * The dirty texture flag value
 */
Constants.MATERIAL_TextureDirtyFlag = 1;
/**
 * The dirty light flag value
 */
Constants.MATERIAL_LightDirtyFlag = 2;
/**
 * The dirty fresnel flag value
 */
Constants.MATERIAL_FresnelDirtyFlag = 4;
/**
 * The dirty attribute flag value
 */
Constants.MATERIAL_AttributesDirtyFlag = 8;
/**
 * The dirty misc flag value
 */
Constants.MATERIAL_MiscDirtyFlag = 16;
/**
 * The dirty prepass flag value
 */
Constants.MATERIAL_PrePassDirtyFlag = 32;
/**
 * The all dirty flag value
 */
Constants.MATERIAL_AllDirtyFlag = 63;
/**
 * Returns the triangle fill mode
 */
Constants.MATERIAL_TriangleFillMode = 0;
/**
 * Returns the wireframe mode
 */
Constants.MATERIAL_WireFrameFillMode = 1;
/**
 * Returns the point fill mode
 */
Constants.MATERIAL_PointFillMode = 2;
/**
 * Returns the point list draw mode
 */
Constants.MATERIAL_PointListDrawMode = 3;
/**
 * Returns the line list draw mode
 */
Constants.MATERIAL_LineListDrawMode = 4;
/**
 * Returns the line loop draw mode
 */
Constants.MATERIAL_LineLoopDrawMode = 5;
/**
 * Returns the line strip draw mode
 */
Constants.MATERIAL_LineStripDrawMode = 6;
/**
 * Returns the triangle strip draw mode
 */
Constants.MATERIAL_TriangleStripDrawMode = 7;
/**
 * Returns the triangle fan draw mode
 */
Constants.MATERIAL_TriangleFanDrawMode = 8;
/**
 * Stores the clock-wise side orientation
 */
Constants.MATERIAL_ClockWiseSideOrientation = 0;
/**
 * Stores the counter clock-wise side orientation
 */
Constants.MATERIAL_CounterClockWiseSideOrientation = 1;
/**
 * Nothing
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_NothingTrigger = 0;
/**
 * On pick
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnPickTrigger = 1;
/**
 * On left pick
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnLeftPickTrigger = 2;
/**
 * On right pick
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnRightPickTrigger = 3;
/**
 * On center pick
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnCenterPickTrigger = 4;
/**
 * On pick down
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnPickDownTrigger = 5;
/**
 * On double pick
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnDoublePickTrigger = 6;
/**
 * On pick up
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnPickUpTrigger = 7;
/**
 * On pick out.
 * This trigger will only be raised if you also declared a OnPickDown
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnPickOutTrigger = 16;
/**
 * On long press
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnLongPressTrigger = 8;
/**
 * On pointer over
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnPointerOverTrigger = 9;
/**
 * On pointer out
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnPointerOutTrigger = 10;
/**
 * On every frame
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnEveryFrameTrigger = 11;
/**
 * On intersection enter
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnIntersectionEnterTrigger = 12;
/**
 * On intersection exit
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnIntersectionExitTrigger = 13;
/**
 * On key down
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnKeyDownTrigger = 14;
/**
 * On key up
 * @see https://doc.babylonjs.com/how_to/how_to_use_actions#triggers
 */
Constants.ACTION_OnKeyUpTrigger = 15;
/**
 * Billboard mode will only apply to Y axis
 */
Constants.PARTICLES_BILLBOARDMODE_Y = 2;
/**
 * Billboard mode will apply to all axes
 */
Constants.PARTICLES_BILLBOARDMODE_ALL = 7;
/**
 * Special billboard mode where the particle will be biilboard to the camera but rotated to align with direction
 */
Constants.PARTICLES_BILLBOARDMODE_STRETCHED = 8;
/** Default culling strategy : this is an exclusion test and it's the more accurate.
 *  Test order :
 *  Is the bounding sphere outside the frustum ?
 *  If not, are the bounding box vertices outside the frustum ?
 *  It not, then the cullable object is in the frustum.
 */
Constants.MESHES_CULLINGSTRATEGY_STANDARD = 0;
/** Culling strategy : Bounding Sphere Only.
 *  This is an exclusion test. It's faster than the standard strategy because the bounding box is not tested.
 *  It's also less accurate than the standard because some not visible objects can still be selected.
 *  Test : is the bounding sphere outside the frustum ?
 *  If not, then the cullable object is in the frustum.
 */
Constants.MESHES_CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY = 1;
/** Culling strategy : Optimistic Inclusion.
 *  This in an inclusion test first, then the standard exclusion test.
 *  This can be faster when a cullable object is expected to be almost always in the camera frustum.
 *  This could also be a little slower than the standard test when the tested object center is not the frustum but one of its bounding box vertex is still inside.
 *  Anyway, it's as accurate as the standard strategy.
 *  Test :
 *  Is the cullable object bounding sphere center in the frustum ?
 *  If not, apply the default culling strategy.
 */
Constants.MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION = 2;
/** Culling strategy : Optimistic Inclusion then Bounding Sphere Only.
 *  This in an inclusion test first, then the bounding sphere only exclusion test.
 *  This can be the fastest test when a cullable object is expected to be almost always in the camera frustum.
 *  This could also be a little slower than the BoundingSphereOnly strategy when the tested object center is not in the frustum but its bounding sphere still intersects it.
 *  It's less accurate than the standard strategy and as accurate as the BoundingSphereOnly strategy.
 *  Test :
 *  Is the cullable object bounding sphere center in the frustum ?
 *  If not, apply the Bounding Sphere Only strategy. No Bounding Box is tested here.
 */
Constants.MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY = 3;
/**
 * No logging while loading
 */
Constants.SCENELOADER_NO_LOGGING = 0;
/**
 * Minimal logging while loading
 */
Constants.SCENELOADER_MINIMAL_LOGGING = 1;
/**
 * Summary logging while loading
 */
Constants.SCENELOADER_SUMMARY_LOGGING = 2;
/**
 * Detailled logging while loading
 */
Constants.SCENELOADER_DETAILED_LOGGING = 3;
/**
 * Constant used to retrieve the irradiance texture index in the textures array in the prepass
 * using getIndex(Constants.PREPASS_IRRADIANCE_TEXTURE_TYPE)
 */
Constants.PREPASS_IRRADIANCE_TEXTURE_TYPE = 0;
/**
 * Constant used to retrieve the position texture index in the textures array in the prepass
 * using getIndex(Constants.PREPASS_POSITION_TEXTURE_INDEX)
 */
Constants.PREPASS_POSITION_TEXTURE_TYPE = 1;
/**
 * Constant used to retrieve the velocity texture index in the textures array in the prepass
 * using getIndex(Constants.PREPASS_VELOCITY_TEXTURE_INDEX)
 */
Constants.PREPASS_VELOCITY_TEXTURE_TYPE = 2;
/**
 * Constant used to retrieve the reflectivity texture index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_REFLECTIVITY_TEXTURE_TYPE)
 */
Constants.PREPASS_REFLECTIVITY_TEXTURE_TYPE = 3;
/**
 * Constant used to retrieve the lit color texture index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_COLOR_TEXTURE_TYPE)
 */
Constants.PREPASS_COLOR_TEXTURE_TYPE = 4;
/**
 * Constant used to retrieve depth + normal index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_DEPTHNORMAL_TEXTURE_TYPE)
 */
Constants.PREPASS_DEPTHNORMAL_TEXTURE_TYPE = 5;
/**
 * Constant used to retrieve albedo index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_ALBEDO_TEXTURE_TYPE)
 */
Constants.PREPASS_ALBEDO_TEXTURE_TYPE = 6;
