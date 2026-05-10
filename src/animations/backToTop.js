import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./smoothScroll.js";

gsap.registerPlugin(ScrollTrigger);

export function renderBackToTop() {
  return `
    <button class="back-to-top" id="back-to-top" aria-label="Back to top">
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
}

export function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const targetSection = document.getElementById("about");
  
  if (targetSection) {
    gsap.to(btn, {
      opacity: 1,
      y: 0,
      pointerEvents: "auto",
      duration: 0.4,
      ease: "power3.out",
      scrollTrigger: {
        trigger: targetSection,
        start: "top 80%", // Button appears when "About" section enters the viewport
        toggleActions: "play none none reverse",
      },
    });
  }

  btn.addEventListener("click", () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}
