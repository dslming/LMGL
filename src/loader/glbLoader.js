import { FileLoader } from './FileLoader.js';
import { Loader } from './Loader.js';
import { VertexBuffer } from './vertex-buffer.js';
import { VertexFormat } from './vertex-format.js';

import {
    typedArrayTypes, typedArrayTypesByteSize,
    ADDRESS_CLAMP_TO_EDGE, ADDRESS_MIRRORED_REPEAT, ADDRESS_REPEAT,
    BUFFER_STATIC,
    CULLFACE_NONE, CULLFACE_BACK,
    FILTER_NEAREST, FILTER_LINEAR, FILTER_NEAREST_MIPMAP_NEAREST, FILTER_LINEAR_MIPMAP_NEAREST, FILTER_NEAREST_MIPMAP_LINEAR, FILTER_LINEAR_MIPMAP_LINEAR,
    INDEXFORMAT_UINT8, INDEXFORMAT_UINT16, INDEXFORMAT_UINT32,
    PRIMITIVE_LINELOOP, PRIMITIVE_LINESTRIP, PRIMITIVE_LINES, PRIMITIVE_POINTS, PRIMITIVE_TRIANGLES, PRIMITIVE_TRIFAN, PRIMITIVE_TRISTRIP,
    SEMANTIC_POSITION, SEMANTIC_NORMAL, SEMANTIC_TANGENT, SEMANTIC_COLOR, SEMANTIC_BLENDINDICES, SEMANTIC_BLENDWEIGHT, SEMANTIC_TEXCOORD0, SEMANTIC_TEXCOORD1,
    TYPE_INT8, TYPE_UINT8, TYPE_INT16, TYPE_UINT16, TYPE_INT32, TYPE_UINT32, TYPE_FLOAT32
} from './constants.js';
import { IndexBuffer } from './index-buffer.js'

// var glb = GlbParser.parse("filename.glb", data, this._device);
//
var gltfToEngineSemanticMap = {
    'POSITION': SEMANTIC_POSITION,
    'NORMAL': SEMANTIC_NORMAL,
    'TANGENT': SEMANTIC_TANGENT,
    'COLOR_0': SEMANTIC_COLOR,
    'JOINTS_0': SEMANTIC_BLENDINDICES,
    'WEIGHTS_0': SEMANTIC_BLENDWEIGHT,
    'TEXCOORD_0': SEMANTIC_TEXCOORD0,
    'TEXCOORD_1': SEMANTIC_TEXCOORD1
};

var getPrimitiveType = function (primitive) {
    if (!primitive.hasOwnProperty('mode')) {
        return PRIMITIVE_TRIANGLES;
    }

    switch (primitive.mode) {
        case 0: return PRIMITIVE_POINTS;
        case 1: return PRIMITIVE_LINES;
        case 2: return PRIMITIVE_LINELOOP;
        case 3: return PRIMITIVE_LINESTRIP;
        case 4: return PRIMITIVE_TRIANGLES;
        case 5: return PRIMITIVE_TRISTRIP;
        case 6: return PRIMITIVE_TRIFAN;
        default: return PRIMITIVE_TRIANGLES;
    }
};

var isDataURI = function (uri) {
    return /^data:.*,.*$/i.test(uri);
};

var getDataURIMimeType = function (uri) {
    return uri.substring(uri.indexOf(":") + 1, uri.indexOf(";"));
};

