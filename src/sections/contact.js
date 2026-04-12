import { fadeInUp } from "../animations/scrollAnimations.js";
import { $$ } from "../utils/dom.js";
import { t } from "../i18n/i18n.js";

export function renderContact() {
  const currentYear = new Date().getFullYear();

  return `
    <section class="contact" id="contact">
      <div class="contact__content">
        <h2 class="contact__heading">${t("contact.heading", "Let's work together")}</h2>
        <p class="contact__subtext">
          ${t("contact.subtext", "Got a project in mind, a collaboration idea, or just want to say hi? I'm always open to new opportunities.")}
        </p>
        <a href="mailto:tedeschi.enzo@outlook.it" class="contact__email">tedeschi.enzo@outlook.it</a>
        <div class="contact__socials">
          <a href="https://www.instagram.com/enzotedeschi.art/" class="contact__social-link" target="_blank" rel="noopener">Instagram</a>
          <a href="https://github.com/enzotedeschi-dev" class="contact__social-link" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </section>
    <footer class="footer">
      <span class="footer__text">© ${currentYear} ${t("contact.footer.copyright", "Enzo Tedeschi")}</span>
      <span class="footer__text">${t("contact.footer.credit", "Designed & built by me")}</span>
    </footer>
  `;
}

export function initContact() {
  const elements = $$(
    ".contact__heading, .contact__subtext, .contact__email, .contact__socials",
  );
  fadeInUp(elements, {
    y: 40,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    start: "top 80%",
  });
}
