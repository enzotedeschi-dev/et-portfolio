/**
 * Navbar — improved overlay
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$ } from "../utils/dom.js";
import { stopScroll, startScroll } from "../animations/smoothScroll.js";
import { t, getLocale } from "../i18n/i18n.js";

function getNavLinks() {
  return [
    { label: t("nav.vfx", "VFX"), href: "#vfx" },
    { label: t("nav.development", "Development"), href: "#development" },
    { label: t("nav.photography", "Photography"), href: "#photography" },
    { label: t("nav.about", "About"), href: "#about" },
    { label: t("nav.contact", "Contact"), href: "#contact" },
  ];
}

export function renderNavbar() {
  return `
    <nav class="navbar" id="navbar">
      <a href="#" class="navbar__logo">ET</a>
      <div class="navbar__actions">
        <div class="navbar__lang" id="lang-toggle">
          <button class="navbar__lang-btn${getLocale() === "en" ? " navbar__lang-btn--active" : ""}" data-lang="en">EN</button>
          <span class="navbar__lang-sep" aria-hidden="true">|</span>
          <button class="navbar__lang-btn${getLocale() === "it" ? " navbar__lang-btn--active" : ""}" data-lang="it">IT</button>
        </div>
        <button class="navbar__toggle" id="nav-toggle" aria-label="Toggle menu" aria-controls="nav-overlay" aria-expanded="false">
          <span class="navbar__toggle-line"></span>
          <span class="navbar__toggle-line"></span>
          <span class="navbar__toggle-line"></span>
        </button>
      </div>
    </nav>

    <div class="nav-overlay" id="nav-overlay">
      <ul class="nav-overlay__list">
        ${getNavLinks()
          .map(
            (link, i) => `
          <li>
            <a href="${link.href}" class="nav-overlay__link">
              <span class="nav-overlay__number">${String(i + 1).padStart(2, "0")}</span>${link.label}
            </a>
          </li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `;
}

const cleanups = [];

export function initNavbar() {
  // Cleanup previous
  cleanups.forEach((fn) => fn());
  cleanups.length = 0;

  const navbar = $("#navbar");
  const toggle = $("#nav-toggle");
  const overlay = $("#nav-overlay");
  const links = $$(".nav-overlay__link");
  let isOpen = false;
  let lastScroll = 0;

  const openMenu = () => {
    isOpen = true;
    navbar.classList.add("navbar--menu-open");
    toggle.classList.add("navbar__toggle--active");
    toggle.setAttribute("aria-expanded", "true");
    overlay.classList.add("nav-overlay--active");
    stopScroll();
    gsap.fromTo(
      links,
      { y: 40, opacity: 0, skewY: 3 },
      {
        y: 0,
        opacity: 1,
        skewY: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      },
    );
  };

  const closeMenu = () => {
    isOpen = false;
    navbar.classList.remove("navbar--menu-open");
    toggle.classList.remove("navbar__toggle--active");
    toggle.setAttribute("aria-expanded", "false");
    overlay.classList.remove("nav-overlay--active");
    startScroll();
    gsap.to(links, {
      y: -20,
      opacity: 0,
      skewY: -2,
      duration: 0.3,
      stagger: 0.04,
      ease: "power2.in",
    });
  };

  toggle.addEventListener("click", () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay && isOpen) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen) {
        closeMenu();
      }
    });
  });

  let isHidden = false;
  const setHidden = (next) => {
    if (next === isHidden) return;
    isHidden = next;
    navbar.classList.toggle("navbar--hidden", next);
  };

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      const scrollY = self.scroll();
      if (scrollY > 100) {
        setHidden(scrollY > lastScroll && !isOpen);
      } else {
        setHidden(false);
      }
      lastScroll = scrollY;
    },
  });
}
