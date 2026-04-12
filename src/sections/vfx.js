/**
 * VFX Section 
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
import { initModelViewer } from "../three/viewer.js";

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

export function renderVfx() {
  const vfxProjects = projects.vfx;

  return `
    <section class="vfx-section" id="vfx">
      <div class="container">
        <div class="section-header">
          <span class="section-label">${t("vfx.label", "01 / Visual Effects")}</span>
          <h2 class="section-title">${t("vfx.title", "VFX")}</h2>
        </div>
        ${vfxProjects
          .map(
            (project) => `
          <article class="vfx-project">
            <div class="vfx-project__media">
              ${
                project.video
                  ? `<video class="vfx-project__video" src="${project.video}" muted loop playsinline poster="${project.poster || ""}"></video>`
                  : `<div class="vfx-project__placeholder">Video placeholder — ${project.title}</div>`
              }
            </div>
            <div class="vfx-project__info">
              <div>
                <h3 class="vfx-project__title">${t(`vfx.${project.id}.title`, project.title)}</h3>
                <p class="vfx-project__description">${t(`vfx.${project.id}.description`, project.description)}</p>
              </div>
              <div class="vfx-project__tags">
                ${project.tags.map((tag) => `<span class="vfx-project__tag">${tag}</span>`).join("")}
              </div>
            </div>
            ${renderBreakdown(project.breakdown)}
          </article>
        `,
          )
          .join("")}

        ${renderModeling()}
      </div>
    </section>
  `;
}

function renderModeling() {
  const modeling = projects.modeling;
  if (!modeling) return "";

  const { viewer, renders } = modeling;

  return `
    <div class="modeling-subsection">
      <div class="modeling-header">
        <span class="section-label">${t("modeling.label", "3D Modeling")}</span>
        <h2 class="modeling-title">${t("modeling.title", "Explore in 3D")}</h2>
      </div>

      <div class="modeling-showcase">
        <div class="modeling-showcase__info">
          <h3 class="modeling-showcase__name">${t("modeling.viewer.title", viewer.title)}</h3>
          <p class="modeling-showcase__desc">${t("modeling.viewer.description", viewer.description)}</p>
          <div class="vfx-project__tags">
            ${viewer.tags.map((tag) => `<span class="vfx-project__tag">${tag}</span>`).join("")}
          </div>
          <p class="modeling-showcase__hint">${t("modeling.viewer.hint", "Drag to rotate \u00b7 Ctrl + scroll to zoom")}</p>
        </div>
        <div class="modeling-viewer" id="model-viewer-${viewer.id}" data-model="${viewer.model}"></div>
      </div>

      ${
        renders.length > 0
          ? `
        <div class="modeling-renders">
          <h3 class="modeling-renders__title">${t("modeling.renders.title", "Renders")}</h3>

          <div class="modeling-renders__videos-row">
            ${renders
              .filter((p) => p.video)
              .map(
                (project) => `
              <div class="modeling-renders__video-col">
                <div class="modeling-renders__video-wrap">
                  <video class="modeling-renders__video" src="${project.video}" muted loop playsinline preload="metadata"></video>
                  <button class="modeling-renders__play-btn" aria-label="Play video">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="23" stroke="currentColor" stroke-width="2" opacity="0.6"/><path d="M19 15l14 9-14 9V15z" fill="currentColor"/></svg>
                  </button>
                </div>
                <h4 class="modeling-renders__video-label">${t(`modeling.renders.${project.id}.title`, project.title)}</h4>
              </div>
            `,
              )
              .join("")}
          </div>

          ${renders
            .filter((p) => p.images.length > 0)
            .map(
              (project) => `
            <div class="modeling-renders__project">
              <div class="modeling-renders__info">
                <h4 class="modeling-renders__name">${t(`modeling.renders.${project.id}.title`, project.title)}</h4>
                <p class="modeling-renders__desc">${t(`modeling.renders.${project.id}.description`, project.description)}</p>
                <div class="vfx-project__tags">
                  ${project.tags.map((tag) => `<span class="vfx-project__tag">${tag}</span>`).join("")}
                </div>
              </div>
              <div class="modeling-renders__grid">
                ${project.images
                  .map(
                    (img, i) => `
                  <div class="modeling-renders__item">
                    <img src="${img}" alt="${project.title} — render ${i + 1}" loading="lazy" decoding="async" />
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `;
}

function safePlay(video) {
  const p = video.play();
  if (p !== undefined) p.catch(() => {});
}

function safePause(video) {
  video.pause();
}

export function initVfx() {
  const header = $(".vfx-section .section-header");
  if (header) cinematicHeader(header);

  const vfxProjects = $$(".vfx-project");
  vfxProjects.forEach((project) => {
    fadeInUp(project, {
      y: 60,
      duration: 1,
      ease: "power3.out",
      start: "top 85%",
    });
  });

  const toggles = $$(".vfx-breakdown__toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
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
    });
  });

  const videos = $$(".vfx-project__video");
  videos.forEach((video) => {
    scaleReveal(video.closest(".vfx-project__media"), {
      scale: 0.94,
      duration: 1.2,
      ease: "power3.out",
      start: "top 88%",
    });

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

  const viewerContainers = $$(".modeling-viewer");
  viewerContainers.forEach((container) => {
    scaleReveal(container, {
      scale: 0.9,
      duration: 1.4,
      ease: "power3.out",
      start: "top 90%",
    });
    let initialized = false;
    ScrollTrigger.create({
      trigger: container,
      start: "top 95%",
      once: true,
      onEnter: () => {
        if (!initialized) {
          initialized = true;
          initModelViewer(container, container.dataset.model);
        }
      },
    });
  });

  const modelingSubs = $$(".modeling-subsection");
  modelingSubs.forEach((sub) => {
    fadeInUp(sub, {
      y: 60,
      duration: 1,
      ease: "power3.out",
      start: "top 85%",
    });
  });

  const playBtns = $$(".modeling-renders__play-btn");
  playBtns.forEach((btn) => {
    const wrap = btn.closest(".modeling-renders__video-wrap");
    const video = wrap.querySelector(".modeling-renders__video");

    btn.addEventListener("click", () => {
      if (video.paused) {
        safePlay(video);
        wrap.classList.add("modeling-renders__video-wrap--playing");
      } else {
        safePause(video);
        wrap.classList.remove("modeling-renders__video-wrap--playing");
      }
    });

    video.addEventListener("click", () => {
      safePause(video);
      wrap.classList.remove("modeling-renders__video-wrap--playing");
    });
  });

  const renderProjects = $$(".modeling-renders__project");
  renderProjects.forEach((project) => {
    staggerIn(project, ".modeling-renders__item", {
      y: 40,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      start: "top 85%",
    });
  });
}
