import astronautaVideo from "../assets/astronautavfxcompresso.mp4";
import unrealVideo from "../assets/videos/progettounreal/FilmatoFinito.mp4";
import cgEnvVideo from "../assets/FinishedCGEnvironment_CompressedDefinitivo.mp4";
import autosortImg from "../assets/autosort/autosort.webp";
import legrandtabouImg from "../assets/dev/legrandtabou-site.webp";
import imediatopImg from "../assets/dev/imediatop-site.webp";
import trullidigiuliaImg from "../assets/dev/trullidigiulia_site.webp";
import cgEnvSolidVideo from "../assets/solidcompressedoutput.mp4";


import profumoVideo from "../assets/videoprofumocompressodefinitivo.mp4";
import leucaFinalVideo from "../assets/LEUCASIASPOTCOMPRESSED.mp4";

import profumoPoster from "../assets/renderprofumoposter.jpg";
import flipFluidsPoster from "../assets/frame_leucasiabreakdown_14.png";

import productPhoto1 from "../assets/photos/fotoprofumi1_def_compressed.webp";
import productPhoto2 from "../assets/photos/fotoprofumi3_compressed.webp";
import productPhoto3 from "../assets/photos/fotoprofumi4_def_compressed.webp";
import naturePhoto1 from "../assets/photos/IMG_7849-2-refined_compressed.webp";
import naturePhoto2 from "../assets/photos/IMG_8031-compressed.webp";
import naturePhoto3 from "../assets/photos/IMG_8172-compressed.webp";
import naturePhoto4 from "../assets/photos/IMG_8252-compressed.webp";
import naturePhoto5 from "../assets/photos/Ninfe_compressed.webp";

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
      video: cgEnvSolidVideo,
      finalVideo: cgEnvVideo,
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
        title: "Odorata Ginestra",
        description:
          "A CG commercial created for the Odorata Ginestra fragrance by G. Inglese, designed to translate the brand's elegant identity into a cinematic advertising piece. Materials, reflections, lighting, and camera movements are carefully crafted to enhance the bottle's presence and convey a warm, refined, and immersive sensation. Every detail contributes to building a premium product image, tailored for contemporary and impactful visual communication.",
        tags: ["Modeling", "Shading", "Lighting", "Rendering", "Compositing", "Lookdev"],
        video: profumoVideo,
        poster: profumoPoster,

      },
      {
        id: "3d-flipfluids",
        title: "Leucasia",
        description:
          "A CG commercial created for the Leucasia fragrance, where fluid simulation, cinematic lighting, and attention to detail come together to elevate the product in an elegant and immersive way. The project explores the entire creative and technical production process, from fluid simulation to final rendering and color correction, with the goal of creating a visual with strong aesthetic and atmospheric impact.",
        tags: ["Modeling", "Shading", "Lighting", "Rendering", "Compositing", "Fluid Simulation"],
        video: leucaFinalVideo,
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
