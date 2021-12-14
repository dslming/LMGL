"use strict";
/// <reference path="../../gl-matrix.d.ts" />
/// <reference path="../../webgl2.d.ts" />
/** @type {WebGL2RenderingContext} */
var gl;

function init() {
  var m = mat4.create();
  // inicjalizacja webg2
  try {
    let canvas = document.querySelector("#glcanvas");
    gl = canvas.getContext("webgl2");
  } catch (e) {}

  if (!gl) {
    alert("Unable to initialize WebGL.");
    return;
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // kompilacja shader-ow
  var vertex_shader = createShader(gl, gl.VERTEX_SHADER, vs_source);
  var fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fs_source);
  var program = createProgram(gl, vertex_shader, fragment_shader);

  // pobranie ubi
  var color_ubi = gl.getUniformBlockIndex(program, "TriangleColor");
  var matrices_ubi = gl.getUniformBlockIndex(program, "Matrices");

  // przyporzadkowanie ubi do ubb
  let color_ubb = 0;
  gl.uniformBlockBinding(program, color_ubi, color_ubb);
  let matrices_ubb = 1;
  gl.uniformBlockBinding(program, matrices_ubi, matrices_ubb);

  // tworzenie sampler-a
  var linear_sampler = gl.createSampler();
  // Ustawienie parametrów sampler-a
  gl.samplerParameteri(linear_sampler, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.samplerParameteri(linear_sampler, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.samplerParameteri(linear_sampler, gl.TEXTURE_WRAP_R, gl.REPEAT);
  gl.samplerParameteri(linear_sampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.samplerParameteri(linear_sampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // tworzenie teksutry
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // wypelnianie tekstury jednym pikselem
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(255, 255, 255, 255));
  gl.bindTexture(gl.TEXTURE_2D, null);

  // ładowanie obrazka (asynchronicznie)
  var image = new Image();
  image.src = "images/Modern_diffuse.png";
  image.addEventListener('load', function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // ladowanie danych z obrazka do tekstury
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // tworzenie mipmap
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  // dane o wierzcholkach
  var vertices = new Float32Array([
    -0.5, 0.0, 0.0, 0.0, 0.0,
    0.5, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.5, 0.0, 0.5, 1.0
  ]);

  // tworzenie VBO
  var vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // dane o indeksach
  var indices = new Uint16Array([0, 1, 2]);

  // tworzenie bufora indeksow
  var index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  let gpu_positions_attrib_location = 0; // musi być taka sama jak po stronie GPU!!!
  let gpu_tex_coord_attrib_location = 1;

  // tworzenie VAO
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.enableVertexAttribArray(gpu_positions_attrib_location);
  gl.vertexAttribPointer(gpu_positions_attrib_location, 3, gl.FLOAT, gl.FALSE, 5 * 4, 0);
  gl.enableVertexAttribArray(gpu_tex_coord_attrib_location);
  gl.vertexAttribPointer(gpu_tex_coord_attrib_location, 2, gl.FLOAT, gl.FALSE, 5 * 4, 3 * 4);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // dane o kolorze
  var triangle_color = new Float32Array([1.0, 1.0, 0.0, 0.0]);

  // dane o macierzy
  var mvp_matrix = mat4.create();
  var model_matrix = mat4.create();
  //mat4.rotateY(model_matrix, model_matrix, Math.PI/4);
  var view_matrix = mat4.create();
  mat4.lookAt(view_matrix, new Float32Array([0., 0., 2.]), new Float32Array([0., 0., 0.]), new Float32Array([0., 1., 0.]));
  //mat4.lookAt(view_matrix, new Float32Array([0., -2., 2.]), new Float32Array([0., 0., 0.]), new Float32Array([0., 0., 1.]));
  var projection_matrix = mat4.create();
  mat4.perspective(projection_matrix, Math.PI / 4., gl.drawingBufferWidth / gl.drawingBufferHeight, 0.01, 10);
  mat4.multiply(mvp_matrix, projection_matrix, view_matrix);
  mat4.multiply(mvp_matrix, mvp_matrix, model_matrix);

  // tworzenie UBO
  var color_ubo = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, color_ubo);
  gl.bufferData(gl.UNIFORM_BUFFER, triangle_color, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.UNIFORM_BUFFER, null);
  var matrices_ubo = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, matrices_ubo);
  gl.bufferData(gl.UNIFORM_BUFFER, mvp_matrix, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.UNIFORM_BUFFER, null);

  // ustawienia danych dla funkcji draw*
  gl.useProgram(program);
  gl.bindSampler(0, linear_sampler);
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindVertexArray(vao);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, color_ubb, color_ubo);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, matrices_ubb, matrices_ubo);
}

function draw() {
  // wyczyszczenie ekranu
  gl.clear(gl.COLOR_BUFFER_BIT);

  // wyslanie polecania rysowania do GPU (odpalenie shader-ow)
  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

  window.requestAnimationFrame(draw);
}

function main() {
  init();
  draw();
};

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertex_shader, fragment_shader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// vertex shader (GLSL)
var vs_source = `#version 300 es
    // "location" musi byc takie same jak po stronie CPU!!!
    layout(location = 0) in vec3 vertex_position;
    layout(location = 1) in vec2 vertex_tex_coord;
    out vec2 tex_coord;
    layout(std140) uniform Matrices
    {
        mat4 mvp_matrix;
    };
    void main()
    {
        tex_coord = vertex_tex_coord;
        gl_Position = mvp_matrix*vec4(vertex_position, 1);
    }`;

// fragment shader (GLSL)
var fs_source = `#version 300 es
    // fs nie ma domyślnej precyzji dla liczb zmiennoprzecinkowych więc musimy wybrać ją sami
    precision mediump float;
    in vec2 tex_coord;
    out vec4 frag_color;
    uniform sampler2D color_texture;
    layout(std140) uniform TriangleColor
    {
        vec3 triangle_color;
    };
    void main()
    {
        //float chessboard_color_multipler = 0.f;
        //vec2 coord_step_result = step(tex_coord, vec2(0.5, 0.5f));
        //chessboard_color_multipler = coord_step_result.x;
        //chessboard_color_multipler -= coord_step_result.y;
        //chessboard_color_multipler = abs(chessboard_color_multipler);
        //chessboard_color_multipler += 0.25;
        //vec3 result = vec3(chessboard_color_multipler);
        vec3 result = texture(color_texture, tex_coord).rgb;
        //result *= triangle_color;
        frag_color = vec4(result, 1.0);
    }`;

main();
