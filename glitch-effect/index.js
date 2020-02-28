const IDs = {
  canvas: "canvas",
  shaders: {
    vertex: "vertex-shader",
    fragment: "fragment-shader"
  }
};

const CANVAS = document.getElementById(IDs.canvas);
const GL = canvas.getContext("webgl");

let PROGRAM;

let IS_ACTIVE = true;
let INTENSITY = 1;

main();

function main() {
  clearCanvas();
  createPlane();
  createProgram();
  createTexture();
  updateCanvasSize();
  initEventListeners();
  draw();
}

function clearCanvas() {
  GL.clearColor(0.26, 1, 0.93, 1.0);
  GL.clear(GL.COLOR_BUFFER_BIT);
}

function createPlane() {
  GL.bindBuffer(GL.ARRAY_BUFFER, GL.createBuffer());
  GL.bufferData(
    GL.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]),
    GL.STATIC_DRAW
  );
}

function createProgram() {
  const shaders = getShaders();

  PROGRAM = GL.createProgram();

  GL.attachShader(PROGRAM, shaders.vertex);
  GL.attachShader(PROGRAM, shaders.fragment);
  GL.linkProgram(PROGRAM);

  const vertexPositionAttribute = GL.getAttribLocation(PROGRAM, "a_position");

  GL.enableVertexAttribArray(vertexPositionAttribute);
  GL.vertexAttribPointer(vertexPositionAttribute, 2, GL.FLOAT, false, 0, 0);

  GL.useProgram(PROGRAM);
}

function getShaders() {
  return {
    vertex: compileShader(
      GL.VERTEX_SHADER,
      document.getElementById(IDs.shaders.vertex).textContent
    ),
    fragment: compileShader(
      GL.FRAGMENT_SHADER,
      document.getElementById(IDs.shaders.fragment).textContent
    )
  };
}

function compileShader(type, source) {
  const shader = GL.createShader(type);

  GL.shaderSource(shader, source);
  GL.compileShader(shader);

  console.log(GL.getShaderInfoLog(shader));

  return shader;
}

function createTexture() {
  const image = new Image();

  image.crossOrigin = "anonymous";

  image.onload = () => {
    const texture = GL.createTexture();

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, image);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);

    GL.uniform1i(GL.getUniformLocation(PROGRAM, "u_texture"), 0);
  };

  image.src =
    "https://78.media.tumblr.com/7bd1cd32a3709a8e6821f5ffd3dbcea1/tumblr_pdti2hTKqw1xujoc5o1_540.jpg";
}

function updateCanvasSize() {
  const size =
    Math.ceil(Math.min(window.innerHeight, window.innerWidth) * 0.9) - 30;

  CANVAS.height = size;
  CANVAS.width = size;

  GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);
  GL.uniform1f(
    GL.getUniformLocation(PROGRAM, "u_canvas_size"),
    Math.max(CANVAS.height, CANVAS.width)
  );
}

function initEventListeners() {
  window.addEventListener("resize", updateCanvasSize);

  CANVAS.addEventListener("mouseover", () => {
    IS_ACTIVE = false;
  });

  CANVAS.addEventListener("mouseout", () => {
    IS_ACTIVE = true;
  });
}

function draw(timeStamp) {
  GL.uniform1f(GL.getUniformLocation(PROGRAM, "u_time"), timeStamp / 1000.0);
  GL.uniform1f(GL.getUniformLocation(PROGRAM, "u_intensity"), INTENSITY);

  if (IS_ACTIVE) {
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);

    if (INTENSITY < 1) {
      INTENSITY += 0.05;
    }
  } else {
    if (INTENSITY > 0) {
      INTENSITY -= 0.05;
      GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    }
  }

  GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(draw);
}
