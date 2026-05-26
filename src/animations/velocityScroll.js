/**
 * Velocity-Aware Scroll Animations
 * Elements react to scroll speed: skew, stretch, parallax layers.
 * Uses Lenis velocity for smooth values.
 */

import { gsap } from "gsap";
import { getLenis } from "./smoothScroll.js";

let running = false;

// Registered targets
const skewTargets = [];
const stretchTargets = [];

/**
 * Register elements for scroll-velocity skew
 * @param {HTMLElement|HTMLElement[]} els
 * @param {object} opts - { maxSkew: number }
 */
export function addVelocitySkew(els, opts = {}) {
  const { maxSkew = 3 } = opts;
  const elements = els.length !== undefined ? [...els] : [els];
  elements.forEach((el) => {
    skewTargets.push({ el, maxSkew });
    el.style.willChange = "transform";
  });
}

/**
 * Register elements for scroll-velocity stretch (scaleY)
 * @param {HTMLElement|HTMLElement[]} els
 * @param {object} opts - { maxStretch: number }
 */
export function addVelocityStretch(els, opts = {}) {
  const { maxStretch = 0.03 } = opts;
  const elements = els.length !== undefined ? [...els] : [els];
  elements.forEach((el) => {
    stretchTargets.push({ el, maxStretch });
  });
}

function tick() {
  if (!running) return;

  const lenis = getLenis();
  if (!lenis) return;

  // Lenis velocity: pixels/second, typically -2000 to 2000
  const velocity = lenis.velocity || 0;
  // Normalize to -1...1 range (clamped)
  const norm = Math.max(-1, Math.min(1, velocity / 1500));

  // Apply skew
  skewTargets.forEach(({ el, maxSkew }) => {
    gsap.to(el, {
      skewY: norm * maxSkew,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  // Apply stretch
  stretchTargets.forEach(({ el, maxStretch }) => {
    const scaleY = 1 + Math.abs(norm) * maxStretch;
    const scaleX = 1 - Math.abs(norm) * maxStretch * 0.5;
    gsap.to(el, {
      scaleY,
      scaleX,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  });
}

export function startVelocityScroll() {
  if (running) return;
  running = true;
  gsap.ticker.add(tick);
}

export function stopVelocityScroll() {
  running = false;
  gsap.ticker.remove(tick);
}

/**
 * Cleanup all targets
 */
export function disposeVelocityScroll() {
  stopVelocityScroll();
  [...skewTargets, ...stretchTargets].forEach(({ el }) => {
    gsap.set(el, { skewY: 0, scaleX: 1, scaleY: 1, clearProps: "skewY,scaleX,scaleY" });
    el.style.willChange = "";
  });
  skewTargets.length = 0;
  stretchTargets.length = 0;
}
