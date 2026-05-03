import { gsap } from "gsap";
import { animateHeroText } from "../animations/textReveal.js";
import { $ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";
import { prefersReducedMotion } from "../utils/motion.js";
import { initHeroLight } from "../animations/heroLight.js";

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
  const year = new Date().getFullYear();
  return `
    <section class="hero" id="hero">
      <div class="hero__bg" aria-hidden="true">
        <canvas class="hero__noise"></canvas>
        <canvas class="hero__light"></canvas>
      </div>

      <div class="hero__viewfinder" aria-hidden="true">
        <span class="hero__cross hero__cross--tl"></span>
        <span class="hero__cross hero__cross--tr"></span>
        <span class="hero__cross hero__cross--bl"></span>
        <span class="hero__cross hero__cross--br"></span>
      </div>

      <aside class="hero__rail" aria-hidden="true">
        <span class="hero__rail-tick"></span>
        <span class="hero__rail-text">${t("hero.rail", "Creative Developer & VFX Artist")}</span>
      </aside>

      <div class="hero__content">
        <p class="hero__kicker gs-reveal">[ ${t("hero.kicker", "Code × Cinema")} ]</p>
        <h1 class="hero__name gs-reveal">Enzo Tedeschi</h1>
        <p class="hero__tagline gs-reveal">${renderTagline()}</p>
      </div>


      <div class="hero__timecode" aria-hidden="true">
        <span class="hero__timecode-label">REC</span>
        <span class="hero__timecode-dot"></span>
        <span class="hero__timecode-value">00:00:00:00</span>
      </div>

      <div class="hero__scroll-indicator">
        <span class="hero__scroll-text">${t("hero.scroll", "Scroll")}</span>
        <div class="hero__scroll-line"></div>
      </div>
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

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width * SCALE * DPR));
    h = Math.max(1, Math.floor(rect.height * SCALE * DPR));
    canvas.width = w;
    canvas.height = h;
  };

  const renderFrame = () => {
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let i = 0, len = d.length; i < len; i += 4) {
      // Luminanza ristretta attorno al grigio medio (110-180 invece di 0-255)
      // Niente piu pixel completamente neri o bianchi → contrasto morbido
      const v = 110 + ((Math.random() * 70) | 0);
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
      d[i + 3] = 14;            // era 26 — alpha quasi dimezzato
    }
    ctx.putImageData(img, 0, 0);
  };

  const tick = (now) => {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    if (now - last < FRAME_MS) return;
    last = now;
    renderFrame();
  };

  resize();
  if (reduced) {
    renderFrame();
  } else {
    rafId = requestAnimationFrame(tick);
  }

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  return () => {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
  };
}

/**
 * Cinema-style timecode ticker at 24fps.
 * Format: HH:MM:SS:FF
 */
function initTimecode(el) {
  if (!el) return () => {};
  const pad = (n) => String(n).padStart(2, "0");
  const FPS = 24;
  const start = performance.now();
  let rafId = 0;
  let running = true;

  const tick = () => {
    if (!running) return;
    const elapsedMs = performance.now() - start;
    const totalFrames = Math.floor((elapsedMs / 1000) * FPS);
    const f = totalFrames % FPS;
    const s = Math.floor(totalFrames / FPS) % 60;
    const m = Math.floor(totalFrames / FPS / 60) % 60;
    const h = Math.floor(totalFrames / FPS / 3600);
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
    rafId = requestAnimationFrame(tick);
  };
  tick();

  return () => {
    running = false;
    cancelAnimationFrame(rafId);
  };
}

let stopNoise = null;
let stopTimecode = null;
let stopLight = null;

export function initHero() {
  const name = $(".hero__name");
  const tagline = $(".hero__tagline");
  const kicker = $(".hero__kicker");
  const scrollIndicator = $(".hero__scroll-indicator");
  const rail = $(".hero__rail");
  const canvas = $(".hero__noise");
  const crosses = document.querySelectorAll(".hero__cross");
  const timecodeRoot = $(".hero__timecode");
  const timecodeValue = $(".hero__timecode-value");

  const lightCanvas = $(".hero__light");

  if (stopNoise) stopNoise();
  if (stopTimecode) stopTimecode();
  if (stopLight) stopLight();
  stopNoise = initNoise(canvas);
  stopTimecode = initTimecode(timecodeValue);
  stopLight = initHeroLight(lightCanvas);

  if (prefersReducedMotion()) {
    [name, tagline, kicker].forEach((el) => {
      if (el) el.style.visibility = "visible";
    });
    [scrollIndicator, rail, timecodeRoot].forEach((el) => {
      if (el) el.style.opacity = "1";
    });
    crosses.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
    });
    return;
  }

  gsap.set(canvas, { opacity: 0 });
  gsap.set(crosses, { opacity: 0, scale: 0.5 });
  gsap.set([rail, timecodeRoot, scrollIndicator], {
    opacity: 0,
  });
  if (kicker) kicker.style.visibility = "hidden";

  const tl = gsap.timeline({ delay: 0.2 });

  // 1. Viewfinder crosshairs pop in
  tl.to(crosses, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "back.out(2)",
    stagger: 0.05,
  });

  // 2. Noise fades up
  tl.to(canvas, { opacity: 1, duration: 1.4, ease: "power2.out" }, "-=0.4");

  // 3. Kicker
  tl.add(() => {
    animateHeroText(kicker, {
      type: "chars",
      duration: 0.7,
      stagger: 0.015,
      y: 8,
      ease: "power3.out",
    });
  }, "-=1.3");

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

  tl.add(() => {
    animateHeroText(tagline, {
      type: "words",
      duration: 0.9,
      stagger: 0.06,
      y: 14,
      ease: "power3.out",
    });
  }, "-=0.6");

  tl.to(
    [rail, timecodeRoot, scrollIndicator],
    { opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.07 },
    "-=0.3",
  );

  tl.add(() => {
    gsap.to(scrollIndicator, {
      opacity: 0,
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "2% top",
        end: "40% top",
        scrub: true,
      },
    });
  });

  tl.add(() => {
    const nameChars = name ? name.querySelectorAll(".split-char") : [];
    const taglineWords = tagline
      ? tagline.querySelectorAll(".split-word-inner")
      : [];
    const kickerChars = kicker ? kicker.querySelectorAll(".split-char") : [];

    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "10% top",
        end: "60% top",
        scrub: true,
      },
    });

    if (nameChars.length) {
      exitTl.to(
        nameChars,
        { y: 40, opacity: 0, stagger: 0.02, ease: "power2.in" },
        0,
      );
    }
    if (taglineWords.length) {
      exitTl.to(
        taglineWords,
        { y: 20, opacity: 0, stagger: 0.04, ease: "none" },
        0,
      );
    }
    if (kickerChars.length) {
      exitTl.to(kickerChars, { opacity: 0, ease: "none" }, 0);
    }
  });
}
