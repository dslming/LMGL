import { BoundingInfo } from "../Culling/boundingInfo";
import { Constants } from "../Engine/constants";
import { Color3, Matrix, Quaternion, Vector3 } from "../Maths/math";
import { Logger } from "../Misc/logger";
import { Tags } from "../Misc/tags";
import { Scene } from "../Scene/scene";
import { Nullable } from "../types";
import { AbstractMesh } from "./abstractMesh";
import { Mesh } from "./mesh";
import { VertexData } from "./mesh.vertexData";
import { SubMesh } from "./subMesh";
import { VertexBuffer } from "./vertexBuffer";

// Tools
export class MeshTool {

  /**
   * Returns an object containing a min and max Vector3 which are the minimum and maximum vectors of each mesh bounding box from the passed array, in the world coordinates
   * @param meshes defines the list of meshes to scan
   * @returns an object `{min:` Vector3`, max:` Vector3`}`
   */
  public static MinMax(meshes: AbstractMesh[]): { min: Vector3; max: Vector3 } {
    var minVector: Nullable<Vector3> = null;
    var maxVector: Nullable<Vector3> = null;

    meshes.forEach(function (mesh) {
      let boundingInfo = mesh.getBoundingInfo();

      let boundingBox = boundingInfo.boundingBox;
      if (!minVector || !maxVector) {
        minVector = boundingBox.minimumWorld;
        maxVector = boundingBox.maximumWorld;
      } else {
        minVector.minimizeInPlace(boundingBox.minimumWorld);
        maxVector.maximizeInPlace(boundingBox.maximumWorld);
      }
    });

    if (!minVector || !maxVector) {
      return {
        min: Vector3.Zero(),
        max: Vector3.Zero(),
      };
    }

    return {
      min: minVector,
      max: maxVector,
    };
  }

  /**
   * Returns the center of the `{min:` Vector3`, max:` Vector3`}` or the center of MinMax vector3 computed from a mesh array
   * @param meshesOrMinMaxVector could be an array of meshes or a `{min:` Vector3`, max:` Vector3`}` object
   * @returns a vector3
   */
  public static Center(meshesOrMinMaxVector: { min: Vector3; max: Vector3 } | AbstractMesh[]): Vector3 {
    var minMaxVector = meshesOrMinMaxVector instanceof Array ? MeshTool.MinMax(meshesOrMinMaxVector) : meshesOrMinMaxVector;
    return Vector3.Center(minMaxVector.min, minMaxVector.max);
  }

