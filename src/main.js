/**
 * ET Portfolio — Main Entry Point
 * Enzo Tedeschi — Creative Developer & Visual Artist
 */

// Styles
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

// Smooth scroll
import { initSmoothScroll } from "./animations/smoothScroll.js";

// Sections — render
import { renderNavbar, initNavbar } from "./sections/navbar.js";
import { renderHero, initHero } from "./sections/hero.js";
import { renderManifesto, initManifesto } from "./sections/manifesto.js";
import { renderDisciplines, initDisciplines } from "./sections/disciplines.js";
import { renderVfx, initVfx } from "./sections/vfx.js";
import { renderDevelopment, initDevelopment } from "./sections/development.js";
import { renderPhotography, initPhotography } from "./sections/photography.js";
import { renderAbout, initAbout } from "./sections/about.js";
import { renderContact, initContact } from "./sections/contact.js";

// DOM
import { $ } from "./utils/dom.js";

function render() {
  const app = $("#app");
  const divider = '<div class="section-glow-divider" aria-hidden="true"></div>';

  app.innerHTML = [
    renderNavbar(),
    renderHero(),
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
}

function init() {
  initSmoothScroll();
  initNavbar();
  initHero();
  initManifesto();
  initDisciplines();
  initVfx();
  initDevelopment();
  initPhotography();
  initAbout();
  initContact();
}

// Boot
render();
init();
