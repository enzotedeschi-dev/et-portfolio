/**
 * DOM Utility helpers
 * Shortcuts to avoid document.querySelector everywhere
 */

export const $ = (selector, parent = document) => parent.querySelector(selector)
export const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag)

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value
    } else if (key === 'innerHTML') {
      el.innerHTML = value
    } else if (key === 'textContent') {
      el.textContent = value
    } else if (key.startsWith('data')) {
      el.setAttribute(key.replace(/([A-Z])/g, '-$1').toLowerCase(), value)
    } else {
      el.setAttribute(key, value)
    }
  })

  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child))
    } else if (child instanceof HTMLElement) {
      el.appendChild(child)
    }
  })

  return el
}

export function htmlToElement(html) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}
