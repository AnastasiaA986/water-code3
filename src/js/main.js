// === ПРЕЛОАДЕР ===
document.body.classList.add("loading");
setTimeout(() => {
  // Сначала плавно скрываем спиннер и белый фон
  const loader = document.getElementById("loader");
  const loaderOverlay = document.getElementById("loader-overlay");
  if (loader) loader.style.opacity = "0";
  if (loaderOverlay) loaderOverlay.style.opacity = "0";

  // Через 400ms (пока оверлей ещё тает) — убираем класс loading,
  // чтобы canvas и меню начали появляться с zoom-эффектом
  setTimeout(() => {
    document.body.classList.remove("loading");
  }, 500);
}, 3000);

document.getElementById("intro-btn").addEventListener("click", () => {
  const intro = document.getElementById("intro-screen");
  intro.classList.add("hidden");

  document.getElementById("sideMenu").classList.add("scene-visible");
  document.getElementById("info-buttons").classList.add("scene-visible");
  document.querySelector("#main-logo").classList.add("visible");
  document.querySelector("#scroll-indicator").classList.add("visible");

  modelsGroup.visible = true;
  modelsIntroActive = true;
  modelsIntroProgress = 0;
});

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import island1Url from "../Ressources/Island.glb";
import model3DUrl from "../Ressources/modele_3D_03.glb";
import model3D2Url from "../Ressources/modele_3d_08.glb";
import model3D3Url from "../Ressources/modele_3d_01.glb";
import model3D4Url from "../Ressources/modele_3d_05.glb";
import model3D5Url from "../Ressources/modele_3d_04.glb";
import model3D6Url from "../Ressources/modele_3d_07.glb";
import model3D7Url from "../Ressources/modele_3d_06.glb";
import model3D8Url from "../Ressources/modele_3d_02.glb";
import starBtnUrl from "../Ressources/star-bouton.svg";

// =====================
// OVERLAY
// =====================
const overlay = document.getElementById("info-overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");

let activeBtn = null;

const scrollInd = document.getElementById("scroll-indicator");
const scrollImgs = scrollInd.querySelectorAll("img");
const mainLogo = document.getElementById("main-logo");

const sectionTl = gsap.timeline({ paused: true });
sectionTl.to(mainLogo, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, 0);

function positionOverlay(btn) {
  const overlay = document.getElementById("info-overlay");
  const rect = btn.getBoundingClientRect();

  const offsetX = -299; // сдвиг по горизонтали (+ вправо, - влево)
  const offsetY = 25; // сдвиг по вертикали (+ вниз, - вверх)

  overlay.style.top = rect.top + offsetY + "px";
  overlay.style.left = rect.left + offsetX + "px";
}

