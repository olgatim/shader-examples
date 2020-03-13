class ProjectedMaterial extends THREE.ShaderMaterial {
  constructor({ camera, texture, color = 0xffffff, ...options }) {
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    camera.updateWorldMatrix();

    // get the matrices from the camera so they're fixed in camera's original position
    const viewMatrixCamera = camera.matrixWorldInverse.clone();
    const projectionMatrixCamera = camera.projectionMatrix.clone();
    const modelMatrixCamera = camera.matrixWorld.clone();

    const projPosition = camera.position.clone();

    super({
      ...options,
      uniforms: {
        color: { value: new THREE.Color(color) },
        texture: { value: texture },
        viewMatrixCamera: { type: "m4", value: viewMatrixCamera },
        projectionMatrixCamera: { type: "m4", value: projectionMatrixCamera },
        modelMatrixCamera: { type: "mat4", value: modelMatrixCamera },
        projPosition: { type: "v3", value: projPosition }
      },
      vertexShader: `
          uniform mat4 viewMatrixCamera;
          uniform mat4 projectionMatrixCamera;
          uniform mat4 modelMatrixCamera;

          varying vec4 vWorldPosition;
          varying vec3 vNormal;
          varying vec4 vTexCoords;


          void main() {
            vNormal = mat3(modelMatrix) * normal;
            vWorldPosition = modelMatrix * vec4(position, 1.0);
            vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D texture;
        uniform vec3 projPosition;

        varying vec3 vNormal;
        varying vec4 vWorldPosition;
        varying vec4 vTexCoords;
        
        void main() {
          vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;

          vec4 outColor = texture2D(texture, uv);

          // this makes sure we don't render the texture also on the back of the object
          vec3 projectorDirection = normalize(projPosition - vWorldPosition.xyz);
          float dotProduct = dot(vNormal, projectorDirection);
          if (dotProduct < 0.0) {
            outColor = vec4(color, 1.0);
          }

          gl_FragColor = outColor;
        }
      `
    });
    this.isProjectedMaterial = true;
  }
}

function project(mesh) {
  if (!mesh.material.isProjectedMaterial) {
    throw new Error(`The mesh material must be a ProjectedMaterial`);
  }

  // make sure the matrix is updated
  mesh.updateMatrixWorld();

  // we save the object model matrix so it's projected relative
  // to that position, like a snapshot
  mesh.material.uniforms.savedModelMatrix.value.copy(mesh.matrixWorld);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 3);
camera.position.set(-1, 1.2, 1.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.ShaderMaterial({
//   uniforms: {
//     texture: { value: assets.get(textureKey) }
//   },
//   vertexShader: "",
//   fragShader: ""
// });

camera.position.z = 5;

const material = new ProjectedMaterial({
  camera: camera,
  texture: new THREE.TextureLoader().load("./images/1.jpeg")
});

const box = new THREE.Mesh(geometry, material);
scene.add(box);

const animate = function() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
