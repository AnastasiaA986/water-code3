import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import islandUrl from "../Ressources/Island.glb"; // ← добавить

// =====================
// НАСТРОЙКИ
// =====================
const WAVE_SPEED = 0.5 / 100.0; // скорость волн
const DISTORTION = 1.2; // сила искажения поверхности
const WATER_COLOR = 0x72b4ce; // цвет глубины воды
const SUN_ELEVATION = 155; // высота солнца в градусах (2 = закат, 45 = полдень)
const SUN_AZIMUTH = 200; // направление солнца (0-360)

// =====================
// РЕНДЕРЕР
// =====================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild(renderer.domElement);

// =====================
// СЦЕНА И КАМЕРА
// =====================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  1,
  20000,
);
camera.position.set(30, 30, 100);

// =====================
// УПРАВЛЕНИЕ
// =====================
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.495; // не пускать камеру под воду
controls.minDistance = 10;
controls.maxDistance = 500;
controls.update();

// =====================
// ВОДА
// =====================
const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/waternormals.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    },
  ),
  sunDirection: new THREE.Vector3(),
  sunColor: 0x012240,
  waterColor: WATER_COLOR,
  distortionScale: DISTORTION,
  fog: scene.fog !== undefined,
});

water.rotation.x = -Math.PI / 2;
scene.add(water);

// =====================
// НЕБО
// =====================
const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);

const skyUniforms = sky.material.uniforms;
skyUniforms["turbidity"].value = 6;
skyUniforms["rayleigh"].value = 3;
skyUniforms["mieCoefficient"].value = 0.005;
skyUniforms["mieDirectionalG"].value = 0.8;

// =====================
// СОЛНЦЕ
// =====================
const sun = new THREE.Vector3();
const pmremGenerator = new THREE.PMREMGenerator(renderer);

function updateSun(elevation, azimuth) {
  const phi = THREE.MathUtils.degToRad(90 - elevation);
  const theta = THREE.MathUtils.degToRad(azimuth);
  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms["sunPosition"].value.copy(sun);
  water.material.uniforms["sunDirection"].value.copy(sun).normalize();

  // HDR отражение неба в воде
  scene.environment = pmremGenerator.fromScene(sky).texture;
}

updateSun(SUN_ELEVATION, SUN_AZIMUTH);

const loader = new GLTFLoader();

loader.load(
  islandUrl,
  (gltf) => {
    console.log("✅ Модель загружена!", gltf);

    const model = gltf.scene;

    // Автомасштаб
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    console.log("Размер:", size);

    model.scale.setScalar(50 / maxDim); // подгоняем до 50 единиц
    model.position.sub(center); // центрируем
    model.position.y = -2; // на уровне воды

    scene.add(model);
  },
  (xhr) => {
    if (xhr.total > 0) {
      console.log(((xhr.loaded / xhr.total) * 100).toFixed(1) + "% загружено");
    }
  },
  (error) => {
    console.error("❌ Ошибка:", error);
  },
);

// =====================
// АНИМАЦИЯ
// =====================
function animate() {
  requestAnimationFrame(animate);
  water.material.uniforms["time"].value += WAVE_SPEED;
  renderer.render(scene, camera);
}

animate();