function showOverlay(title, text, btn) {
  const overlay = document.getElementById("info-overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayText = document.getElementById("overlay-text");

  overlayTitle.textContent = title;
  overlayText.textContent = text;

  activeBtn = btn;
  positionOverlay(btn);

  overlay.classList.add("visible");
}

// =====================
// КЛИКИ ПО КНОПКАМ (открытие/закрытие overlay)
// =====================

document.querySelectorAll(".ripple-btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    switch (btn.id) {
      case "btn-1a":
        showOverlay(
          "Pétales polymères adaptatifs",
          "Des panneaux ultrafins, souples à la base et plus rigides sur les bords, pour garder une forme précise",
          btn,
        );
        break;

      case "btn-1b":
        showOverlay(
          "Structure respirante",
          "Une base souple qui accompagne chaque mouvement comme un pétale vivant",
          btn,
        );
        break;

      case "btn-2a":
        showOverlay(
          "Spirales cinétiques",
          "Des rubans polymères légers qui tournent autour du corps comme des flux d’air solidifiés",
          btn,
        );
        break;

      case "btn-2b":
        showOverlay(
          "Équilibre suspendu",
          "Chaque courbe garde sa tension grâce à une structure interne invisible",
          btn,
        );
        break;

      case "btn-3a":
        showOverlay(
          "Expansion aquatique",
          "Des éléments souples qui s’étendent comme des branches sous‑marines, réagissant au mouvement de l’air",
          btn,
        );
        break;

      case "btn-3b":
        showOverlay(
          "Surface vivante",
          "Un tissu irisé qui ondule doucement, imitant les reflets de l’eau sur la peau",
          btn,
        );
        break;

      case "btn-4a":
        showOverlay(
          "Structure cristalline",
          "Des panneaux rigides et translucides qui s’élèvent comme des éclats de lumière figés dans le mouvement",
          btn,
        );
        break;

      case "btn-4b":
        showOverlay(
          "Structure cristalline",
          "Des panneaux rigides et translucides qui s’élèvent comme des éclats de lumière figés dans le mouvement",
          btn,
        );
        break;

      case "btn-5a":
        showOverlay(
          "Floraison minérale",
          "Des pétales rigides inspirés des cristaux, sculptés pour amplifier la puissance du corps",
          btn,
        );
        break;

      case "btn-5b":
        showOverlay(
          "Éclat solaire",
          "La matière dorée capte la lumière et la renvoie en reflets chauds, comme une armure lumineuse",
          btn,
        );
        break;

      case "btn-6a":
        showOverlay(
          "Spirales organiques",
          "Des volumes souples qui s’enroulent autour du corps, évoquant le souffle et la croissance naturelle",
          btn,
        );
        break;

      case "btn-6b":
        showOverlay(
          "Texture lumineuse",
          "Un tissu doré qui capte la lumière et la diffuse comme une brume chaude sur la peau",
          btn,
        );
        break;

      case "btn-7a":
        showOverlay(
          "Architecture organique",
          "Des formes angulaires qui s’ouvrent et se referment comme des pétales mécaniques autour du corps",
          btn,
        );
        break;

      case "btn-7b":
        showOverlay(
          "Structure dynamique",
          "Un design sculpté qui équilibre force et légèreté, évoquant la tension d’un mouvement figé",
          btn,
        );
        break;

      case "btn-8a":
        showOverlay(
          "Cristaux fluides",
          "Un tissage translucide inspiré des structures de glace — souple, lumineux, presque vivant sous la lumière",
          btn,
        );
        break;

      case "btn-8b":
        showOverlay(
          "Réseau cristallin",
          "Des lignes entrelacées qui suivent le corps comme des veines de lumière en mouvement",
          btn,
        );
        break;
    }
  });

  btn.addEventListener("mouseleave", (e) => {
    // если курсор ушёл на overlay — не скрываем
    if (overlay.contains(e.relatedTarget)) return;

    overlay.classList.remove("visible");
    activeBtn = null;
  });
});
overlay.addEventListener("mouseenter", () => {
  overlay.classList.add("visible");
});

overlay.addEventListener("mouseleave", () => {
  overlay.classList.remove("visible");
  activeBtn = null;
});

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
document.getElementById("canvas-container").appendChild(renderer.domElement);

// =====================
// СЦЕНА И КАМЕРА
// =====================
const scene = new THREE.Scene();
// =====================
// ГРУППА ДЛЯ ОСТРОВОВ И МОДЕЛЕЙ (скрыта до нажатия кнопки)
// =====================
const modelsGroup = new THREE.Group();
modelsGroup.visible = false;
scene.add(modelsGroup);

let modelsIntroActive = false;
let modelsIntroProgress = 0;

