/**
 * Contact Section — premium CTA with cinematic text reveal,
 * continuous marquee, and live clock footer.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateHeroText } from "../animations/textReveal.js";
import { fadeInUp } from "../animations/scrollAnimations.js";
import { makeMagnetic } from "../animations/magnetic.js";
import { $, $$ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";

/* ── SVG Icons ─────────────────────────────────── */

const ICON_INSTAGRAM = `<svg class="contact__social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm5.5-.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>`;

const ICON_GITHUB = `<svg class="contact__social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.6 9.6 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z"/></svg>`;

/* ── Marquee Keywords ──────────────────────────── */

const MARQUEE_WORDS = "VFX  •  CODE  •  CINEMA  •  DESIGN  •  MOTION  •  ";
const MARQUEE_REPEAT = 8; // repeat enough to fill wide screens

function buildMarqueeText() {
  return MARQUEE_WORDS.repeat(MARQUEE_REPEAT);
}

/* ── Render ─────────────────────────────────────── */

export function renderContact() {
  const currentYear = new Date().getFullYear();
  const marqueeText = buildMarqueeText();

  return `
    <section class="contact" id="contact">

      <div class="contact__marquee-wrap" aria-hidden="true">
        <span class="contact__marquee contact__marquee--row1">${marqueeText}</span>
        <span class="contact__marquee contact__marquee--row2">${marqueeText}</span>
      </div>

      <div class="contact__content">
        <h2 class="contact__heading">${t("contact.heading", "Let's work together")}</h2>
        <p class="contact__subtext">
          ${t("contact.subtext", "Got a project in mind, a collaboration idea, or just want to say hi? I'm always open to new opportunities.")}
        </p>
        <a href="mailto:tedeschi.enzo@outlook.it" class="contact__email">tedeschi.enzo@outlook.it</a>
        <div class="contact__socials">
          <a href="https://www.instagram.com/enzotedeschi.art/" class="contact__social-link" target="_blank" rel="noopener">
            ${ICON_INSTAGRAM}<span class="contact__social-text">Instagram</span>
          </a>
          <a href="https://github.com/enzotedeschi-dev" class="contact__social-link" target="_blank" rel="noopener">
            ${ICON_GITHUB}<span class="contact__social-text">GitHub</span>
          </a>
        </div>
      </div>

    </section>

    <footer class="footer">
      <div class="footer__col footer__col--left">
        <span class="footer__text">© ${currentYear} ${t("contact.footer.copyright", "Enzo Tedeschi")}</span>
      </div>
      <div class="footer__col footer__col--center">
        <span class="footer__status">
          <span class="footer__status-dot" aria-hidden="true"></span>
          ${t("contact.available", "Available for work")}
        </span>
        <span class="footer__time-sep footer__text">—</span>
        <span class="footer__time-label footer__text">${t("contact.localtime", "Local time")}</span>
        <span class="footer__time" id="footer-clock"></span>
      </div>
      <div class="footer__col footer__col--right">
        <span class="footer__text">${t("contact.footer.credit", "Designed & built by me")}</span>
      </div>
    </footer>
  `;
}

/* ── Init ───────────────────────────────────────── */

export function initContact() {
  const cleanups = [];

  /* — 1. Cinematic heading text reveal — */
  const heading = $(".contact__heading");
  if (heading) {
    gsap.set(heading, { visibility: "hidden" });

    const st = ScrollTrigger.create({
      trigger: heading,
      start: "top 82%",
      once: true,
      onEnter: () => {
        animateHeroText(heading, {
          type: "chars",
          duration: 0.9,
          stagger: 0.025,
          y: 14,
          ease: "power3.out",
        });

        // Blur-in on each char (same as hero name)
        requestAnimationFrame(() => {
          const chars = heading.querySelectorAll(".split-char");
          if (chars.length) {
            gsap.fromTo(
              chars,
              { filter: "blur(8px)" },
              {
                filter: "blur(0px)",
                duration: 1,
                stagger: 0.025,
                ease: "power3.out",
              },
            );
          }
        });
      },
    });
    cleanups.push(() => st.kill());
  }

  /* — 2. Subtext fade-in — */
  const subtext = $(".contact__subtext");
  if (subtext) {
    fadeInUp([subtext], {
      y: 30,
      duration: 0.9,
      stagger: 0,
      ease: "power3.out",
      start: "top 82%",
    });
  }

  /* — 3. Email: magnetic — */
  const email = $(".contact__email");
  if (email) {
    cleanups.push(makeMagnetic(email, { strength: 0.3, radius: 120 }));

    fadeInUp([email], {
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      start: "top 85%",
    });
  }

  /* — 4. Social links: magnetic + fade-in — */
  const socials = $$(".contact__social-link");

  if (socials.length) {
    fadeInUp(socials, {
      y: 20,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
      start: "top 88%",
    });
  }

  socials.forEach((link) => {
    cleanups.push(makeMagnetic(link, { strength: 0.2, radius: 80 }));
  });

  /* — 5. Marquee — continuous infinite scroll — */
  const row1 = $(".contact__marquee--row1");
  const row2 = $(".contact__marquee--row2");

  if (row1) {
    const tw1 = gsap.to(row1, {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1,
    });
    cleanups.push(() => tw1.kill());
  }
  if (row2) {
    const tw2 = gsap.fromTo(
      row2,
      { xPercent: -50 },
      {
        xPercent: 0,
        duration: 40,
        ease: "none",
        repeat: -1,
      },
    );
    cleanups.push(() => tw2.kill());
  }

  /* — 6. Live local time clock — */
  const clockEl = document.getElementById("footer-clock");
  if (clockEl) {
    let clockRunning = true;

    const updateClock = () => {
      if (!clockRunning) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      clockEl.textContent = `${hh}:${mm}:${ss}`;
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    cleanups.push(() => {
      clockRunning = false;
      clearInterval(clockInterval);
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
  };
}
