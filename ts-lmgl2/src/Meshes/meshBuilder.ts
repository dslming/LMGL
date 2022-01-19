import { BoxBuilder } from "./Builders/boxBuilder";
import { SphereBuilder } from "./Builders/sphereBuilder";
import { CylinderBuilder } from "./Builders/cylinderBuilder";
import { Vector4 } from "../Maths/math.vector";
import { Nullable } from "../types";
import { Scene } from "../Scene/scene";
import { Mesh } from "./mesh";
import { Color4 } from '../Maths/math.color';

/**
 * Class containing static functions to help procedurally build meshes
 */
export class MeshBuilder {
    /**
     * Creates a box mesh
     * * The parameter `size` sets the size (float) of each box side (default 1)
     * * You can set some different box dimensions by using the parameters `width`, `height` and `depth` (all by default have the same value of `size`)
     * * You can set different colors and different images to each box side by using the parameters `faceColors` (an array of 6 Color3 elements) and `faceUV` (an array of 6 Vector4 elements)
     * * Please read this tutorial : https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @see https://doc.babylonjs.com/how_to/set_shapes#box
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the box mesh
     */
    public static CreateBox(name: string, options: { size?: number, width?: number, height?: number, depth?: number, faceUV?: Vector4[], faceColors?: Color4[], sideOrientation?: number, frontUVs?: Vector4, backUVs?: Vector4, wrap?: boolean, topBaseAt?: number, bottomBaseAt?: number, updatable?: boolean }, scene: Nullable<Scene> = null): Mesh {
        return BoxBuilder.CreateBox(name, options, scene);
    }

    /**
     * Creates a sphere mesh
     * * The parameter `diameter` sets the diameter size (float) of the sphere (default 1)
     * * You can set some different sphere dimensions, for instance to build an ellipsoid, by using the parameters `diameterX`, `diameterY` and `diameterZ` (all by default have the same value of `diameter`)
     * * The parameter `segments` sets the sphere number of horizontal stripes (positive integer, default 32)
     * * You can create an unclosed sphere with the parameter `arc` (positive float, default 1), valued between 0 and 1, what is the ratio of the circumference (latitude) : 2 x PI x ratio
     * * You can create an unclosed sphere on its height with the parameter `slice` (positive float, default1), valued between 0 and 1, what is the height ratio (longitude)
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the sphere mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#sphere
     */
    public static CreateSphere(name: string, options: { segments?: number, diameter?: number, diameterX?: number, diameterY?: number, diameterZ?: number, arc?: number, slice?: number, sideOrientation?: number, frontUVs?: Vector4, backUVs?: Vector4, updatable?: boolean }, scene: Nullable<Scene> = null): Mesh {
        return SphereBuilder.CreateSphere(name, options, scene);
    }

    /**
     * Creates a cylinder or a cone mesh
     * * The parameter `height` sets the height size (float) of the cylinder/cone (float, default 2).
     * * The parameter `diameter` sets the diameter of the top and bottom cap at once (float, default 1).
     * * The parameters `diameterTop` and `diameterBottom` overwrite the parameter `diameter` and set respectively the top cap and bottom cap diameter (floats, default 1). The parameter "diameterBottom" can't be zero.
     * * The parameter `tessellation` sets the number of cylinder sides (positive integer, default 24). Set it to 3 to get a prism for instance.
     * * The parameter `subdivisions` sets the number of rings along the cylinder height (positive integer, default 1).
     * * The parameter `hasRings` (boolean, default false) makes the subdivisions independent from each other, so they become different faces.
     * * The parameter `enclose`  (boolean, default false) adds two extra faces per subdivision to a sliced cylinder to close it around its height axis.
     * * The parameter `cap` sets the way the cylinder is capped. Possible values : BABYLON.Mesh.NO_CAP, BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL (default).
     * * The parameter `arc` (float, default 1) is the ratio (max 1) to apply to the circumference to slice the cylinder.
     * * You can set different colors and different images to each box side by using the parameters `faceColors` (an array of n Color3 elements) and `faceUV` (an array of n Vector4 elements).
     * * The value of n is the number of cylinder faces. If the cylinder has only 1 subdivisions, n equals : top face + cylinder surface + bottom face = 3
     * * Now, if the cylinder has 5 independent subdivisions (hasRings = true), n equals : top face + 5 stripe surfaces + bottom face = 2 + 5 = 7
     * * Finally, if the cylinder has 5 independent subdivisions and is enclose, n equals : top face + 5 x (stripe surface + 2 closing faces) + bottom face = 2 + 5 * 3 = 17
     * * Each array (color or UVs) is always ordered the same way : the first element is the bottom cap, the last element is the top cap. The other elements are each a ring surface.
     * * If `enclose` is false, a ring surface is one element.
     * * If `enclose` is true, a ring surface is 3 successive elements in the array : the tubular surface, then the two closing faces.
     * * Example how to set colors and textures on a sliced cylinder : https://www.html5gamedevs.com/topic/17945-creating-a-closed-slice-of-a-cylinder/#comment-106379
     * * You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
     * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/babylon101/discover_basic_elements#side-orientation
     * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
     * @param name defines the name of the mesh
     * @param options defines the options used to create the mesh
     * @param scene defines the hosting scene
     * @returns the cylinder mesh
     * @see https://doc.babylonjs.com/how_to/set_shapes#cylinder-or-cone
     */
    public static CreateCylinder(name: string, options: { height?: number, diameterTop?: number, diameterBottom?: number, diameter?: number, tessellation?: number, subdivisions?: number, arc?: number, faceColors?: Color4[], faceUV?: Vector4[], updatable?: boolean, hasRings?: boolean, enclose?: boolean, cap?: number, sideOrientation?: number, frontUVs?: Vector4, backUVs?: Vector4 }, scene: Nullable<Scene> = null): Mesh {
        return CylinderBuilder.CreateCylinder(name, options, scene);
    }
}
