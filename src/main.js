import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import "@fontsource-variable/inter";
import "@fontsource-variable/inter/wght-italic.css";
import "@fontsource-variable/space-grotesk";

import "./styles/base.css";
import "./styles/layout.css";
import "./styles/sections/navbar.css";
import "./styles/sections/hero.css";
import "./styles/sections/manifesto.css";
import "./styles/sections/disciplines.css";
import "./styles/sections/projects.css";
import "./styles/sections/about.css";
import "./styles/sections/contact.css";
import "./styles/sections/modeling.css";
import "./styles/sections/photography.css";
import "./styles/effects.css";
import "./styles/cursor.css";
import "./styles/preloader.css";
import "./styles/scrollProgress.css";
import "./styles/backToTop.css";

import { initI18n, setLocale, getLocale } from "./i18n/i18n.js";

import { initSmoothScroll } from "./animations/smoothScroll.js";

import { initCustomCursor } from "./animations/cursor.js";

import { createPreloader, playIntro } from "./animations/preloader.js";

import { initScrollProgress } from "./animations/scrollProgress.js";

import { renderBackToTop, initBackToTop } from "./animations/backToTop.js";

import { startMonitoring } from "./utils/performanceManager.js";

import {
  addVelocitySkew,
  startVelocityScroll,
  disposeVelocityScroll,
} from "./animations/velocityScroll.js";

import { renderNavbar, initNavbar } from "./sections/navbar.js";
import { renderHero, initHero } from "./sections/hero.js";
import { renderManifesto, initManifesto } from "./sections/manifesto.js";
import { renderDisciplines, initDisciplines } from "./sections/disciplines.js";
import { renderVfx, initVfx } from "./sections/vfx.js";
import { renderDevelopment, initDevelopment } from "./sections/development.js";
import { renderPhotography, initPhotography } from "./sections/photography.js";
import { renderAbout, initAbout } from "./sections/about.js";
import { renderContact, initContact } from "./sections/contact.js";

import { $ } from "./utils/dom.js";

function render() {
  const app = $("#app");
  const divider = '<div class="section-glow-divider" aria-hidden="true"></div>';

  const mainContent = [
    renderHero(),
    divider,
    renderManifesto(),
    divider,
    renderDisciplines(),
    divider,
    renderVfx(),
    divider,
    renderDevelopment(),
    divider,
    renderPhotography(),
    divider,
    renderAbout(),
    divider,
    renderContact(),
  ].join("");

  app.innerHTML = `${renderNavbar()}<main>${mainContent}</main>${renderBackToTop()}`;
}

let globalInitDone = false;

/**
 * Cleanup registry — collects dispose functions from section init calls.
 * Called before re-init on language switch to prevent listener accumulation.
 */
const sectionCleanups = [];

function cleanupSections() {
  sectionCleanups.forEach((fn) => fn());
  sectionCleanups.length = 0;
  disposeVelocityScroll();
}

function registerCleanup(fn) {
  if (typeof fn === "function") sectionCleanups.push(fn);
}

function init() {
  if (!globalInitDone) {
    initSmoothScroll();
    initCustomCursor();
    initScrollProgress();
    startMonitoring();
    globalInitDone = true;
  }
  registerCleanup(initNavbar());
  registerCleanup(initHero());
  registerCleanup(initManifesto());
  registerCleanup(initDisciplines());
  registerCleanup(initVfx());
  registerCleanup(initDevelopment());
  registerCleanup(initPhotography());
  registerCleanup(initAbout());
  registerCleanup(initContact());
  initLangToggle();
  initVelocityEffects();
  initBackToTop();
}

/**
 * Register elements for velocity-based scroll effects
 */
function initVelocityEffects() {
  // Skew on section titles during fast scroll
  const titles = document.querySelectorAll(
    ".section-title, .manifesto__text, .contact__heading",
  );
  if (titles.length) {
    addVelocitySkew(titles, { maxSkew: 2 });
  }

  // Skew on project cards
  const cards = document.querySelectorAll(
    ".vfx-project, .dev-card",
  );
  if (cards.length) {
    addVelocitySkew(cards, { maxSkew: 1.5 });
  }

  startVelocityScroll();
}

function initLangToggle() {
  const langToggle = document.getElementById("lang-toggle");
  if (!langToggle) return;

  langToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".navbar__lang-btn");
    if (!btn) return;

    const lang = btn.dataset.lang;
    if (lang === getLocale()) return;

    const scrollY = window.scrollY;

    setLocale(lang);

    // Cleanup previous section state
    cleanupSections();
    ScrollTrigger.getAll().forEach((st) => st.kill());

    render();
    init();

    window.scrollTo(0, scrollY);
  });
}

initI18n();
const preloader = createPreloader();
render();

playIntro(preloader).then(() => {
  init();
});
