/**
 * About Section — Personal info with photo and bio
 */

import { fadeInUp, cinematicHeader } from "../animations/scrollAnimations.js";
import { $, $$ } from "../utils/dom.js";
import aboutPhoto from "../assets/enzotedeschiphoto.png";

export function renderAbout() {
  return `
    <section class="about" id="about">
      <div class="container">
        <div class="section-header">
          <span class="section-label">About</span>
          <h2 class="section-title">Who I am</h2>
        </div>
        <div class="about__content">
          <div class="about__photo">
            <img src="${aboutPhoto}" alt="Enzo Tedeschi" loading="lazy" decoding="async" />
          </div>
          <div class="about__text">
            <h3 class="about__heading">Enzo Tedeschi</h3>
            <p class="about__bio">
              I'm a 15-year-old creative developer from Italy with a passion for blending 
              visual effects, code, and cinematography. I don't just build things — I craft 
              experiences that sit at the intersection of art and technology.
            </p>
            <p class="about__bio">
              Whether it's compositing a VFX shot, coding an interactive website, 
              or directing a short film, I approach every project with the same philosophy: 
              precision in the details, boldness in the vision.
            </p>
            <div>
              <p class="about__detail"><strong>Location</strong> — Italy</p>
              <p class="about__detail"><strong>Focus</strong> — VFX, Development, Web, Photo & Video</p>
              <p class="about__detail"><strong>Available for</strong> — Freelance & Collaborations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initAbout() {
  // Cinematic section header
  const header = $(".about .section-header");
  if (header) cinematicHeader(header);

  const elements = $$(
    ".about__photo, .about__heading, .about__bio, .about__detail",
  );
  fadeInUp(elements, {
    y: 40,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out",
    start: "top 80%",
  });
}
