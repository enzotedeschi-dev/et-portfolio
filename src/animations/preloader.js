import { gsap } from "gsap";

export function createPreloader() {
  const preloader = document.createElement("div");
  preloader.className = "preloader";
  preloader.innerHTML = `
    <div class="preloader__logo">ET</div>
    <div class="preloader__line"></div>
    <div class="preloader__tagline">Creative Developer & Visual Artist</div>
  `;
  document.body.prepend(preloader);
  return preloader;
}

export function playIntro(preloader) {
  return new Promise((resolve) => {
    const logo = preloader.querySelector(".preloader__logo");
    const line = preloader.querySelector(".preloader__line");
    const tagline = preloader.querySelector(".preloader__tagline");

    const tl = gsap.timeline({
      onComplete: () => {
        preloader.remove();
        resolve();
      },
    });

    tl.to(logo, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    });

    tl.to(line, {
      scaleX: 1,
      duration: 0.6,
      ease: "power3.inOut",
    }, "-=0.3");

    tl.to(tagline, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.2");

    tl.to({}, { duration: 0.4 });

    tl.to(logo, {
      y: -40,
      opacity: 0,
      duration: 0.5,
      ease: "power3.in",
    });

    tl.to([line, tagline], {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, "-=0.4");

    tl.to(preloader, {
      yPercent: -100,
      duration: 0.7,
      ease: "power3.inOut",
    }, "-=0.1");
  });
}
