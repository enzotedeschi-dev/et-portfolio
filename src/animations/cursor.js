/**
 * Context-Aware Custom Cursor
 * - Dot + Ring + Label
 * - Shows contextual text on hover (View, Play, Drag, Open)
 * - mix-blend-mode: difference for automatic contrast
 */

import { gsap } from "gsap";

export function initCustomCursor() {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";

  const ring = document.createElement("div");
  ring.className = "cursor-ring";

  const label = document.createElement("div");
  label.className = "cursor-label";

  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.appendChild(label);

  const ringX = gsap.quickTo(ring, "x", {
    duration: 0.15,
    ease: "power2.out",
  });
  const ringY = gsap.quickTo(ring, "y", {
    duration: 0.15,
    ease: "power2.out",
  });
  const labelX = gsap.quickTo(label, "x", {
    duration: 0.18,
    ease: "power2.out",
  });
  const labelY = gsap.quickTo(label, "y", {
    duration: 0.18,
    ease: "power2.out",
  });

  document.addEventListener("mousemove", (e) => {
    gsap.set(dot, { x: e.clientX, y: e.clientY });
    ringX(e.clientX);
    ringY(e.clientY);
    labelX(e.clientX);
    labelY(e.clientY);
  });

  // Standard hover targets (scale up ring)
  const hoverTargets =
    "a, button, .btn, .discipline-card, .dev-card, .vfx-project__media, .modeling-renders__item, .modeling-renders__video-wrap, .navbar__toggle, input, textarea";

  // Context-aware cursor targets
  const contextTargets = [
    {
      selector:
        ".vfx-project__video, .modeling-renders__video-wrap",
      label: "Play",
      cls: "cursor--media",
    },
    {
      selector: ".photo-mosaic__item",
      label: "View",
      cls: "cursor--view",
    },
    {
      selector: ".modeling-viewer--desktop",
      label: "Drag",
      cls: "cursor--drag",
    },
    {
      selector: 'a[target="_blank"]',
      label: "Open ↗",
      cls: "cursor--link",
    },
  ];

  let currentCtx = null;

  const setContext = (ctx) => {
    if (currentCtx === ctx) return;
    // Clear previous
    if (currentCtx) {
      ring.classList.remove(currentCtx.cls);
      label.classList.remove("cursor-label--visible");
    }
    currentCtx = ctx;
    if (ctx) {
      label.textContent = ctx.label;
      ring.classList.add(ctx.cls);
      label.classList.add("cursor-label--visible");
      // Expand ring for context label
      ring.classList.add("cursor-ring--context");
    } else {
      ring.classList.remove("cursor-ring--context");
    }
  };

  document.addEventListener("mouseover", (e) => {
    // Check context targets first
    for (const ctx of contextTargets) {
      if (e.target.closest(ctx.selector)) {
        setContext(ctx);
        dot.classList.add("cursor-dot--hover");
        ring.classList.add("cursor-ring--hover");
        return;
      }
    }

    // Standard hover
    if (e.target.closest(hoverTargets)) {
      dot.classList.add("cursor-dot--hover");
      ring.classList.add("cursor-ring--hover");
      setContext(null);
    }
  });

  document.addEventListener("mouseout", (e) => {
    // Check if leaving a context target
    for (const ctx of contextTargets) {
      if (e.target.closest(ctx.selector)) {
        setContext(null);
      }
    }

    if (e.target.closest(hoverTargets)) {
      dot.classList.remove("cursor-dot--hover");
      ring.classList.remove("cursor-ring--hover");
      setContext(null);
    }
  });

  document.addEventListener("mouseleave", () => {
    dot.classList.add("cursor-dot--hidden");
    ring.classList.add("cursor-ring--hidden");
    label.classList.add("cursor-label--hidden");
  });

  document.addEventListener("mouseenter", () => {
    dot.classList.remove("cursor-dot--hidden");
    ring.classList.remove("cursor-ring--hidden");
    label.classList.remove("cursor-label--hidden");
  });
}
