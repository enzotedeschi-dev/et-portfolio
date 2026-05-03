import * as THREE from "three";

/* ============================================================
   heroLight — cinematic volumetric light beam via Three.js
   ============================================================
   Single full-screen quad with a fragment shader that renders:
     • A directional cone of soft light from the top-left
     • Procedural god-rays with noise-based streaks
     • Atmospheric scatter / haze for natural falloff
     • A bright hotspot at the source
   All falloff is baked into the math — no hard edges anywhere.
   ============================================================ */

// ---------- Vertex shader (trivial fullscreen quad) ----------
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ---------- Fragment shader ----------
const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform float uAspect;
  uniform float uIntensity;
  uniform vec2  uMouseOffset;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 coord = uv;
    coord.x *= uAspect;

    vec2 lightPos = vec2(0.12 * uAspect, 1.05);

    vec2 delta = coord - lightPos;
    float dist = length(delta);
    float angle = atan(delta.x, -delta.y);

    float mouseTilt = clamp(uMouseOffset.x, -1.0, 1.0) * 0.40;
    float coneCenter = 0.85 + mouseTilt;
    float coneWidth  = 0.32;

    float dynamicWidth = coneWidth + 0.85 / (1.0 + dist * 4.0);
    float angDiff = (angle - coneCenter) / dynamicWidth;
    float coneFalloff = exp(-angDiff * angDiff * 2.2);

    float angDist = abs(angle - coneCenter);
    coneFalloff *= smoothstep(1.4, 0.8, angDist);

    float distAtten = exp(-dist * dist * 0.55);

    float beam = coneFalloff * distAtten;

    float r1 = fbm(vec2(angle * 14.0, dist * 1.2 - uTime * 0.004));
    float r2 = fbm(vec2(angle * 14.0 + 47.3, dist * 1.2 - uTime * 0.004));
    float rayNoise = (r1 + r2) * 0.5;
    float rays = smoothstep(0.42, 0.78, rayNoise) * 0.42;
    rays *= coneFalloff * distAtten;

    float scatter = exp(-dist * dist * 0.95) * 0.16;
    scatter *= coneFalloff;

    float hotspot = exp(-dist * dist * 4.5) * 0.6;
    hotspot *= mix(0.45, 1.0, coneFalloff);

    float light = beam * 0.75 + rays + scatter + hotspot;
    light = 1.0 - exp(-light * 1.25);
    light *= uIntensity;

    vec3 warmColor = vec3(1.00, 0.95, 0.86);
    vec3 coolColor = vec3(0.94, 0.93, 0.89);
    float warmth = smoothstep(0.0, 0.55, beam);
    vec3 color = mix(coolColor, warmColor, warmth) * light;

    float dither = (hash(uv * uResolution + uTime) - 0.5) * 0.012;
    color += dither;

    gl_FragColor = vec4(color, light);
  }
`;

// ---------- Public API ----------

/**
 * Initializes the Three.js volumetric light.
 * @param {HTMLCanvasElement} canvas — the target canvas element
 * @returns {Function} cleanup/dispose function
 */
export function initHeroLight(canvas) {
  if (!canvas) return () => {};

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(1.0);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uAspect: { value: 1.0 },
    uIntensity: { value: 0 }, // parte invisibile
    uMouseOffset: { value: new THREE.Vector2() },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /* ---- Sizing ---- */
  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    renderer.setSize(w, h, false);
    uniforms.uResolution.value.set(
      w * renderer.getPixelRatio(),
      h * renderer.getPixelRatio(),
    );
    uniforms.uAspect.value = w / h;
  }

  resize();
  window.addEventListener("resize", resize);

  /* ---- Mouse tracking con smoothing ---- */
  const targetMouse = { x: 0, y: 0 }; // dove vuole andare
  const currentMouse = { x: 0, y: 0 }; // dove è ora (interpolato)

  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const onMouseMove = (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetMouse.x = nx;
    targetMouse.y = ny;
  };

  if (!isTouchDevice) {
    window.addEventListener("mousemove", onMouseMove);
  }

  /* ---- Entrata cinematografica ---- */
  /* L'intensita parte da 0 e sale dolcemente a 1 in ~2.5 secondi */
  const FADE_IN_DURATION = 2500; // ms
  const FADE_IN_DELAY = 600; // ms — ritardo prima che parta
  const startTime = performance.now();

  /* easing dolce per l'entrata — power3.out simulato */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  /* ---- Render loop ---- */
  let running = true;
  let rafId = 0;

  function tick() {
    if (!running) return;
    rafId = requestAnimationFrame(tick);

    const now = performance.now();
    uniforms.uTime.value = now * 0.001;

    /* --- Animazione di entrata --- */
    const elapsed = now - startTime - FADE_IN_DELAY;
    if (elapsed < 0) {
      uniforms.uIntensity.value = 0;
    } else if (elapsed < FADE_IN_DURATION) {
      const t = elapsed / FADE_IN_DURATION;
      uniforms.uIntensity.value = easeOutCubic(t);
    } else {
      uniforms.uIntensity.value = 1;
    }

    /* --- Smoothing del mouse (lerp) --- */
    /* Piu basso il fattore, piu "lento e setoso" segue il mouse */
    const SMOOTH = 0.35;
    currentMouse.x += (targetMouse.x - currentMouse.x) * SMOOTH;
    currentMouse.y += (targetMouse.y - currentMouse.y) * SMOOTH;
    uniforms.uMouseOffset.value.set(currentMouse.x, currentMouse.y);

    renderer.render(scene, camera);
  }

  rafId = requestAnimationFrame(tick);

  /* ---- Cleanup ---- */
  return () => {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    if (!isTouchDevice) {
      window.removeEventListener("mousemove", onMouseMove);
    }
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
