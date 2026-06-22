import { gsap } from "gsap";
import { animateHeroText } from "../animations/textReveal.js";
import { $ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";
import { prefersReducedMotion } from "../utils/motion.js";
import { initHeroScene } from "../animations/heroScene.js";
import { makeMagnetic } from "../animations/magnetic.js";


export function renderHero() {
  return `
    <section class="hero" id="hero">
      <div class="hero__bg" aria-hidden="true">
        <canvas class="hero__light"></canvas>
      </div>

      <div class="hero__content">
        <h1 class="hero__name gs-reveal"><span class="hero__name-word">Enzo</span> <span class="hero__name-word">Tedeschi</span></h1>

        <div class="hero__cta-wrapper gs-reveal">
          <a href="#vfx" class="btn btn--outline">${t("hero.cta", "Explore Projects")} <span class="btn__arrow">&rarr;</span></a>
        </div>
      </div>

      <a href="#manifesto" class="hero__scroll-indicator">
        <span class="hero__scroll-text">${t("hero.scroll", "Scroll")}</span>
        <svg class="hero__scroll-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>
      </a>
    </section>
  `;
}

let stopLight = null;
let stopScrollMagnetic = null;

export function initHero() {
  const name = $(".hero__name");
  const scrollIndicator = $(".hero__scroll-indicator");
  const ctaWrapper = $(".hero__cta-wrapper");
  const lightCanvas = $(".hero__light");

  // Cleanup istanze precedenti
  if (stopLight) stopLight();
  if (stopScrollMagnetic) stopScrollMagnetic();

  stopLight = null;
  stopScrollMagnetic = null;

  initHeroScene(lightCanvas).then((dispose) => {
    stopLight = dispose;
  });

  if (prefersReducedMotion()) {
    [name, ctaWrapper].forEach((el) => {
      if (el) el.style.visibility = "visible";
    });
    if (scrollIndicator) scrollIndicator.style.opacity = "1";
    return;
  }

  // Initial states
  if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });
  if (ctaWrapper) gsap.set(ctaWrapper, { autoAlpha: 0 });

  const tl = gsap.timeline({ delay: 0.2 });

  // 1. Name chars reveal + blur
  tl.add(() => {
    animateHeroText(name, {
      type: "chars",
      duration: 1.2,
      stagger: 0.035,
      y: 20,
      ease: "power3.out",
    });
    const chars = name ? name.querySelectorAll(".split-char") : [];
    if (chars.length) {
      gsap.fromTo(
        chars,
        { filter: "blur(12px)" },
        {
          filter: "blur(0px)",
          duration: 1.4,
          stagger: 0.035,
          ease: "power3.out",
        },
      );
    }
  }, 0);


  // 3. HUD elements and CTA fade in
  if (scrollIndicator) {
    tl.to(
      scrollIndicator,
      { opacity: 1, duration: 0.9, ease: "power2.out" },
      1.0,
    );
  }
  if (ctaWrapper) {
    tl.fromTo(
      ctaWrapper,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" },
      0.8,
    );
  }

  // 4. Magnetic scroll indicator
  if (scrollIndicator) {
    stopScrollMagnetic = makeMagnetic(scrollIndicator, {
      strength: 0.25,
      radius: 100,
    });
  }

  // 5. Scroll indicator fade-out on scroll
  if (scrollIndicator) {
    tl.add(() => {
      gsap.to(scrollIndicator, {
        opacity: 0,
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "2% top",
          end: "40% top",
          scrub: true,
        },
      });
    });
  }

  // 6. Exit animation con distorsione cinematografica
  tl.add(() => {
    const nameChars = name ? name.querySelectorAll(".split-char") : [];
    const taglineWords = tagline
      ? tagline.querySelectorAll(".split-word-inner")
      : [];

    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "10% top",
        end: "60% top",
        scrub: true,
      },
    });

    if (nameChars.length) {
      const count = nameChars.length;
      const center = count / 2;
      exitTl.to(
        nameChars,
        {
          y: 50,
          opacity: 0,
          skewY: (i) => {
            const distFromCenter =
              1 - Math.abs(i - center) / center;
            return distFromCenter * 8;
          },
          scaleY: 1.3,
          filter: "blur(4px)",
          stagger: 0.015,
          ease: "power2.in",
        },
        0,
      );
    }
    if (taglineWords.length) {
      exitTl.to(
        taglineWords,
        { y: 20, opacity: 0, scaleY: 0.7, stagger: 0.03, ease: "none" },
        0,
      );
    }
  });

  return () => {
    if (stopLight) stopLight();
    if (stopScrollMagnetic) stopScrollMagnetic();
  };
}
