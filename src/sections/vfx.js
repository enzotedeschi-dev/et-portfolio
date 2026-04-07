/**
 * VFX Section — Projects with integrated breakdowns
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  fadeInUp,
  cinematicHeader,
  scaleReveal,
} from "../animations/scrollAnimations.js";
import { $, $$ } from "../utils/dom.js";
import { projects } from "../data/projects.js";
import { initModelViewer } from "../three/viewer.js";

gsap.registerPlugin(ScrollTrigger);

function renderBreakdown(breakdown) {
  if (!breakdown) return "";

  return `
    <button class="vfx-breakdown__toggle" aria-expanded="false">
      <span class="vfx-breakdown__toggle-icon"></span>
      View Breakdown
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
            <span class="vfx-breakdown__label">Before</span>
          </div>
          <div class="vfx-breakdown__panel">
            ${
              breakdown.after
                ? `<img src="${breakdown.after}" alt="After" class="vfx-breakdown__img" loading="lazy" decoding="async" />`
                : `<span>${breakdown.type === "side-by-side" ? "After" : "Final"}</span>`
            }
            <span class="vfx-breakdown__label">After</span>
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
          <span class="section-label">01 / Visual Effects</span>
          <h2 class="section-title">VFX</h2>
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
                <h3 class="vfx-project__title">${project.title}</h3>
                <p class="vfx-project__description">${project.description}</p>
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
        <span class="section-label">3D Modeling</span>
        <h2 class="modeling-title">Explore in 3D</h2>
      </div>

      <div class="modeling-showcase">
        <div class="modeling-showcase__info">
          <h3 class="modeling-showcase__name">${viewer.title}</h3>
          <p class="modeling-showcase__desc">${viewer.description}</p>
          <div class="vfx-project__tags">
            ${viewer.tags.map((tag) => `<span class="vfx-project__tag">${tag}</span>`).join("")}
          </div>
          <p class="modeling-showcase__hint">Drag to rotate · Ctrl + scroll to zoom</p>
        </div>
        <div class="modeling-viewer" id="model-viewer-${viewer.id}" data-model="${viewer.model}"></div>
      </div>

      ${
        renders.length > 0
          ? `
        <div class="modeling-renders">
          <h3 class="modeling-renders__title">Renders</h3>
          ${renders
            .map(
              (project) => `
            <div class="modeling-renders__project">
              <div class="modeling-renders__info">
                <h4 class="modeling-renders__name">${project.title}</h4>
                <p class="modeling-renders__desc">${project.description}</p>
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

export function initVfx() {
  // Cinematic section header
  const header = $(".vfx-section .section-header");
  if (header) cinematicHeader(header);

  // Stagger project entrance
  const vfxProjects = $$(".vfx-project");
  vfxProjects.forEach((project) => {
    fadeInUp(project, {
      y: 60,
      duration: 1,
      ease: "power3.out",
      start: "top 85%",
    });
  });

  // Breakdown toggle
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

  // Video scale reveal + autoplay on scroll
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
      onEnter: () => video.play(),
      onLeave: () => video.pause(),
      onEnterBack: () => video.play(),
      onLeaveBack: () => video.pause(),
    });
  });

  // 3D Modeling viewer — scale reveal + lazy init
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

  // Modeling subsection cinematic entrance
  const modelingSubs = $$(".modeling-subsection");
  modelingSubs.forEach((sub) => {
    fadeInUp(sub, {
      y: 60,
      duration: 1,
      ease: "power3.out",
      start: "top 85%",
    });
  });
}
