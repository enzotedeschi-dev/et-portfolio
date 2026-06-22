/**
 * VFX Section — Horizontal scroll showcase + vertical modeling subsection
 *
 * Desktop: VFX projects are displayed as full-viewport horizontal scroll panels
 * pinned with GSAP ScrollTrigger. Each panel shows a large video with overlay info.
 *
 * Mobile (<768px): Falls back to a vertical stacked layout for touch UX.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  fadeInUp,
  staggerIn,
  cinematicHeader,
  scaleReveal,
} from "../animations/scrollAnimations.js";
import { $, $$ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";
import { projects } from "../data/projects.js";

/* ── VFX Project Metadata ────────────────────────────────── */

const VFX_META = [
  {
    role: "Compositing / Tracking",
    format: "Breakdown",
    year: "2025",
    steps: [
      ["Plate", "Source footage prepared for cleanup and integration."],
      ["Track", "Camera and object movement solved for stable placement."],
      ["CG Environment", "Every aspect of the digital environment was built and refined for the shot."],
      ["Key", "Foreground elements isolated with clean matte extraction."],
      ["Composite", "CG, plate, and atmosphere merged into one image."],
      ["Grade", "Final color balance shaped for a cinematic finish."],
    ],
  },
  {
    role: "Realtime Cinematic",
    format: "Sequence",
    year: "2025",
    steps: [
      ["Layout", "Shot composition and camera rhythm blocked in engine."],
      ["Lighting", "Scene mood built through practical and cinematic light."],
      ["Render", "Realtime output captured with controlled visual settings."],
      ["Comp", "Passes refined with contrast, depth, and atmosphere."],
      ["Edit", "Final sequence paced for continuity and impact."],
    ],
  },
  {
    role: "CG Environment",
    format: "Full CG",
    year: "2025",
    steps: [
      ["Model", "Environment forms shaped from blockout to final detail."],
      ["Shade", "Materials tuned for scale, texture, and believable response."],
      ["Light", "Directional lighting designed to guide the viewer's eye."],
      ["Render", "Final frames rendered with composition and depth in mind."],
      ["Grade", "Color and contrast unified into the final look."],
    ],
  },
];

function getVfxMeta(project, index) {
  const meta = VFX_META[index] || {
    role: project.tags[0] || "Visual Effects",
    format: "Case Study",
    year: "2025",
    steps: project.tags.slice(0, 5),
  };

  return {
    ...meta,
    role: t(`vfx.${project.id}.meta.role`, meta.role),
    format: t(`vfx.${project.id}.meta.format`, meta.format),
    steps: meta.steps.map((step, stepIndex) => {
      const [label, description = "A focused stage in the visual effects pipeline."] =
        Array.isArray(step) ? step : [step];
      const keyBase = `vfx.${project.id}.pipeline.${stepIndex + 1}`;
      return [
        t(`${keyBase}.label`, label),
        t(`${keyBase}.description`, description),
      ];
    }),
  };
}

/* ── Render Pipeline (compact label row for horizontal panels) ── */

function renderPipelineCompact(steps) {
  return `
    <div class="vfx-hscroll__pipeline">
      ${steps
        .map(
          (step) => {
            const [label] = Array.isArray(step) ? step : [step];
            return `<span class="vfx-hscroll__pipeline-step">${label}</span>`;
          },
        )
        .join('<span class="vfx-hscroll__pipeline-sep">→</span>')}
    </div>
  `;
}

/* ── Render Full Pipeline (vertical — for mobile fallback) ── */

function renderPipeline(steps) {
  return `
    <ol class="vfx-project__pipeline" aria-label="VFX pipeline">
      ${steps
        .map(
          (step, i) => {
            const [label, description = "A focused stage in the visual effects pipeline."] =
              Array.isArray(step) ? step : [step];
            return `
        <li class="vfx-project__pipeline-step">
          <span class="vfx-project__pipeline-index">${String(i + 1).padStart(2, "0")}</span>
          <span class="vfx-project__pipeline-copy">
            <span class="vfx-project__pipeline-label">${label}</span>
            <span class="vfx-project__pipeline-description">${description}</span>
          </span>
        </li>
      `;
          },
        )
        .join("")}
    </ol>
  `;
}

/* ── Render Video Element ── */

