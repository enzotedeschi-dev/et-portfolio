import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initScrollProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.innerHTML = `
    <div class="scroll-progress__track"></div>
    <div class="scroll-progress__glow"></div>
  `;
  document.body.prepend(bar);

  const track = bar.querySelector(".scroll-progress__track");
  const glow = bar.querySelector(".scroll-progress__glow");

  gsap.to(track, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });

  gsap.to(glow, {
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        glow.style.transform = `translateX(calc(${self.progress * 100}vw - 120px))`;
      },
    },
  });

  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "2% top",
    onLeave: () => gsap.to(bar, { opacity: 1, duration: 0.3 }),
    onEnterBack: () => gsap.to(bar, { opacity: 0, duration: 0.3 }),
  });

  gsap.set(bar, { opacity: 0 });
}
