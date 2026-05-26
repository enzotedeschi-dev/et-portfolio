# Enzo Tedeschi — Portfolio

**Creative Developer & VFX Artist**

Live: [enzotedeschi.studio](https://www.enzotedeschi.studio/)

A premium portfolio built from scratch focusing on cinematic aesthetics, extreme performance, and custom interactive experiences. Zero frameworks, just vanilla JavaScript with modern build tooling.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?logo=greensock&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## Features

### Sections

- **Hero** — Cinematic entrance featuring a real-time WebGL volumetric light beam (Three.js), procedural FBM noise, and a custom CRT-style timecode ticker.
- **Manifesto** — Typographic reveal driven by scroll interactions.
- **Disciplines** — Animated cards with asymmetric reveals showcasing skills and tools.
- **VFX** — Video projects with scroll-triggered autoplay and native fullscreen support.
- **Development** — Interactive preview cards showcasing web projects with direct GitHub links.
- **Photography** — Premium editorial mosaic grid with a custom vanilla JS lightbox and context-aware cursors.
- **About & Contact** — Bio section with image reveals, and a clean contact footer.

### Technical Excellence

- **Zero frameworks** — Pure vanilla JS. Architecture based on mount/unmount patterns similar to React, but hand-written for maximum control.
- **Three.js Volumetric Light** — Custom fragment shaders for procedural godrays, atmospheric scattering, and per-pixel dithering. Automatically scales down pixel density on mobile for butter-smooth 60fps.
- **GSAP + ScrollTrigger** — Scroll-driven animations, parallax, cinematic reveals, and staggered entrances.
- **Velocity Scroll** — Custom Lenis integration that skews and stretches DOM elements dynamically based on scroll speed.
- **Custom Cursor** — Context-aware magnetic cursor (View, Play, Open) that survives component re-renders.
- **Performance First** — 
  - Automated `sharp` image pipeline for WebP conversion (saving >90% bandwidth).
  - Code-splitting via Vite/Rolldown (Three.js and GSAP isolated in chunks).
  - IntersectionObserver system to pause WebGL and animations when off-screen.
  - Centralized GSAP ticker loop to prevent RAF (Request Animation Frame) memory leaks.
- **i18n** — Full bilingual support (English/Italian) with instantaneous JSON-based swapping without page reloads.

### Architecture

```
src/
├── animations/      # GSAP, Velocity Scroll, Custom Cursor, WebGL Hero Light
├── data/            # JSON structures for VFX, Dev, and Photography projects
├── i18n/            # Translation engine and en.json/it.json
├── sections/        # Section renderers and logic (Hero, VFX, Dev, Photo...)
├── styles/          # Modular CSS architecture
├── utils/           # Performance manager, DOM helpers
└── main.js          # Main orchestrator (handles routing and memory cleanup)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Optimize heavy assets (PNG/JPG -> WebP)
npm run optimize-images

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Tech Stack

| Category       | Tools                      |
| -------------- | -------------------------- |
| **Build**      | Vite, Sharp                |
| **WebGL/3D**   | Three.js, Custom GLSL      |
| **Animation**  | GSAP, ScrollTrigger, Lenis |
| **Languages**  | JavaScript, HTML, CSS      |

---

## Author

**Enzo Tedeschi**

---

## License

All rights reserved.

This code is provided for viewing and educational purposes only.
You are not allowed to copy, modify, distribute, or use any part of this code for commercial or personal projects without explicit permission.
