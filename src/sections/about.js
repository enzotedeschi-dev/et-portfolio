import { gsap } from "gsap";
import { cinematicHeader } from "../animations/scrollAnimations.js";
import { $, $$ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";
import aboutPhoto from "../assets/enzotedeschiphoto.png";

export function renderAbout() {
  return `
    <section class="about" id="about">
      <div class="container">
        <div class="section-header">
          <span class="section-label">${t("about.label", "About")}</span>
          <h2 class="section-title">${t("about.title", "Who I am")}</h2>
        </div>
        <div class="about__content">
          <div class="about__photo">
            <img src="${aboutPhoto}" alt="Enzo Tedeschi" loading="lazy" decoding="async" />
          </div>
          <div class="about__text">
            <h3 class="about__heading">Enzo Tedeschi</h3>
            <p class="about__bio">
              ${t("about.bio1", "I'm a 15-year-old creative developer from Italy with a passion for blending visual effects, code, and cinematography. I don't just build things \u2014 I craft experiences that sit at the intersection of art and technology.")}
            </p>
            <p class="about__bio">
              ${t("about.bio2", "Whether it's compositing a VFX shot, coding an interactive website, or directing a short film, I approach every project with the same philosophy: precision in the details, boldness in the vision.")}
            </p>
            <div>
              <p class="about__detail"><strong>${t("about.location.label", "Location")}</strong> — ${t("about.location.value", "Italy")}</p>
              <p class="about__detail"><strong>${t("about.focus.label", "Focus")}</strong> — ${t("about.focus.value", "VFX, Development, Web, Photo & Video")}</p>
              <p class="about__detail"><strong>${t("about.available.label", "Available for")}</strong> — ${t("about.available.value", "Freelance & Collaborations")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initAbout() {
  const header = $(".about .section-header");
  if (header) cinematicHeader(header);

  const photo = $(".about__photo");
  if (photo) {
    gsap.from(photo, {
      clipPath: "inset(0 100% 0 0)",
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: photo,
        start: "top 80%",
        once: true,
      },
    });
  }

  const heading = $(".about__heading");
  if (heading) {
    gsap.from(heading, {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 85%",
        once: true,
      },
    });
  }

  const bios = $$(".about__bio");
  gsap.from(bios, {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: bios[0],
      start: "top 85%",
      once: true,
    },
  });

  const details = $$(".about__detail");
  gsap.from(details, {
    x: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: details[0],
      start: "top 88%",
      once: true,
    },
  });
}
