class SecondGrid {
  constructor(opt) {
    this.geometry = new THREE.InstancedBufferGeometry();
    this.scene = opt.scene;
    this.coords = opt.coords;
    this.count = opt.count;
    this.screenRatio = opt.screenRatio;

    this.createBlueprint();
    this.instanceBlueprint();
  }

  createBlueprint() {
    this.blueprint = this.coords;

    this.sideLength = Math.sqrt(
      Math.pow(this.blueprint[0] - this.blueprint[3], 2) +
        Math.pow(this.blueprint[1] - this.blueprint[4], 2)
    );
    this.uv = [0, 0.5, 0.5, 0.14, 0.5, 0.86, 0.5, 0.14, 1, 0.5, 0.5, 0.86];
    console.log(this.coords);

    let position = new THREE.BufferAttribute(
      new Float32Array(this.blueprint),
      3
    );
    this.geometry.addAttribute("position", position);
    let uv = new THREE.BufferAttribute(new Float32Array(this.uv), 2);
    this.geometry.addAttribute("uv", uv);
  }

  instanceBlueprint() {
    var translation = new Float32Array(this.count * 3);

    var uvOffset = new Float32Array(this.count * 2);
    var uvScales = new Float32Array(this.count * 2);

    var uvOffsetIterator = 0;
    var uvScalesIterator = 0;
    //and iterators for convenience :)
    var translationIterator = 0;
    this.rank = -1;

    let uvScale = new THREE.Vector2(1 / 60, 1 / 60);

    for (let i = 0; i < 120; i++) {
      for (let j = 0; j < 60; j++) {
        this.rank++;

        uvScales[uvScalesIterator++] = uvScale.x;
        uvScales[uvScalesIterator++] = uvScale.y;
        if (i % 2 == 0) {
          translation[translationIterator++] =
            2 * (Math.sin(Math.PI / 3) * this.sideLength * j) -
            Math.abs(
              this.screenRatio.x * 2 -
                2 * (Math.sin(Math.PI / 3) * this.sideLength) * 60
            ) /
              2;
          translation[translationIterator++] =
            (i * this.sideLength) / 2 -
            this.sideLength * 60 +
            Math.abs(-this.screenRatio.y * 2 - this.sideLength * 60) / 2;
          translation[translationIterator++] = 0;
          uvOffset[uvOffsetIterator++] = j * uvScale.x;
          uvOffset[uvOffsetIterator++] = 0.36 * i * uvScale.y;
        } else {
          translation[translationIterator++] =
            2 * (Math.sin(Math.PI / 3) * this.sideLength * j) +
            Math.sin(Math.PI / 3) * this.sideLength -
            Math.abs(
              this.screenRatio.x * 2 -
                2 * (Math.sin(Math.PI / 3) * this.sideLength) * 60
            ) /
              2;
          translation[translationIterator++] =
            (i * this.sideLength) / 2 -
            this.sideLength * 60 +
            Math.abs(-this.screenRatio.y * 2 - this.sideLength * 60) / 2;
          translation[translationIterator++] = 0;
          uvOffset[uvOffsetIterator++] = j * uvScale.x + 0.5 / 6;
          uvOffset[uvOffsetIterator++] = 0.36 * i * uvScale.y;
        }
      }
    }
    this.geometry.addAttribute(
      "translation",
      new THREE.InstancedBufferAttribute(translation, 3, 1)
    );

    this.geometry.addAttribute(
      "uvOffset",
      new THREE.InstancedBufferAttribute(uvOffset, 2, 1)
    );
    this.geometry.addAttribute(
      "uvScale",
      new THREE.InstancedBufferAttribute(uvScales, 2, 1)
    );
    //   video = document.createElement( 'video' );
    // // video.id = 'video';
    // // video.type = ' video/ogg; codecs="theora, vorbis" ';
    // video.src = "../Untitled.mp4";
    // video.load(); // must call after setting/changing source
    // video.play();

    // var texture = new THREE.VideoTexture( video );
    // texture.minFilter = THREE.LinearFilter;
    // texture.magFilter = THREE.LinearFilter;
    // texture.format = THREE.RGBFormat;

    let material = new THREE.RawShaderMaterial({
      uniforms: {
        u_time: {
          type: "f",
          value: 1.0
        },
        envmap: { type: "t", value: null },
        texture: { type: "t", value: null }
      },

      vertexShader: document.getElementById("vertShader").innerHTML,
      fragmentShader: document.getElementById("fragShader").innerHTML,
      side: THREE.DoubleSide,
      wireframe: false
    });

    var co = "http://crossorigin.me/",
      url = "",
      src = co + url;

    var tl = new THREE.TextureLoader();
    tl.setCrossOrigin("Anonymous");
    tl.load("./striped-background.jpg", function(t) {
      material.uniforms.envmap.value = t;
    });

    this.grid = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.grid);
  }
}