  /**
   * Merge the array of meshes into a single mesh for performance reasons.
   * @param meshes defines he vertices source.  They should all be of the same material.  Entries can empty
   * @param disposeSource when true (default), dispose of the vertices from the source meshes
   * @param allow32BitsIndices when the sum of the vertices > 64k, this must be set to true
   * @param meshSubclass when set, vertices inserted into this Mesh.  Meshes can then be merged into a Mesh sub-class.
   * @param subdivideWithSubMeshes when true (false default), subdivide mesh to his subMesh array with meshes source.
   * @param multiMultiMaterials when true (false default), subdivide mesh and accept multiple multi materials, ignores subdivideWithSubMeshes.
   * @returns a new mesh
   */
  public static MergeMeshes(
    meshes: Array<Mesh>,
    disposeSource = true,
    allow32BitsIndices?: boolean,
    meshSubclass?: Mesh,
    subdivideWithSubMeshes?: boolean,
    multiMultiMaterials?: boolean
  ): Nullable<Mesh> {
    var index: number;
    if (!allow32BitsIndices) {
      var totalVertices = 0;

      // Counting vertices
      for (index = 0; index < meshes.length; index++) {
        if (meshes[index]) {
          totalVertices += meshes[index].getTotalVertices();

          if (totalVertices >= 65536) {
            Logger.Warn(
              "Cannot merge meshes because resulting mesh will have more than 65536 vertices. Please use allow32BitsIndices = true to use 32 bits indices"
            );
            return null;
          }
        }
      }
    }

    // Merge
    var vertexData: Nullable<VertexData> = null;
    var otherVertexData: VertexData;
    var indiceArray: Array<number> = new Array<number>();
    var source: Nullable<Mesh> = null;
    for (index = 0; index < meshes.length; index++) {
      if (meshes[index]) {
        var mesh = meshes[index];
        if (mesh.isAnInstance) {
          Logger.Warn("Cannot merge instance meshes.");
          return null;
        }

        const wm = mesh.computeWorldMatrix(true);
        otherVertexData = VertexData.ExtractFromMesh(mesh, true, true);
        otherVertexData.transform(wm);

        if (vertexData) {
          vertexData.merge(otherVertexData, allow32BitsIndices);
        } else {
          vertexData = otherVertexData;
          source = mesh;
        }
        if (subdivideWithSubMeshes) {
          indiceArray.push(mesh.getTotalIndices());
        }
      }
    }

    source = <Mesh>source;

    if (!meshSubclass) {
      meshSubclass = new Mesh(source.name + "_merged", source.getScene());
    }

    (<VertexData>vertexData).applyToMesh(meshSubclass);

    // Setting properties
    // meshSubclass.checkCollisions = source.checkCollisions;
    meshSubclass.overrideMaterialSideOrientation = source.overrideMaterialSideOrientation;

    // Cleaning
    if (disposeSource) {
      for (index = 0; index < meshes.length; index++) {
        if (meshes[index]) {
          meshes[index].dispose();
        }
      }
    }

    // Subdivide
    if (subdivideWithSubMeshes || multiMultiMaterials) {
      //-- removal of global submesh
      meshSubclass.releaseSubMeshes();
      index = 0;
      var offset = 0;

      //-- apply subdivision according to index table
      while (index < indiceArray.length) {
        SubMesh.CreateFromIndices(0, offset, indiceArray[index], meshSubclass);
        offset += indiceArray[index];
        index++;
      }
    }

    if (multiMultiMaterials) {
    } else {
      meshSubclass.material = source.material;
    }

    return meshSubclass;
  }

