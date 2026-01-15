import type { MetadataRoute } from "next";
import { WEDDING_INFO } from "./lib/constants";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ebe1d1",
    description: `${WEDDING_INFO.couple.groom} & ${WEDDING_INFO.couple.bride} · ${WEDDING_INFO.date.display} · ${WEDDING_INFO.venue.name}`,
    display: "browser",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icon-light-512.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "1024x1024",
        src: "/icon-light-1024.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "any",
        src: "/icon-light.svg",
        type: "image/svg+xml",
      },
      {
        purpose: "monochrome",
        sizes: "any",
        src: "/icon-dark.svg",
        type: "image/svg+xml",
      },
    ],
    name: WEDDING_INFO.couple.heading,
    short_name: WEDDING_INFO.couple.heading,
    start_url: "/",
    theme_color: "#ebe1d1",
  };
}