function renderVideo(project) {
  if (project.finalVideo) {
    return `
      <div class="vfx-hscroll__video-wrap--toggle">
        <video class="vfx-hscroll__video vfx-hscroll__video--breakdown is-hidden" src="${project.video}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>
        <video class="vfx-hscroll__video vfx-hscroll__video--final" src="${project.finalVideo}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>
        <button class="vfx-video-toggle" data-state="final">${t("vfx.toggle.breakdown", "View Breakdown")}</button>
        <button class="video-fullscreen-btn" aria-label="Fullscreen" style="z-index: 10;">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    `;
  }
  if (project.video) {
    return `
      <video class="vfx-hscroll__video" src="${project.video}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>
      <button class="video-fullscreen-btn" aria-label="Fullscreen" style="z-index: 10;">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    `;
  }
  return `<div class="vfx-hscroll__placeholder">Video — ${project.title}</div>`;
}

/* ── Render VFX Video for mobile fallback ── */

function renderVideoMobile(project) {
  if (project.finalVideo) {
    return `
      <div class="vfx-project__video-wrap--toggle">
        <video class="vfx-project__video vfx-project__video--breakdown is-hidden" src="${project.video}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>
        <video class="vfx-project__video vfx-project__video--final" src="${project.finalVideo}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>
        <button class="vfx-video-toggle" data-state="final">${t("vfx.toggle.breakdown", "View Breakdown")}</button>
        <button class="video-fullscreen-btn" aria-label="Fullscreen" style="z-index: 10;">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    `;
  }
  if (project.video) {
    return `<video class="vfx-project__video" src="${project.video}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>
       <button class="video-fullscreen-btn" aria-label="Fullscreen">
         <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
       </button>`;
  }
  return `<div class="vfx-project__placeholder">Video placeholder — ${project.title}</div>`;
}

/* ── Render Breakdown (preserved for mobile) ── */

