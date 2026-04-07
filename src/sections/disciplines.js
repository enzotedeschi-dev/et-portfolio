/**
 * Disciplines Section — 4 skill cards with stagger animation
 */

import { staggerIn, cinematicHeader } from "../animations/scrollAnimations.js";
import { $, $$ } from "../utils/dom.js";

const DISCIPLINES = [
  {
    number: "01",
    title: "Visual Effects",
    description:
      "Compositing, 3D integration, simulations, and digital environments. Turning the impossible into photorealistic.",
    tools: ["After Effects", "Nuke", "Houdini", "Cinema 4D"],
  },
  {
    number: "02",
    title: "Development",
    description:
      "Full-stack development, creative coding, and interactive experiences. Clean code that powers bold ideas.",
    tools: ["JavaScript", "Python", "Three.js", "GSAP"],
  },
  {
    number: "03",
    title: "Web Design",
    description:
      "High-end websites with motion, rhythm, and purpose. Every pixel and interaction is intentional.",
    tools: ["HTML/CSS", "Figma", "Vite", "Responsive"],
  },
  {
    number: "04",
    title: "Photo & Video",
    description:
      "Cinematic storytelling through the lens. From concept to color grade, every frame tells a story.",
    tools: ["Premiere Pro", "DaVinci", "Lightroom", "Sony"],
  },
];

export function renderDisciplines() {
  return `
    <section class="disciplines" id="disciplines">
      <div class="container">
        <div class="section-header">
          <span class="section-label">What I do</span>
          <h2 class="section-title">Disciplines</h2>
        </div>
        <div class="disciplines__grid">
          ${DISCIPLINES.map(
            (d) => `
            <div class="discipline-card">
              <span class="discipline-card__number">${d.number}</span>
              <h3 class="discipline-card__title">${d.title}</h3>
              <p class="discipline-card__description">${d.description}</p>
              <div class="discipline-card__tools">
                ${d.tools.map((t) => `<span class="discipline-card__tool">${t}</span>`).join("")}
              </div>
            </div>
          `,
          ).join("")}
        </div>
      </div>
    </section>
  `;
}

export function initDisciplines() {
  const header = $(".disciplines .section-header");
  if (header) cinematicHeader(header);

  const grid = $(".disciplines__grid");
  staggerIn(grid, ".discipline-card", {
    y: 50,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    start: "top 80%",
  });
}
