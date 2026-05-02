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

  const progressTl = gsap.timeline({
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      invalidateOnRefresh: true,
    },
  });

  progressTl
    .fromTo(track, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0)
    .fromTo(
      glow,
      { x: -120, opacity: 0 },
      { x: () => window.innerWidth, opacity: 1, ease: "none" },
      0,
    );

  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "2% top",
    onLeave: () => gsap.to(bar, { opacity: 1, duration: 0.3 }),
    onEnterBack: () => gsap.to(bar, { opacity: 0, duration: 0.3 }),
  });

  gsap.set(bar, { opacity: 0 });
}
