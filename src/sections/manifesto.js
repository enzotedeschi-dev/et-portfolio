/**
 * Manifesto Section — cinematic statement with editorial pillars.
 * - Scrub-based word-by-word reveal on the main text (preserves inline accents).
 * - Cascading entrance on kicker, line, subtext, actions, divider and pillars.
 * - Two huge outlined keyword rows in the background, scrubbed in opposite directions.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";

function getPillars() {
  return [
    {
      number: "01",
      title: t("manifesto.pillars.vision.title", "Vision"),
      description: t(
        "manifesto.pillars.vision.description",
        "Every project starts from a clear idea and a defined intent.",
      ),
    },
    {
      number: "02",
      title: t("manifesto.pillars.precision.title", "Precision"),
      description: t(
        "manifesto.pillars.precision.description",
        "Craft and technology applied to every detail — no compromises.",
      ),
    },
    {
      number: "03",
      title: t("manifesto.pillars.image.title", "Image"),
      description: t(
        "manifesto.pillars.image.description",
        "Visual storytelling and identity, built to resonate and last.",
      ),
    },
  ];
}

/**
 * Background vertical keywords — decorative texture on the left/right edges.
 * Universal English brand vocabulary works in both locales.
 */
const BG_COL_LEFT =
  "CINEMA · COMPOSITING · LIGHTING · GRADING · LENS · FRAME · CINEMA · COMPOSITING · LIGHTING · GRADING · LENS · FRAME";
const BG_COL_RIGHT =
  "VFX · RENDER · KEYING · TRACKING · MATTE · SIMULATION · VFX · RENDER · KEYING · TRACKING · MATTE · SIMULATION";