const camera = new THREE.PerspectiveCamera(
  50,
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

    modelsGroup.add(clone);

    // 💡 свой свет над каждым островом
    const light = new THREE.SpotLight(0xff2700, 80); // ← ИНТЕНСИВНОСТЬ СВЕТА (меньше = слабее)
    light.position.set(x, 80, z);
    light.target.position.set(x, 0, z);
    light.angle = Math.PI / 5;
    light.penumbra = 1;
    light.decay = 2;
    light.castShadow = true;

    modelsGroup.add(light);
    modelsGroup.add(light.target);
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

    modelsGroup.add(obj);
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

    modelsGroup.add(obj2);
    console.log("✅ modele_3D_02 загружен!");

    // Привязка кнопок к верхней точке модели
    const top2 = getTopPoint(obj2);
    MODELS_DATA[1].buttons.forEach((btn, i) => {
      btn.anchor = top2.clone();
      btn.anchor.y += 2 + i * 2; // аккуратно вверх
    });
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

    modelsGroup.add(obj2);
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

    modelsGroup.add(obj2);
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

    modelsGroup.add(obj2);
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

    modelsGroup.add(obj2);
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

    modelsGroup.add(obj2);
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

    modelsGroup.add(obj2);
    console.log("✅ modele_3D_08 загружен!");
  });
});

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);
// =====================
// НАВИГАЦИЯ ПО ОСТРОВАМ
// =====================
const islandPositions = [
  // модель 1
  { x: 0, y: -7, z: 120, lookAt: new THREE.Vector3(0, 0, 0), rotation: 0.04 },
  { x: 0, y: 5, z: 80, lookAt: new THREE.Vector3(0, 0, 0), rotation: -0.04 },
  // модель 2
  {
    x: 120,
    y: 10,
    z: -270,
    lookAt: new THREE.Vector3(120, 0, -350),
    rotation: 0.05,
  },
  {
    x: 160,
    y: 0,
    z: -300,
    lookAt: new THREE.Vector3(120, 0, -350),
    rotation: -0.05,
  },
  // модель 3
  {
    x: -180,
    y: 5,
    z: -520,
    lookAt: new THREE.Vector3(-180, 0, -600),
    rotation: 0.05,
  },
  {
    x: -220,
    y: 0,
    z: -520,
    lookAt: new THREE.Vector3(-180, 0, -600),
    rotation: -0.05,
  },
  // модель 4
  {
    x: 80,
    y: 5,
    z: -820,
    lookAt: new THREE.Vector3(80, 0, -900),
    rotation: 0.04,
  },
  {
    x: 140,
    y: -5,
    z: -960,
    lookAt: new THREE.Vector3(80, 0, -900),
    rotation: 0.04,
  },

  // модель 6
  {
    x: 200,
    y: 7,
    z: -1420,
    lookAt: new THREE.Vector3(200, 0, -1500),
    rotation: 0.04,
  },
  {
    x: 160,
    y: 0,
    z: -1420,
    lookAt: new THREE.Vector3(200, 0, -1500),
    rotation: 0.04,
  },

  // модель 5
  {
    x: -120,
    y: 5,
    z: -1120,
    lookAt: new THREE.Vector3(-120, 0, -1200),
    rotation: -0.04,
  },
  {
    x: -95,
    y: -3,
    z: -1080,
    lookAt: new THREE.Vector3(-120, 0, -1200),
    rotation: -0.04,
  },

  // модель 7
  {
    x: -200,
    y: 10,
    z: -1720,
    lookAt: new THREE.Vector3(-200, 0, -1800),
    rotation: -0.04,
  },
  {
    x: -300,
    y: 0,
    z: -1770,
    lookAt: new THREE.Vector3(-200, 0, -1800),
    rotation: -0.04,
  },
  // модель 8
  {
    x: 150,
    y: 5,
    z: -2020,
    lookAt: new THREE.Vector3(150, 0, -2100),
    rotation: 0.04,
  }, // на скроль
  {
    x: 130,
    y: -5,
    z: -2120,
    lookAt: new THREE.Vector3(130, 0, -2200),
    rotation: -0.04,
  },
];

let scrollProgress = 0;
let targetProgress = 0;

