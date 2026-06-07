/**
 * Cinematic Preloader
 * - SVG stroke-draw animation for "ET" logo
 * - 24fps timecode counter
 * - Animated progress bar
 * - Dramatic smooth exit sequence
 */

import { gsap } from "gsap";

/* ── SVG Logo ──────────────────────────────────────────────────
   Hand-crafted "ET" monogram paths — geometric, angular letterforms
   designed to complement Space Grotesk.
   viewBox: 0 0 200 120  (wide format — cinematic aspect)
   ─────────────────────────────────────────────────────────────── */

const ET_SVG = `
<svg
  class="preloader__logo-svg"
  viewBox="0 0 200 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <text 
    class="preloader__stroke"
    x="50%" 
    y="55%" 
    dominant-baseline="middle" 
    text-anchor="middle" 
    font-family="var(--font-heading)" 
    font-size="90px" 
    font-weight="500" 
    letter-spacing="0.08em"
  >ET</text>
</svg>`;

/* ── Percentage counter formatter ── */
function formatPercentage(val) {
  return `${Math.round(val)}%`;
}

/* ── Create Preloader DOM ──────────────────────────────────── */

export function createPreloader() {
  const preloader = document.createElement("div");
  preloader.className = "preloader";
  preloader.setAttribute("aria-live", "polite");
  preloader.setAttribute("role", "status");

  preloader.innerHTML = `
    <div class="preloader__center">
      <div class="preloader__logo-wrap">
        ${ET_SVG}
      </div>
      <div class="preloader__progress-wrap">
        <div class="preloader__progress-bar"></div>
      </div>
    </div>
    <div class="preloader__percentage">
      <span class="preloader__percentage-value">0%</span>
    </div>
  `;

  document.body.prepend(preloader);
  return preloader;
}

/* ── Play Intro Sequence ──────────────────────────────────── */

export function playIntro(preloader) {
  return new Promise((resolve) => {
    const strokes = preloader.querySelectorAll(".preloader__stroke");
    const progressBar = preloader.querySelector(".preloader__progress-bar");
    const percentageValue = preloader.querySelector(".preloader__percentage-value");
    const percentageWrap = preloader.querySelector(".preloader__percentage");
    const logoSvg = preloader.querySelector(".preloader__logo-svg");
    const center = preloader.querySelector(".preloader__center");

    /* ── Setup SVG stroke-dasharray ── */
    strokes.forEach((path) => {
      // For <text> elements, we use a fixed large number to guarantee coverage 
      // since getTotalLength() is not standard for text nodes.
      let length = 1200; 
      if (path.getTotalLength) {
        try {
          length = path.getTotalLength() || 1200;
        } catch (e) {}
      }
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.stroke = "#f0ece4";
      path.style.strokeWidth = "1.5px";
      path.style.fill = "transparent";
    });

    /* ── Percentage counter logic ── */
    const progressObj = { val: 0 };
    const updatePercentage = () => {
      percentageValue.textContent = formatPercentage(progressObj.val);
    };

    /* ── Build GSAP Timeline ── */
    const tl = gsap.timeline({
      onComplete: () => {
        preloader.remove();
        resolve();
      },
    });

    // 0.3s — SVG stroke draw begins (both letters staggered)
    strokes.forEach((path, i) => {
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
        },
        0.3 + i * 0.12,
      );
    });

    // 0.4s — Percentage fades in and starts counting
    tl.add(() => {
      gsap.set(percentageWrap, { opacity: 0 });
      gsap.to(percentageWrap, { opacity: 1, duration: 0.6, ease: "power2.out" });
    }, 0.4);

    tl.to(
      progressObj,
      {
        val: 100,
        duration: 1.6,
        ease: "power1.inOut",
        onUpdate: updatePercentage,
      },
      0.8,
    );

    // 0.8s — Progress bar animates
    tl.fromTo(
      progressBar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.6,
        ease: "power1.inOut",
      },
      0.8,
    );

    // 1.9s — Stroke fill fades in (letters become solid without losing stroke)
    strokes.forEach((path) => {
      tl.to(
        path,
        {
          fill: "#f0ece4",
          duration: 0.5,
          ease: "power2.out",
        },
        1.9,
      );
    });

    // 2.6s — EXIT: Smooth fade out of wrapper elements (hardware accelerated)
    tl.to(
      [logoSvg, percentageWrap, progressBar.parentElement],
      {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      },
      2.6,
    );

    // 3.4s — Preloader fades out smoothly (cinematic crossfade to the website)
    tl.to(
      preloader,
      {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      },
      3.4,
    );
  });
}
