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
        <div class="section-header vfx-section__header">
          <span class="section-label">${t("vfx.label", "01 / Visual Effects")}</span>
          <h2 class="section-title">${t("vfx.title", "VFX")}</h2>
          <p class="vfx-section__lede">${t(
            "vfx.lede",
            "Selected shots, breakdowns, and CG work shaped through light, compositing, and technical precision.",
          )}</p>
        </div>

        <div class="vfx-showcase">
          ${vfxProjects
            .map((project, index) => {
              const meta = getVfxMeta(project, index);
              return `
          <article class="vfx-project vfx-project--${index === 0 ? "feature" : "compact"}">
            <div class="vfx-project__media-wrap">
              <div class="vfx-project__media">
              ${
                project.finalVideo
                  ? `
                  <div class="vfx-project__video-wrap--wipe" style="--wipe: 55%;">
                    <video class="vfx-project__video vfx-project__video--breakdown" src="${project.video}" muted loop playsinline preload="metadata" poster="${project.poster || ""}"></video>
                    <video class="vfx-project__video vfx-project__video--final" src="${project.finalVideo}" muted loop playsinline preload="metadata" poster="${project.poster || ""}"></video>
                    <div class="modeling-wipe" aria-hidden="true">
                      <span class="modeling-wipe__label modeling-wipe__label--left">Final</span>
                      <span class="modeling-wipe__handle"></span>
                      <span class="modeling-wipe__label modeling-wipe__label--right">Solid</span>
                    </div>
                    <input class="modeling-wipe__range vfx-wipe__range" type="range" min="0" max="100" value="55" aria-label="Compare final and solid" />
                    <button class="video-fullscreen-btn" aria-label="Fullscreen" style="z-index: 10;">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                  `
                  : project.video
                  ? `<video class="vfx-project__video" src="${project.video}" muted loop playsinline poster="${project.poster || ""}"></video>
                     <button class="video-fullscreen-btn" aria-label="Fullscreen">
                       <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                     </button>`
                  : `<div class="vfx-project__placeholder">Video placeholder — ${project.title}</div>`
              }
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

        ${renderModeling()}
      </div>
    </section>
  `;
}

function renderModeling() {
  const modeling = projects.modeling;
  if (!modeling) return "";

  const { renders } = modeling;
  const videoProjects = renders.filter((p) => p.video);
  const stillsProject = renders.find((p) => p.images.length > 0);

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
                <div class="modeling-renders__video-wrap${project.finalVideo ? " modeling-renders__video-wrap--wipe" : ""}"${project.finalVideo ? ' style="--wipe: 55%;"' : ""}>
                  ${
                    project.finalVideo
                      ? `
                    <video class="modeling-renders__video modeling-renders__video--breakdown" src="${project.video}" muted loop playsinline preload="metadata" poster="${project.poster || ""}"></video>
                    <video class="modeling-renders__video modeling-renders__video--final" src="${project.finalVideo}" muted loop playsinline preload="metadata" poster="${project.poster || ""}"></video>
                    <div class="modeling-wipe" aria-hidden="true">
                      <span class="modeling-wipe__label modeling-wipe__label--left">Final</span>
                      <span class="modeling-wipe__handle"></span>
                      <span class="modeling-wipe__label modeling-wipe__label--right">Breakdown</span>
                    </div>
                    <input class="modeling-wipe__range" type="range" min="0" max="100" value="55" aria-label="Compare final and breakdown" />
                  `
                      : `<video class="modeling-renders__video" src="${project.video}" muted loop playsinline preload="metadata" poster="${project.poster || ""}"></video>`
                  }
                  <button class="modeling-renders__play-btn" aria-label="Play video">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="23" stroke="currentColor" stroke-width="2" opacity="0.6"/><path d="M19 15l14 9-14 9V15z" fill="currentColor"/></svg>
                  </button>
                </div>
              </div>
              <div class="modeling-commercial__copy">
                <span class="modeling-commercial__eyebrow">${t(`modeling.renders.${project.id}.eyebrow`, i === 0 ? "Final Product Film" : "Breakdown Reel")}</span>
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

      ${
        stillsProject
          ? `
        <div class="modeling-stills">
          <div class="modeling-stills__header">
            <span class="modeling-stills__label">${t("modeling.stills.label", "03 / Campaign Stills")}</span>
            <h3 class="modeling-stills__title">${t("modeling.stills.title", "Campaign Stills")}</h3>
            <p class="modeling-stills__description">${t(
              "modeling.stills.description",
              "Static CGI frames designed as supporting campaign visuals — focused on packaging, reflections, material detail and premium product presence.",
            )}</p>
          </div>

          <div class="modeling-renders__grid">
            ${stillsProject.images
              .map(
                (img, i) => `
                  <div class="modeling-renders__item">
                    <img src="${img}" alt="${stillsProject.title} — campaign still ${i + 1}" loading="lazy" decoding="async" />
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    </section>
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

  const vfxProjects = $$(".vfx-project");
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

    btn.addEventListener("click", () => {
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
    });

    primaryVideo.addEventListener("click", () => {
      videos.forEach((video) => safePause(video));
      wrap.classList.remove("modeling-renders__video-wrap--playing");
    });
  });

  $$(".modeling-renders__video-wrap--wipe, .vfx-project__video-wrap--wipe").forEach((wrap) => {
    const range = wrap.querySelector(".modeling-wipe__range, .vfx-wipe__range");
    const videos = Array.from(wrap.querySelectorAll(".modeling-renders__video, .vfx-project__video"));
    if (!range) return;

    const setWipe = () => {
      wrap.style.setProperty("--wipe", `${range.value}%`);
    };
    range.addEventListener("input", setWipe);
    setWipe();

    const [baseVideo, compareVideo] = videos;
    if (baseVideo && compareVideo) {
      baseVideo.addEventListener("timeupdate", () => {
        if (Math.abs(compareVideo.currentTime - baseVideo.currentTime) > 0.12) {
          compareVideo.currentTime = baseVideo.currentTime;
        }
      });
    }
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

  $$(".video-fullscreen-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const container =
        btn.closest(".vfx-project__media") ||
        btn.closest(".modeling-renders__video-wrap");
      const video = container.querySelector("video");
      if (container?.requestFullscreen) {
        container.requestFullscreen();
      } else if (video) {
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      }
    });
  });
}
