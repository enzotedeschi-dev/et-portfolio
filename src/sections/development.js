import { staggerIn, cinematicHeader } from "../animations/scrollAnimations.js";
import { $ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";
import { projects } from "../data/projects.js";

function renderPreview(project) {
  if (project.preview === "iframe" && project.url) {
    return `
      <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="dev-card__preview dev-card__preview--iframe">
        <iframe src="${project.url}" class="dev-card__iframe" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>
        <div class="dev-card__iframe-overlay"></div>
      </a>
    `;
  }
  if (project.preview === "image" && project.screenshot) {
    if (project.url) {
      return `
        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="dev-card__preview">
          <img src="${project.screenshot}" alt="${project.title}" class="dev-card__img" loading="lazy" decoding="async" />
        </a>
      `;
    }
    return `
      <div class="dev-card__preview">
        <img src="${project.screenshot}" alt="${project.title}" class="dev-card__img" loading="lazy" decoding="async" />
      </div>
    `;
  }
  return `<div class="dev-card__preview"><span>Preview — ${project.title}</span></div>`;
}

export function renderDevelopment() {
  const devProjects = projects.development;

  return `
    <section class="dev-section" id="development">
      <div class="container">
        <div class="section-header">
          <span class="section-label">${t("dev.label", "02 / Code")}</span>
          <h2 class="section-title">${t("dev.title", "Development")}</h2>
        </div>
        <div class="dev-projects__grid">
          ${devProjects
            .map(
              (project) => `
            <article class="dev-card">
              ${renderPreview(project)}
              <div class="dev-card__body">
                <h3 class="dev-card__title">${project.title}</h3>
                <p class="dev-card__description">${t(`dev.${project.id}.description`, project.description)}</p>
                <div class="dev-card__stack">
                  ${project.stack.map((tech) => `<span class="dev-card__tech">${tech}</span>`).join("")}
                </div>
                <div class="dev-card__links">
                  ${project.url ? `<a href="${project.url}" class="dev-card__link" target="_blank" rel="noopener">${t("dev.visit", "Visit site \u2197")}</a>` : ""}
                  ${project.github ? `<a href="${project.github}" class="dev-card__link" target="_blank" rel="noopener">${t("dev.github", "GitHub \u2197")}</a>` : ""}
                </div>
              </div>
            </article>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function initDevelopment() {
  const header = $(".dev-section .section-header");
  if (header) cinematicHeader(header);

  const grid = $(".dev-projects__grid");
  staggerIn(grid, ".dev-card", {
    y: 50,
    duration: 0.9,
    stagger: 0.15,
    ease: "power3.out",
    start: "top 80%",
  });
}