// =====================
// ПАРАЛЛАКС МЫШИ
// =====================
let mouseTargetX = 0;
let mouseSmoothX = 0;
const MOUSE_LATERAL_STRENGTH = 10; // максимальное боковое смещение камеры (единицы)
const MOUSE_EASE = 0.05; // плавность следования (0.01 = очень плавно, 0.1 = быстро)

window.addEventListener("mousemove", (e) => {
  mouseTargetX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 … +1
});

const SCROLL_SENSITIVITY = 0.0075; // уменьшенная чувствительность, чтобы не было резких рывков
const SCROLL_EASE = 0.06; // более мягкое сглаживание прогресса

const LAST_MODEL_INDEX = 14.8;
const LAST_MODEL_OVERSHOOT = 2; // насколько дальше последней модели можно прокрутить (для более плавного перехода к открытию секции)
const LOCKED_CAMERA_PROGRESS = LAST_MODEL_INDEX + LAST_MODEL_OVERSHOOT;
const SECTION_TRIGGER = 14.75; // прогресс, при котором открывается последняя секция с моделью 8 (можно изменить для более раннего или позднего открытия)
const MAX_PROGRESS = 15;
scrollProgress = LAST_MODEL_INDEX;

let sceneLocked = false;

// =====================
// ПРОСТЫЕ HTML-КНОПКИ
// =====================
const SIMPLE_BUTTONS = [
  // Модель 1
  { id: "btn-1a", min: 0.3, max: 1.1 },
  { id: "btn-1b", min: 0.3, max: 1.1 },

  // Модель 2
  { id: "btn-2a", min: 1.9, max: 3 },
  { id: "btn-2b", min: 1.9, max: 3 },

  // Модель 3
  { id: "btn-3a", min: 4, max: 5 },
  { id: "btn-3b", min: 4, max: 5 },

  // Модель 4
  { id: "btn-4a", min: 6.5, max: 7 },
  { id: "btn-4b", min: 5.95, max: 6.3 },

  // Модель 5
  { id: "btn-5a", min: 7.9, max: 8.95 },
  { id: "btn-5b", min: 7.9, max: 8.95 },

  // Модель 6
  { id: "btn-6a", min: 9.95, max: 10.35 },
  { id: "btn-6b", min: 9.95, max: 10.35 },

  // Модель 7
  { id: "btn-7a", min: 11.95, max: 12.9 },
  { id: "btn-7b", min: 11.95, max: 12.9 },

  // Модель 8
  { id: "btn-8a", min: 13.9, max: 14.2 },
  { id: "btn-8b", min: 13.9, max: 14.2 },
];

function updateSimpleButtons() {
  SIMPLE_BUTTONS.forEach((b) => {
    const el = document.getElementById(b.id);
    const visible = scrollProgress >= b.min && scrollProgress <= b.max;

    el.style.opacity = visible ? 1 : 0;
    el.style.pointerEvents = visible ? "auto" : "none";
  });
}

// скролл
window.addEventListener(
  "wheel",
  (e) => {
    if (
      !document.getElementById("sideMenu").classList.contains("scene-visible")
    )
      return;

    // если скроллим внутри combined-section — не перехватывать

    const rawDelta = e.deltaY * SCROLL_SENSITIVITY;
    const deltaProgress =
      Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 0.02);
    const willOpenSection =
      targetProgress >= SECTION_TRIGGER || scrollProgress >= SECTION_TRIGGER;

    const combinedSection = document.getElementById("combined-section");

    if (
      willOpenSection &&
      deltaProgress > 0 &&
      !combinedSection.contains(e.target)
    ) {
      e.preventDefault();
      return;
    }

    if (willOpenSection && deltaProgress < 0 && combinedSection.scrollTop > 0) {
      return;
    }

    targetProgress += deltaProgress;
    targetProgress = Math.max(0, Math.min(MAX_PROGRESS, targetProgress));
  },
  { passive: false },
);

