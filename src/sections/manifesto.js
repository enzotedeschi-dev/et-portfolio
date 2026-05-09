/**
 * Manifesto Section — scrub-based word-by-word opacity reveal
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitText } from "../animations/textReveal.js";
import { makeMagnetic } from "../animations/magnetic.js";
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
            ${t("manifesto.text", "I blend visual effects, code, and cinematography into experiences that feel alive, bridging the gap between technical precision and creative vision.")}
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

const magneticCleanups = [];

export function initManifesto() {
  const text = $(".manifesto__text");
  const kicker = $(".manifesto__kicker");
  const line = $(".manifesto__line");
  const actions = $(".manifesto__actions");

  // Cleanup previous magnetic
  magneticCleanups.forEach((fn) => fn());
  magneticCleanups.length = 0;

  // ---- Word-by-word scrub opacity reveal (Apple-style) ----
  if (text) {
    const words = splitText(text, "words");
    text.style.visibility = "visible";

    // Set all words to low opacity initially
    gsap.set(words, { opacity: 0.15 });

    // Scrub: each word lights up as you scroll through the section
    ScrollTrigger.create({
      trigger: text,
      start: "top 75%",
      end: "bottom 40%",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        words.forEach((word, i) => {
          const wordProgress = i / words.length;
          // Each word has a small range where it transitions
          const range = 0.15;
          const wordStart = wordProgress * (1 - range);
          const t = Math.max(0, Math.min(1, (progress - wordStart) / range));
          gsap.set(word, { opacity: 0.15 + t * 0.85 });
        });
      },
    });
  }

  if (kicker) {
    gsap.from(kicker, {
      opacity: 0,
      y: 15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: kicker,
        start: "top 80%",
        once: true,
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
        once: true,
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
        once: true,
      },
      onStart: () => {
        actions.style.visibility = "visible";
      },
    });

    // Magnetic buttons
    const btns = actions.querySelectorAll(".btn");
    btns.forEach((btn) => {
      magneticCleanups.push(
        makeMagnetic(btn, { strength: 0.25, radius: 100 }),
      );
    });
  }
}
