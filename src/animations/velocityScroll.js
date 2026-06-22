/**
 * Velocity-Aware Scroll Animations
 * Elements react to scroll speed: skew.
 * Uses Lenis velocity for smooth values.
 * Performance: uses gsap.quickTo() to reuse tweens instead of creating new ones per frame.
 */

import { gsap } from "gsap";
import { getLenis } from "./smoothScroll.js";

let running = false;

// Registered targets
const skewTargets = [];

/**
 * Register elements for scroll-velocity skew
 * @param {HTMLElement|HTMLElement[]} els
 * @param {object} opts - { maxSkew: number }
 */
export function addVelocitySkew(els, opts = {}) {
  const { maxSkew = 3 } = opts;
  const elements = els.length !== undefined ? [...els] : [els];
  elements.forEach((el) => {
    skewTargets.push({
      el,
      maxSkew,
      quickSkewY: gsap.quickTo(el, "skewY", { duration: 0.3, ease: "power2.out" }),
    });
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

  // Apply skew via quickTo (reuses existing tween — zero allocation)
  skewTargets.forEach(({ maxSkew, quickSkewY }) => {
    quickSkewY(norm * maxSkew);
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
  skewTargets.forEach(({ el }) => {
    gsap.set(el, { skewY: 0, clearProps: "skewY" });
  });
  skewTargets.length = 0;
}
