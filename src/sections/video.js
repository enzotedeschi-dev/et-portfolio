/**
 * Websites Section — Web projects with live preview
 */

import { fadeInUp } from "../animations/scrollAnimations.js";
import { $$ } from "../utils/dom.js";
import { projects } from "../data/projects.js";

export function renderWebsites() {
  const websites = projects.websites;

  return `
    <section class="websites-section" id="websites">
      <div class="container">
        <div class="section-header">
          <span class="section-label">04 / Web</span>
          <h2 class="section-title">Websites</h2>
        </div>
        <div class="websites-grid">
          ${websites
            .map(
              (project) => `
            <article class="website-project">
              <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="website-project__preview">
                <iframe src="${project.url}" class="website-project__iframe" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>
                <div class="website-project__iframe-overlay"></div>
              </a>
              <h3 class="website-project__title">${project.title}</h3>
              <p class="website-project__description">${project.description}</p>
              <div class="website-project__stack">
                ${project.stack.map((tech) => `<span class="website-project__tech">${tech}</span>`).join("")}
              </div>
              <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="website-project__link">
                Visit site ↗
              </a>
            </article>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function initWebsites() {
  const websiteProjects = $$(".website-project");
  websiteProjects.forEach((project) => {
    fadeInUp(project, {
      y: 60,
      duration: 1,
      ease: "power3.out",
      start: "top 85%",
    });
  });
}
