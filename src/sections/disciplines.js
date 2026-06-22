import { gsap } from "gsap";
import { cinematicHeader } from "../animations/scrollAnimations.js";
import { $, $$ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";

function getDisciplines() {
  return [
    {
      number: "01",
      title: t("disciplines.vfx.title", "Visual Effects"),
      description: t(
        "disciplines.vfx.description",
        "Compositing, 3D integration, simulations, and digital environments. Turning the impossible into photorealistic.",
      ),
      href: "#vfx",
    },
    {
      number: "02",
      title: t("disciplines.dev.title", "Development"),
      description: t(
        "disciplines.dev.description",
        "Full-stack development, creative coding, and interactive experiences. Clean code that powers bold ideas.",
      ),
      href: "#development",
    },
    {
      number: "03",
      title: t("disciplines.web.title", "Web Design"),
      description: t(
        "disciplines.web.description",
        "High-end websites with motion, rhythm, and purpose. Every pixel and interaction is intentional.",
      ),
      href: "#development",
    },
    {
      number: "04",
      title: t("disciplines.photo.title", "Photo & Video"),
      description: t(
        "disciplines.photo.description",
        "Cinematic storytelling through the lens. From concept to color grade, every frame tells a story.",
      ),
      href: "#photography",
    },
  ];
}

export function renderDisciplines() {
  const items = getDisciplines();
  const ctaLabel = t("disciplines.cta", "View work");

  return `
    <section class="disciplines" id="disciplines">
      <div class="container">
        <div class="section-header disciplines__header">
          <span class="section-label">${t("disciplines.label", "What I do")}</span>
          <h2 class="section-title">${t("disciplines.title", "Disciplines")}</h2>
          <p class="disciplines__lede">${t(
            "disciplines.lede",
            "Four interconnected practices. One language — cinematic, precise, intentional.",
          )}</p>
        </div>

        <div class="disciplines__index" aria-hidden="true">
          <span class="disciplines__index-label">${t("disciplines.index.label", "Index")}</span>
          <span class="disciplines__index-range">01 — ${String(items.length).padStart(2, "0")}</span>
        </div>

        <ul class="disciplines__list">
          ${items
            .map(
              (d) => `
            <li class="discipline-row">
              <a href="${d.href}" class="discipline-row__link" aria-label="${d.title} — ${ctaLabel}">
                <div class="discipline-row__index">
                  <span class="discipline-row__number">${d.number}</span>
                  <span class="discipline-row__rule" aria-hidden="true"></span>
                </div>

                <div class="discipline-row__content">
                  <h3 class="discipline-row__title">${d.title}</h3>
                  <p class="discipline-row__description">${d.description}</p>
                </div>

                <div class="discipline-row__cta">
                  <span class="discipline-row__cta-text">${ctaLabel}</span>
                  <span class="discipline-row__cta-arrow" aria-hidden="true">&rarr;</span>
                </div>
              </a>
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
    </section>
  `;
}

export function initDisciplines() {
  const header = $(".disciplines .section-header");
  if (header) cinematicHeader(header);

  const lede = $(".disciplines__lede");
  if (lede) {
    gsap.from(lede, {
      y: 20,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.2,
      scrollTrigger: {
        trigger: lede,
        start: "top 88%",
        once: true,
      },
    });
  }

  const indexMeta = $(".disciplines__index");
  if (indexMeta) {
    gsap.from(indexMeta, {
      opacity: 0,
      y: 12,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: indexMeta,
        start: "top 92%",
        once: true,
      },
    });
  }

  const rows = $$(".discipline-row");
  rows.forEach((row, i) => {
    gsap.from(row, {
      y: 48,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: i * 0.08,
      scrollTrigger: {
        trigger: row,
        start: "top 90%",
        once: true,
      },
    });
  });

  return () => {};
}
