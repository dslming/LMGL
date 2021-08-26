let enums = {
  FLOAT_VEC2: {
    value: 0x8b50,
    setter: function(location, v) {
      gl.uniform2fv(location, v);
    }
  },
  FLOAT_VEC3: {
    value: 0x8b51,
    setter: function(location, v) {
      console.log(v);
      gl.uniform3fv(location, v);
    }
  },
  FLOAT_VEC4: {
    value: 0x8b52,
    setter: function(location, v) {
      gl.uniform3fv(location, v);
    }
  },
  INT_VEC2: {
    value: 0x8b53,
    setter: function(location, v) {
      gl.uniform2iv(location, v);
    }
  },
  INT_VEC3: {
    value: 0x8b54,
    setter: function(location, v) {
      gl.uniform3iv(location, v);
    }
  },
  INT_VEC4: {
    value: 0x8b55,
    setter: function(location, v) {
      gl.uniform4iv(location, v);
    }
  },
  BOOL: {
    value: 0x8b56,
    setter: function(location, v) {
      gl.uniform1iv(location, v);
    }
  },
  BOOL_VEC2: {
    value: 0x8b57,
    setter: function(location, v) {
      gl.uniform2iv(location, v);
    }
  },
  BOOL_VEC3: {
    value: 0x8b58,
    setter: function(location, v) {
      gl.uniform3iv(location, v);
    }
  },
  BOOL_VEC4: {
    value: 0x8b59,
    setter: function(location, v) {
      gl.uniform4iv(location, v);
    }
  },
  FLOAT_MAT2: {
    value: 0x8b5a,
    setter: function(location, v) {
      gl.uniformMatrix2fv(location, false, v);
    }
  },
  FLOAT_MAT3: {
    value: 0x8b5b,
    setter: function(location, v) {
      gl.uniformMatrix3fv(location, false, v);
    }
  },
  FLOAT_MAT4: {
    value: 0x8b5c,
    setter: function(location, v) {
      gl.uniformMatrix4fv(location, false, v);
    }
  },
  SAMPLER_2D: {
    value: 0x8b5e,
    setter: function(location, texture) {
      gl.uniform1i(location, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    }
  },
  SAMPLER_CUBE: {
    value: 0x8b60,
    setter: function(location, texture) {
      gl.uniform1i(location, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    }
  },

  INT: {
    value: 0x1404,
    setter: function(location, v) {
      gl.uniform1i(location, v);
    }
  },

  FLOAT: {
    value: 0x1406,
    setter: function(location, v) {
      gl.uniform1f(location, v);
    }
  }
};
