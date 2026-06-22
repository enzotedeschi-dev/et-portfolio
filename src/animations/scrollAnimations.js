/**
 * Scroll Animations
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Fade in + slide up on scroll
 */
export function fadeInUp(elements, options = {}) {
  const {
    y = 60,
    duration = 1,
    stagger = 0.15,
    delay = 0,
    ease = "power3.out",
    start = "top 85%",
  } = options;

  gsap.from(elements, {
    y,
    opacity: 0,
    duration,
    stagger,
    delay,
    ease,
    scrollTrigger: {
      trigger: elements[0] || elements,
      start,
      once: true,
    },
  });
}

/**
 * Stagger children entrance
 */
export function staggerIn(parent, childSelector, options = {}) {
  const {
    y = 40,
    duration = 0.8,
    stagger = 0.1,
    ease = "power3.out",
    start = "top 80%",
  } = options;

  const children = parent.querySelectorAll(childSelector);

  gsap.from(children, {
    y,
    opacity: 0,
    duration,
    stagger,
    ease,
    scrollTrigger: {
      trigger: parent,
      start,
      once: true,
    },
  });
}

/**
 * Cinematic section header entrance
 */
export function cinematicHeader(headerEl, options = {}) {
  const { start = "top 82%" } = options;

  const label = headerEl.querySelector(".section-label");
  const title = headerEl.querySelector(".section-title");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: headerEl,
      start,
      once: true,
    },
  });

  if (label) {
    tl.from(label, {
      opacity: 0,
      x: -30,
      duration: 0.7,
      ease: "power3.out",
    });
  }

  if (title) {
    tl.from(
      title,
      {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.4",
    );
  }

  return tl;
}

/**
 * Scale-in reveal
 */
export function scaleReveal(element, options = {}) {
  const {
    scale = 0.92,
    duration = 1.2,
    ease = "power3.out",
    start = "top 85%",
  } = options;

  gsap.from(element, {
    scale,
    opacity: 0,
    duration,
    ease,
    scrollTrigger: {
      trigger: element,
      start,
      once: true,
    },
  });
}

/**
 * Clip-path reveal — wipe animation scrubbed with scroll
 * @param {HTMLElement} element
 * @param {object} options
 */
export function clipReveal(element, options = {}) {
  const {
    direction = "left", // left, right, top, bottom
    start = "top 85%",
    end = "top 40%",
    scrub = false,
  } = options;

  const clipPaths = {
    left: {
      from: "inset(0 100% 0 0)",
      to: "inset(0 0% 0 0)",
    },
    right: {
      from: "inset(0 0 0 100%)",
      to: "inset(0 0 0 0%)",
    },
    top: {
      from: "inset(100% 0 0 0)",
      to: "inset(0% 0 0 0)",
    },
    bottom: {
      from: "inset(0 0 100% 0)",
      to: "inset(0 0 0% 0)",
    },
  };

  const clip = clipPaths[direction] || clipPaths.left;

  if (scrub) {
    gsap.fromTo(
      element,
      { clipPath: clip.from },
      {
        clipPath: clip.to,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub: true,
        },
      },
    );
  } else {
    gsap.fromTo(
      element,
      { clipPath: clip.from },
      {
        clipPath: clip.to,
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: element,
          start,
          once: true,
        },
      },
    );
  }
}
