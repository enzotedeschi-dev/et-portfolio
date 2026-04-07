/**
 * Text Reveal Animations
 * Split text into chars/words/lines and animate them
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Split text element into individual spans for animation
 * @param {HTMLElement} element
 * @param {'chars' | 'words' | 'lines'} type
 * @returns {HTMLElement[]} array of created spans
 */
export function splitText(element, type = 'chars') {
  const text = element.textContent
  element.setAttribute('aria-label', text)
  element.innerHTML = ''

  if (type === 'chars') {
    const chars = text.split('')
    return chars.map(char => {
      const span = document.createElement('span')
      span.className = 'split-char'
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.setAttribute('aria-hidden', 'true')
      element.appendChild(span)
      return span
    })
  }

  if (type === 'words') {
    const words = text.split(' ')
    return words.map((word, i) => {
      const span = document.createElement('span')
      span.className = 'split-word'
      span.style.display = 'inline-block'
      span.setAttribute('aria-hidden', 'true')

      const inner = document.createElement('span')
      inner.className = 'split-word-inner'
      inner.textContent = word
      inner.style.display = 'inline-block'
      span.appendChild(inner)

      element.appendChild(span)

      if (i < words.length - 1) {
        const space = document.createElement('span')
        space.innerHTML = '&nbsp;'
        space.style.display = 'inline-block'
        element.appendChild(space)
      }

      return inner
    })
  }

  if (type === 'lines') {
    const lines = text.split('\n')
    return lines.map(line => {
      const wrapper = document.createElement('span')
      wrapper.className = 'split-line-wrapper'
      wrapper.style.display = 'block'
      wrapper.style.overflow = 'hidden'

      const inner = document.createElement('span')
      inner.className = 'split-line'
      inner.textContent = line
      inner.style.display = 'block'
      inner.setAttribute('aria-hidden', 'true')

      wrapper.appendChild(inner)
      element.appendChild(wrapper)
      return inner
    })
  }

  return []
}

/**
 * Animate hero text — chars reveal from bottom with stagger
 */
export function animateHeroText(element, options = {}) {
  const {
    type = 'chars',
    duration = 1,
    stagger = 0.03,
    delay = 0,
    y = 60,
    ease = 'power4.out',
  } = options

  const targets = splitText(element, type)
  element.style.visibility = 'visible'

  return gsap.from(targets, {
    y,
    opacity: 0,
    duration,
    stagger,
    delay,
    ease,
  })
}

/**
 * Animate text on scroll — words fade in as user scrolls
 */
export function animateScrollText(element, options = {}) {
  const {
    type = 'words',
    duration = 0.8,
    stagger = 0.05,
    y = 30,
    ease = 'power3.out',
    start = 'top 80%',
  } = options

  const targets = splitText(element, type)
  element.style.visibility = 'visible'

  return gsap.from(targets, {
    y,
    opacity: 0,
    duration,
    stagger,
    ease,
    scrollTrigger: {
      trigger: element,
      start,
      toggleActions: 'play none none none',
    },
  })
}
