/**
 * Manifesto Section 
 */

import { gsap } from "gsap";
import { animateScrollText } from "../animations/textReveal.js";
import { $, $$ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";

export function renderManifesto() {
  return `
    <section class="manifesto" id="manifesto">
      <div class="container container--narrow">
        <div class="manifesto__inner">
          <span class="manifesto__kicker gs-reveal">${t("manifesto.kicker", "The Vision")}</span>
          <div class="manifesto__line gs-reveal"></div>
          <p class="manifesto__text gs-reveal">
            ${t("manifesto.text", "I blend visual effects, code, and cinematography into experiences that feel alive \u2014 bridging the gap between technical precision and creative vision.")}
          </p>
          <div class="manifesto__actions gs-reveal">
            <a href="#vfx" class="btn btn--primary">${t("manifesto.cta.work", "See my work")} <span class="btn__arrow">&rarr;</span></a>
            <a href="#disciplines" class="btn btn--outline">${t("manifesto.cta.what", "What I do")}</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initManifesto() {
  const text = $(".manifesto__text");
  const kicker = $(".manifesto__kicker");
  const line = $(".manifesto__line");
  const actions = $(".manifesto__actions");

  animateScrollText(text, {
    type: "words",
    duration: 0.6,
    stagger: 0.04,
    y: 20,
    ease: "power3.out",
    start: "top 75%",
  });

  if (kicker) {
    gsap.from(kicker, {
      opacity: 0,
      y: 15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: kicker,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onStart: () => {
        kicker.style.visibility = "visible";
      },
    });
  }

  if (line) {
    gsap.from(line, {
      scaleX: 0,
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: line,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onStart: () => {
        line.style.visibility = "visible";
      },
    });
  }

  if (actions) {
    gsap.from(actions, {
      opacity: 0,
      y: 25,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.4,
      scrollTrigger: {
        trigger: actions,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      onStart: () => {
        actions.style.visibility = "visible";
      },
    });
  }
}