function getCameraState(progress) {
  const indexA = Math.floor(progress);
  const indexB = Math.min(indexA + 1, islandPositions.length - 1);
  let t = progress - indexA;

  // мягкий переход между позициями без резкого ускорения
  t = t * t * (3 - 2 * t); // smoothstep

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

window.addEventListener("resize", () => {
  const overlay = document.getElementById("info-overlay");
  if (overlay.classList.contains("visible") && activeBtn) {
    positionOverlay(activeBtn);
  }
});

// =====================
// АНИМАЦИЯ
// =====================

function animate() {
  requestAnimationFrame(animate);
  water.material.uniforms["time"].value += WAVE_SPEED;

  // плавно догоняем скролл
  scrollProgress += (targetProgress - scrollProgress) * SCROLL_EASE;

  console.log("scrollProgress:", scrollProgress.toFixed(2));

  // базовая позиция и lookAt по маршруту
  const cameraProgress = Math.min(scrollProgress, LOCKED_CAMERA_PROGRESS);
  const { pos, look } = getCameraState(cameraProgress);

  // Scene lock state: остаётся заблокированной после выхода за последнюю модель
  const sectionVisible = scrollProgress >= SECTION_TRIGGER;
  sceneLocked = scrollProgress >= LOCKED_CAMERA_PROGRESS;
  controls.enabled = !sceneLocked;

  // плавно тянем боковое смещение к позиции мыши
  mouseSmoothX += (mouseTargetX - mouseSmoothX) * MOUSE_EASE;
  pos.x += mouseSmoothX * MOUSE_LATERAL_STRENGTH;

  // направление взгляда
  const direction = new THREE.Vector3().subVectors(look, pos).normalize();

  const finalLookAt = pos.clone().add(direction);

  camera.position.copy(pos);
  camera.lookAt(finalLookAt);

  // обновляем активное меню в зависимости от прогресса
  let activeIndex;
  if (scrollProgress < SECTION_TRIGGER) {
    activeIndex = 0;
  } else {
    const cs = document.getElementById("combined-section");
    activeIndex = cs.scrollTop >= window.innerHeight ? 2 : 1;
  }

  // снимаем active со всех
  const menuItems = ["menu-collection", "menu-iris", "menu-oceanix"];
  menuItems.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  // добавляем active к текущему
  const activeEl = document.getElementById(menuItems[activeIndex]);
  if (activeEl) activeEl.classList.add("active");

  // ── Плавное появление моделей ──
  if (modelsIntroActive) {
    modelsIntroProgress = Math.min(1, modelsIntroProgress + 0.02);

    // fade‑in
    modelsGroup.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = modelsIntroProgress;
      }
    });

    // zoom‑in
    const scale = 0.9 + modelsIntroProgress * 0.1; // 0.9 → 1.0
    modelsGroup.scale.setScalar(scale);

    if (modelsIntroProgress === 1) {
      modelsIntroActive = false;
    }
  }
  updateSimpleButtons();

  renderer.render(scene, camera);

  // =====================
  // КОНТРОЛЬ ВИДИМОСТИ COMBINED-СЕКЦИИ
  // =====================
  const combinedSection = document.getElementById("combined-section");

  if (sectionVisible !== prevSectionVisible) {
    prevSectionVisible = sectionVisible;
    if (sectionVisible) {
      sectionTl.play();
      scrollImgs.forEach((img) => (img.src = img.dataset.light));
    } else {
      sectionTl.reverse();
      scrollImgs.forEach((img) => (img.src = img.dataset.dark));
    }
  }

  if (sectionVisible) {
    combinedSection.classList.add("visible");
    runArtisteAnimation();
  } else {
    if (combinedSection.classList.contains("visible")) {
      combinedSection.scrollTop = 0;
      artisteAnimated = false;
    }
    combinedSection.classList.remove("visible");
  }
}

