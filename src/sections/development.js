/**
 * Development Section — Project cards with iframe or image preview
 */

import { staggerIn, cinematicHeader } from "../animations/scrollAnimations.js";
import { $ } from "../utils/dom.js";
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
          <span class="section-label">02 / Code</span>
          <h2 class="section-title">Development</h2>
        </div>
        <div class="dev-projects__grid">
          ${devProjects
            .map(
              (project) => `
            <article class="dev-card">
              ${renderPreview(project)}
              <div class="dev-card__body">
                <h3 class="dev-card__title">${project.title}</h3>
                <p class="dev-card__description">${project.description}</p>
                <div class="dev-card__stack">
                  ${project.stack.map((tech) => `<span class="dev-card__tech">${tech}</span>`).join("")}
                </div>
                <div class="dev-card__links">
                  ${project.url ? `<a href="${project.url}" class="dev-card__link" target="_blank" rel="noopener">Visit site ↗</a>` : ""}
                  ${project.github ? `<a href="${project.github}" class="dev-card__link" target="_blank" rel="noopener">GitHub ↗</a>` : ""}
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
  // Cinematic section header
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
