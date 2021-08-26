var random = Math.random;

function randomColor() {
  return {
    r: random() * 255,
    g: random() * 255,
    b: random() * 255,
    a: random() * 1
  };
}

function $$(str) {
  if (!str) return null;
  if (str.startsWith('#')) {
    return document.querySelector(str);
  }
  let result = document.querySelectorAll(str);
  if (result.length == 1) {
    return result[0];
  }
  return result;
}

function getCanvas(id) {
  return $$(id);
}

function resizeCanvas(canvas, width, height) {
  if (canvas.width !== width) {
    canvas.width = width ? width : window.innerWidth;
  }
  if (canvas.height !== height) {
    canvas.height = height ? height : window.innerHeight;
  }
}

function getContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}



function createColorForVertex(vertex, c) {
  let vertexNums = vertex.positions;
  let colors = [];
  let color = c || {
    r: 255,
    g: 0,
    b: 0,
    a: 255
  };

  for (let i = 0; i < vertexNums.length; i++) {
    color = c || randomColor();
    colors.push(color.r, color.g, color.b, 255);
  }

  vertex.colors = new Uint8Array(colors);
  return vertex;
}


function getVariableCounts(gl, program, type) {
  return gl.getProgramParameter(program, type);
}





function getKeyFromType(type) {
  for (let i in enums) {
    if (enums[i].value == type) {
      return i;
    }
  }
}



// 列表类
function List(list) {
  this.list = list || [];
  this.uuid = this.list.length;
}
// 添加对象
List.prototype.add = function(object) {
  object.uuid = this.uuid;
  this.list.push(object);
  this.uuid++;
};
// 删除对象
List.prototype.remove = function(object) {
  this.list.splice(object.uuid, 1);
};
// 删除对象
List.prototype.get = function(index) {
  return this.list[index];
};
// 添加对象
List.prototype.forEach = function(fun) {
  this.list.forEach(fun);
};