export function renderManifesto() {
  const manifestoText = t(
    "manifesto.text",
    'I blend visual effects, code, and cinematography into experiences that <em class="manifesto__accent">come alive</em>, bridging the gap between technical precision and <em class="manifesto__accent">creative</em> vision.',
  );

  return `
    <section class="manifesto" id="manifesto">
      <div class="manifesto__bg" aria-hidden="true">
        <div class="manifesto__bg-col manifesto__bg-col--left">${BG_COL_LEFT}</div>
        <div class="manifesto__bg-col manifesto__bg-col--right">${BG_COL_RIGHT}</div>
      </div>

      <div class="container container--narrow">
        <div class="manifesto__inner">
          <span class="manifesto__kicker gs-reveal">${t("manifesto.kicker", "The Vision")}</span>
          <div class="manifesto__line gs-reveal"></div>

          <p class="manifesto__text gs-reveal">${manifestoText}</p>

          <p class="manifesto__subtext gs-reveal">${t(
            "manifesto.subtext",
            "Every project balances aesthetics and function. From the first idea to the final result, every choice is made to communicate with impact and honesty.",
          )}</p>

          <div class="manifesto__actions gs-reveal">
            <a href="#vfx" class="btn btn--primary">${t("manifesto.cta.work", "See my work")} <span class="btn__arrow">&rarr;</span></a>
            <a href="#disciplines" class="btn btn--outline">${t("manifesto.cta.what", "What I do")} <span class="btn__arrow">&rarr;</span></a>
          </div>

          <div class="manifesto__divider gs-reveal" aria-hidden="true"></div>

          <ul class="manifesto__pillars gs-reveal">
            ${getPillars()
              .map(
                (p) => `
              <li class="manifesto-pillar">
                <span class="manifesto-pillar__number">${p.number}</span>
                <h3 class="manifesto-pillar__title">${p.title}</h3>
                <p class="manifesto-pillar__description">${p.description}</p>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
      </div>
    </section>
  `;
}

/**
 * Walks the element tree, splitting every text node into per-word spans
 * while preserving inline wrappers (like <em class="manifesto__accent">).
 * Returns the flat list of word spans, in document order.
 */
function splitWordsPreserveMarkup(root) {
  const words = [];
  const fullText = root.textContent.replace(/\s+/g, " ").trim();
  root.setAttribute("aria-label", fullText);

  const walk = (node) => {
    const children = Array.from(node.childNodes);
    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        if (!text || !text.trim()) return;

        const parts = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "split-word-inner";
            span.style.display = "inline-block";
            span.setAttribute("aria-hidden", "true");
            span.textContent = part;
            fragment.appendChild(span);
            words.push(span);
          }
        });

        node.replaceChild(fragment, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };

  walk(root);
  return words;
}

export function initManifesto() {
  const kicker = $(".manifesto__kicker");
  const line = $(".manifesto__line");
  const text = $(".manifesto__text");
  const subtext = $(".manifesto__subtext");
  const actions = $(".manifesto__actions");
  const divider = $(".manifesto__divider");
  const pillars = $$(".manifesto-pillar");
  const bgLeft = $(".manifesto__bg-col--left");
  const bgRight = $(".manifesto__bg-col--right");
  const section = $(".manifesto");

  // ---- Background vertical marquee (scrubbed, opposite directions) ----
  if (bgLeft && section) {
    gsap.fromTo(
      bgLeft,
      { yPercent: -30 },
      {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
  }

  if (bgRight && section) {
    gsap.fromTo(
      bgRight,
      { yPercent: -5 },
      {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
  }

  // ---- Kicker ----
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

  // ---- Hairline under kicker ----
  if (line) {
    gsap.from(line, {
      scaleX: 0,
      duration: 1.2,
      ease: "power3.inOut",
      delay: 0.15,
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

  // ---- Main statement: word-by-word scrub (markup-aware) ----
  if (text) {
    const words = splitWordsPreserveMarkup(text);
    text.style.visibility = "visible";

    gsap.set(words, { opacity: 0.15 });

    ScrollTrigger.create({
      trigger: text,
      start: "top 75%",
      end: "bottom 45%",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const range = 0.15;
        words.forEach((word, i) => {
          const wordProgress = i / words.length;
          const wordStart = wordProgress * (1 - range);
          const t = Math.max(0, Math.min(1, (progress - wordStart) / range));
          gsap.set(word, { opacity: 0.15 + t * 0.85 });
        });
      },
    });
  }

  // ---- Subtext ----
  if (subtext) {
    gsap.from(subtext, {
      opacity: 0,
      y: 20,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.2,
      scrollTrigger: {
        trigger: subtext,
        start: "top 88%",
        once: true,
      },
      onStart: () => {
        subtext.style.visibility = "visible";
      },
    });
  }

  // ---- Actions ----
  if (actions) {
    gsap.from(actions, {
      opacity: 0,
      y: 25,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.35,
      scrollTrigger: {
        trigger: actions,
        start: "top 88%",
        once: true,
      },
      onStart: () => {
        actions.style.visibility = "visible";
      },
    });
  }

  // ---- Divider ----
  if (divider) {
    gsap.from(divider, {
      scaleX: 0,
      duration: 1.4,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: divider,
        start: "top 88%",
        once: true,
      },
      onStart: () => {
        divider.style.visibility = "visible";
      },
    });
  }

  // ---- Pillars: stagger reveal + hover accent on number ----
  if (pillars.length) {
    const pillarsContainer = $(".manifesto__pillars");
    if (pillarsContainer) pillarsContainer.style.visibility = "visible";

    gsap.from(pillars, {
      opacity: 0,
      y: 30,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: pillarsContainer || pillars[0],
        start: "top 85%",
        once: true,
      },
    });

    pillars.forEach((pillar) => {
      const number = pillar.querySelector(".manifesto-pillar__number");
      if (!number) return;
      pillar.addEventListener("mouseenter", () => {
        gsap.to(number, {
          color: "var(--color-text-primary)",
          duration: 0.4,
          ease: "power2.out",
        });
      });
      pillar.addEventListener("mouseleave", () => {
        gsap.to(number, {
          color: "var(--color-text-muted)",
          duration: 0.4,
          ease: "power2.out",
        });
      });
    });
  }
}