class createApp {
  constructor(opt) {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.winRatio = this.winWidth / this.winHeight;
    this.camera = new THREE.PerspectiveCamera(150, this.winRatio, 0.005, 1000);
    this.camera2 = new THREE.PerspectiveCamera(150, this.winRatio, 0.005, 1000);
    this.camera.setFocalLength(50);
    this.camera2.setFocalLength(50);
    this.camera.position.z = 1;
    this.camera2.position.z = 0.01;

    this.target = new THREE.Vector3();
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.winWidth, this.winHeight);

    document.body.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));

    this.rawCoords = [
      {
        x: this.winWidth / 101,
        y: 0
      },

      {
        x: (Math.cos((2 * Math.PI) / 3) * this.winWidth) / 101,
        y: (Math.sin((2 * Math.PI) / 3) * this.winWidth) / 101
      },
      {
        x: (Math.cos(((2 * Math.PI) / 3) * 2) * this.winWidth) / 101,
        y: (Math.sin(((2 * Math.PI) / 3) * 2) * this.winWidth) / 101
      }
    ];

    this.rawCoords2 = [
      {
        x: -this.winWidth / 60,
        y: 0
      },

      {
        x: (-Math.cos((-2 * Math.PI) / 3) * this.winWidth) / 60,
        y: (-Math.sin((-2 * Math.PI) / 3) * this.winWidth) / 60
      },
      {
        x: (-Math.cos(((-2 * Math.PI) / 3) * 2) * this.winWidth) / 60,
        y: (-Math.sin(((-2 * Math.PI) / 3) * 2) * this.winWidth) / 60
      },

      {
        x: (-Math.cos((-2 * Math.PI) / 3) * this.winWidth) / 60,
        y: (-Math.sin((-2 * Math.PI) / 3) * this.winWidth) / 60
      },
      {
        x: (2 * this.winWidth) / 60,
        y: 0
      },
      {
        x: (-Math.cos(((-2 * Math.PI) / 3) * 2) * this.winWidth) / 60,
        y: (-Math.sin(((-2 * Math.PI) / 3) * 2) * this.winWidth) / 60
      }
    ];

    // let geo = new THREE.PlaneGeometry(10,10,120,120);
    // let mat = new THREE.MeshBasicMaterial({color:"#ffffff",wireframe:true})

    // let meshh = new THREE.Mesh(geo, mat)
    // this.scene.add(meshh)
    // meshh.rotation.z = Math.PI/4

    this.treatedCoords = [];

    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(0, 0, 0.6);
    this.scene.add(this.light);

    this.time = 0;
    this.initCoords();
    this.animate();
  }

  initCoords() {
    for (let i = 0; i < this.rawCoords2.length; i++) {
      let treatedCoordsX = (this.rawCoords2[i].x / this.winWidth) * 2 - 1;
      let treatedCoordsY = -(this.rawCoords2[i].y / this.winHeight) * 2 + 1;

      this.newPos = new THREE.Vector3(
        treatedCoordsX,
        treatedCoordsY,
        -1
      ).unproject(this.camera);
      this.treatedCoords.push(this.newPos.x, this.newPos.y, this.newPos.z);
    }
    this.grid2 = new SecondGrid({
      count: 7200,
      scene: this.scene,
      coords: this.treatedCoords,
      screenRatio: new THREE.Vector3(1, -1, -1).unproject(this.camera)
    });
    //this.grid = new Grid({count: 10201, scene: this.scene, coords:this.treatedCoords, screenRatio: new THREE.Vector3(1, -1,-1).unproject(this.camera)})
  }

  onMouseMove(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    this.mouseX = (mouseX / this.winWidth) * 2 - 1;
    this.mouseY = -(mouseY / this.winHeight) * 2 + 1;
  }

  onResize() {
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.winRatio = this.winWidth / this.winHeight;
    this.camera2.aspect = this.winRatio;
    this.camera2.updateProjectionMatrix();
    this.renderer.setSize(this.winWidth, this.winHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.camera2.lookAt(this.target);
    this.time += 0.1;
    // this.grid.grid.material.uniforms.u_time.value = this.time
    this.grid2.grid.material.uniforms.u_time.value = this.time;

    // this.mousePos = new THREE.Vector3(this.mouseX, this.mouseY,-1).unproject(this.camera)
    // this.grid.grid.material.uniforms.u_mouse.value.x = this.mousePos.x
    // this.grid.grid.material.uniforms.u_mouse.value.y = this.mousePos.y

    //this.grid.grid.material.uniforms.u_time = this.time
    this.renderer.render(this.scene, this.camera2);
  }
}

new createApp();
