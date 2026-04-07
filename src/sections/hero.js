/**
 * Hero Section — Cinematic text reveal with "Enzo Tedeschi" + tagline
 * Video background with dark overlay, vignette, and mouse-following glow
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateHeroText } from "../animations/textReveal.js";
import { $ } from "../utils/dom.js";
import heroVideo from "../assets/breakdownastronauta.mp4";

gsap.registerPlugin(ScrollTrigger);

export function renderHero() {
  return `
    <section class="hero" id="hero">
      <div class="hero-video-wrap">
        <video class="hero-video" src="${heroVideo}" autoplay muted loop playsinline></video>
        <div class="hero-video-overlay"></div>
        <div class="hero-video-darken"></div>
      </div>
      <div class="hero-vignette"></div>
      <div class="hero__content">
        <h1 class="hero__name gs-reveal">Enzo Tedeschi</h1>
        <p class="hero__tagline gs-reveal">Where code meets cinema</p>
        <div class="hero__cta">
          <a href="#manifesto" class="btn btn--outline">Explore <span class="btn__arrow">&darr;</span></a>
        </div>
      </div>
      <div class="hero__scroll-indicator">
        <div class="hero__scroll-line"></div>
        <span class="hero__scroll-text">Scroll</span>
      </div>
    </section>
  `;
}

export function initHero() {
  const name = $(".hero__name");
  const tagline = $(".hero__tagline");
  const scrollIndicator = $(".hero__scroll-indicator");

  // Speed up the hero video
  const video = $(".hero-video");
  if (video) video.playbackRate = 1.8;

  // Master timeline for hero entrance
  const tl = gsap.timeline({ delay: 0.5 });

  // Animate name — chars reveal
  tl.add(() => {
    animateHeroText(name, {
      type: "chars",
      duration: 1,
      stagger: 0.04,
      y: 80,
      ease: "power3.inOut",
    });
  });

  // Animate tagline — words reveal, slightly delayed
  tl.add(() => {
    animateHeroText(tagline, {
      type: "words",
      duration: 0.8,
      stagger: 0.08,
      y: 30,
      ease: "power3.out",
    });
  }, "-=0.5");

  // Fade in CTA button
  const heroCta = $(".hero__cta");
  if (heroCta) {
    gsap.set(heroCta, { opacity: 0, y: 20 });
    tl.to(
      heroCta,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.3",
    );
  }

  // Fade in scroll indicator
  tl.to(
    scrollIndicator,
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    },
    "-=0.6",
  );

  // Parallax scroll indicator — fades out as user scrolls
  gsap.to(scrollIndicator, {
    opacity: 0,
    y: -20,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "20% top",
      scrub: true,
    },
  });

  // ─── Scroll-driven cinematic exit ───

  const videoWrap = $(".hero-video-wrap");
  const darken = $(".hero-video-darken");

  // 1) Video parallax zoom + blur
  if (videoWrap) {
    gsap.to(videoWrap, {
      scale: 1.15,
      filter: "blur(6px)",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // 2) Progressive darkening on scroll
  if (darken) {
    gsap.to(darken, {
      opacity: 0.7,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "30% top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // 3) Name + Tagline exit — reverse of entrance, registered after entrance completes
  tl.add(() => {
    // Name chars: entrance was y:80 → 0, so exit is 0 → y:80
    const nameChars = name ? name.querySelectorAll(".split-char") : [];
    if (nameChars.length) {
      gsap.to(nameChars, {
        y: 80,
        opacity: 0,
        stagger: 0.04,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: ".hero",
          start: "10% top",
          end: "50% top",
          scrub: true,
        },
      });
    }

    // Tagline words: entrance was y:30 → 0, so exit is 0 → y:30
    const taglineWords = tagline
      ? tagline.querySelectorAll(".split-word-inner")
      : [];
    if (taglineWords.length) {
      gsap.to(taglineWords, {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "10% top",
          end: "45% top",
          scrub: true,
        },
      });
    }

    // CTA: entrance was y:20, opacity:0 → visible, so exit reverses
    if (heroCta) {
      gsap.to(heroCta, {
        y: 20,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "10% top",
          end: "40% top",
          scrub: true,
        },
      });
    }
  });
}
