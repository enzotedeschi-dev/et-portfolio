/**
 * heroScene — Interactive VFX 3D scene
 *
 * Noise-displaced icosahedron with fresnel glow, wireframe overlay,
 * floating particles, and post-processing (bloom + chromatic aberration).
 * Mouse-reactive: rotation, displacement, and chromatic aberration
 * respond to cursor movement.
 *
 * Replaces the old heroLight.js volumetric shader with a full 3D scene
 * that communicates "VFX Artist" identity at first glance.
 */

import { observeVisibility } from "../utils/performanceManager.js";

/* ================================================================
   GLSL — Simplex Noise 3D (ashima/webgl-noise, MIT)
   ================================================================ */

const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v   - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4  j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4  x_ = floor(j * ns.z);
    vec4  y_ = floor(j - 7.0 * x_);
    vec4  x  = x_ * ns.x + ns.yyyy;
    vec4  y  = y_ * ns.x + ns.yyyy;
    vec4  h  = 1.0 - abs(x) - abs(y);
    vec4  b0 = vec4(x.xy, y.xy);
    vec4  b1 = vec4(x.zw, y.zw);
    vec4  s0 = floor(b0) * 2.0 + 1.0;
    vec4  s1 = floor(b1) * 2.0 + 1.0;
    vec4  sh = -step(h, vec4(0.0));
    vec4  a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4  a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3  p0 = vec3(a0.xy, h.x);
    vec3  p1 = vec3(a0.zw, h.y);
    vec3  p2 = vec3(a1.xy, h.z);
    vec3  p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;  p1 *= norm.y;  p2 *= norm.z;  p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

/* ================================================================
   GLSL — Icosahedron vertex shader (noise displacement + mouse)
   ================================================================ */

const ICO_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uNoiseScale;
  uniform float uDisplacement;
  uniform vec2  uMouse;
  uniform float uIntensity;

  varying vec3  vWorldPosition;
  varying float vDisplacement;

  ${NOISE_GLSL}

  void main() {
    vec3 pos = position;

    // Multi-octave noise displacement — respira nel tempo
    float n1 = snoise(pos * uNoiseScale + uTime * 0.15);
    float n2 = snoise(pos * uNoiseScale * 2.0 + uTime * 0.1 + 100.0) * 0.5;
    float noise = n1 + n2 * 0.3;
    float disp  = noise * uDisplacement * uIntensity;

    // Mouse influence sulla deformazione
    vec3  mousePos3D  = vec3(uMouse * 3.0, 0.0);
    float mouseDist   = length(pos.xy - mousePos3D.xy);
    float mouseEffect = smoothstep(3.5, 0.0, mouseDist) * 0.65;
    disp += mouseEffect * uIntensity;

    pos += normal * disp;

    vDisplacement  = disp;
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ================================================================
   GLSL — Icosahedron fragment (fresnel edge glow)
   ================================================================ */

const ICO_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uIntensity;
  uniform vec3  uBaseColor;
  uniform vec3  uFresnelColor;
  uniform float uFresnelPower;

  varying vec3  vWorldPosition;
  varying float vDisplacement;

  void main() {
    // Normals from screen-space derivatives for accurate fresnel
    // on a noise-displaced surface
    vec3 fdx = dFdx(vWorldPosition);
    vec3 fdy = dFdy(vWorldPosition);
    vec3 N   = normalize(cross(fdx, fdy));

    vec3  viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(N, viewDir)), uFresnelPower);

    // Base color + fresnel edge glow
    vec3 color = mix(uBaseColor, uFresnelColor, fresnel);
    // Subtle displacement-based brightness variation
    color += uFresnelColor * abs(vDisplacement) * 0.25;

    // Values > 1.0 on edges — bloom picks them up
    float brightness = 0.15 + fresnel * 1.3;
    color *= brightness;

    float alpha = (0.4 + fresnel * 0.6) * uIntensity;

    gl_FragColor = vec4(color * uIntensity, alpha);
  }
`;

/* ================================================================
   GLSL — Wireframe overlay fragment
   ================================================================ */

const WIRE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uIntensity;
  uniform vec3  uWireColor;

  void main() {
    gl_FragColor = vec4(uWireColor, 0.08 * uIntensity);
  }
`;

/* ================================================================
   GLSL — Floating particles vertex
   ================================================================ */

const PARTICLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2  uMouse;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute float aOffset;

  varying float vAlpha;

  ${NOISE_GLSL}

  void main() {
    vec3 pos = position;

    // Noise-based drift — particelle che derivano lentamente
    float t = uTime * 0.08 + aOffset;
    pos.x += snoise(vec3(pos.y * 0.5, t, aOffset))          * 0.4;
    pos.y += snoise(vec3(t, pos.z * 0.5, aOffset + 50.0))   * 0.4;
    pos.z += snoise(vec3(aOffset + 100.0, pos.x * 0.5, t))  * 0.4;

    // Mouse repulsion (desktop — uMouse resta a 0,0 su touch)
    vec3  mousePos3D = vec3(uMouse * 2.5, 0.0);
    vec3  diff       = pos - mousePos3D;
    float dist       = length(diff);
    float repulsion  = smoothstep(2.0, 0.0, dist) * 0.6;
    pos += normalize(diff + 0.001) * repulsion;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Size attenuation
    gl_PointSize = aSize * uPixelRatio * (180.0 / -mvPos.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    // Alpha: sfuma ai bordi, modulata dall'intensita
    float centerDist = length(position);
    vAlpha = smoothstep(3.8, 1.2, centerDist) * uIntensity;
  }
`;

/* ================================================================
   GLSL — Floating particles fragment
   ================================================================ */

const PARTICLE_FRAGMENT = /* glsl */ `
  precision highp float;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.05, dist) * vAlpha * 0.12;
    // Warm particle color — stesso accent del testo
    gl_FragColor = vec4(0.94, 0.93, 0.89, alpha);
  }