var flipTexCoordVs = function (vertexBuffer) {
    var i, j;

    var floatOffsets = [];
    var shortOffsets = [];
    var byteOffsets = [];
    for (i = 0; i < vertexBuffer.format.elements.length; ++i) {
        var element = vertexBuffer.format.elements[i];
        if (element.name === SEMANTIC_TEXCOORD0 ||
            element.name === SEMANTIC_TEXCOORD1) {
            switch (element.dataType) {
                case TYPE_FLOAT32:
                    floatOffsets.push({ offset: element.offset / 4 + 1, stride: element.stride / 4 });
                    break;
                case TYPE_UINT16:
                    shortOffsets.push({ offset: element.offset / 2 + 1, stride: element.stride / 2 });
                    break;
                case TYPE_UINT8:
                    byteOffsets.push({ offset: element.offset + 1, stride: element.stride });
                    break;
            }
        }
    }

    var flip = function (offsets, type, one) {
        var typedArray = new type(vertexBuffer.storage);
        for (i = 0; i < offsets.length; ++i) {
            var index = offsets[i].offset;
            var stride = offsets[i].stride;
            for (j = 0; j < vertexBuffer.numVertices; ++j) {
                typedArray[index] = one - typedArray[index];
                index += stride;
            }
        }
    };

    if (floatOffsets.length > 0) {
        flip(floatOffsets, Float32Array, 1.0);
    }
    if (shortOffsets.length > 0) {
        flip(shortOffsets, Uint16Array, 65535);
    }
    if (byteOffsets.length > 0) {
        flip(byteOffsets, Uint8Array, 255);
    }
};

// create buffer views
var parseBufferViewsAsync = function (gltf, buffers, options, callback) {

    var result = [];

    var preprocess = options && options.bufferView && options.bufferView.preprocess;
    var processAsync = (options && options.bufferView && options.bufferView.processAsync) || function (gltfBufferView, buffers, callback) {
        callback(null, null);
    };
    var postprocess = options && options.bufferView && options.bufferView.postprocess;

    var remaining = gltf.bufferViews ? gltf.bufferViews.length : 0;

    // handle case of no buffers
    if (!remaining) {
        callback(null, null);
        return;
    }

    var onLoad = function (index, bufferView) {
        var gltfBufferView = gltf.bufferViews[index];
        if (gltfBufferView.hasOwnProperty('byteStride')) {
            bufferView.byteStride = gltfBufferView.byteStride;
        }

        result[index] = bufferView;
        if (postprocess) {
            postprocess(gltfBufferView, bufferView);
        }
        if (--remaining === 0) {
            callback(null, result);
        }
    };

    for (var i = 0; i < gltf.bufferViews.length; ++i) {
        var gltfBufferView = gltf.bufferViews[i];

        if (preprocess) {
            preprocess(gltfBufferView);
        }

        processAsync(gltfBufferView, buffers, function (i, gltfBufferView, err, result) {       // eslint-disable-line no-loop-func
            if (err) {
                callback(err);
            } else if (result) {
                onLoad(i, result);
            } else {
                var buffer = buffers[gltfBufferView.buffer];
                var typedArray = new Uint8Array(buffer.buffer,
                                                buffer.byteOffset + (gltfBufferView.hasOwnProperty('byteOffset') ? gltfBufferView.byteOffset : 0),
                                                gltfBufferView.byteLength);
                onLoad(i, typedArray);
            }
        }.bind(null, i, gltfBufferView));
    }
};

var getNumComponents = function (accessorType) {
    switch (accessorType) {
        case 'SCALAR': return 1;
        case 'VEC2': return 2;
        case 'VEC3': return 3;
        case 'VEC4': return 4;
        case 'MAT2': return 4;
        case 'MAT3': return 9;
        case 'MAT4': return 16;
        default: return 3;
    }
};

var getComponentType = function (componentType) {
    switch (componentType) {
        case 5120: return TYPE_INT8;
        case 5121: return TYPE_UINT8;
        case 5122: return TYPE_INT16;
        case 5123: return TYPE_UINT16;
        case 5124: return TYPE_INT32;
        case 5125: return TYPE_UINT32;
        case 5126: return TYPE_FLOAT32;
        default: return 0;
    }
};

var getComponentSizeInBytes = function (componentType) {
    switch (componentType) {
        case 5120: return 1;    // int8
        case 5121: return 1;    // uint8
        case 5122: return 2;    // int16
        case 5123: return 2;    // uint16
        case 5124: return 4;    // int32
        case 5125: return 4;    // uint32
        case 5126: return 4;    // float32
        default: return 0;
    }
};

