/**
 * Photography Section — premium editorial mosaic with lightbox
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
import { t } from "../i18n/i18n.js";
import { stopScroll, startScroll } from "../animations/smoothScroll.js";

gsap.registerPlugin(ScrollTrigger);

export function renderPhotography() {
  const categories = projects.photography;

  return `
    <section class="photography" id="photography">
      <div class="container">
        <div class="section-header">
          <span class="section-label">${t("photo.label", "03 / Lens")}</span>
          <h2 class="section-title">${t("photo.title", "Photography")}</h2>
        </div>

        ${categories
          .map((cat, idx) => {
            const titleKey = `photo.${cat.id}.title`;
            const descKey = `photo.${cat.id}.description`;
            return `
          <article class="photo-category" data-category="${cat.id}">
            <header class="photo-category__header">
              <span class="photo-category__index">${String(idx + 1).padStart(2, "0")}</span>
              <div class="photo-category__heading">
                <h3 class="photo-category__title">${t(titleKey, cat.title)}</h3>
                <p class="photo-category__description">${t(descKey, cat.description)}</p>
              </div>
            </header>
            <div class="photo-mosaic photo-mosaic--${cat.id}">
              ${cat.images
                .map(
                  (src, i) => `
                <button
                  type="button"
                  class="photo-mosaic__item"
                  data-category="${cat.id}"
                  data-index="${i}"
                  aria-label="${t(titleKey, cat.title)} — ${i + 1}"
                >
                  <img src="${src}" alt="${t(titleKey, cat.title)} — ${i + 1}" loading="lazy" decoding="async" />
                </button>
              `,
                )
                .join("")}
            </div>
          </article>
        `;
          })
          .join("")}
      </div>

      <div class="photo-lightbox" id="photo-lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="${t("photo.lightbox.label", "Photo viewer")}">
        <button type="button" class="photo-lightbox__close" id="photo-lightbox-close" aria-label="${t("photo.lightbox.close", "Close")}">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.6" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" />
          </svg>
        </button>
        <button type="button" class="photo-lightbox__nav photo-lightbox__nav--prev" id="photo-lightbox-prev" aria-label="${t("photo.lightbox.prev", "Previous")}">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="1.6" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button type="button" class="photo-lightbox__nav photo-lightbox__nav--next" id="photo-lightbox-next" aria-label="${t("photo.lightbox.next", "Next")}">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="1.6" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <figure class="photo-lightbox__stage">
          <img class="photo-lightbox__img" id="photo-lightbox-img" alt="" />
          <figcaption class="photo-lightbox__caption">
            <span class="photo-lightbox__counter" id="photo-lightbox-counter"></span>
          </figcaption>
        </figure>
      </div>
    </section>
  `;
}

export function initPhotography() {
  const header = $(".photography .section-header");
  if (header) cinematicHeader(header);

  const categories = $$(".photo-category");
  categories.forEach((cat) => {
    fadeInUp(cat.querySelector(".photo-category__header"), {
      y: 30,
      duration: 0.8,
      start: "top 85%",
    });

    staggerIn(cat, ".photo-mosaic__item", {
      y: 30,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      start: "top 80%",
    });
  });

  initLightbox();
}

function initLightbox() {
  const lightbox = $("#photo-lightbox");
  const imgEl = $("#photo-lightbox-img");
  const counter = $("#photo-lightbox-counter");
  const closeBtn = $("#photo-lightbox-close");
  const prevBtn = $("#photo-lightbox-prev");
  const nextBtn = $("#photo-lightbox-next");
  if (!lightbox || !imgEl) return;

  const items = $$(".photo-mosaic__item");
  let currentIndex = 0;
  let lastFocused = null;

  const flatList = items.map((btn) => ({
    src: btn.querySelector("img").src,
    alt: btn.querySelector("img").alt,
  }));

  const open = (index) => {
    currentIndex = index;
    lastFocused = document.activeElement;
    showImage(currentIndex);
    lightbox.classList.add("photo-lightbox--open");
    lightbox.setAttribute("aria-hidden", "false");
    stopScroll();
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  };

  const close = () => {
    lightbox.classList.remove("photo-lightbox--open");
    lightbox.setAttribute("aria-hidden", "true");
    startScroll();
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  };

  const showImage = (index) => {
    const total = flatList.length;
    currentIndex = (index + total) % total;
    const item = flatList[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    counter.textContent = `${currentIndex + 1} / ${total}`;
  };

  const next = () => showImage(currentIndex + 1);
  const prev = () => showImage(currentIndex - 1);

  const onKeydown = (e) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  };

  items.forEach((btn, i) => {
    btn.addEventListener("click", () => open(i));
  });

  closeBtn.addEventListener("click", close);
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
}
