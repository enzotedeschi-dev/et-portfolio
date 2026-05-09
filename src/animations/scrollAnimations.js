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

/**
 * Horizontal marquee — text scrolls horizontally tied to scroll position
 */
export function horizontalMarquee(element, options = {}) {
  const {
    speed = -150, // negative = left, positive = right
    start = "top bottom",
    end = "bottom top",
  } = options;

  gsap.to(element, {
    x: speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: 0.5,
    },
  });
}

/**
 * Counter reveal — animates a number from 0 to its value
 */
export function counterReveal(element, options = {}) {
  const {
    duration = 1.5,
    ease = "power2.out",
    start = "top 85%",
  } = options;

  const finalText = element.textContent;
  const finalNum = parseInt(finalText, 10);
  if (isNaN(finalNum)) return;

  const prefix = finalText.replace(/\d+/, "");
  const padLength = finalText.match(/\d+/)?.[0]?.length || 0;

  const obj = { val: 0 };

  gsap.to(obj, {
    val: finalNum,
    duration,
    ease,
    scrollTrigger: {
      trigger: element,
      start,
      once: true,
    },
    onUpdate: () => {
      element.textContent =
        String(Math.round(obj.val)).padStart(padLength, "0") + prefix.trim();
    },
  });
}
