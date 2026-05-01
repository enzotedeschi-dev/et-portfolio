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
import "./styles/effects.css";
import "./styles/cursor.css";
import "./styles/preloader.css";
import "./styles/scrollProgress.css";

import { initI18n, setLocale, getLocale } from "./i18n/i18n.js";

import { initSmoothScroll } from "./animations/smoothScroll.js";

import { initCustomCursor } from "./animations/cursor.js";

import { createPreloader, playIntro } from "./animations/preloader.js";

import { initScrollProgress } from "./animations/scrollProgress.js";

import { renderNavbar, initNavbar } from "./sections/navbar.js";
import { renderHero, initHero } from "./sections/hero.js";
import { renderManifesto, initManifesto } from "./sections/manifesto.js";
import { renderDisciplines, initDisciplines } from "./sections/disciplines.js";
import { renderVfx, initVfx } from "./sections/vfx.js";
import { renderDevelopment, initDevelopment } from "./sections/development.js";
import { renderAbout, initAbout } from "./sections/about.js";
import { renderContact, initContact } from "./sections/contact.js";

import { $ } from "./utils/dom.js";

function render() {
  const app = $("#app");
  const divider = '<div class="section-glow-divider" aria-hidden="true"></div>';

  const mainContent = [
    renderHero(),
    renderManifesto(),
    divider,
    renderDisciplines(),
    divider,
    renderVfx(),
    divider,
    renderDevelopment(),
    divider,
    renderAbout(),
    divider,
    renderContact(),
  ].join("");

  app.innerHTML = `${renderNavbar()}<main>${mainContent}</main>`;
}

let globalInitDone = false;

function init() {
  if (!globalInitDone) {
    initSmoothScroll();
    initCustomCursor();
    initScrollProgress();
    globalInitDone = true;
  }
  initNavbar();
  initHero();
  initManifesto();
  initDisciplines();
  initVfx();
  initDevelopment();
  initAbout();
  initContact();
  initLangToggle();
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
