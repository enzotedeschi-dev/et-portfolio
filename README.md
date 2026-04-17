# Enzo Tedeschi — Portfolio

**Creative Developer & Visual Artist**

Live: [enzotedeschi.studio](https://www.enzotedeschi.studio/)

A personal portfolio built from scratch — no templates, no frameworks, just vanilla JavaScript with modern tooling. Designed to showcase work across VFX, 3D modeling, web development, and video production.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?logo=greensock&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## Features

### Sections

- **Hero** — Cinematic entrance with video background, character-by-character text reveal, and scroll-driven parallax
- **Disciplines** — Animated cards with asymmetric reveals showcasing skills and tools
- **VFX** — Video projects with scroll-triggered autoplay, side-by-side breakdowns, and native fullscreen support
- **3D Modeling** — Interactive Three.js model viewer (desktop) with OrbitControls, Draco/Meshopt compression, and lazy initialization on scroll; image carousel fallback on mobile
- **Renders** — Click-to-play video renders with poster thumbnails
- **Development** — Live iframe previews of web projects and GitHub links
- **About** — Bio section with clip-path photo reveal and staggered animations
- **Contact** — Email and social links with fade-in animations

### Technical

- **Zero frameworks** — Pure vanilla JS, no React/Vue/Angular
- **Vite** — Fast dev server and optimized production builds
- **Three.js** — GLTF model loading with Draco and Meshopt decompression, custom lighting rig, auto-rotation, IntersectionObserver for lazy rendering
- **GSAP + ScrollTrigger** — Scroll-driven animations, parallax, cinematic reveals, staggered entrances
- **Lenis** — Smooth scrolling with GSAP integration
- **i18n** — Full bilingual support (English/Italian) with JSON translation files and localStorage persistence
- **Responsive** — Mobile-first approach with adaptive layouts; 3D viewer replaced by image carousel on mobile to prevent crashes
- **SEO** — Open Graph, Twitter Card meta tags, full favicon set, semantic HTML
- **Performance** — Lazy loading images/videos, `preload="metadata"` for video thumbnails, IntersectionObserver for deferred Three.js initialization, click-to-play for heavy video content

### Architecture

```
src/
├── animations/      # GSAP animation modules (scroll, preloader, hero text)
├── assets/          # Videos, images, 3D models (.glb)
├── data/            # Project data (VFX, dev, modeling, photography)
├── i18n/            # Translation files (en.json, it.json) and i18n engine
├── sections/        # Section renderers and initializers
├── styles/          # Modular CSS (base, layout, sections, effects)
├── three/           # Three.js viewer setup
├── utils/           # DOM helpers
└── main.js          # Entry point — orchestrates everything
```

---

## Getting Started

```bash
# Install dependencies
npm install

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
| **Build**      | Vite                       |
| **3D**         | Three.js, Draco, Meshopt   |
| **Animation**  | GSAP, ScrollTrigger, Lenis |
| **Languages**  | JavaScript, HTML, CSS      |
| **Deployment** | Vercel                     |

---

## Author

**Enzo Tedeschi**

---

## License

All rights reserved.

This code is provided for viewing and educational purposes only.
You are not allowed to copy, modify, distribute, or use any part of this code for commercial or personal projects without explicit permission.