function renderBreakdown(breakdown) {
  if (!breakdown) return "";

  return `
    <button class="vfx-breakdown__toggle" aria-expanded="false">
      <span class="vfx-breakdown__toggle-icon"></span>
      ${t("vfx.breakdown.toggle", "View Breakdown")}
    </button>
    <div class="vfx-breakdown__content">
      <div class="vfx-breakdown__inner">
        <div class="vfx-breakdown__panels">
          <div class="vfx-breakdown__panel">
            ${
              breakdown.before
                ? `<img src="${breakdown.before}" alt="Before" class="vfx-breakdown__img" loading="lazy" decoding="async" />`
                : `<span>${breakdown.type === "side-by-side" ? "Before" : "Raw"}</span>`
            }
            <span class="vfx-breakdown__label">${t("vfx.breakdown.before", "Before")}</span>
          </div>
          <div class="vfx-breakdown__panel">
            ${
              breakdown.after
                ? `<img src="${breakdown.after}" alt="After" class="vfx-breakdown__img" loading="lazy" decoding="async" />`
                : `<span>${breakdown.type === "side-by-side" ? t("vfx.breakdown.after", "After") : "Final"}</span>`
            }
            <span class="vfx-breakdown__label">${t("vfx.breakdown.after", "After")}</span>
          </div>
        </div>
        ${
          breakdown.steps
            ? `
          <div class="vfx-breakdown__steps">
            ${breakdown.steps
              .map(
                (step, i) => `
              <span class="vfx-breakdown__step">${step}</span>
              ${i < breakdown.steps.length - 1 ? '<span class="vfx-breakdown__step-arrow">→</span>' : ""}
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

/* ── Main Render ────────────────────────────────────────── */

export function renderVfx() {
  const vfxProjects = projects.vfx;

  return `
    <section class="vfx-section" id="vfx">
      <div class="container">
        <div class="section-header vfx-section__header">
          <span class="section-label">${t("vfx.label", "01 / Visual Effects")}</span>
          <h2 class="section-title">${t("vfx.title", "VFX")}</h2>
          <p class="vfx-section__lede">${t(
            "vfx.lede",
            "Selected shots, breakdowns, and CG work shaped through light, compositing, and technical precision.",
          )}</p>
        </div>
      </div>

      <!-- ═══ Horizontal Scroll Showcase (desktop) ═══ -->
      <div class="vfx-hscroll" aria-label="VFX project showcase">
        <div class="vfx-hscroll__track">
          ${vfxProjects
            .map((project, index) => {
              const meta = getVfxMeta(project, index);
              return `
            <article class="vfx-hscroll__panel" data-panel="${index}">
              <div class="vfx-hscroll__panel-inner">
                <div class="vfx-hscroll__panel-media">
                  ${renderVideo(project)}
                  <div class="vfx-hscroll__panel-overlay">
                    <div class="vfx-hscroll__panel-number">${String(index + 1).padStart(2, "0")}</div>
                  </div>
                </div>
                <div class="vfx-hscroll__panel-info">
                  <div class="vfx-hscroll__panel-meta">
                    <span class="vfx-hscroll__panel-role">${meta.role}</span>
                    <span class="vfx-hscroll__panel-sep">—</span>
                    <span class="vfx-hscroll__panel-format">${meta.format}</span>
                  </div>
                  <h3 class="vfx-hscroll__panel-title">${t(`vfx.${project.id}.title`, project.title)}</h3>
                  <p class="vfx-hscroll__panel-description">${t(`vfx.${project.id}.description`, project.description)}</p>
                  <div class="vfx-hscroll__panel-tags">
                    ${project.tags.map((tag) => `<span class="vfx-project__tag">${tag}</span>`).join("")}
                  </div>
                  ${renderPipelineCompact(meta.steps)}
                </div>
              </div>
            </article>
          `;
            })
            .join("")}
        </div>
        <div class="vfx-hscroll__progress">
          <div class="vfx-hscroll__progress-bar">
            <div class="vfx-hscroll__progress-fill"></div>
          </div>
          <span class="vfx-hscroll__progress-counter">01 / ${String(vfxProjects.length).padStart(2, "0")}</span>
        </div>
      </div>

      <!-- ═══ Mobile Fallback (vertical stack) ═══ -->
      <div class="vfx-mobile-stack container">
        <div class="vfx-showcase">
          ${vfxProjects
            .map((project, index) => {
              const meta = getVfxMeta(project, index);
              return `
            <article class="vfx-project vfx-project--${index === 0 ? "feature" : "compact"}">
              <div class="vfx-project__media-wrap">
                <div class="vfx-project__media">
                ${renderVideoMobile(project)}
                  <div class="vfx-project__media-overlay">
                    <span>${String(index + 1).padStart(2, "0")}</span>
                  </div>
                </div>
              </div>
              <div class="vfx-project__info">
                <div class="vfx-project__copy">
                  <h3 class="vfx-project__title">${t(`vfx.${project.id}.title`, project.title)}</h3>
                  <p class="vfx-project__description">${t(`vfx.${project.id}.description`, project.description)}</p>
                </div>
                <div class="vfx-project__details">
                  <div class="vfx-project__tags">
                    ${project.tags.map((tag) => `<span class="vfx-project__tag">${tag}</span>`).join("")}
                  </div>
                  ${renderPipeline(meta.steps)}
                </div>
              </div>
              ${renderBreakdown(project.breakdown)}
            </article>
          `;
            })
            .join("")}
        </div>
      </div>

      <div class="container">
        ${renderModeling()}
      </div>
    </section>
  `;
}

/* ── Modeling Sub-section (unchanged) ── */

function renderModeling() {
  const modeling = projects.modeling;
  if (!modeling) return "";

  const { renders } = modeling;
  const videoProjects = renders.filter((p) => p.video);

  return `
    <section class="modeling-subsection" aria-labelledby="cg-commercials-title">
      <div class="modeling-header">
        <span class="section-label">${t("modeling.label", "02 / CG Advertising")}</span>
        <h2 class="modeling-title" id="cg-commercials-title">${t("modeling.title", "CG Commercials")}</h2>
        <p class="modeling-lede">${t(
          "modeling.lede",
          "Product-focused 3D visuals for advertising, brand films and digital campaigns — from vertical product films to simulation breakdowns and final campaign stills.",
        )}</p>
      </div>

      ${
        videoProjects.length > 0
          ? `
        <div class="modeling-commercials">
          ${videoProjects
            .map(
              (project, i) => `
            <article class="modeling-commercial">
              <div class="modeling-commercial__media">
                <span class="modeling-commercial__number">${String(i + 1).padStart(2, "0")}</span>
                <div class="modeling-renders__video-wrap${project.finalVideo ? " modeling-renders__video-wrap--toggle" : ""}">
                  ${
                    project.finalVideo
                      ? `
                    <video class="modeling-renders__video modeling-renders__video--breakdown is-hidden" src="${project.video}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>
                    <video class="modeling-renders__video modeling-renders__video--final" src="${project.finalVideo}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>
                    <button class="vfx-video-toggle" data-state="final">${t("vfx.toggle.breakdown", "View Breakdown")}</button>
                  `
                      : `<video class="modeling-renders__video" src="${project.video}" muted loop playsinline preload="none" poster="${project.poster || ""}"></video>`
                  }
                  <button class="modeling-renders__play-btn" aria-label="Play video">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="23" stroke="currentColor" stroke-width="2" opacity="0.6"/><path d="M19 15l14 9-14 9V15z" fill="currentColor"/></svg>
                  </button>
                </div>
              </div>
              <div class="modeling-commercial__copy">
                <span class="modeling-commercial__eyebrow">${t(`modeling.renders.${project.id}.eyebrow`, "Final Spot")}</span>
                <h3 class="modeling-commercial__title">${t(`modeling.renders.${project.id}.title`, project.title)}</h3>
                <p class="modeling-commercial__description">${t(`modeling.renders.${project.id}.description`, project.description)}</p>
                <div class="modeling-commercial__tags">
                  ${project.tags.map((tag) => `<span class="vfx-project__tag">${tag}</span>`).join("")}
                </div>
              </div>
            </article>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }


    </section>
  `;
}

/* ── Helpers ── */

function safePlay(video) {
  if (getComputedStyle(video).display === "none") return;
  const p = video.play();
  if (p !== undefined) p.catch(() => {});
}

function safePause(video) {
  video.pause();
}

function isMobile() {
  return window.innerWidth < 768;
}

/* ── Init ──────────────────────────────────────────────── */

export function initVfx() {
  const header = $(".vfx-section .section-header");
  if (header) {
    cinematicHeader(header);
    const lede = header.querySelector(".vfx-section__lede");
    if (lede) {
      fadeInUp(lede, {
        y: 24,
        duration: 0.8,
        delay: 0.25,
        start: "top 82%",
      });
    }
  }

  const cleanups = [];

  if (!isMobile()) {
    cleanups.push(initHorizontalScroll());
  }

  // Mobile vertical fallback — init animations
  initMobileVfx(cleanups);

  // Modeling subsection — always vertical
  initModeling(cleanups);

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

/* ── Horizontal Scroll Init (desktop only) ──────────── */

function initHorizontalScroll() {
  const hscroll = $(".vfx-hscroll");
  const track = $(".vfx-hscroll__track");
  const panels = $$(".vfx-hscroll__panel");
  const counter = $(".vfx-hscroll__progress-counter");
  const progressFill = $(".vfx-hscroll__progress-fill");

  if (!hscroll || !track || panels.length === 0) return () => {};

  const cleanups = [];
  const totalPanels = panels.length;

  // Animate the hscroll section entrance
  fadeInUp(hscroll, {
    y: 60,
    duration: 1,
    ease: "power3.out",
    start: "top 85%",
  });

  // Calculate track width — each panel is 100vw
  const getTrackShift = () => track.scrollWidth - window.innerWidth;

  // Main horizontal scroll — pin + scrub
  const st = ScrollTrigger.create({
    trigger: hscroll,
    start: "top top",
    end: () => `+=${window.innerHeight * (totalPanels - 1) + window.innerHeight * 0.5}`,
    pin: true,
    scrub: 0.8,
    invalidateOnRefresh: true,
    animation: gsap.to(track, {
      x: () => -getTrackShift(),
      ease: "none",
    }),
    onUpdate: (self) => {
      const progress = self.progress;

      // Update counter
      const activeIndex = Math.min(
        totalPanels - 1,
        Math.floor(progress * totalPanels),
      );
      if (counter) {
        counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(totalPanels).padStart(2, "0")}`;
      }

      // Update progress bar
      if (progressFill) {
        gsap.set(progressFill, { scaleX: progress });
      }
    },
  });

  cleanups.push(() => st.kill(true));

  // Animate panel info elements as they come into view
  panels.forEach((panel, i) => {
    const info = panel.querySelector(".vfx-hscroll__panel-info");
    const title = panel.querySelector(".vfx-hscroll__panel-title");
    const desc = panel.querySelector(".vfx-hscroll__panel-description");
    const tags = panel.querySelectorAll(".vfx-project__tag");
    const pipeline = panel.querySelector(".vfx-hscroll__pipeline");
    const meta = panel.querySelector(".vfx-hscroll__panel-meta");

    if (i === 0) {
      // First panel is visible on load — animate once
      const firstST = ScrollTrigger.create({
        trigger: hscroll,
        start: "top 80%",
        once: true,
        onEnter: () => {
          animatePanelIn(info, title, desc, tags, pipeline, meta);
        },
      });
      cleanups.push(() => firstST.kill());
    } else {
      // Subsequent panels — animate based on horizontal scroll progress
      const entryProgress = (i - 0.3) / totalPanels;
      const panelST = ScrollTrigger.create({
        trigger: hscroll,
        start: "top top",
        end: () => `+=${window.innerHeight * (totalPanels - 1) + window.innerHeight * 0.5}`,
        onUpdate: (self) => {
          if (self.progress >= entryProgress && !panel.classList.contains("vfx-hscroll__panel--animated")) {
            panel.classList.add("vfx-hscroll__panel--animated");
            animatePanelIn(info, title, desc, tags, pipeline, meta);
          }
        },
      });
      cleanups.push(() => panelST.kill());
    }
  });

  // Auto-play videos based on visible panel
  const allVideos = $$(".vfx-hscroll__video");
  let lastActivePanel = -1;

  const videoST = ScrollTrigger.create({
    trigger: hscroll,
    start: "top top",
    end: () => `+=${window.innerHeight * (totalPanels - 1) + window.innerHeight * 0.5}`,
    onUpdate: (self) => {
      const activeIndex = Math.min(
        totalPanels - 1,
        Math.floor(self.progress * totalPanels),
      );
      if (activeIndex !== lastActivePanel) {
        lastActivePanel = activeIndex;
        // Pause all, play current panel's visible video
        allVideos.forEach((v) => safePause(v));
        const activePanel = panels[activeIndex];
        if (activePanel) {
          const visibleVideo = activePanel.querySelector(".vfx-hscroll__video:not(.is-hidden)");
          if (visibleVideo) safePlay(visibleVideo);
        }
      }
    },
    onLeave: () => {
      allVideos.forEach((v) => safePause(v));
      lastActivePanel = -1;
    },
    onLeaveBack: () => {
      allVideos.forEach((v) => safePause(v));
      lastActivePanel = -1;
    },
  });

  cleanups.push(() => videoST.kill());

  // Video toggle buttons (final/breakdown)
  $$(".vfx-hscroll .vfx-video-toggle").forEach((btn) => {
    const wrap = btn.closest(".vfx-hscroll__video-wrap--toggle");
    if (!wrap) return;
    const videoFinal = wrap.querySelector(".vfx-hscroll__video--final");
    const videoBreakdown = wrap.querySelector(".vfx-hscroll__video--breakdown");
    if (!videoFinal || !videoBreakdown) return;

    const handler = (e) => {
      e.stopPropagation();
      const isFinal = btn.dataset.state === "final";

      if (isFinal) {
        btn.dataset.state = "breakdown";
        btn.textContent = t("vfx.toggle.final", "View Final");
        videoFinal.classList.add("is-hidden");
        videoBreakdown.classList.remove("is-hidden");
        videoBreakdown.currentTime = videoFinal.currentTime;
        safePause(videoFinal);
        safePlay(videoBreakdown);
      } else {
        btn.dataset.state = "final";
        btn.textContent = t("vfx.toggle.solid", "View Solid");
        videoBreakdown.classList.add("is-hidden");
        videoFinal.classList.remove("is-hidden");
        videoFinal.currentTime = videoBreakdown.currentTime;
        safePause(videoBreakdown);
        safePlay(videoFinal);
      }
    };

    btn.addEventListener("click", handler);
    cleanups.push(() => btn.removeEventListener("click", handler));
  });

  // Desktop fullscreen buttons
  $$(".vfx-hscroll .video-fullscreen-btn").forEach((btn) => {
    const fullHandler = () => {
      const container = btn.closest(".vfx-hscroll__panel-media");
      const video = container?.querySelector("video:not(.is-hidden)") || container?.querySelector("video");
      if (video) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      }
    };
    btn.addEventListener("click", fullHandler);
    cleanups.push(() => btn.removeEventListener("click", fullHandler));
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

/* ── Panel info entrance animation ── */

function animatePanelIn(info, title, desc, tags, pipeline, meta) {
  if (!info) return;

  const tl = gsap.timeline();

  if (meta) {
    tl.from(meta, {
      opacity: 0, x: -20, duration: 0.5, ease: "power3.out",
    }, 0);
  }

  if (title) {
    tl.from(title, {
      opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
    }, 0.1);
  }

  if (desc) {
    tl.from(desc, {
      opacity: 0, y: 20, duration: 0.6, ease: "power3.out",
    }, 0.25);
  }

  if (tags.length) {
    tl.from(tags, {
      opacity: 0, y: 12, stagger: 0.04, duration: 0.45, ease: "power3.out",
    }, 0.35);
  }

  if (pipeline) {
    tl.from(pipeline, {
      opacity: 0, y: 10, duration: 0.5, ease: "power3.out",
    }, 0.45);
  }
}

/* ── Mobile VFX Init (vertical fallback) ────────────── */

function initMobileVfx(cleanups) {
  const vfxProjects = $$(".vfx-mobile-stack .vfx-project");
  if (!vfxProjects.length) return;

  vfxProjects.forEach((project) => {
    fadeInUp(project, {
      y: 60,
      duration: 1,
      ease: "power3.out",
      start: "top 85%",
    });

    const media = project.querySelector(".vfx-project__media");
    if (media) {
      scaleReveal(media, {
        scale: 0.96,
        duration: 1.1,
        start: "top 86%",
      });
    }

    staggerIn(project, ".vfx-project__tag, .vfx-project__pipeline-step", {
      y: 16,
      duration: 0.55,
      stagger: 0.035,
      start: "top 82%",
    });
  });

  // Breakdown toggles
  const toggles = $$(".vfx-mobile-stack .vfx-breakdown__toggle");
  toggles.forEach((toggle) => {
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const content = toggle.nextElementSibling;
      const isOpen = content.classList.contains("vfx-breakdown__content--open");

      toggle.classList.toggle("vfx-breakdown__toggle--active", !isOpen);
      toggle.setAttribute("aria-expanded", !isOpen);
      content.classList.toggle("vfx-breakdown__content--open", !isOpen);

      if (!isOpen) {
        gsap.from(content.querySelectorAll(".vfx-breakdown__panel"), {
          scale: 0.95,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        });
      }
    };
    toggle.addEventListener("click", handler);
    cleanups.push(() => toggle.removeEventListener("click", handler));
  });

  // Mobile video autoplay
  const videos = $$(".vfx-mobile-stack .vfx-project__video");
  videos.forEach((video) => {
    ScrollTrigger.create({
      trigger: video,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: () => safePlay(video),
      onLeave: () => safePause(video),
      onEnterBack: () => safePlay(video),
      onLeaveBack: () => safePause(video),
    });
  });

  // Mobile video toggles (final/breakdown)
  $$(".vfx-mobile-stack .vfx-project__video-wrap--toggle").forEach((wrap) => {
    const btn = wrap.querySelector(".vfx-video-toggle");
    const videoFinal = wrap.querySelector(".vfx-project__video--final");
    const videoBreakdown = wrap.querySelector(".vfx-project__video--breakdown");

    if (!btn || !videoFinal || !videoBreakdown) return;

    const toggleHandler = (e) => {
      e.stopPropagation();
      const isFinal = btn.dataset.state === "final";

      if (isFinal) {
        btn.dataset.state = "breakdown";
        btn.textContent = t("vfx.toggle.final", "View Final");
        videoFinal.classList.add("is-hidden");
        videoBreakdown.classList.remove("is-hidden");
        videoBreakdown.currentTime = videoFinal.currentTime;
        safePause(videoFinal);
        safePlay(videoBreakdown);
      } else {
        btn.dataset.state = "final";
        btn.textContent = t("vfx.toggle.solid", "View Solid");
        videoBreakdown.classList.add("is-hidden");
        videoFinal.classList.remove("is-hidden");
        videoFinal.currentTime = videoBreakdown.currentTime;
        safePause(videoBreakdown);
        safePlay(videoFinal);
      }
    };

    btn.addEventListener("click", toggleHandler);
    cleanups.push(() => btn.removeEventListener("click", toggleHandler));
  });

  // Mobile fullscreen buttons
  $$(".vfx-mobile-stack .video-fullscreen-btn").forEach((btn) => {
    const fullHandler = () => {
      const container =
        btn.closest(".vfx-project__media") ||
        btn.closest(".modeling-renders__video-wrap");
      const video = container.querySelector("video:not(.is-hidden)") || container.querySelector("video");
      if (video) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      }
    };
    btn.addEventListener("click", fullHandler);
    cleanups.push(() => btn.removeEventListener("click", fullHandler));
  });
}