  /**
 * Returns a new Mesh object parsed from the source provided.
 * @param parsedMesh is the source
 * @param scene defines the hosting scene
 * @param rootUrl is the root URL to prefix the `delayLoadingFile` property with
 * @returns a new Mesh
 */
  public static Parse(parsedMesh: any, scene: Scene, rootUrl: string): Mesh {
    var mesh: Mesh;

    if (parsedMesh.type && parsedMesh.type === "GroundMesh") {
      mesh = Mesh._GroundMeshParser(parsedMesh, scene);
    } else {
      mesh = new Mesh(parsedMesh.name, scene);
    }
    mesh.id = parsedMesh.id;

    if (Tags) {
      Tags.AddTagsTo(mesh, parsedMesh.tags);
    }

    mesh.position = Vector3.FromArray(parsedMesh.position);

    if (parsedMesh.metadata !== undefined) {
      mesh.metadata = parsedMesh.metadata;
    }

    if (parsedMesh.rotationQuaternion) {
      mesh.rotationQuaternion = Quaternion.FromArray(parsedMesh.rotationQuaternion);
    } else if (parsedMesh.rotation) {
      mesh.rotation = Vector3.FromArray(parsedMesh.rotation);
    }

    mesh.scaling = Vector3.FromArray(parsedMesh.scaling);

    if (parsedMesh.localMatrix) {
      mesh.setPreTransformMatrix(Matrix.FromArray(parsedMesh.localMatrix));
    } else if (parsedMesh.pivotMatrix) {
      mesh.setPivotMatrix(Matrix.FromArray(parsedMesh.pivotMatrix));
    }

    mesh.setEnabled(parsedMesh.isEnabled);
    mesh.isVisible = parsedMesh.isVisible;
    mesh.infiniteDistance = parsedMesh.infiniteDistance;

    // mesh.showBoundingBox = parsedMesh.showBoundingBox;
    mesh.showSubMeshesBoundingBox = parsedMesh.showSubMeshesBoundingBox;

    if (parsedMesh.applyFog !== undefined) {
      mesh.applyFog = parsedMesh.applyFog;
    }

    if (parsedMesh.pickable !== undefined) {
      mesh.isPickable = parsedMesh.pickable;
    }

    if (parsedMesh.alphaIndex !== undefined) {
      mesh.alphaIndex = parsedMesh.alphaIndex;
    }

    mesh.receiveShadows = parsedMesh.receiveShadows;

    mesh.billboardMode = parsedMesh.billboardMode;

    if (parsedMesh.visibility !== undefined) {
      mesh.visibility = parsedMesh.visibility;
    }

    // mesh.checkCollisions = parsedMesh.checkCollisions;
    mesh.overrideMaterialSideOrientation = parsedMesh.overrideMaterialSideOrientation;

    if (parsedMesh.isBlocker !== undefined) {
      mesh.isBlocker = parsedMesh.isBlocker;
    }

    mesh._shouldGenerateFlatShading = parsedMesh.useFlatShading;

    // freezeWorldMatrix
    if (parsedMesh.freezeWorldMatrix) {
      mesh._waitingData.freezeWorldMatrix = parsedMesh.freezeWorldMatrix;
    }

    // Parent
    if (parsedMesh.parentId) {
      mesh._waitingParentId = parsedMesh.parentId;
    }

    // Actions
    if (parsedMesh.actions !== undefined) {
      mesh._waitingData.actions = parsedMesh.actions;
    }

    // Overlay
    if (parsedMesh.overlayAlpha !== undefined) {
      mesh.overlayAlpha = parsedMesh.overlayAlpha;
    }

    if (parsedMesh.overlayColor !== undefined) {
      mesh.overlayColor = Color3.FromArray(parsedMesh.overlayColor);
    }

    if (parsedMesh.renderOverlay !== undefined) {
      // mesh.renderOverlay = parsedMesh.renderOverlay;
    }

    // Geometry
    mesh.isUnIndexed = !!parsedMesh.isUnIndexed;
    mesh.hasVertexAlpha = parsedMesh.hasVertexAlpha;

    if (parsedMesh.delayLoadingFile) {
      mesh.delayLoadState = Constants.DELAYLOADSTATE_NOTLOADED;
      mesh.delayLoadingFile = rootUrl + parsedMesh.delayLoadingFile;
      mesh._boundingInfo = new BoundingInfo(Vector3.FromArray(parsedMesh.boundingBoxMinimum), Vector3.FromArray(parsedMesh.boundingBoxMaximum));

      if (parsedMesh._binaryInfo) {
        mesh._binaryInfo = parsedMesh._binaryInfo;
      }

      mesh._delayInfo = [];
      if (parsedMesh.hasUVs) {
        mesh._delayInfo.push(VertexBuffer.UVKind);
      }

      if (parsedMesh.hasUVs2) {
        mesh._delayInfo.push(VertexBuffer.UV2Kind);
      }

      if (parsedMesh.hasUVs3) {
        mesh._delayInfo.push(VertexBuffer.UV3Kind);
      }

      if (parsedMesh.hasUVs4) {
        mesh._delayInfo.push(VertexBuffer.UV4Kind);
      }

      if (parsedMesh.hasUVs5) {
        mesh._delayInfo.push(VertexBuffer.UV5Kind);
      }

      if (parsedMesh.hasUVs6) {
        mesh._delayInfo.push(VertexBuffer.UV6Kind);
      }

      if (parsedMesh.hasColors) {
        mesh._delayInfo.push(VertexBuffer.ColorKind);
      }

      if (parsedMesh.hasMatricesIndices) {
        mesh._delayInfo.push(VertexBuffer.MatricesIndicesKind);
      }

      if (parsedMesh.hasMatricesWeights) {
        mesh._delayInfo.push(VertexBuffer.MatricesWeightsKind);
      }

      // mesh._delayLoadingFunction = Geometry._ImportGeometry;

      // if (SceneLoaderFlags.ForceFullSceneLoadingForIncremental) {
      //   mesh._checkDelayState();
      // }
    } else {
      // Geometry._ImportGeometry(parsedMesh, mesh);
    }

    // Material
    if (parsedMesh.materialId) {
      mesh.setMaterialByID(parsedMesh.materialId);
    } else {
      mesh.material = null;
    }

    // Layer Mask
    if (parsedMesh.layerMask && !isNaN(parsedMesh.layerMask)) {
      mesh.layerMask = Math.abs(parseInt(parsedMesh.layerMask));
    } else {
      mesh.layerMask = 0x0fffffff;
    }

    // Levels
    if (parsedMesh.lodMeshIds) {
      mesh._waitingData.lods = {
        ids: parsedMesh.lodMeshIds,
        distances: parsedMesh.lodDistances ? parsedMesh.lodDistances : null,
        coverages: parsedMesh.lodCoverages ? parsedMesh.lodCoverages : null,
      };
    }

    // Instances
    if (parsedMesh.instances) {
      for (var index = 0; index < parsedMesh.instances.length; index++) {
        var parsedInstance = parsedMesh.instances[index];
        var instance = mesh.createInstance(parsedInstance.name);

        if (parsedInstance.id) {
          instance.id = parsedInstance.id;
        }

        if (Tags) {
          if (parsedInstance.tags) {
            Tags.AddTagsTo(instance, parsedInstance.tags);
          } else {
            Tags.AddTagsTo(instance, parsedMesh.tags);
          }
        }

        instance.position = Vector3.FromArray(parsedInstance.position);

        if (parsedInstance.metadata !== undefined) {
          instance.metadata = parsedInstance.metadata;
        }

        if (parsedInstance.parentId) {
          instance._waitingParentId = parsedInstance.parentId;
        }

        if (parsedInstance.isEnabled !== undefined && parsedInstance.isEnabled !== null) {
          instance.setEnabled(parsedInstance.isEnabled);
        }

        if (parsedInstance.isVisible !== undefined && parsedInstance.isVisible !== null) {
          instance.isVisible = parsedInstance.isVisible;
        }

        if (parsedInstance.isPickable !== undefined && parsedInstance.isPickable !== null) {
          instance.isPickable = parsedInstance.isPickable;
        }

        if (parsedInstance.rotationQuaternion) {
          instance.rotationQuaternion = Quaternion.FromArray(parsedInstance.rotationQuaternion);
        } else if (parsedInstance.rotation) {
          instance.rotation = Vector3.FromArray(parsedInstance.rotation);
        }

        instance.scaling = Vector3.FromArray(parsedInstance.scaling);

        if (parsedInstance.checkCollisions != undefined && parsedInstance.checkCollisions != null) {
          // instance.checkCollisions = parsedInstance.checkCollisions;
        }
        if (parsedInstance.pickable != undefined && parsedInstance.pickable != null) {
          instance.isPickable = parsedInstance.pickable;
        }
        // if (parsedInstance.showBoundingBox != undefined && parsedInstance.showBoundingBox != null) {
        //     instance.showBoundingBox = parsedInstance.showBoundingBox;
        // }
        if (parsedInstance.showSubMeshesBoundingBox != undefined && parsedInstance.showSubMeshesBoundingBox != null) {
          instance.showSubMeshesBoundingBox = parsedInstance.showSubMeshesBoundingBox;
        }
        if (parsedInstance.alphaIndex != undefined && parsedInstance.showSubMeshesBoundingBox != null) {
          instance.alphaIndex = parsedInstance.alphaIndex;
        }
      }
    }

    return mesh;
  }
}