var getComponentDataType = function (componentType) {
    switch (componentType) {
        case 5120: return Int8Array;
        case 5121: return Uint8Array;
        case 5122: return Int16Array;
        case 5123: return Uint16Array;
        case 5124: return Int32Array;
        case 5125: return Uint32Array;
        case 5126: return Float32Array;
        default: return null;
    }
};

var createVertexBufferInternal = function (device, sourceDesc, disableFlipV) {
    var positionDesc = sourceDesc[SEMANTIC_POSITION];
    var numVertices = positionDesc.count;

    // generate vertexDesc elements
    var vertexDesc = [];
    for (var semantic in sourceDesc) {
        if (sourceDesc.hasOwnProperty(semantic)) {
            vertexDesc.push({
                semantic: semantic,
                components: sourceDesc[semantic].components,
                type: sourceDesc[semantic].type,
                normalize: !!sourceDesc[semantic].normalize
            });
        }
    }

    // order vertexDesc to match the rest of the engine
    var elementOrder = [
        SEMANTIC_POSITION,
        SEMANTIC_NORMAL,
        SEMANTIC_TANGENT,
        SEMANTIC_COLOR,
        SEMANTIC_BLENDINDICES,
        SEMANTIC_BLENDWEIGHT,
        SEMANTIC_TEXCOORD0,
        SEMANTIC_TEXCOORD1
    ];

    // sort vertex elements by engine-ideal order
    vertexDesc.sort(function (lhs, rhs) {
        var lhsOrder = elementOrder.indexOf(lhs.semantic);
        var rhsOrder = elementOrder.indexOf(rhs.semantic);
        return (lhsOrder < rhsOrder) ? -1 : (rhsOrder < lhsOrder ? 1 : 0);
    });

    var i, j, k;
    var source, target, sourceOffset;

    var vertexFormat = new VertexFormat(device, vertexDesc);

    // check whether source data is correctly interleaved
    var isCorrectlyInterleaved = true;
    for (i = 0; i < vertexFormat.elements.length; ++i) {
        target = vertexFormat.elements[i];
        source = sourceDesc[target.name];
        sourceOffset = source.offset - positionDesc.offset;
        if ((source.buffer !== positionDesc.buffer) ||
            (source.stride !== target.stride) ||
            (source.size !== target.size) ||
            (sourceOffset !== target.offset)) {
            isCorrectlyInterleaved = false;
            break;
        }
    }

    // create vertex buffer
    var vertexBuffer = new VertexBuffer(device,
                                        vertexFormat,
                                        numVertices,
                                        BUFFER_STATIC);

    var vertexData = vertexBuffer.lock();
    var targetArray = new Uint32Array(vertexData);
    var sourceArray;

    if (isCorrectlyInterleaved) {
        // copy data
        sourceArray = new Uint32Array(positionDesc.buffer,
                                      positionDesc.offset,
                                      numVertices * vertexBuffer.format.size / 4);
        targetArray.set(sourceArray);
    } else {
        var targetStride, sourceStride;
        // copy data and interleave
        for (i = 0; i < vertexBuffer.format.elements.length; ++i) {
            target = vertexBuffer.format.elements[i];
            targetStride = target.stride / 4;

            source = sourceDesc[target.name];
            sourceArray = new Uint32Array(source.buffer, source.offset, source.count * source.stride / 4);
            sourceStride = source.stride / 4;

            var src = 0;
            var dst = target.offset / 4;
            var kend = Math.floor((source.size + 3) / 4);
            for (j = 0; j < numVertices; ++j) {
                for (k = 0; k < kend; ++k) {
                    targetArray[dst + k] = sourceArray[src + k];
                }
                src += sourceStride;
                dst += targetStride;
            }
        }
    }

    if (!disableFlipV) {
        flipTexCoordVs(vertexBuffer);
    }

    vertexBuffer.unlock();

    return vertexBuffer;
};

