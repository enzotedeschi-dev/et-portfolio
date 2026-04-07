/**
 * Navbar
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$ } from "../utils/dom.js";
import { stopScroll, startScroll } from "../animations/smoothScroll.js";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "VFX", href: "#vfx" },
  { label: "Development", href: "#development" },
  { label: "Photography", href: "#photography" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function renderNavbar() {
  return `
    <nav class="navbar" id="navbar">
      <a href="#" class="navbar__logo">ET</a>
      <button class="navbar__toggle" id="nav-toggle" aria-label="Toggle menu" aria-controls="nav-overlay" aria-expanded="false">
        <span class="navbar__toggle-line"></span>
        <span class="navbar__toggle-line"></span>
        <span class="navbar__toggle-line"></span>
      </button>
    </nav>

    <div class="nav-overlay" id="nav-overlay">
      <ul class="nav-overlay__list">
        ${NAV_LINKS.map(
          (link, i) => `
          <li>
            <a href="${link.href}" class="nav-overlay__link">
              <span class="nav-overlay__number">${String(i + 1).padStart(2, "0")}</span>${link.label}
            </a>
          </li>
        `,
        ).join("")}
      </ul>
    </div>
  `;
}

export function initNavbar() {
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
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
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

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      const scrollY = self.scroll();
      if (scrollY > 100) {
        if (scrollY > lastScroll && !isOpen) {
          navbar.classList.add("navbar--hidden");
        } else {
          navbar.classList.remove("navbar--hidden");
        }
      } else {
        navbar.classList.remove("navbar--hidden");
      }
      lastScroll = scrollY;
    },
  });
}