/* ── Modeling Sub-section Init (unchanged) ────────────── */

function initModeling(cleanups) {
  const modelingSubs = $$(".modeling-subsection");
  modelingSubs.forEach((sub) => {
    fadeInUp(sub, {
      y: 60,
      duration: 1,
      ease: "power3.out",
      start: "top 85%",
    });

    staggerIn(sub, ".modeling-commercial", {
      y: 36,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      start: "top 78%",
    });
  });

  const playBtns = $$(".modeling-renders__play-btn");
  playBtns.forEach((btn) => {
    const wrap = btn.closest(".modeling-renders__video-wrap");
    const videos = Array.from(wrap.querySelectorAll(".modeling-renders__video"));
    const primaryVideo = videos[0];

    const btnHandler = () => {
      if (primaryVideo.paused) {
        videos.forEach((video) => {
          if (video !== primaryVideo) video.currentTime = primaryVideo.currentTime;
          safePlay(video);
        });
        wrap.classList.add("modeling-renders__video-wrap--playing");
      } else {
        videos.forEach((video) => safePause(video));
        wrap.classList.remove("modeling-renders__video-wrap--playing");
      }
    };

    const videoHandler = () => {
      videos.forEach((video) => safePause(video));
      wrap.classList.remove("modeling-renders__video-wrap--playing");
    };

    btn.addEventListener("click", btnHandler);
    primaryVideo.addEventListener("click", videoHandler);

    cleanups.push(() => {
      btn.removeEventListener("click", btnHandler);
      primaryVideo.removeEventListener("click", videoHandler);
    });
  });

  $$(".modeling-renders__video-wrap--toggle").forEach((wrap) => {
    const btn = wrap.querySelector(".vfx-video-toggle");
    const videoFinal = wrap.querySelector(".modeling-renders__video--final");
    const videoBreakdown = wrap.querySelector(".modeling-renders__video--breakdown");

    if (!btn || !videoFinal || !videoBreakdown) return;

    const toggleHandler = (e) => {
      e.stopPropagation();
      const isFinal = btn.dataset.state === "final";

      if (isFinal) {
        btn.dataset.state = "breakdown";
        btn.textContent = t("vfx.toggle.final", "View Final");
        videoFinal.classList.add("is-hidden");
        videoBreakdown.classList.remove("is-hidden");
        videoBreakdown.currentTime = videoFinal.currentTime;
        safePause(videoFinal);
        safePlay(videoBreakdown);
      } else {
        btn.dataset.state = "final";
        btn.textContent = t("vfx.toggle.breakdown", "View Breakdown");
        videoBreakdown.classList.add("is-hidden");
        videoFinal.classList.remove("is-hidden");
        videoFinal.currentTime = videoBreakdown.currentTime;
        safePause(videoBreakdown);
        safePlay(videoFinal);
      }
    };

    btn.addEventListener("click", toggleHandler);
    cleanups.push(() => btn.removeEventListener("click", toggleHandler));
  });

  const stillsBlocks = $$(".modeling-stills");
  stillsBlocks.forEach((block) => {
    staggerIn(block, ".modeling-renders__item", {
      y: 40,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      start: "top 85%",
    });
  });
}