var createVertexBuffer = function (device, attributes, indices, accessors, bufferViews, disableFlipV, vertexBufferDict) {

    // extract list of attributes to use
    var attrib, useAttributes = {}, attribIds = [];
    for (attrib in attributes) {
        if (attributes.hasOwnProperty(attrib) && gltfToEngineSemanticMap.hasOwnProperty(attrib)) {
            useAttributes[attrib] = attributes[attrib];

            // build unique id for each attribute in format: Semantic:accessorIndex
            attribIds.push(attrib + ":" + attributes[attrib]);
        }
    }

    // sort unique ids and create unique vertex buffer ID
    attribIds.sort();
    var vbKey = attribIds.join();

    // return already created vertex buffer if identical
    var vb = vertexBufferDict[vbKey];
    if (!vb) {
        // build vertex buffer format desc and source
        var sourceDesc = {};
        for (attrib in useAttributes) {
            var accessor = accessors[attributes[attrib]];
            var accessorData = getAccessorData(accessor, bufferViews);
            var bufferView = bufferViews[accessor.bufferView];
            var semantic = gltfToEngineSemanticMap[attrib];
            var size = getNumComponents(accessor.type) * getComponentSizeInBytes(accessor.componentType);
            var stride = bufferView.hasOwnProperty('byteStride') ? bufferView.byteStride : size;
            sourceDesc[semantic] = {
                buffer: accessorData.buffer,
                size: size,
                offset: accessorData.byteOffset,
                stride: stride,
                count: accessor.count,
                components: getNumComponents(accessor.type),
                type: getComponentType(accessor.componentType),
                normalize: accessor.normalized
            };
        }

        // generate normals if they're missing (this should probably be a user option)
        if (!sourceDesc.hasOwnProperty(SEMANTIC_NORMAL)) {
            generateNormals(sourceDesc, indices);
        }

        // create and store it in the dictionary
        vb = createVertexBufferInternal(device, sourceDesc, disableFlipV);
        vertexBufferDict[vbKey] = vb;
    }

    return vb;
};

	const parseGlb = function parseGlb(glbData, callback) {
		var data = new DataView(glbData);
		var magic = data.getUint32(0, true);
		var version = data.getUint32(4, true);
		var length = data.getUint32(8, true);

		if (magic !== 0x46546C67) {
			callback("Invalid magic number found in glb header. Expected 0x46546C67, found 0x" + magic.toString(16));
			return;
		}

		if (version !== 2) {
			callback("Invalid version number found in glb header. Expected 2, found " + version);
			return;
		}

		if (length <= 0 || length > glbData.byteLength) {
			callback("Invalid length found in glb header. Found " + length);
			return;
		}

		var chunks = [];
		var offset = 12;

		while (offset < length) {
			var chunkLength = data.getUint32(offset, true);

			if (offset + chunkLength + 8 > glbData.byteLength) {
				throw new Error("Invalid chunk length found in glb. Found " + chunkLength);
			}

			var chunkType = data.getUint32(offset + 4, true);
			var chunkData = new Uint8Array(glbData, offset + 8, chunkLength);
			chunks.push({
				length: chunkLength,
				type: chunkType,
				data: chunkData
			});
			offset += chunkLength + 8;
		}

		if (chunks.length !== 1 && chunks.length !== 2) {
			callback("Invalid number of chunks found in glb file.");
			return;
		}

		if (chunks[0].type !== 0x4E4F534A) {
			callback("Invalid chunk type found in glb file. Expected 0x4E4F534A, found 0x" + chunks[0].type.toString(16));
			return;
		}

		if (chunks.length > 1 && chunks[1].type !== 0x004E4942) {
			callback("Invalid chunk type found in glb file. Expected 0x004E4942, found 0x" + chunks[1].type.toString(16));
			return;
		}

		callback(null, {
			gltfChunk: chunks[0].data,
			binaryChunk: chunks.length === 2 ? chunks[1].data : null
		});
  };

