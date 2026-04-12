import { gsap } from "gsap";

export function initCustomCursor() {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";

  const ring = document.createElement("div");
  ring.className = "cursor-ring";

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.set(dot, { x: mouseX, y: mouseY });
  });

  gsap.ticker.add(() => {
    gsap.to(ring, {
      x: mouseX,
      y: mouseY,
      duration: 0.15,
      ease: "power2.out",
    });
  });

  const hoverTargets = "a, button, .btn, .discipline-card, .dev-card, .vfx-project__media, .modeling-renders__item, .modeling-renders__video-wrap, .navbar__toggle, input, textarea";

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
