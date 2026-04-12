import { gsap } from "gsap";
import { cinematicHeader } from "../animations/scrollAnimations.js";
import { $, $$ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";

function getDisciplines() {
  return [
    {
      number: "01",
      title: t("disciplines.vfx.title", "Visual Effects"),
      description: t("disciplines.vfx.description", "Compositing, 3D integration, simulations, and digital environments. Turning the impossible into photorealistic."),
      tools: ["After Effects", "Nuke", "Houdini", "Cinema 4D"],
    },
    {
      number: "02",
      title: t("disciplines.dev.title", "Development"),
      description: t("disciplines.dev.description", "Full-stack development, creative coding, and interactive experiences. Clean code that powers bold ideas."),
      tools: ["JavaScript", "Python", "Three.js", "GSAP"],
    },
    {
      number: "03",
      title: t("disciplines.web.title", "Web Design"),
      description: t("disciplines.web.description", "High-end websites with motion, rhythm, and purpose. Every pixel and interaction is intentional."),
      tools: ["HTML/CSS", "Figma", "Vite", "Responsive"],
    },
    {
      number: "04",
      title: t("disciplines.photo.title", "Photo & Video"),
      description: t("disciplines.photo.description", "Cinematic storytelling through the lens. From concept to color grade, every frame tells a story."),
      tools: ["Premiere Pro", "DaVinci", "Lightroom", "Sony"],
    },
  ];
}

export function renderDisciplines() {
  return `
    <section class="disciplines" id="disciplines">
      <div class="container">
        <div class="section-header">
          <span class="section-label">${t("disciplines.label", "What I do")}</span>
          <h2 class="section-title">${t("disciplines.title", "Disciplines")}</h2>
        </div>
        <div class="disciplines__grid">
          ${getDisciplines().map(
            (d) => `
            <div class="discipline-card">
              <span class="discipline-card__number">${d.number}</span>
              <h3 class="discipline-card__title">${d.title}</h3>
              <p class="discipline-card__description">${d.description}</p>
              <div class="discipline-card__tools">
                ${d.tools.map((tool) => `<span class="discipline-card__tool">${tool}</span>`).join("")}
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

  const cards = $$(".discipline-card");
  cards.forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.from(card, {
      x: fromLeft ? -60 : 60,
      y: 40,
      opacity: 0,
      rotation: fromLeft ? -3 : 3,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      delay: i * 0.1,
    });
  });
}
