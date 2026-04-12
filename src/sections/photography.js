/**
 * Photography Section
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  fadeInUp,
  staggerIn,
  cinematicHeader,
} from "../animations/scrollAnimations.js";
import { $, $$ } from "../utils/dom.js";
import { projects } from "../data/projects.js";

gsap.registerPlugin(ScrollTrigger);

export function renderPhotography() {
  const photoProjects = projects.photography;

  return `
    <section class="photo-section" id="photography">
      <div class="container">
        <div class="section-header">
          <span class="section-label">03 / Lens</span>
          <h2 class="section-title">Photography</h2>
        </div>
        ${photoProjects
          .map(
            (project) => `
          <article class="photo-project">
            <h3 class="photo-project__title">${project.title}</h3>
            <p class="photo-project__description">${project.description}</p>
            <span class="photo-project__meta">${project.camera}</span>
            <div class="photo-grid">
              ${project.images
                .map(
                  (img, i) => `
                <div class="photo-grid__item">
                  ${
                    img
                      ? `<img src="${img}" alt="${project.title} — ${i + 1}" loading="lazy" decoding="async" />`
                      : `Photo ${i + 1}`
                  }
                </div>
              `,
                )
                .join("")}
            </div>
          </article>
        `,
          )
          .join("")}
      </div>
    </section>
  `;
}

export function initPhotography() {
  const header = $(".photo-section .section-header");
  if (header) cinematicHeader(header);

  const photoProjects = $$(".photo-project");
  photoProjects.forEach((project) => {
    fadeInUp(project.querySelector(".photo-project__title"), {
      y: 30,
      duration: 0.8,
      start: "top 85%",
    });

    staggerIn(project, ".photo-grid__item", {
      y: 30,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      start: "top 80%",
    });
  });
}
