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
 * Parallax effect on scroll
 */
export function parallax(element, options = {}) {
  const { y = -80, start = "top bottom", end = "bottom top" } = options;

  gsap.to(element, {
    y,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: true,
    },
  });
}

/**
 * Horizontal line grow animation
 */
export function lineGrow(element, options = {}) {
  const { duration = 1.2, ease = "power3.inOut", start = "top 90%" } = options;

  gsap.from(element, {
    scaleX: 0,
    transformOrigin: "left center",
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
 * Lazy video autoplay
 */
export function lazyVideoPlay(videoElements) {
  videoElements.forEach((video) => {
    ScrollTrigger.create({
      trigger: video,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: () => video.play(),
      onLeave: () => video.pause(),
      onEnterBack: () => video.play(),
      onLeaveBack: () => video.pause(),
    });
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
 * Scrub-based parallax on elements
 */
export function scrubParallax(elements, options = {}) {
  const { yPercent = -15, start = "top bottom", end = "bottom top" } = options;

  if (elements.length !== undefined) {
    elements.forEach((el) => {
      gsap.to(el, {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      });
    });
  } else {
    gsap.to(elements, {
      yPercent,
      ease: "none",
      scrollTrigger: {
        trigger: elements,
        start,
        end,
        scrub: true,
      },
    });
  }
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
