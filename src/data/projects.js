/**
 * Projects Data
 * Organized by category — each with its own schema
 * Replace placeholder content with your real work
 */

import astronautaVideo from "../assets/breakdownastronauta.mp4";
import unrealVideo from "../assets/videos/progettounreal/FilmatoFinito.mp4";
import keyingVideo from "../assets/videos/greenscreencomp/keying.mp4";
import keyingBefore from "../assets/videos/greenscreencomp/before.png";
import keyingAfter from "../assets/videos/greenscreencomp/after.png";
import autosortImg from "../assets/autosort/autosort.png";

import renderProfumo1 from "../assets/profumo/renderprofumo1.jpg";
import renderProfumo2 from "../assets/profumo/renderprofumo2.jpg";
import renderProfumo3 from "../assets/profumo/renderprofumo3.jpg";
import profumoVideo from "../assets/Finalprofumo2compresso1.mp4";
import flipFluidsVideo from "../assets/output_ULTRA_LIGHT.mp4";
import profumoPoster from "../assets/renderprofumoposter.jpg";
import flipFluidsPoster from "../assets/frame_leucasiabreakdown_14.png";
import houseModel from "../assets/house/house3dmodelcompressed.glb?url";

export const projects = {
  vfx: [
    {
      id: "vfx-1",
      title: "Astronaut Breakdown",
      description:
        "Full VFX breakdown of an astronaut composite — tracking, keying, and environment integration.",
      tags: ["Nuke", "Blender", "DaVinci Resolve", "PFTrack"],
      video: astronautaVideo,
      poster: null,
      breakdown: null,
    },
    {
      id: "vfx-2",
      title: "Unreal Cinematic",
      description:
        "Real-time cinematic environment built in Unreal Engine with compositing in Nuke and final edit in Premiere.",
      tags: ["Unreal Engine", "Nuke", "Premiere Pro"],
      video: unrealVideo,
      poster: null,
      breakdown: null,
    },
    {
      id: "vfx-3",
      title: "Green Screen Composite",
      description:
        "Clean keying and compositing of green screen footage with environment integration.",
      tags: ["Nuke"],
      video: keyingVideo,
      poster: null,
      breakdown: {
        type: "side-by-side",
        before: keyingBefore,
        after: keyingAfter,
        steps: null,
      },
    },
  ],

  development: [
    {
      id: "dev-1",
      title: "Le Grand Tabou",
      description: "Website design and development for Le Grand Tabou.",
      stack: ["HTML", "CSS", "JavaScript"],
      url: "https://www.legrandtabou.it/",
      github: null,
      preview: "iframe",
    },
    {
      id: "dev-2",
      title: "iMedia Top",
      description: "Website design and development for iMedia Top.",
      stack: ["HTML", "CSS", "JavaScript"],
      url: "https://www.imediatop.it/",
      github: null,
      preview: "iframe",
    },
    {
      id: "dev-3",
      title: "AutoSort",
      description:
        "AI-powered file organizer — scans directories and classifies files into folders automatically.",
      stack: ["Python", "AI", "CLI"],
      url: null,
      github: "https://github.com/enzotedeschi-dev/AutoSort.git",
      screenshot: autosortImg,
      preview: "image",
    },
  ],

  modeling: {
    viewer: {
      id: "3d-house",
      title: "Architectural Model",
      description:
        "Detailed architectural house model built from scratch in Autodesk Maya — geometry, materials, and scene assembly.",
      tags: ["Autodesk Maya", "3D Modeling", "Architecture"],
      model: houseModel,
    },
    renders: [
      {
        id: "3d-profumo",
        title: "Perfume Bottle",
        description:
          "Product visualization — modeled and rendered in Blender with procedural materials.",
        tags: ["Blender", "3D Rendering"],
        video: profumoVideo,
        poster: profumoPoster,
        images: [renderProfumo1, renderProfumo2, renderProfumo3],
      },
      {
        id: "3d-flipfluids",
        title: "Perfume Commercial Breakdown",
        description:
          "Commercial breakdown with FLIP Fluids simulation in Blender.",
        tags: ["Blender", "FLIP Fluids", "Simulation"],
        video: flipFluidsVideo,
        poster: flipFluidsPoster,
        images: [],
      },
    ],
  },

  photography: [
    {
      id: "photo-1",
      title: "Urban Fragments",
      description: "A study of light, geometry, and solitude in the city.",
      images: [null, null, null],
      camera: "Sony A7III",
    },
    {
      id: "photo-2",
      title: "Portraits in Contrast",
      description: "High contrast black and white portraiture.",
      images: [null, null],
      camera: "Sony A7III",
    },
    {
      id: "photo-3",
      title: "After Hours",
      description: "Night photography exploring neon, shadows, and stillness.",
      images: [null, null, null, null],
      camera: "Sony A7III",
    },
  ],
};
