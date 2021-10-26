import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";

// Loaders
const loader = new THREE.TextureLoader();
const texture = loader.load("/texture.jpg");
const height = loader.load("/height.png");
const alpha = loader.load("/alpha.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const planeGeometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64);

// Materials
const material = new THREE.MeshStandardMaterial({
  color: "gray",
  map: texture,
  displacementMap: height,
  displacementScale: 0.6,
  alphaMap: alpha,
  transparent: true,
  depthTest: false,
});

// Mesh
const plane = new THREE.Mesh(planeGeometry, material);
scene.add(plane);

plane.rotation.x = 181;

const planeControls = gui.addFolder("Plane");

planeControls.add(plane.rotation, "x").min(0).max(360).step(0.01);
// Lights

const pointLight = new THREE.PointLight(0x00b3ff, 3);
pointLight.position.x = 0.2;
pointLight.position.y = 10;
pointLight.position.z = 4.4;
scene.add(pointLight);

const pointLightControls = gui.addFolder("Point Light");
pointLightControls.add(pointLight.position, "x").min(-6).max(6).step(0.01);
pointLightControls.add(pointLight.position, "y").min(-3).max(3).step(0.01);
pointLightControls.add(pointLight.position, "z").min(-3).max(3).step(0.01);
pointLightControls.add(pointLight, "intensity").min(0).max(10).step(0.01);

const pointLightColor = {
  color: 0x00b3ff,
};

pointLightControls.addColor(pointLightColor, "color").onChange(() => {
  pointLight.color.set(pointLightColor.color);
});

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
// scene.add(pointLightHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

document.addEventListener("mousemove", animateTerrain);

let mouseY = 0;

function animateTerrain(e) {
  mouseY = event.clientY;
}

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  plane.rotation.z = 0.5 * elapsedTime;
  plane.material.displacementScale = mouseY * 0.001;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
