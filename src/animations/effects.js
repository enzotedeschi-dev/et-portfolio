/**
 * Visual Effects — Grain, mouse glow, ambient orbs
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $ } from '../utils/dom.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Add film grain overlay to the page
 */
export function initGrain() {
  const grain = document.createElement('div')
  grain.className = 'grain-overlay'
  grain.setAttribute('aria-hidden', 'true')
  document.body.appendChild(grain)
}

/**
 * Mouse-following glow on the hero section
 */
export function initHeroGlow() {
  const hero = $('#hero')
  if (!hero) return

  const glow = document.createElement('div')
  glow.className = 'hero-glow'
  glow.innerHTML = '<div class="hero-glow__circle"></div>'
  hero.appendChild(glow)

  const circle = $('.hero-glow__circle')

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    gsap.to(circle, {
      left: x,
      top: y,
      duration: 0.8,
      ease: 'power2.out',
    })
  })

  hero.addEventListener('mouseleave', () => {
    gsap.to(circle, {
      left: '50%',
      top: '50%',
      duration: 1.2,
      ease: 'power3.out',
    })
  })
}

/**
 * Ambient floating glow orbs on a section
 */
export function initAmbientOrbs(sectionSelector) {
  const section = $(sectionSelector)
  if (!section) return

  const orbsContainer = document.createElement('div')
  orbsContainer.className = 'ambient-orbs'
  orbsContainer.setAttribute('aria-hidden', 'true')
  orbsContainer.innerHTML = `
    <div class="ambient-orb ambient-orb--1"></div>
    <div class="ambient-orb ambient-orb--2"></div>
    <div class="ambient-orb ambient-orb--3"></div>
  `
  section.prepend(orbsContainer)

  const orbs = orbsContainer.querySelectorAll('.ambient-orb')

  // Animate orbs when section enters viewport
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    onEnter: () => {
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          opacity: 1,
          duration: 2,
          delay: i * 0.3,
          ease: 'power2.out',
        })

        // Slow floating animation
        gsap.to(orb, {
          x: `random(-40, 40)`,
          y: `random(-30, 30)`,
          duration: `random(6, 10)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.5,
        })
      })
    },
    once: true,
  })
}

/**
 * Add dot grid background to a section
 */
export function initDotGrid(sectionSelector) {
  const section = $(sectionSelector)
  if (!section) return

  const grid = document.createElement('div')
  grid.className = 'dot-grid-bg'
  grid.setAttribute('aria-hidden', 'true')
  section.prepend(grid)
}

/**
 * Add scanlines texture to a section
 */
export function initLinesTexture(sectionSelector) {
  const section = $(sectionSelector)
  if (!section) return

  const lines = document.createElement('div')
  lines.className = 'lines-texture'
  lines.setAttribute('aria-hidden', 'true')
  section.prepend(lines)
}
