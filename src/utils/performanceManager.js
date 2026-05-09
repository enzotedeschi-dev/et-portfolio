/**
 * Performance Manager
 * - Idle detection: pause RAF loops when sections aren't visible
 * - FPS monitor: detect drops and reduce complexity
 * - Shared IntersectionObserver pool
 */

let fpsHistory = [];
let lastFrameTime = performance.now();
let rafId = 0;
let running = false;
let degraded = false;

const FPS_SAMPLE_SIZE = 30;
const FPS_THRESHOLD = 28;

const callbacks = new Set();

/**
 * Register a callback that receives { fps, degraded }
 */
export function onPerformanceChange(cb) {
  callbacks.add(cb);
  return () => callbacks.delete(cb);
}

function notifyAll() {
  const data = { fps: getAvgFps(), degraded };
  callbacks.forEach((cb) => cb(data));
}

function getAvgFps() {
  if (fpsHistory.length === 0) return 60;
  return fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
}

function tick() {
  if (!running) return;
  const now = performance.now();
  const delta = now - lastFrameTime;
  lastFrameTime = now;

  if (delta > 0) {
    const fps = 1000 / delta;
    fpsHistory.push(fps);
    if (fpsHistory.length > FPS_SAMPLE_SIZE) fpsHistory.shift();
  }

  const avg = getAvgFps();
  const wasDegraded = degraded;

  if (avg < FPS_THRESHOLD && !degraded) {
    degraded = true;
    document.documentElement.classList.add("perf-degraded");
    notifyAll();
  } else if (avg > FPS_THRESHOLD + 10 && degraded) {
    // Hysteresis: recover only if well above threshold
    degraded = false;
    document.documentElement.classList.remove("perf-degraded");
    notifyAll();
  }

  rafId = requestAnimationFrame(tick);
}

export function startMonitoring() {
  if (running) return;
  running = true;
  lastFrameTime = performance.now();
  rafId = requestAnimationFrame(tick);
}

export function stopMonitoring() {
  running = false;
  cancelAnimationFrame(rafId);
}

export function isDegraded() {
  return degraded;
}

/**
 * Shared IntersectionObserver — observe an element and call back on visibility
 * Returns unobserve function
 */
const visibilityObservers = new Map();

let sharedObserver = null;

function getSharedObserver() {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const cb = visibilityObservers.get(entry.target);
        if (cb) cb(entry.isIntersecting);
      });
    },
    { rootMargin: "100px" },
  );
  return sharedObserver;
}

/**
 * Observe an element's visibility
 * @param {HTMLElement} el
 * @param {(visible: boolean) => void} callback
 * @returns {() => void} unobserve function
 */
export function observeVisibility(el, callback) {
  const observer = getSharedObserver();
  visibilityObservers.set(el, callback);
  observer.observe(el);
  return () => {
    visibilityObservers.delete(el);
    observer.unobserve(el);
  };
}
