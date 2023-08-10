import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { init, gl, scene, camera, controls } from './init/init';

import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';
import { GUI } from './init/lil-gui.module.min';
import './style.css';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

init();

var mouse = new THREE.Vector2();

let gui = new GUI();
let options = {
  hue: 0.5,
  uDisplace: 2
}

window.addEventListener('mousemove', function(event) {
  // Calculate normalized coordinates (-1 to 1) relative to the canvas size
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}, false);

var torus = null;

function renderTorus(mouseX, mouseY){
  scene.remove(torus);
  torus = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.3, 100, 100),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      wireframe: false,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uDisplace: { value: options.uDisplace },
        uSpread: { value: 1.0 },
        uNoise: { value: 16 },
        u_mouse: { value: mouse }
      },
    })
  );
  // torus.material.color.setHSL(
  //   options.hue, 
  //   torus.material.color.getHSL().s, 
  //   torus.material.color.getHSL().l
  // );
  scene.add(torus);
}
renderTorus();
gui.add(options, 'uDisplace', 1, 20).step(1).onChange(renderTorus);
gui.add(options, 'hue', 0, 1).step(0.001).onChange(renderTorus);

let composer = new EffectComposer(gl);
composer.addPass(new RenderPass(scene, camera));

const clock = new THREE.Clock();

let animate = () => {
  const elapsedTime = clock.getElapsedTime();
  torus.material.uniforms.uTime.value = elapsedTime;
  composer.render();
  controls.update();
  requestAnimationFrame(animate);
};
animate();