// get accessor data, making a copy and patching in the case of a sparse accessor
var getAccessorData = function (gltfAccessor, bufferViews) {
    var numComponents = getNumComponents(gltfAccessor.type);
    var dataType = getComponentDataType(gltfAccessor.componentType);
    if (!dataType) {
        return null;
    }
    var result;

    if (gltfAccessor.sparse) {
        // handle sparse data
        var sparse = gltfAccessor.sparse;

        // get indices data
        var indicesAccessor = {
            count: sparse.count,
            type: "SCALAR"
        };
        var indices = getAccessorData(Object.assign(indicesAccessor, sparse.indices), bufferViews);

        // data values data
        var valuesAccessor = {
            count: sparse.count,
            type: gltfAccessor.scalar,
            componentType: gltfAccessor.componentType
        };
        var values = getAccessorData(Object.assign(valuesAccessor, sparse.values), bufferViews);

        // get base data
        if (gltfAccessor.hasOwnProperty('bufferView')) {
            var baseAccessor = {
                bufferView: gltfAccessor.bufferView,
                byteOffset: gltfAccessor.byteOffset,
                componentType: gltfAccessor.componentType,
                count: gltfAccessor.count,
                type: gltfAccessor.type
            };
            // make a copy of the base data since we'll patch the values
            result = getAccessorData(baseAccessor, bufferViews).slice();
        } else {
            // there is no base data, create empty 0'd out data
            result = new dataType(gltfAccessor.count * numComponents);
        }

        for (var i = 0; i < sparse.count; ++i) {
            var targetIndex = indices[i];
            for (var j = 0; j < numComponents; ++j) {
                result[targetIndex * numComponents + j] = values[i * numComponents + j];
            }
        }
    } else {
        var bufferView = bufferViews[gltfAccessor.bufferView];
        result = new dataType(bufferView.buffer,
                              bufferView.byteOffset + (gltfAccessor.hasOwnProperty('byteOffset') ? gltfAccessor.byteOffset : 0),
                              gltfAccessor.count * numComponents);
    }

    return result;
};