`;

/* ================================================================
   Public API
   ================================================================ */

/**
 * Initializes the Three.js interactive VFX scene.
 * @param {HTMLCanvasElement} canvas — the target canvas element
 * @param {object} [options]
 * @param {number} [options.fadeInDelay=400]    — ms before fade-in starts
 * @param {number} [options.fadeInDuration=2200] — fade-in length in ms
 * @returns {Promise<() => void>} cleanup/dispose function
 */
export async function initHeroScene(canvas, options = {}) {
  if (!canvas) return () => {};

  const THREE = await import("three");

  const parent = canvas.parentElement;
  if (!parent) return () => {};

  const rect = parent.getBoundingClientRect();
  const isMobile = rect.width < 768;
  const isTouchDevice = window.matchMedia(
    "(hover: none), (pointer: coarse)",
  ).matches;

  const { fadeInDelay = 400, fadeInDuration = 2200 } = options;

  /* ---- Renderer ---- */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: !isMobile,
    powerPreference: isMobile ? "low-power" : "default",
  });
  renderer.setClearColor(0x0a0a0a, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  /* ---- Scene & Camera ---- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.5;

  /* ---- Shared uniforms (referenced by all materials) ---- */
  const sharedUniforms = {
    uTime: { value: 0 },
    uNoiseScale: { value: 1.5 },
    uDisplacement: { value: 0.28 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uIntensity: { value: 0 },
  };

  /* ---- Icosahedron — solid mesh ---- */
  const icoDetail = isMobile ? 3 : 4;
  const icoGeometry = new THREE.IcosahedronGeometry(0.95, icoDetail);

  const solidMaterial = new THREE.ShaderMaterial({
    vertexShader: ICO_VERTEX,
    fragmentShader: ICO_FRAGMENT,
    uniforms: {
      ...sharedUniforms,
      uBaseColor: { value: new THREE.Color(0x0d0d0d) },
      uFresnelColor: { value: new THREE.Color(0xf0ece4) },
      uFresnelPower: { value: 2.5 },
    },
    transparent: true,
    depthWrite: true,
  });
  // OES_standard_derivatives per dFdx/dFdy (necessario su WebGL1 fallback)
  solidMaterial.extensions = { derivatives: true };

  const solidMesh = new THREE.Mesh(icoGeometry, solidMaterial);

  /* ---- Icosahedron — wireframe overlay ---- */
  const wireMaterial = new THREE.ShaderMaterial({
    vertexShader: ICO_VERTEX,
    fragmentShader: WIRE_FRAGMENT,
    uniforms: {
      ...sharedUniforms,
      uWireColor: { value: new THREE.Color(0xf0ece4) },
    },
    transparent: true,
    wireframe: true,
    depthWrite: false,
    depthTest: false, // sempre visibile sopra il solid
  });

  const wireMesh = new THREE.Mesh(icoGeometry, wireMaterial);
  wireMesh.scale.setScalar(1.002); // previene z-fighting

  /* ---- Group per rotazione sincronizzata ---- */
  const icoGroup = new THREE.Group();
  icoGroup.add(solidMesh);
  icoGroup.add(wireMesh);
  scene.add(icoGroup);

  /* ---- Floating particles ---- */
  const particleCount = isMobile ? 50 : 120;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const offsets = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // Distribuzione casuale su guscio sferico (raggio 1.8 — 3.2)
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.8 + Math.random() * 1.4;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = 1.0 + Math.random() * 2.5;
    offsets[i] = Math.random() * 100;
  }

  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  pGeo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: PARTICLE_VERTEX,
    fragmentShader: PARTICLE_FRAGMENT,
    uniforms: {
      ...sharedUniforms,
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(pGeo, particleMaterial);
  scene.add(particles);



  /* ---- Sizing ---- */
  let lastW = 0;
  let currentH = 0;

  function resize() {
    const r = parent.getBoundingClientRect();
    const w = r.width;
    const h = r.height;

    // Previene flickering su mobile (address bar hide/show)
    if (w === lastW && Math.abs(h - currentH) < 200) return;
    lastW = w;
    currentH = h;

    const currentMobile = w < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    icoGroup.scale.setScalar(currentMobile ? 0.65 : 1.0);

    particleMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  }

  resize();
  window.addEventListener("resize", resize);

  /* ---- Mouse tracking con smoothing ---- */
  const targetMouse = { x: 0, y: 0 };
  const currentMouse = { x: 0, y: 0 };
  const prevMouse = { x: 0, y: 0 };
  const mouseVelocity = { x: 0, y: 0 };

  const onMouseMove = (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  if (!isTouchDevice) {
    window.addEventListener("mousemove", onMouseMove);
  }

  /* ---- Rotation state ---- */
  const autoRot = { x: 0, y: 0 };
  const mouseRot = { x: 0, y: 0 };
  const AUTO_SPEED = { x: 0.05, y: 0.08 };

  /* ---- Entrata cinematografica ---- */
  const startTime = performance.now();
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  /* ---- Render loop ---- */
  let running = true;
  let visible = true;
  let rafId = 0;
  let lastFrameTime = performance.now();

  function tick() {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    if (!visible) return;

    const now = performance.now();
    const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;

    // Time
    sharedUniforms.uTime.value = now * 0.001;

    // Smooth mouse interpolation (time-based)
    const smooth = 1 - Math.exp(-4.0 * delta);
    currentMouse.x += (targetMouse.x - currentMouse.x) * smooth;
    currentMouse.y += (targetMouse.y - currentMouse.y) * smooth;
    sharedUniforms.uMouse.value.set(currentMouse.x, -currentMouse.y);

    // Mouse velocity (smoothed safely to avoid spikes/black screens)
    const dx = currentMouse.x - prevMouse.x;
    const dy = currentMouse.y - prevMouse.y;
    prevMouse.x = currentMouse.x;
    prevMouse.y = currentMouse.y;
    
    const safeDelta = Math.max(delta, 0.005);
    const instVel = Math.hypot(dx, dy) / safeDelta;
    
    // Smooth the magnitude directly into mouseVelocity.x to avoid NaN/flickering
    const velSmooth = 1 - Math.exp(-10.0 * delta);
    mouseVelocity.x += (instVel - mouseVelocity.x) * velSmooth;

    // Fade-in
    const elapsed = now - startTime - fadeInDelay;
    if (elapsed < 0) {
      sharedUniforms.uIntensity.value = 0;
    } else if (elapsed < fadeInDuration) {
      sharedUniforms.uIntensity.value = easeOutCubic(elapsed / fadeInDuration);
    } else {
      sharedUniforms.uIntensity.value = 1;
    }

    // Rotation: auto + mouse
    autoRot.x += AUTO_SPEED.x * delta;
    autoRot.y += AUTO_SPEED.y * delta;
    mouseRot.x +=
      (-currentMouse.y * 1.0 - mouseRot.x) * (1 - Math.exp(-3.0 * delta));
    mouseRot.y +=
      (currentMouse.x * 1.5 - mouseRot.y) * (1 - Math.exp(-3.0 * delta));
    icoGroup.rotation.x = autoRot.x + mouseRot.x;
    icoGroup.rotation.y = autoRot.y + mouseRot.y;

    // Particles: rotazione indipendente lenta
    particles.rotation.y += 0.012 * delta;
    particles.rotation.x += 0.008 * delta;

    // Render diretto senza post-processing per massima fluidità ed evitare banding
    renderer.render(scene, camera);
  }

  rafId = requestAnimationFrame(tick);

  /* ---- Visibility-based pause ---- */
  const heroSection = canvas.closest(".hero") || parent;
  let unobserve = () => {};
  if (heroSection) {
    unobserve = observeVisibility(heroSection, (isVis) => {
      visible = isVis;
    });
  }

  /* ---- Cleanup ---- */
  return () => {
    running = false;
    cancelAnimationFrame(rafId);
    unobserve();
    window.removeEventListener("resize", resize);
    if (!isTouchDevice) {
      window.removeEventListener("mousemove", onMouseMove);
    }
    icoGeometry.dispose();
    solidMaterial.dispose();
    wireMaterial.dispose();
    pGeo.dispose();
    particleMaterial.dispose();
    renderer.dispose();
  };
}
