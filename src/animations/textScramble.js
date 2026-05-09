/**
 * Text Scramble Effect
 * Randomizes characters before resolving to the final text.
 * Used on hover for nav links, logo, social links.
 */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

/**
 * Scramble text content on hover
 * @param {HTMLElement} el - Element with text to scramble
 * @param {object} options
 * @returns {() => void} cleanup
 */
export function addTextScramble(el, options = {}) {
  if (!el) return () => {};

  const {
    duration = 600, // ms total
    fps = 30,
    chars = CHARS,
  } = options;

  const originalText = el.textContent;
  let frameId = null;
  let isAnimating = false;

  const scramble = () => {
    if (isAnimating) return;
    isAnimating = true;

    const text = originalText;
    const totalFrames = Math.ceil((duration / 1000) * fps);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (progress > i / text.length) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      el.textContent = result;

      if (frame >= totalFrames) {
        clearInterval(interval);
        el.textContent = originalText;
        isAnimating = false;
      }
    }, 1000 / fps);

    frameId = interval;
  };

  const reset = () => {
    if (frameId) clearInterval(frameId);
    el.textContent = originalText;
    isAnimating = false;
  };

  el.addEventListener("mouseenter", scramble);
  el.addEventListener("mouseleave", reset);

  return () => {
    el.removeEventListener("mouseenter", scramble);
    el.removeEventListener("mouseleave", reset);
    reset();
  };
}