var createMesh = function (device, gltfMesh, accessors, bufferViews, callback, disableFlipV, vertexBufferDict) {
    var meshes = [];

    gltfMesh.primitives.forEach(function (primitive) {

        var primitiveType, vertexBuffer, numIndices;
        var indices = null;
        // var mesh = new Mesh(device);
      var mesh = {
        primitive: [{}],
        indexBuffer: [{}]
      };
        var canUseMorph = true;

        // try and get draco compressed data first
        if (primitive.hasOwnProperty('extensions')) {
            var extensions = primitive.extensions;
            if (extensions.hasOwnProperty('KHR_draco_mesh_compression')) {

                // access DracoDecoderModule
                var decoderModule = window.DracoDecoderModule;
                if (decoderModule) {
                    var extDraco = extensions.KHR_draco_mesh_compression;
                    if (extDraco.hasOwnProperty('attributes')) {
                        var uint8Buffer = bufferViews[extDraco.bufferView];
                        var buffer = new decoderModule.DecoderBuffer();
                        buffer.Init(uint8Buffer, uint8Buffer.length);

                        var decoder = new decoderModule.Decoder();
                        var geometryType = decoder.GetEncodedGeometryType(buffer);

                        var outputGeometry, status;
                        switch (geometryType) {
                            case decoderModule.POINT_CLOUD:
                                primitiveType = PRIMITIVE_POINTS;
                                outputGeometry = new decoderModule.PointCloud();
                                status = decoder.DecodeBufferToPointCloud(buffer, outputGeometry);
                                break;
                            case decoderModule.TRIANGULAR_MESH:
                                primitiveType = PRIMITIVE_TRIANGLES;
                                outputGeometry = new decoderModule.Mesh();
                                status = decoder.DecodeBufferToMesh(buffer, outputGeometry);
                                break;
                            case decoderModule.INVALID_GEOMETRY_TYPE:
                            default:
                                break;
                        }

                        if (!status || !status.ok() || outputGeometry.ptr == 0) {
                            callback("Failed to decode draco compressed asset: " +
                            (status ? status.error_msg() : ('Mesh asset - invalid draco compressed geometry type: ' + geometryType) ));
                            return;
                        }

                        // indices
                        var numFaces = outputGeometry.num_faces();
                        if (geometryType == decoderModule.TRIANGULAR_MESH) {
                            var bit32 = outputGeometry.num_points() > 65535;
                            numIndices = numFaces * 3;
                            var dataSize = numIndices * (bit32 ? 4 : 2);
                            var ptr = decoderModule._malloc(dataSize);

                            if (bit32) {
                                decoder.GetTrianglesUInt32Array(outputGeometry, dataSize, ptr);
                                indices = new Uint32Array(decoderModule.HEAPU32.buffer, ptr, numIndices).slice();
                            } else {
                                decoder.GetTrianglesUInt16Array(outputGeometry, dataSize, ptr);
                                indices = new Uint16Array(decoderModule.HEAPU16.buffer, ptr, numIndices).slice();
                            }

                            decoderModule._free( ptr );
                        }

                        // vertices
                        vertexBuffer = createVertexBufferDraco(device, outputGeometry, extDraco, decoder, decoderModule, indices, disableFlipV);

                        // clean up
                        decoderModule.destroy(outputGeometry);
                        decoderModule.destroy(decoder);
                        decoderModule.destroy(buffer);

                        // morph streams are not compatible with draco compression, disable morphing
                        canUseMorph = false;
                    }
                } else {
                    // #ifdef DEBUG
                    console.warn("File contains draco compressed data, but DracoDecoderModule is not configured.");
                    // #endif
                }
            }
        }

        // if mesh was not constructed from draco data, use uncompressed
        if (!vertexBuffer) {
            indices = primitive.hasOwnProperty('indices') ? getAccessorData(accessors[primitive.indices], bufferViews) : null;
            vertexBuffer = createVertexBuffer(device, primitive.attributes, indices, accessors, bufferViews, disableFlipV, vertexBufferDict);
            primitiveType = getPrimitiveType(primitive);
        }

        // build the mesh
        mesh.vertexBuffer = vertexBuffer;
        mesh.primitive[0].type = primitiveType;
        mesh.primitive[0].base = 0;
        mesh.primitive[0].indexed = (indices !== null);

        // index buffer
        if (indices !== null) {
            var indexFormat;
            if (indices instanceof Uint8Array) {
                indexFormat = INDEXFORMAT_UINT8;
            } else if (indices instanceof Uint16Array) {
                indexFormat = INDEXFORMAT_UINT16;
            } else {
                indexFormat = INDEXFORMAT_UINT32;
            }

            // 32bit index buffer is used but not supported
            if (indexFormat === INDEXFORMAT_UINT32 && !device.extUintElement) {

                // #ifdef DEBUG
                if (vertexBuffer.numVertices > 0xFFFF) {
                    console.warn("Glb file contains 32bit index buffer but these are not supported by this device - it may be rendered incorrectly.");
                }
                // #endif

                // convert to 16bit
                indexFormat = INDEXFORMAT_UINT16;
                indices = new Uint16Array(indices);
            }

            var indexBuffer = new IndexBuffer(device, indexFormat, indices.length, BUFFER_STATIC, indices);
            mesh.indexBuffer[0] = indexBuffer;
            mesh.primitive[0].count = indices.length;
        } else {
            mesh.primitive[0].count = vertexBuffer.numVertices;
        }

        mesh.materialIndex = primitive.material;

        var accessor = accessors[primitive.attributes.POSITION];
        var min = accessor.min;
        var max = accessor.max;
        // var aabb = new BoundingBox(
        //     new Vec3((max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2),
        //     new Vec3((max[0] - min[0]) / 2, (max[1] - min[1]) / 2, (max[2] - min[2]) / 2)
        // );
        // mesh.aabb = aabb;

        // morph targets
        if (canUseMorph && primitive.hasOwnProperty('targets')) {
            var targets = [];

            primitive.targets.forEach(function (target, index) {
                var options = {};

                if (target.hasOwnProperty('POSITION')) {
                    accessor = accessors[target.POSITION];
                    options.deltaPositions = getAccessorData(accessor, bufferViews);
                    options.deltaPositionsType = getComponentType(accessor.componentType);
                    if (accessor.hasOwnProperty('min') && accessor.hasOwnProperty('max')) {
                        options.aabb = new BoundingBox();
                        options.aabb.setMinMax(new Vec3(accessor.min), new Vec3(accessor.max));
                    }
                }

                if (target.hasOwnProperty('NORMAL')) {
                    accessor = accessors[target.NORMAL];
                    options.deltaNormals = getAccessorData(accessor, bufferViews);
                    options.deltaNormalsType = getComponentType(accessor.componentType);
                }

                if (gltfMesh.hasOwnProperty('extras') &&
                    gltfMesh.extras.hasOwnProperty('targetNames')) {
                    options.name = gltfMesh.extras.targetNames[index];
                } else {
                    options.name = targets.length.toString(10);
                }

                targets.push(new MorphTarget(options));
            });

            mesh.morph = new Morph(targets, device);

            // set default morph target weights if they're specified
            if (gltfMesh.hasOwnProperty('weights')) {
                for (var i = 0; i < gltfMesh.weights.length; ++i) {
                    targets[i].defaultWeight = gltfMesh.weights[i];
                }
            }
        }

        meshes.push(mesh);
    });

    return meshes;
};

  const createMeshes = function createMeshes(device, gltf, bufferViews, callback, disableFlipV) {
		if (!gltf.hasOwnProperty('meshes') || gltf.meshes.length === 0 || !gltf.hasOwnProperty('accessors') || gltf.accessors.length === 0 || !gltf.hasOwnProperty('bufferViews') || gltf.bufferViews.length === 0) {
			return [];
		}

		var vertexBufferDict = {};
		return gltf.meshes.map(function (gltfMesh) {
			return createMesh(device, gltfMesh, gltf.accessors, bufferViews, callback, disableFlipV, vertexBufferDict);
		});
	};

