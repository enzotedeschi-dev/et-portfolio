/**
 * Projects Data
 * Organized by category — each with its own schema
 * Replace placeholder content with your real work
 */

import astronautaVideo from "../assets/breakdownastronauta.mp4";
import unrealVideo from "../assets/videos/progettounreal/FilmatoFinito.mp4";
import cgEnvVideo from "../assets/FinishedCGEnvironment_CompressedDefinitivo.mp4";
import autosortImg from "../assets/autosort/autosort.png";
import legrandtabouImg from "../assets/dev/legrandtabou-site.png";
import imediatopImg from "../assets/dev/imediatop-site.png";
import trullidigiuliaImg from "../assets/dev/trullidigiulia_site.png";

import renderProfumo1 from "../assets/profumo/renderprofumo1.jpg";
import renderProfumo2 from "../assets/profumo/renderprofumo2.jpg";
import renderProfumo3 from "../assets/profumo/renderprofumo3.jpg";
import profumoVideo from "../assets/videoprofumocompressodefinitivo.mp4";
import leucaFinalVideo from "../assets/LEUCASIASPOTCOMPRESSED.mp4";
import flipFluidsVideo from "../assets/output_ULTRA_LIGHT.mp4";
import profumoPoster from "../assets/renderprofumoposter.jpg";
import flipFluidsPoster from "../assets/frame_leucasiabreakdown_14.png";

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
      title: "Astronaut Live-Action",
      description:
        "Live-action greenscreen integration of an astronaut into a fully crafted CG environment.",
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
      title: "CG Environment",
      description:
        "Full CG environment created in Blender with final compositing and color grading in DaVinci Resolve.",
      tags: ["Blender", "DaVinci Resolve"],
      video: cgEnvVideo,
      poster: null,
      breakdown: null,
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
    renders: [
      {
        id: "3d-profumo",
        title: "Perfume Product Film",
        description:
          "A polished 3D product film created for G. Inglese, designed to translate the brand's refined identity into a digital advertising piece for premium product communication. The spot focuses on material detail, warm reflections, controlled lighting, camera rhythm, and a visual language that gives the bottle a cinematic presence. Every element is shaped to make the product feel tactile, elegant, and campaign-ready.",
        tags: ["Product CGI", "Lighting", "Lookdev", "Final Render"],
        video: profumoVideo,
        poster: profumoPoster,
        images: [renderProfumo1, renderProfumo2, renderProfumo3],
      },
      {
        id: "3d-flipfluids",
        title: "Fluid Simulation Breakdown",
        description:
          "A commercial-style product shot created for G. Inglese, built around simulated liquid motion and a refined product reveal. The interactive wipe compares the finished film with the technical breakdown, showing how fluid dynamics, lighting, render control, compositing, and final grading come together in the final spot. It is meant to show both the polished advertising result and the technical process behind the image.",
        tags: ["FLIP Fluids", "Simulation", "Blender", "Breakdown"],
        finalVideo: leucaFinalVideo,
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
