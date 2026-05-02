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
import legrandtabouImg from "../assets/dev/legrandtabou-site.png";
import imediatopImg from "../assets/dev/imediatop-site.png";
import trullidigiuliaImg from "../assets/dev/trullidigiulia_site.png";

import renderProfumo1 from "../assets/profumo/renderprofumo1.jpg";
import renderProfumo2 from "../assets/profumo/renderprofumo2.jpg";
import renderProfumo3 from "../assets/profumo/renderprofumo3.jpg";
import profumoVideo from "../assets/videoprofumocompressodefinitivo.mp4";
import flipFluidsVideo from "../assets/output_ULTRA_LIGHT.mp4";
import profumoPoster from "../assets/renderprofumoposter.jpg";
import flipFluidsPoster from "../assets/frame_leucasiabreakdown_14.png";
import houseModel from "../assets/house/house3dmodelcompressed.glb?url";

import productPhoto1 from "../assets/photos/fotoprofumi1_def_compressed.jpg";
import productPhoto2 from "../assets/photos/fotoprofumi3_compressed.jpg";
import productPhoto3 from "../assets/photos/fotoprofumi4_def_compressed.jpg";
import naturePhoto1 from "../assets/photos/IMG_7849-2-refined_compressed.jpg";
import naturePhoto2 from "../assets/photos/IMG_8031-compressed.jpg";
import naturePhoto3 from "../assets/photos/IMG_8172-compressed.jpg";
import naturePhoto4 from "../assets/photos/IMG_8252-compressed.jpg";
import naturePhoto5 from "../assets/photos/Ninfe_compressed.jpg";

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
      preview: "image",
      screenshot: legrandtabouImg,
    },
    {
      id: "dev-2",
      title: "iMediaTop",
      description: "Website design and development for iMediaTop.",
      stack: ["HTML", "CSS", "JavaScript"],
      url: "https://www.imediatop.it/",
      github: null,
      preview: "image",
      screenshot: imediatopImg,
    },
    {
      id: "dev-4",
      title: "Trulli di Giulia",
      description: "Website design and development for Trulli di Giulia.",
      stack: ["HTML", "CSS", "JavaScript"],
      url: "https://www.trullidigiulia.com/",
      github: null,
      preview: "image",
      screenshot: trullidigiuliaImg,
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
      id: "photo-products",
      title: "Products",
      description:
        "Product photography — sculpting form, texture, and presence with light, both in studio and on location.",
      images: [productPhoto1, productPhoto2, productPhoto3],
    },
    {
      id: "photo-nature",
      title: "Nature & Wildlife",
      description:
        "Quiet observations from the outdoors — patience, instinct, and the right frame.",
      images: [
        naturePhoto2,
        naturePhoto1,
        naturePhoto3,
        naturePhoto4,
        naturePhoto5,
      ],
    },
  ],
};