export class glbLoader extends Loader {

	constructor(gl) {
    super();
    this.gl = gl;
	}

	load( url) {

		const scope = this;

		const loader = new FileLoader();
		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( scope.withCredentials );

    var decodeBinaryUtf8 = function (array) {
      if (typeof TextDecoder !== 'undefined') {
          return new TextDecoder().decode(array);
      }

      var str = "";
      for (var i = 0; i < array.length; i++) {
          str += String.fromCharCode(array[i]);
      }

      return decodeURIComponent(escape(str));
    };



		return new Promise((resolve, reject) => {
      loader.load(url).then(buffer => {

        parseGlb(buffer, (err,chunks) => {
          const str = decodeBinaryUtf8(chunks.gltfChunk);
          var gltf = JSON.parse(str);
          parseBufferViewsAsync(gltf, [chunks.binaryChunk], [], (err, bufferViews) => {
             const ret = createMeshes({
               buffers: [],
               gl: this.gl,
                  _vram: {
                  // #ifdef PROFILER
                  texShadow: 0,
                  texAsset: 0,
                  texLightmap: 0,
                  // #endif
                  tex: 0,
                  vb: 0,
                  ib: 0
              }
                }, gltf, bufferViews, () => {
                })
                resolve(ret)
          })

        })
			}).catch(err => {
			  reject(err);
			});
		})
	}

}
