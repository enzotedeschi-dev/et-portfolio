import { gsap } from "gsap";

export function initCustomCursor() {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";

  const ring = document.createElement("div");
  ring.className = "cursor-ring";

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  const ringX = gsap.quickTo(ring, "x", { duration: 0.15, ease: "power2.out" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.15, ease: "power2.out" });

  document.addEventListener("mousemove", (e) => {
    gsap.set(dot, { x: e.clientX, y: e.clientY });
    ringX(e.clientX);
    ringY(e.clientY);
  });

  const hoverTargets =
    "a, button, .btn, .discipline-card, .dev-card, .vfx-project__media, .modeling-renders__item, .modeling-renders__video-wrap, .navbar__toggle, input, textarea";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add("cursor-dot--hover");
      ring.classList.add("cursor-ring--hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove("cursor-dot--hover");
      ring.classList.remove("cursor-ring--hover");
    }
  });

  document.addEventListener("mouseleave", () => {
    dot.classList.add("cursor-dot--hidden");
    ring.classList.add("cursor-ring--hidden");
  });

  document.addEventListener("mouseenter", () => {
    dot.classList.remove("cursor-dot--hidden");
    ring.classList.remove("cursor-ring--hidden");
  });
}
