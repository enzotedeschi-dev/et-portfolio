/**
 * DOM Utility helpers
 * Shortcuts to avoid document.querySelector everywhere
 */

export const $ = (selector, parent = document) => parent.querySelector(selector)
export const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]
