/**
 * Magnetic Interactions
 * Elements that subtly attract toward the cursor when nearby.
 * Uses gsap.quickTo for buttery smooth 60fps movement.
 */

import { gsap } from "gsap";

const DEFAULTS = {
  strength: 0.35, // 0 = none, 1 = follows cursor exactly
  radius: 120, // px — activation radius from element center
  ease: "power3.out",
  duration: 0.5,
};

/**
 * Make an element magnetic
 * @param {HTMLElement} el
 * @param {object} options
 * @returns {() => void} cleanup function
 */
export function makeMagnetic(el, options = {}) {
  if (!el || "ontouchstart" in window) return () => {};

  const opts = { ...DEFAULTS, ...options };

  const xTo = gsap.quickTo(el, "x", {
    duration: opts.duration,
    ease: opts.ease,
  });
  const yTo = gsap.quickTo(el, "y", {
    duration: opts.duration,
    ease: opts.ease,
  });

  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < opts.radius) {
      const pull = 1 - dist / opts.radius; // 1 at center, 0 at edge
      xTo(dx * opts.strength * pull);
      yTo(dy * opts.strength * pull);
    } else {
      xTo(0);
      yTo(0);
    }
  };

  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
    gsap.set(el, { x: 0, y: 0 });
  };
}

/**
 * Auto-init all elements with data-magnetic attribute
 */
export function initMagnetics() {
  const els = document.querySelectorAll("[data-magnetic]");
  const cleanups = [];

  els.forEach((el) => {
    const strength = parseFloat(el.dataset.magneticStrength) || undefined;
    const radius = parseFloat(el.dataset.magneticRadius) || undefined;
    cleanups.push(makeMagnetic(el, { strength, radius }));
  });

  return () => cleanups.forEach((fn) => fn());
}
