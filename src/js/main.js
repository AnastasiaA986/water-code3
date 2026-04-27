import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import island1Url from "../Ressources/Island.glb";
import model3DUrl from "../Ressources/modele_3D_03.glb";
import model3D2Url from "../Ressources/modele_3d_08.glb";
import model3D3Url from "../Ressources/modele_3d_01.glb";
import model3D4Url from "../Ressources/modele_3d_05.glb";
import model3D5Url from "../Ressources/modele_3d_04.glb";
import model3D6Url from "../Ressources/modele_3d_07.glb";
import model3D7Url from "../Ressources/modele_3d_06.glb";
import model3D8Url from "../Ressources/modele_3d_02.glb";

// =====================
// НАСТРОЙКИ
// =====================
const WAVE_SPEED = 0.5 / 100.0; // скорость волн
const DISTORTION = 1.2; // сила искажения поверхности
const WATER_COLOR = 0x72b4ce; // цвет глубины воды
const SUN_ELEVATION = 160; // высота солнца в градусах (2 = закат, 45 = полдень)
const SUN_AZIMUTH = 200; // направление солнца (0-360)

// =====================
// РЕНДЕРЕР
// =====================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  45,
  window.innerWidth / window.innerHeight,
  1,
  20000,
);
camera.position.set(0, 30, 100);

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
water.position.y = -15; // ← добавь эту строку (отрицательное = ниже)
scene.add(water);

// СВЕТ
// =====================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // общий мягкий свет
scene.add(ambientLight);

// const dirLight = new THREE.DirectionalLight(0xffffff);
// dirLight.position.set(80, 60, 80);
// scene.add(dirLight);

const spotLight = new THREE.SpotLight(0xff2700, 0);
spotLight.position.set(80, 100, 80); // ← сверху над островом
spotLight.target.position.set(0, 0, 0); // ← целится в центр
spotLight.angle = Math.PI / 4; // ← угол конуса света
spotLight.penumbra = 1; // ← мягкость краёв
spotLight.decay = 2;
scene.add(spotLight);
scene.add(spotLight.target);
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

