import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "meshoptimizer";

export function initModelViewer(containerEl, modelPath) {
  if (!containerEl) return null;

  const width = containerEl.clientWidth;
  const height = containerEl.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.03);

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = false;
  containerEl.appendChild(renderer.domElement);

  const grid = new THREE.GridHelper(10, 20, 0x333333, 0x1a1a1a);
  grid.material.opacity = 0.4;
  grid.material.transparent = true;
  scene.add(grid);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffe4b5, 2.5);
  keyLight.position.set(5, 10, 4);
  scene.add(keyLight);

  const spotLight = new THREE.SpotLight(
    0xffd59e,
    2.0,
    20,
    Math.PI * 0.3,
    0.7,
    1,
  );
  spotLight.position.set(3, 7, 5);
  scene.add(spotLight);

  const fillLight = new THREE.DirectionalLight(0x8ab4f8, 0.6);
  fillLight.position.set(-5, 4, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xadc8ff, 1.5);
  rimLight.position.set(-2, 6, -6);
  scene.add(rimLight);

  const hemiLight = new THREE.HemisphereLight(0x2a3a5c, 0x0a0a0a, 0.4);
  scene.add(hemiLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minDistance = 2;
  controls.maxDistance = 12;
  controls.minPolarAngle = Math.PI * 0.1;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.autoRotate = true;
  controls.autoRotateSpeed = -0.8;
  controls.target.set(0, 0.8, 0);
  controls.update();

  renderer.domElement.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomSpeed = 0.5;
        const delta = e.deltaY > 0 ? zoomSpeed : -zoomSpeed;
        const dist = camera.position.distanceTo(controls.target);
        const newDist = THREE.MathUtils.clamp(
          dist + delta,
          controls.minDistance,
          controls.maxDistance,
        );
        const dir = camera.position.clone().sub(controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(dir, newDist);
      }
    },
    { passive: false },
  );

  const loadingEl = document.createElement("div");
  loadingEl.className = "modeling-viewer__loading";
  loadingEl.innerHTML = "<span>Loading 3D Model...</span>";
  containerEl.appendChild(loadingEl);

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
  );
  dracoLoader.setDecoderConfig({ type: "js" });

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);

  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;
      model.scale.setScalar(scale);

      const scaledBox = new THREE.Box3().setFromObject(model);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      const scaledMin = scaledBox.min;

      model.position.x -= scaledCenter.x;
      model.position.z -= scaledCenter.z;
      model.position.y -= scaledMin.y - 0.01;

      scene.add(model);

      const finalBox = new THREE.Box3().setFromObject(model);
      const finalCenter = finalBox.getCenter(new THREE.Vector3());
      controls.target.set(0, finalCenter.y, 0);
      controls.update();

      dracoLoader.dispose();

      loadingEl.style.opacity = "0";
      setTimeout(() => loadingEl.remove(), 500);
    },
    (progress) => {
      if (progress.lengthComputable) {
        const pct = Math.round((progress.loaded / progress.total) * 100);
        loadingEl.querySelector("span").textContent =
          `Loading 3D Model... ${pct}%`;
      }
    },
    (error) => {
      console.error("Error loading 3D model:", error);
      loadingEl.querySelector("span").textContent = "Failed to load model";
    },
  );

  let animId;
  let isVisible = false;

  function animate() {
    animId = requestAnimationFrame(animate);
    if (!isVisible) return;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  const visObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
    },
    { threshold: 0.05 },
  );
  visObserver.observe(containerEl);

  function onResize() {
    const w = containerEl.clientWidth;
    const h = containerEl.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(containerEl);

  return {
    dispose() {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      visObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
