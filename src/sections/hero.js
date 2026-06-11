import { gsap } from "gsap";
import { animateHeroText } from "../animations/textReveal.js";
import { $ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";
import { prefersReducedMotion } from "../utils/motion.js";
import { initHeroScene } from "../animations/heroScene.js";
import { observeVisibility } from "../utils/performanceManager.js";
import { makeMagnetic } from "../animations/magnetic.js";

function renderTagline() {
  const full = t("hero.tagline", "Where code meets cinema");
  const accent = t("hero.tagline.accent", "cinema");
  const idx = full.toLowerCase().lastIndexOf(accent.toLowerCase());
  if (idx < 0) return full;
  const before = full.slice(0, idx);
  const match = full.slice(idx, idx + accent.length);
  const after = full.slice(idx + accent.length);
  return `${before}<span class="hero__tagline-accent">${match}</span>${after}`;
}

export function renderHero() {
  return `
    <section class="hero" id="hero">
      <div class="hero__bg" aria-hidden="true">
        <canvas class="hero__noise"></canvas>
        <canvas class="hero__light"></canvas>
      </div>

      <div class="hero__content">
        <h1 class="hero__name gs-reveal"><span class="hero__name-word">Enzo</span> <span class="hero__name-word">Tedeschi</span></h1>
        <p class="hero__tagline gs-reveal">${renderTagline()}</p>
      </div>

      <a href="#manifesto" class="hero__scroll-indicator">
        <span class="hero__scroll-text">${t("hero.scroll", "Scroll")}</span>
        <svg class="hero__scroll-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>
      </a>
    </section>
  `;
}

/**
 * Animated film grain noise.
 * - Renders random luminance pixels to a half-resolution canvas
 * - Updates at ~12fps for a cinematic film grain feel
 * - Upscaled by CSS (image-rendering: pixelated) for a tactile texture
 */
function initNoise(canvas) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const reduced = prefersReducedMotion();
  const FPS = 12;              // era 18 — piu calmo, piu cinematografico
  const FRAME_MS = 1000 / FPS;
  const DPR = 1;               // era min(dpr, 1.25) — su retina la grana era troppo fine
  const SCALE = 0.5;           // era 1.0 — grana piu grossa, upscalata da CSS

  let w = 0;
  let h = 0;
  let rafId = 0;
  let running = true;
  let last = 0;
  let alphaFloorByRow = new Uint8Array(0);
  let alphaFracByRow = new Float32Array(0);

  const smoothstep = (edge0, edge1, x) => {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };

  let lastW = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const newW = Math.max(1, Math.floor(rect.width * SCALE * DPR));
    const newH = Math.max(1, Math.floor(rect.height * SCALE * DPR));
    
    // Prevent clearing the canvas on mobile address-bar hide/show
    if (newW === lastW && Math.abs(newH - h) < 200) {
      return;
    }
    
    lastW = newW;
    w = newW;
    h = newH;
    
    canvas.width = w;
    canvas.height = h;

    alphaFloorByRow = new Uint8Array(h);
    alphaFracByRow = new Float32Array(h);
    for (let y = 0; y < h; y += 1) {
      const yNorm = h > 1 ? y / (h - 1) : 0;
      const fade = 1 - smoothstep(0.52, 1, yNorm);
      const alpha = 8 * fade;
      alphaFloorByRow[y] = Math.floor(alpha);
      alphaFracByRow[y] = alpha - alphaFloorByRow[y];
    }
  };

  const renderFrame = () => {
    const img = ctx.createImageData(w, h);
    const d = img.data;
    let i = 0;
    for (let y = 0; y < h; y += 1) {
      const alphaBase = alphaFloorByRow[y];
      const alphaFrac = alphaFracByRow[y];
      for (let x = 0; x < w; x += 1) {
        // Luminanza ristretta attorno al grigio medio (110-180 invece di 0-255)
        // Niente piu pixel completamente neri o bianchi -> contrasto morbido
        const rnd = Math.random();
        const v = 110 + ((rnd * 70) | 0);
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = alphaBase + (rnd < alphaFrac ? 1 : 0); // fade dithered, no CSS mask bands
        i += 4;
      }
    }
    ctx.putImageData(img, 0, 0);
  };

  let visible = true;

  const tick = (time) => {
    if (!running || !visible) return;
    const now = time * 1000;
    if (now - last < FRAME_MS) return;
    last = now;
    renderFrame();
  };

  resize();
  if (reduced) {
    renderFrame();
  } else {
    gsap.ticker.add(tick);
  }

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  // Pause when hero is off-screen
  const heroSection = canvas.closest(".hero");
  let unobserve = () => {};
  if (heroSection) {
    unobserve = observeVisibility(heroSection, (isVis) => {
      visible = isVis;
    });
  }

  return () => {
    running = false;
    gsap.ticker.remove(tick);
    unobserve();
    window.removeEventListener("resize", onResize);
  };
}

let stopNoise = null;
let stopLight = null;
let stopScrollMagnetic = null;

export function initHero() {
  const name = $(".hero__name");
  const tagline = $(".hero__tagline");
  const scrollIndicator = $(".hero__scroll-indicator");
  const canvas = $(".hero__noise");
  const lightCanvas = $(".hero__light");
  const content = $(".hero__content");

  // Cleanup istanze precedenti
  if (stopNoise) stopNoise();
  if (stopLight) stopLight();
  if (stopScrollMagnetic) stopScrollMagnetic();

  stopNoise = initNoise(canvas);
  stopLight = null;
  stopScrollMagnetic = null;

  initHeroScene(lightCanvas).then((dispose) => {
    stopLight = dispose;
  });

  if (prefersReducedMotion()) {
    [name, tagline].forEach((el) => {
      if (el) el.style.visibility = "visible";
    });
    if (scrollIndicator) scrollIndicator.style.opacity = "1";
    return;
  }

  // Initial states
  gsap.set(canvas, { opacity: 0 });
  if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.2 });

  // 1. Noise fades up
  tl.to(canvas, { opacity: 1, duration: 1.4, ease: "power2.out" });

  // 2. Name chars reveal + blur
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
  }, "-=0.9");

  // 3. Tagline reveal
  tl.add(() => {
    animateHeroText(tagline, {
      type: "words",
      duration: 0.9,
      stagger: 0.06,
      y: 14,
      ease: "power3.out",
    });
  }, "-=0.6");

  // 4. HUD elements fade in
  if (scrollIndicator) {
    tl.to(
      scrollIndicator,
      { opacity: 1, duration: 0.9, ease: "power2.out" },
      "-=0.3",
    );
  }

  // 5. Magnetic scroll indicator
  if (scrollIndicator) {
    stopScrollMagnetic = makeMagnetic(scrollIndicator, {
      strength: 0.25,
      radius: 100,
    });
  }

  // 6. Scroll indicator fade-out on scroll
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

  // 8. Exit animation con distorsione cinematografica
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
    if (stopNoise) stopNoise();
    if (stopLight) stopLight();
    if (stopScrollMagnetic) stopScrollMagnetic();
  };
}
