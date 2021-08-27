import { getVariableCounts } from './programs.js'

function getNumsPerElementByName(name) {
  switch (name) {
    case 'colors':
      return 4;
    case 'positions':
      return 3;
    case 'normals':
      return 3;
    case 'texcoords':
      return 2;
    default:
      return 4;
  }
}

function getTypeByName(name) {
  if (name == 'colors') {
    return Uint8Array;
  }
  if (name == 'positions' || name == 'normals' || name == 'texcoords') {
    return Float32Array;
  }
  if (name == 'indices') {
    return Uint16Array;
  }
  return Float32Array;
}


function createAttributeSetters(gl, program) {
  let attributesCount = getVariableCounts(gl, program, gl.ACTIVE_ATTRIBUTES);
  let attributeSetter = {};
  for (let i = 0; i < attributesCount; i++) {
    let attributeInfo = gl.getActiveAttrib(program, i);
    let attributeIndex = gl.getAttribLocation(program, attributeInfo.name);
    attributeSetter[attributeInfo.name] = createAttributeSetter(
      gl,
      attributeIndex
    );
  }
  return attributeSetter;
}


function buffer2Attribute(object) {
  let map = {};
  Object.keys(object).forEach(function(name) {
    if (name == 'indices') {
      return;
    }
    map['a_' + name[0].toUpperCase() + name.substr(1, name.length - 2)] = name;
  });
  return map;
}

function createBuffer(gl, attribute, vertexAttribPointer) {
  let { size, type, normalize, stride, offset } = vertexAttribPointer;
  gl.enableVertexAttribArray(attribute);
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(
    attribute,
    size,
    type || gl.FLOAT,
    normalize || false,
    stride || 0,
    offset || 0
  );
  return buffer;
}


function createAttributeSetter(gl, attributeIndex) {
  return function(bufferInfo) {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.buffer);
    gl.enableVertexAttribArray(attributeIndex);
    gl.vertexAttribPointer(
      attributeIndex,
      bufferInfo.numsPerElement || bufferInfo.size,
      bufferInfo.type || gl.FLOAT,
      bufferInfo.normalize || false,
      bufferInfo.stride || 0,
      bufferInfo.offset || 0
    );
  };
}

function makeTypedArray(data, name) {
  if (!data.numsPerElement) {
    data.numsPerElement = getNumsPerElementByName(name, data.length);
  }

  let type = getTypeByName(name);
  let typedArray = data;
  if (Array.isArray(data)) {
    typedArray = new type(data);
  }

  typedArray.numsPerElement = data.numsPerElement;
  Object.defineProperty(typedArray, 'elementsCount', {
    get: function() {
      return this.length / this.numsPerElement;
    }
  });
  return typedArray;
}

function createWebGLBuffer(gl, typedArray, bufferType, drawType) {
  let buffer = gl.createBuffer();
  bufferType = bufferType || gl.ARRAY_BUFFER;
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, typedArray, drawType || gl.STATIC_DRAW);
  return buffer;
}

function getWebGLTypeByTypedArrayType(gl, array) {
  switch (array.constructor) {
    case Int8Array:
      return gl.BYTE;
    case Uint8Array:
      return gl.UNSIGNED_BYTE;
    case Int16Array:
      return gl.SHORT;
    case Uint16Array:
      return gl.UNSIGNED_SHORT;
    case Int32Array:
      return gl.INT;
    case Uint32Array:
      return gl.UNSIGNED_INT;
    case Float32Array:
      return gl.FLOAT;
  }
}

function getNormalize(array) {
  if (array instanceof Uint8Array || array instanceof Int8Array) {
    return true;
  }
  return false;
}

function makeAttributesInBufferInfo(gl, object) {
  let mapping = buffer2Attribute(object);
  let attributeObject = {};
  Object.keys(mapping).forEach(function(attributeName) {
    let bufferName = mapping[attributeName];
    let array = makeTypedArray(object[bufferName], bufferName);
    attributeObject[attributeName] = {
      buffer: createWebGLBuffer(gl, array),
      numsPerElement: array.numsPerElement || getNumsPerElementByName(bufferName),
      type: getWebGLTypeByTypedArrayType(gl, array),
      normalize: getNormalize(array)
    };
  });
  return attributeObject;
}

function createBufferInfoFromObject(gl, object) {
  let bufferInfo = {};
  bufferInfo.attributes = makeAttributesInBufferInfo(gl, object);
  let indices = object.indices;
  if (indices) {
    indices = makeTypedArray(indices, 'indices');
    bufferInfo.indices = createWebGLBuffer(
      gl,
      indices,
      gl.ELEMENT_ARRAY_BUFFER
    );
    bufferInfo.elementsCount = indices.length;
  } else {
    bufferInfo.elementsCount = setElementsCountPerAttribute(object);
  }

  return bufferInfo;
}

function setElementsCountPerAttribute(object) {
  let key = Object.keys(object)[0];
  let array = object[key];
  if (array && array.buffer instanceof ArrayBuffer) {
    return array.elementsCount;
  } else {
    return array.length / array.numsPerElement;
  }
}

function setBufferInfos(gl, setters, buffers) {
  if (!buffers.attributes) {
    return;
  }
  setAttributes(setters, buffers.attributes);
  if (buffers.indices) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  }
}

function setAttributes(setters, attributes) {
  setters = setters.attributeSetters || setters;
  Object.keys(attributes).forEach(function(name) {
    let setter = setters[name];
    if (setter) {
      setter(attributes[name]);
    }
  });
}

function setUniforms(setters, values) {
  setters = setters.uniformSetters || setters;
  Object.keys(values).forEach(function(name) {
    let setter = setters[name];
    if (setter) {
      setter(values[name]);
    }
  });
}

function createAttribute(gl, program, param) {
  const {
    attribureName,
    attriburData,
    itemSize,
  } = param

  let attribure = gl.getAttribLocation(program, attribureName);
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(attribure);

  let type = gl.FLOAT;
  let normalize = false;
  let stride = 0;
  let offset = 0;
  gl.vertexAttribPointer(attribure, itemSize, type, normalize, stride, offset);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attriburData), gl.STATIC_DRAW);
}

export {
  createAttribute
}