// =====================
// АНИМАЦИЯ COMBINED-СЕКЦИИ (запускается один раз)
// =====================
let artisteAnimated = false;

gsap
  .timeline({
    scrollTrigger: {
      trigger: "#combined-section .combined-page:nth-of-type(2)",
      scroller: "#combined-section",
      start: "top 0%",
      end: "bottom 40%",
      toggleActions: "play none none reverse",
    },
  })
  .fromTo(
    ".oceanix-image",
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" },
  )
  .fromTo(
    ".oceanix-biographie",
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" },
    "-=0.6",
  )
  .fromTo(
    ".propos",
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" },
    "-=0.6",
  );

function runArtisteAnimation() {
  if (artisteAnimated) return;
  artisteAnimated = true;
  gsap
    .timeline()
    .fromTo(
      ".artiste-image",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" },
    )
    .fromTo(
      ".artiste-biographie",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" },
      "-=0.6",
    )
    .fromTo(
      ".propos-collection",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" },
      "-=0.6",
    );
}

let prevSectionVisible = false;

animate();

// =====================
// БЕСКОНЕЧНАЯ КАРУСЕЛЬ МОДЕЛЕЙ
// =====================

const track = document.querySelector(".modeles-track");
if (track) {
  const TOTAL_SETS = 4; // 1 оригинал + 3 клона — нет пробелов при любой ширине экрана
  const originals = Array.from(track.children);

  for (let i = 0; i < TOTAL_SETS - 1; i++) {
    originals.forEach((item) => track.appendChild(item.cloneNode(true)));
  }

  // Передаём количество наборов в CSS чтобы анимация двигалась ровно на 1 набор
  track.style.setProperty("--marquee-sets", TOTAL_SETS);

  const allImgs = Array.from(track.querySelectorAll("img"));

  function animateCarousel() {
    const c = window.innerWidth / 2;
    allImgs.forEach((img) => {
      const r = img.getBoundingClientRect();
      const dist = Math.abs(c - (r.left + r.width / 2));
      const t = Math.max(0, 1 - dist / (window.innerWidth / 2));
      img.style.transform = `scale(${0.6 + t * 0.4})`;
      img.style.opacity = 0.4 + t * 0.6;
    });
    requestAnimationFrame(animateCarousel);
  }

  animateCarousel();
}

// =====================
// НАВИГАЦИЯ ПО МЕНЮ
// =====================
const combinedSectionEl = document.getElementById("combined-section");

function navigateTo(destination, onComplete) {
  gsap.killTweensOf({ targetProgress });
  const proxy = { value: targetProgress };
  gsap.to(proxy, {
    value: destination,
    duration: 3,
    ease: "power2.inOut",
    onUpdate: () => {
      targetProgress = proxy.value;
    },
    onComplete,
  });
}

document
  .getElementById("menu-collection")
  .closest(".menu-item")
  .addEventListener("click", () => {
    navigateTo(0);
  });

document
  .getElementById("menu-iris")
  .closest(".menu-item")
  .addEventListener("click", () => {
    navigateTo(MAX_PROGRESS, () => {
      combinedSectionEl.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

document
  .getElementById("menu-oceanix")
  .closest(".menu-item")
  .addEventListener("click", () => {
    navigateTo(MAX_PROGRESS, () => {
      combinedSectionEl.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    });
  });

// =====================
// HIDE MENU ON THIRD COMBINED-PAGE (intro-titres)
// =====================
const sideMenu = document.getElementById("sideMenu");

combinedSectionEl.addEventListener(
  "scroll",
  () => {
    const atThirdPage = combinedSectionEl.scrollTop >= window.innerHeight * 2;
    sideMenu.classList.toggle("menu-hidden", atThirdPage);
  },
  { passive: true },
);

// =====================
// КНОПКА «RETOUR À LA RÉALITÉ» — перезагрузка страницы
// =====================
document.getElementById("retour-btn").addEventListener("click", () => {
  window.location.reload();
});
