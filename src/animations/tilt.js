/**
 * 3D Tilt Effect
 * Adds perspective-based rotation + spotlight glare on cards.
 * Throttled via requestAnimationFrame for performance.
 */

import { gsap } from "gsap";

const DEFAULTS = {
  maxTilt: 8, // degrees
  scale: 1.02,
  speed: 0.4, // gsap duration for the tilt
  glare: true, // show spotlight/glare
  glareOpacity: 0.12,
  perspective: 1000,
};

/**
 * Apply 3D tilt to an element
 * @param {HTMLElement} el
 * @param {object} options
 * @returns {() => void} cleanup
 */
export function addTilt(el, options = {}) {
  if (!el || "ontouchstart" in window) return () => {};

  const opts = { ...DEFAULTS, ...options };

  // Ensure parent has perspective
  el.style.transformStyle = "preserve-3d";
  if (el.parentElement) {
    el.parentElement.style.perspective = `${opts.perspective}px`;
  }

  // Create glare overlay
  let glareEl = null;
  if (opts.glare) {
    glareEl = document.createElement("div");
    glareEl.className = "tilt-glare";
    glareEl.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 2;
    `;
    el.style.position = el.style.position || "relative";
    el.style.overflow = "hidden";
    el.appendChild(glareEl);
  }

  let rafPending = false;
  let lastMouse = { x: 0, y: 0 };

  const updateTilt = () => {
    rafPending = false;
    const rect = el.getBoundingClientRect();
    const x = (lastMouse.x - rect.left) / rect.width; // 0 → 1
    const y = (lastMouse.y - rect.top) / rect.height;

    const rotateX = (0.5 - y) * opts.maxTilt * 2;
    const rotateY = (x - 0.5) * opts.maxTilt * 2;

    gsap.to(el, {
      rotateX,
      rotateY,
      scale: opts.scale,
      duration: opts.speed,
      ease: "power2.out",
      transformPerspective: opts.perspective,
    });

    if (glareEl) {
      const gx = x * 100;
      const gy = y * 100;
      glareEl.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,${opts.glareOpacity}) 0%, transparent 60%)`;
      glareEl.style.opacity = "1";
    }
  };

  const onMove = (e) => {
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updateTilt);
    }
  };

  const onLeave = () => {
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    });
    if (glareEl) {
      glareEl.style.opacity = "0";
    }
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
    if (glareEl && glareEl.parentNode) {
      glareEl.parentNode.removeChild(glareEl);
    }
    gsap.set(el, { rotateX: 0, rotateY: 0, scale: 1, clearProps: "all" });
  };
}

/**
 * Auto-init all [data-tilt] elements
 */
export function initTilts() {
  const els = document.querySelectorAll("[data-tilt]");
  const cleanups = [];
  els.forEach((el) => {
    const maxTilt = parseFloat(el.dataset.tiltMax) || undefined;
    cleanups.push(addTilt(el, { maxTilt }));
  });
  return () => cleanups.forEach((fn) => fn());
}