// =====================
// ОСТРОВА + СВЕТ
// =====================
loader.load(island1Url, (gltf) => {
  function createIsland(x, z) {
    const clone = gltf.scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    clone.scale.setScalar(50 / maxDim);
    clone.position.sub(center);
    clone.position.x = x;
    clone.position.z = z;
    clone.position.y = -14;
    clone.rotation.y = -Math.PI / 5.8; // ← 30 градусов

    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(clone);

    // 💡 свой свет над каждым островом
    const light = new THREE.SpotLight(0xff2700, 80); // ← ИНТЕНСИВНОСТЬ СВЕТА (меньше = слабее)
    light.position.set(x, 80, z);
    light.target.position.set(x, 0, z);
    light.angle = Math.PI / 5;
    light.penumbra = 1;
    light.decay = 2;
    light.castShadow = true;

    scene.add(light);
    scene.add(light.target);
  }

  // расставляем острова

  createIsland(0, 0); // первый (центр)
  createIsland(120, -350); // второй
  createIsland(-180, -600); // третий
  createIsland(80, -900); // четвёртый
  createIsland(-120, -1200); // пятый
  createIsland(200, -1500); // шестой
  createIsland(-200, -1800); // седьмой
  createIsland(150, -2100); // восьмой

  // =====================
  // модель на первый остров (x=0, z=0)
  // =====================
  loader.load(model3DUrl, (gltf2) => {
    const obj = gltf2.scene;

    const b = new THREE.Box3().setFromObject(obj);
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3());

    obj.scale.setScalar(33 / Math.max(s.x, s.y, s.z));
    obj.rotation.y = -Math.PI / 2;
    obj.position.sub(c);
    obj.position.x = -1; // первый остров x=0, смещение -3
    obj.position.z = 0;
    obj.position.y = 9.5;

    obj.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(obj);
    console.log("✅ modele_3D_01 загружен!");
  });

  // =====================
  // модель на второй остров (x=120, z=-350)
  // =====================
  loader.load(model3D2Url, (gltf3) => {
    const obj2 = gltf3.scene;

    const b = new THREE.Box3().setFromObject(obj2);
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3());

    obj2.scale.setScalar(33 / Math.max(s.x, s.y, s.z));
    obj2.rotation.y = -Math.PI / 2;
    obj2.position.sub(c);
    obj2.position.x = 120; // второй остров x=120
    obj2.position.z = -350; // второй остров z=-350
    obj2.position.y = 9;

    obj2.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(obj2);
    console.log("✅ modele_3D_02 загружен!");
  });

  // =====================
  // модель на 3 остров (x=-180, z=-600)
  // =====================
  loader.load(model3D3Url, (gltf3) => {
    const obj2 = gltf3.scene;

    const b = new THREE.Box3().setFromObject(obj2);
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3());

    obj2.scale.setScalar(33 / Math.max(s.x, s.y, s.z));
    obj2.rotation.y = -Math.PI / 2;
    obj2.position.sub(c);
    obj2.position.x = -183; // третий остров x=-180
    obj2.position.z = -600; // третий остров z=-600
    obj2.position.y = 10;

    obj2.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(obj2);
    console.log("✅ modele_3D_03 загружен!");
  });

  // =====================
  // модель на 4 остров (x=80, z=-900)
  // =====================
  loader.load(model3D4Url, (gltf3) => {
    const obj2 = gltf3.scene;

    const b = new THREE.Box3().setFromObject(obj2);
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3());

    obj2.scale.setScalar(33 / Math.max(s.x, s.y, s.z));
    obj2.rotation.y = -Math.PI / 2;
    obj2.position.sub(c);
    obj2.position.x = 80.5; // четвёртый остров x=80
    obj2.position.z = -900; // четвёртый остров z=-900
    obj2.position.y = 15;

    obj2.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(obj2);
    console.log("✅ modele_3D_04 загружен!");
  });

  // =====================
  // модель на 5 остров (x=-120, z=-1200)
  // =====================
  loader.load(model3D5Url, (gltf3) => {
    const obj2 = gltf3.scene;

    const b = new THREE.Box3().setFromObject(obj2);
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3());

    obj2.scale.setScalar(33 / Math.max(s.x, s.y, s.z));
    obj2.rotation.y = -Math.PI / 2;
    obj2.position.sub(c);
    obj2.position.x = -121.5; // пятый остров x=-120
    obj2.position.z = -1195; // пятый остров z=-1200
    obj2.position.y = 10;

    obj2.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(obj2);
    console.log("✅ modele_3D_05 загружен!");
  });

  // =====================
  // модель на 6 остров (x=200, z=-1500)
  // =====================
  loader.load(model3D6Url, (gltf3) => {
    const obj2 = gltf3.scene;

    const b = new THREE.Box3().setFromObject(obj2);
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3());

    obj2.scale.setScalar(33 / Math.max(s.x, s.y, s.z));
    obj2.rotation.y = -Math.PI / 2;
    obj2.position.sub(c);
    obj2.position.x = 200; // шестой остров x=200
    obj2.position.z = -1500; // шестой остров z=-1500
    obj2.position.y = -7;

    obj2.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(obj2);
    console.log("✅ modele_3D_06 загружен!");
  });

  // =====================
  // модель на 7 остров (x=-200, z=-1720)
  // =====================
  loader.load(model3D7Url, (gltf3) => {
    const obj2 = gltf3.scene;

    const b = new THREE.Box3().setFromObject(obj2);
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3());

    obj2.scale.setScalar(33 / Math.max(s.x, s.y, s.z));
    obj2.rotation.y = -Math.PI / 2;
    obj2.position.sub(c);
    obj2.position.x = -203; // седьмой остров x=-200
    obj2.position.z = -1800; // седьмой остров z=-1800
    obj2.position.y = 9;

    obj2.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(obj2);
    console.log("✅ modele_3D_07 загружен!");
  });

  // =====================
  // модель на 8 остров (x=-200, z=-1720)
  // =====================
  loader.load(model3D8Url, (gltf3) => {
    const obj2 = gltf3.scene;

    const b = new THREE.Box3().setFromObject(obj2);
    const c = b.getCenter(new THREE.Vector3());
    const s = b.getSize(new THREE.Vector3());

    obj2.scale.setScalar(33 / Math.max(s.x, s.y, s.z));
    obj2.rotation.y = -Math.PI / 2;
    obj2.position.sub(c);
    obj2.position.x = 150; // восьмой остров x=150
    obj2.position.z = -2100; // восьмой остров z=-2100
    obj2.position.y = 15.5;

    obj2.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.2;
        child.material.needsUpdate = true;
      }
    });

    scene.add(obj2);
    console.log("✅ modele_3D_08 загружен!");
  });
});

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);
// =====================
// НАВИГАЦИЯ ПО ОСТРОВАМ
// =====================
const islandPositions = [
  { x: 0, y: 0, z: 120, lookAt: new THREE.Vector3(0, 0, 0) },
  { x: 0, y: 5, z: 80, lookAt: new THREE.Vector3(0, 0, 0) },
  { x: 120, y: 15, z: -270, lookAt: new THREE.Vector3(120, 0, -350) },
  { x: -180, y: 5, z: -520, lookAt: new THREE.Vector3(-180, 0, -600) },
  { x: 80, y: 10, z: -820, lookAt: new THREE.Vector3(80, 0, -900) },
  { x: -120, y: 5, z: -1120, lookAt: new THREE.Vector3(-120, 0, -1200) },
  { x: 200, y: 10, z: -1420, lookAt: new THREE.Vector3(200, 0, -1500) },
  { x: -200, y: 15, z: -1720, lookAt: new THREE.Vector3(-200, 0, -1800) },
  { x: 150, y: 5, z: -2020, lookAt: new THREE.Vector3(150, 0, -2100) },
];

