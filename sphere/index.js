let SCENE;
let CAMERA;
let RENDERER;
let CONTROLS;

main();

function main() {
  init();
  animate();
}

function init() {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  initEventListeners();

  createObjects();

  document.querySelector(".canvas-container").appendChild(RENDERER.domElement);
}

function initScene() {
  SCENE = new THREE.Scene();

  initLights();
}

function initLights() {
  const point = new THREE.PointLight(0xffffff, 1, 0);
  point.position.set(0, 100, 50);
  SCENE.add(point);
}

function initCamera() {
  CAMERA = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  CAMERA.position.y = 100;
  CAMERA.position.z = 100;
}

function initRenderer() {
  RENDERER = new THREE.WebGLRenderer({ alpha: true });
  RENDERER.setPixelRatio(window.devicePixelRatio);
  RENDERER.setSize(window.innerWidth, window.innerHeight);
  RENDERER.shadowMap.enabled = true;
  RENDERER.shadowMapSort = true;
  RENDERER.setClearColor(0x000000, 1);
}

function initControls() {
  CONTROLS = new THREE.OrbitControls(CAMERA);
  CONTROLS.enableZoom = false;
  CONTROLS.minPolarAngle = (Math.PI * 1) / 4;
  CONTROLS.maxPolarAngle = (Math.PI * 3) / 4;
  CONTROLS.update();
}

function initEventListeners() {
  window.addEventListener("resize", onWindowResize);

  onWindowResize();
}

function onWindowResize() {
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();

  RENDERER.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  CONTROLS.update();
  render();
}

function render() {
  CAMERA.lookAt(SCENE.position);
  RENDERER.render(SCENE, CAMERA);
}

function createObjects() {
  const geometry = new THREE.SphereBufferGeometry(30, 64, 64);
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      //...
    },
    vertexShader: document.getElementById("sphere-vertex-shader").textContent,
    fragmentShader: document.getElementById("sphere-fragment-shader")
      .textContent
  });
  const sphere = new THREE.Mesh(geometry, shaderMaterial);

  SCENE.add(sphere);
}
