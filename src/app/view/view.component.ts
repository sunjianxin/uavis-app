import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { Stats } from 'stats-js/build/stats.js';
import * as STATS from 'stats-js';
import * as d3 from 'd3';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  counter = 1;
  counterT = 1;
  stats = new STATS();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
  // renderer = new THREE.WebGLRenderer();
  renderer;
  clock = new THREE.Clock();
  mixer;
  data;
  dataDeploy;
  drone;
  mixerDrone;
  droneTransmitter;
  mixerDroneTransmitter;
  transmitterDeployOn = false;
  receiverDeployOn = false;
  transmitterRecallOn = false;

  minDbm0: number;
  maxDbm0: number;
  minDbm1: number;
  maxDbm1: number;

  selectedChannel = 'Channel 1';

  // colorScale = ["#030000","#050000","#080000","#0a0000","#0d0000","#0f0000","#120000","#140000","#170000","#190000","#1c0000","#1e0000","#210000","#230000","#260000","#280000","#2b0000","#2d0000","#300000","#320000","#350000","#380000","#3a0000","#3d0000","#3f0000","#420000","#440000","#470000","#490000","#4c0000","#4e0000","#510000","#530000","#560000","#580000","#5b0000","#5d0000","#600000","#620000","#650000","#680000","#6a0000","#6d0000","#6f0000","#720000","#740000","#770000","#790000","#7c0000","#7e0000","#810000","#830000","#860000","#880000","#8b0000","#8d0000","#900000","#920000","#950000","#970000","#9a0000","#9d0000","#9f0000","#a20000","#a40000","#a70000","#a90000","#ac0000","#ae0000","#b10000","#b30000","#b60000","#b80000","#bb0000","#bd0000","#c00000","#c20000","#c50000","#c70000","#ca0000","#cd0000","#cf0000","#d20000","#d40000","#d70000","#d90000","#dc0000","#de0000","#e10000","#e30000","#e60000","#e80000","#eb0000","#ed0000","#f00000","#f20000","#f50000","#f70000","#fa0000","#fc0000"];

  getColorCode(min, max, input) {
    const colorScale = ["#fffcfc","#fffafa","#fff7f7","#fff5f5","#fff2f2","#fff0f0","#ffeded","#ffebeb","#ffe8e8","#ffe6e6","#ffe3e3","#ffe1e1","#ffdede","#ffdcdc","#ffd9d9","#ffd7d7","#ffd4d4","#ffd2d2","#ffcfcf","#ffcdcd","#ffcaca","#ffc7c7","#ffc5c5","#ffc2c2","#ffc0c0","#ffbdbd","#ffbbbb","#ffb8b8","#ffb6b6","#ffb3b3","#ffb1b1","#ffaeae","#ffacac","#ffa9a9","#ffa7a7","#ffa4a4","#ffa2a2","#ff9f9f","#ff9d9d","#ff9a9a","#ff9797","#ff9595","#ff9292","#ff9090","#ff8d8d","#ff8b8b","#ff8888","#ff8686","#ff8383","#ff8181","#ff7e7e","#ff7c7c","#ff7979","#ff7777","#ff7474","#ff7272","#ff6f6f","#ff6d6d","#ff6a6a","#ff6868","#ff6565","#ff6262","#ff6060","#ff5d5d","#ff5b5b","#ff5858","#ff5656","#ff5353","#ff5151","#ff4e4e","#ff4c4c","#ff4949","#ff4747","#ff4444","#ff4242","#ff3f3f","#ff3d3d","#ff3a3a","#ff3838","#ff3535","#ff3232","#ff3030","#ff2d2d","#ff2b2b","#ff2828","#ff2626","#ff2323","#ff2121","#ff1e1e","#ff1c1c","#ff1919","#ff1717","#ff1414","#ff1212","#ff0f0f","#ff0d0d","#ff0a0a","#ff0808","#ff0505","#ff0303"];
    // ["#030000","#050000","#080000","#0a0000","#0d0000","#0f0000","#120000","#140000","#170000","#190000","#1c0000","#1e0000","#210000","#230000","#260000","#280000","#2b0000","#2d0000","#300000","#320000","#350000","#380000","#3a0000","#3d0000","#3f0000","#420000","#440000","#470000","#490000","#4c0000","#4e0000","#510000","#530000","#560000","#580000","#5b0000","#5d0000","#600000","#620000","#650000","#680000","#6a0000","#6d0000","#6f0000","#720000","#740000","#770000","#790000","#7c0000","#7e0000","#810000","#830000","#860000","#880000","#8b0000","#8d0000","#900000","#920000","#950000","#970000","#9a0000","#9d0000","#9f0000","#a20000","#a40000","#a70000","#a90000","#ac0000","#ae0000","#b10000","#b30000","#b60000","#b80000","#bb0000","#bd0000","#c00000","#c20000","#c50000","#c70000","#ca0000","#cd0000","#cf0000","#d20000","#d40000","#d70000","#d90000","#dc0000","#de0000","#e10000","#e30000","#e60000","#e80000","#eb0000","#ed0000","#f00000","#f20000","#f50000","#f70000","#fa0000","#fc0000"];
    if (input < min) {
      return colorScale[0];
    }
    if (input > max) {
      return colorScale[colorScale.length];
    }
    return colorScale[Math.floor(colorScale.length * (input - min) / (max - min))];
  }

  getTransmitterData() {
    const latFinal = this.data[1670].lat;
    const longFinal = this.data[1670].long;
    const altFinal = this.data[0].alt + 85;
    const totalStepSize = 100;

    const data = [];
    const latStart = this.data[0].lat;
    const longStart = this.data[0].long;
    const altStart = this.data[0].alt;
    const latStep = (latFinal - latStart) / totalStepSize;
    const longStep = (longFinal - longStart) / totalStepSize;
    const altStep = (altFinal - altStart) / totalStepSize;

    for (let i = 0; i < totalStepSize + 1; i++) {
      const temp = {};
      temp['lat'] = latStart + latStep * i;
      temp['long'] = longStart + longStep * i;
      temp['alt'] = altStart + altStep * i;
      data.push(temp);
    }
    this.dataDeploy = data;
  }

  readData() {
    console.log(this.counter);
    d3.csv('../assets/data/data.csv').then((data) => {
      data.forEach((d) => {
        d.lat = +d.lat;
        d.long = +d.long;
        d.alt = +d.alt;
        d.dbm_0 = +d.dbm_0;
        d.dbm_1 = +d.dbm_1;
      });
      this.data = data;
      this.minDbm0 = Math.min.apply(Math, data.map((o) => o.dbm_0));
      this.maxDbm0 = Math.max.apply(Math, data.map((o) => o.dbm_0));
      this.minDbm1 = Math.min.apply(Math, data.map((o) => o.dbm_1));
      this.maxDbm1 = Math.max.apply(Math, data.map((o) => o.dbm_1));
      console.log(this.minDbm0, this.maxDbm0, this.minDbm1, this.maxDbm1);

      // console.log(data[0]);
      // console.log(data[2]);
      this.getTransmitterData();
      console.log(this.dataDeploy);
      this.loadModel();
    });
  }

  loadModel() {
    const gltfloader = new GLTFLoader( );

    // Load a glTF resource
    gltfloader.load(
      // resource URL
      '../assets/model/s9_mini_drone/scene.gltf',
      // '../assets/model/drone_tri-copter/scene.gltf',
      // 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',
      // called when the resource is loaded
      ( gltf ) => {

        this.initSense();
        /*
        this.drone = Object.assign({}, gltf);
        this.mixerDrone = new THREE.AnimationMixer( this.drone.scene );
        this.mixerDrone.clipAction( this.drone.animations[ 0 ] ).play();
        this.drone.scene.position.set(0, 5, 0);

        this.droneTransmitter = Object.assign({}, gltf);
        this.mixerDroneTransmitter = new THREE.AnimationMixer( this.droneTransmitter.scene );
        this.mixerDroneTransmitter.clipAction( this.droneTransmitter.animations[ 0 ] ).play();
        this.droneTransmitter.scene.position.set(0, 5, 0);

        this.scene.add( this.drone.scene );
        this.scene.add( this.droneTransmitter.scene );
        */

        // this.mixer = new THREE.AnimationMixer( gltf.scene );
        // this.mixer.clipAction( gltf.animations[ 0 ] ).play();

        // gltf.scene.position.set(0, 5, 0);
        this.drone = gltf.scene.clone();
        this.mixerDrone = new THREE.AnimationMixer( this.drone );
        this.mixerDrone.clipAction( gltf.animations[ 0 ] ).play();

        // this.droneTransmitter = gltf.scene.clone();
        this.droneTransmitter = gltf.scene;
        this.mixerDroneTransmitter = new THREE.AnimationMixer( this.droneTransmitter );
        this.mixerDroneTransmitter.clipAction( gltf.animations[ 0 ] ).play();

        // this.droneTransmitter = gltf.scene;
        this.drone.position.set(0, 5, 0);
        this.droneTransmitter.position.set(0, 5, 0);
        // this.drone = Object.assign(this.drone, gltf.scene);
        // this.droneTranssmitter = Object.assign({}, gltf.scene);
        // console.log(typeof(this.drone));
        this.scene.add( this.drone );
        this.scene.add( this.droneTransmitter );

        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object
        this.animate();
      },
      // called while loading is progressing
      ( xhr ) => {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      ( error ) => {

        console.log( 'An error happened' );

      }
    );
  }

  animate() {
    // console.log(this.);
    this.stats.begin();

    // monitored code goes here

    this.stats.end();
    requestAnimationFrame( this.animate.bind(this) );


    // if ( this.mixer ) { this.mixer.update( this.clock.getDelta() ); }
    if ( this.mixerDroneTransmitter ) {
      this.mixerDroneTransmitter.update( this.clock.getDelta() );
      this.mixerDrone.update( this.clock.getDelta() );
    }
    if ( this.mixerDrone ) { this.mixerDrone.update( this.clock.getDelta() ); }

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // drone.rotation.x += 0.01;

    if (this.counter < this.data.length && this.counter > 0 && this.receiverDeployOn) {
      // @ts-ignore
      // console.log(this.counter + ': ' +
      //             this.data[this.counter]['long'] + ' ' +
      //             this.data[this.counter]['lat'] + ' ' +
      //             this.data[this.counter]['alt']);
      // console.log(counter + ': ' + data[counter]['long'] + ' ' +  data[counter]['lat'] + ' ' + (data[counter]['alt'] - 2260));
      this.drone.position.x = this.data[this.counter].long;
      this.drone.position.y = this.data[this.counter].alt - 2260;
      this.drone.position.z = - this.data[this.counter].lat;
      // cube.position.x = data[counter]['long'];
      // cube.position.y = data[counter]['alt'] - 2260;
      // cube.position.z = - data[counter]['lat'];
      // drow line

      // console.log(this.data[this.counter - 1].dbm_0);
      let selectedColor;
      if (this.selectedChannel === 'Channel 1') {
        selectedColor = this.getColorCode(this.minDbm0, this.maxDbm0, this.data[this.counter - 1].dbm_0);
      }
      if (this.selectedChannel === 'Channel 2') {
        selectedColor = this.getColorCode(this.minDbm1, this.maxDbm1, this.data[this.counter - 1].dbm_1);
      }
      // const color = this.getColorCode(this.minDbm0, this.maxDbm0, this.data[this.counter - 1].dbm_0);
      // const color = this.getColorCode(-100, -70, this.data[this.counter - 1].dbm_0);
      const materialLine = new THREE.LineBasicMaterial( { color: selectedColor } );
      const points = [];
      points.push( new THREE.Vector3( this.data[this.counter - 1].long,
                                      this.data[this.counter - 1].alt - 2260,
                                      -this.data[this.counter - 1].lat ) );
      points.push( new THREE.Vector3( this.data[this.counter].long,
                                      this.data[this.counter].alt - 2260,
                                      -this.data[this.counter].lat ) );
      const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
      const line = new THREE.Line( geometryLine, materialLine );
      this.scene.add( line );

      this.counter += 1;

    }

    // console.log(this.counterT);
    if (this.counterT < this.dataDeploy.length && this.counterT >= 0 && this.transmitterDeployOn) {
      // @ts-ignore
      // console.log(counter + ': ' + data[counter]['long'] + ' ' +  data[counter]['lat'] + ' ' + data[counter]['alt'] - 2260);
      // console.log(counter + ': ' + data[counter]['long'] + ' ' +  data[counter]['lat'] + ' ' + (data[counter]['alt'] - 2260));
      this.droneTransmitter.position.x = this.dataDeploy[this.counterT].long;
      this.droneTransmitter.position.y = this.dataDeploy[this.counterT].alt - 2260;
      this.droneTransmitter.position.z = - this.dataDeploy[this.counterT].lat;
      // cube.position.x = data[counter]['long'];
      // cube.position.y = data[counter]['alt'] - 2260;
      // cube.position.z = - data[counter]['lat'];
      // drow line
      /*
      const materialLine = new THREE.LineBasicMaterial( { color: 0x0000ff } );
      const points = [];
      points.push( new THREE.Vector3( this.dataDeploy[this.counterT - 1]['long'],
        this.dataDeploy[this.counterT - 1]['alt'] - 2260,
        -this.dataDeploy[this.counterT - 1]['lat'] ) );
      points.push( new THREE.Vector3( this.dataDeploy[this.counterT]['long'],
        this.dataDeploy[this.counterT]['alt'] - 2260,
        -this.dataDeploy[this.counterT]['lat'] ) );
      const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
      const line = new THREE.Line( geometryLine, materialLine );
      this.scene.add( line );
*/
      this.counterT += 1;
    }

    if (this.counterT < this.dataDeploy.length + 1 && this.counterT >= 2 && this.transmitterRecallOn) {
      // @ts-ignore
      // console.log(counter + ': ' + data[counter]['long'] + ' ' +  data[counter]['lat'] + ' ' + data[counter]['alt'] - 2260);
      // console.log(counter + ': ' + data[counter]['long'] + ' ' +  data[counter]['lat'] + ' ' + (data[counter]['alt'] - 2260));
      this.droneTransmitter.position.x = this.dataDeploy[this.counterT - 1].long;
      this.droneTransmitter.position.y = this.dataDeploy[this.counterT - 1].alt - 2260;
      this.droneTransmitter.position.z = - this.dataDeploy[this.counterT - 1].lat;
      // cube.position.x = data[counter]['long'];
      // cube.position.y = data[counter]['alt'] - 2260;
      // cube.position.z = - data[counter]['lat'];
      // drow line
      /*
      const materialLine = new THREE.LineBasicMaterial( { color: 0x0000ff } );
      const points = [];
      points.push( new THREE.Vector3( this.dataDeploy[this.counterT - 2]['long'],
        this.dataDeploy[this.counterT - 2]['alt'] - 2260,
        -this.dataDeploy[this.counterT - 2]['lat'] ) );
      points.push( new THREE.Vector3( this.dataDeploy[this.counterT -1]['long'],
        this.dataDeploy[this.counterT - 1]['alt'] - 2260,
        -this.dataDeploy[this.counterT - 1]['lat'] ) );
      const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
      const line = new THREE.Line( geometryLine, materialLine );
      this.scene.add( line );
*/
      this.counterT -= 1;
    }



    this.renderer.render( this.scene, this.camera );
  }


  initSense() {
    // monitor stats
    // const stats = new STATS();
    this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    // const canvas = document.querySelector('#c');
    // this.renderer.setRenderTarget(canvas);
    // const renderer = new THREE.WebGLRenderer({canvas});
    // const canvas = document.getElementById('c');
    // this.renderer.setRenderTarget(canvas);


    // const scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    this.camera.position.set(0, 20, 20); // Set position like this
    this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // Set look at coordinate like this

    // const container = document.getElementById( 'c' );
    // document.body.appendChild( container );

    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // const displayCanvas = document.getElementById('displayCanvas');

    const canvas = document.getElementById('displayCanvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });

    // this.renderer = new THREE.WebGLRenderer({ canvas: displayCanvas });
    // this.renderer.setSize(800, 800);
    // container.appendChild( this.renderer.domElement );
    // document.body.appendChild(this.renderer.domElement);



    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    // check when the browser size has changed and adjust the camera accordingly
    window.addEventListener('resize', () => {
      // const canvas = document.getElementById('displayCanvas') as HTMLCanvasElement;
      // canvas.width = window.innerWidth;
      // canvas.height = window.innerHeight;
      const WIDTH = window.innerWidth;
      const HEIGHT = window.innerHeight;
      this.renderer.setSize( WIDTH, HEIGHT );
      // camera.aspect = WIDTH / HEIGHT;
      // camera.updateProjectionMatrix( );
    });

    // Add skybox
    this.addSkybox(this.scene);
    // Add plane
    this.addPlane(this.scene);
    // Add Arrows
    this.addArrows(this.scene);
    // Add text
    this.addText(this.scene);
    // Add lighting
    this.addLight(this.scene);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    this.scene.add(cube);

    const geometry_1 = new THREE.BoxGeometry(1, 1, 1);
    const material_1 = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    const cube_1 = new THREE.Mesh(geometry_1, material_1);
    cube_1.position.set(0, 1, 0);
    this.scene.add(cube_1);


    this.camera.position.z = 5;
    // this.counter = 0;

  }

  addSkybox(scene) {
    // CUBE
    // Skybox texture website http://www.custommapmakers.org/skyboxes.php
    /*
    {
      const loader = new THREE.CubeTextureLoader();
      const texture = loader.load([
        '../assets/skybox/Ely30/Ely30_px.jpg',
        '../assets/skybox/Ely30/Ely30_nx.jpg',
        '../assets/skybox/Ely30/Ely30_py.jpg',
        '../assets/skybox/Ely30/Ely30_ny.jpg',
        '../assets/skybox/Ely30/Ely30_pz.jpg',
        '../assets/skybox/Ely30/Ely30_nz.jpg',
      ]);
      scene.background = texture;
    }*/

    const materialArray = [];
    const texture_ft = new THREE.TextureLoader().load('../assets/skybox/Ely30/Ely30_px.jpg');
    const texture_bk = new THREE.TextureLoader().load('../assets/skybox/Ely30/Ely30_nx.jpg');
    const texture_up = new THREE.TextureLoader().load('../assets/skybox/Ely30/Ely30_py.jpg');
    const texture_dn = new THREE.TextureLoader().load('../assets/skybox/Ely30/Ely30_ny.jpg');
    const texture_rt = new THREE.TextureLoader().load('../assets/skybox/Ely30/Ely30_pz.jpg');
    const texture_lf = new THREE.TextureLoader().load('../assets/skybox/Ely30/Ely30_nz.jpg');
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}));
    for (let i = 0; i < 6; i++) {
      materialArray[i].side = THREE.BackSide;
    }
    const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    const skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
  }

  addPlane(scene) {
    // const planeSize = 120;
    const planeSize = 200;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.position.set(planeSize / 2 - 10, 0, -planeSize / 2 + 10);
    scene.add(mesh);
  }
  addArrows(scene) {
    const arrowNorth = new THREE.ArrowHelper(
      // first argument is the direction
      new THREE.Vector3(0, 0, -1).normalize(),
      // second argument is the orgin
      new THREE.Vector3(0, 1, 0),
      // length
      80,
      // color
      0xff0000);
    scene.add(arrowNorth);
    const arrowEast = new THREE.ArrowHelper(
      // first argument is the direction
      new THREE.Vector3(1, 0, 0).normalize(),
      // second argument is the orgin
      new THREE.Vector3(0, 1, 0),
      // length
      80,
      // color
      0x00ff00);
    scene.add(arrowEast);
  }
  addText(scene) {
    const loader = new THREE.FontLoader();
    loader.load('../assets/fonts/helvetiker_regular.typeface.json', (font) => {

      const geometryTextNorth = new THREE.TextGeometry('N', {
        font,
        size: 10,
        height: 1,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.3,
        bevelSegments: 3
      });
      const geometryTextEast = new THREE.TextGeometry('E', {
        font,
        size: 10,
        height: 2,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.3,
        bevelSegments: 3
      });
      const textMatNorth = new THREE.MeshLambertMaterial({color: 0xff0000});
      const textMatEast = new THREE.MeshLambertMaterial({color: 0x00ff00});
      const textNorth = new THREE.Mesh(geometryTextNorth, textMatNorth);
      const textEast = new THREE.Mesh(geometryTextEast, textMatEast);

      textNorth.rotation.x = -Math.PI / 2;
      textNorth.position.set(-4, 0, -80);
      textEast.rotation.x = -Math.PI / 2;
      textEast.position.set(80, 0, 4);
      scene.add(textNorth);
      scene.add(textEast);
    });
  }
  addLight(scene) {
    const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1.0 );
    scene.add(ambientLight);

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    scene.add(light);
    scene.add(light.target);
  }


  constructor() {
    this.readData();
  }

  onDeployTransmitter() {
    // this.counter = 0;
    this.transmitterRecallOn = false;
    this.transmitterDeployOn = true;
    console.log('Deploying Transmitter Drone!');
  }
  onDeployReceiver() {
    // this.counter = 0;
    this.receiverDeployOn = true;
    // this.counter = 1;
    console.log('Start!');
  }
  onRecallTransmitter() {
    // this.counter = 0;
    this.transmitterDeployOn = false;
    this.transmitterRecallOn = true;
    console.log('Start!');
  }


  ngOnInit(): void {
  }

  onChannelChange() {
    const selectedChannel = (document.getElementById('channelselect') as HTMLInputElement).value;
    console.log('channel selected:', selectedChannel);
    // this.setting.days = selectBox;
    this.selectedChannel = selectedChannel;

  }

}