let scrollProgress = 0;
let targetProgress = 0;

// =====================
// ПОВОРОТ МЫШЬЮ ±5°
// =====================
const TILT_LIMIT = THREE.MathUtils.degToRad(1); // ← УМЕНЬШИ ЧИСЛО ДЛЯ МЕНЬШЕГО НАКЛОНА
const mouse = { x: 0, y: 0 }; // -1 до +1

window.addEventListener("mousemove", (e) => {
  // нормализуем позицию мыши от -1 до +1
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

// скролл
window.addEventListener("wheel", (e) => {
  targetProgress += e.deltaY * 0.002; // ← СКОРОСТЬ СКРОЛЛА (меньше = медленнее)
  targetProgress = Math.max(
    0,
    Math.min(islandPositions.length - 1, targetProgress),
  );
});

function getCameraState(progress) {
  const indexA = Math.floor(progress);
  const indexB = Math.min(indexA + 1, islandPositions.length - 1);
  let t = progress - indexA;

  // замедление при приближении (ease-out quartic) ← ИЗМЕНИ СТЕПЕНЬ ДЛЯ СИЛЫ ЗАМЕДЛЕНИЯ (4 = quartic, сильнее чем cubic)
  t = 1 - Math.pow(1 - t, 4);

  const a = islandPositions[indexA];
  const b = islandPositions[indexB];

  const pos = new THREE.Vector3(
    a.x + (b.x - a.x) * t,
    a.y + (b.y - a.y) * t,
    a.z + (b.z - a.z) * t,
  );

  const look = new THREE.Vector3(
    a.lookAt.x + (b.lookAt.x - a.lookAt.x) * t,
    a.lookAt.y + (b.lookAt.y - a.lookAt.y) * t,
    a.lookAt.z + (b.lookAt.z - a.lookAt.z) * t,
  );

  return { pos, look };
}

// resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =====================
// АНИМАЦИЯ
// =====================
function animate() {
  requestAnimationFrame(animate);
  water.material.uniforms["time"].value += WAVE_SPEED;

  // плавно догоняем скролл ← ИЗМЕНИ КОЭФФИЦИЕНТ ДЛЯ СКОРОСТИ СГЛАЖИВАНИЯ (меньше = медленнее)
  scrollProgress += (targetProgress - scrollProgress) * 0.05;

  // базовая позиция и lookAt по маршруту
  const { pos, look } = getCameraState(scrollProgress);

  // применяем смещение от мыши (±10°)
  const offsetX = mouse.x * TILT_LIMIT; // горизонталь
  const offsetY = mouse.y * TILT_LIMIT; // вертикаль

  // направление взгляда
  const direction = new THREE.Vector3().subVectors(look, pos).normalize();

  // поворачиваем направление на угол мыши
  const quaternion = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(direction, up).normalize();

  const qH = new THREE.Quaternion().setFromAxisAngle(up, -offsetX);
  const qV = new THREE.Quaternion().setFromAxisAngle(right, offsetY);
  quaternion.multiplyQuaternions(qH, qV);

  const finalLook = direction.clone().applyQuaternion(quaternion);
  const finalLookAt = pos.clone().add(finalLook);

  camera.position.copy(pos);
  camera.lookAt(finalLookAt);

  // обновляем активное меню в зависимости от прогресса
  let activeIndex;
  if (scrollProgress < 4)
    activeIndex = 0; // Accueil для первых 4 островов
  else if (scrollProgress < 6)
    activeIndex = 1; // Collection для следующих 2
  else if (scrollProgress < 7)
    activeIndex = 2; // Iris для следующих 1
  else activeIndex = 3; // Oceanix для последнего

  // снимаем active со всех
  const menuItems = [
    "menu-accueil",
    "menu-collection",
    "menu-iris",
    "menu-oceanix",
  ];
  menuItems.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  // добавляем active к текущему
  const activeEl = document.getElementById(menuItems[activeIndex]);
  if (activeEl) activeEl.classList.add("active");

  renderer.render(scene, camera);
}

animate();
