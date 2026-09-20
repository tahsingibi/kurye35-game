import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kurye 35: İzmir Vardiyası",
    short_name: "Kurye 35",
    description: "İzmir trafiğinde gündüzden geceye motosikletli kurye vardiyası.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#020305",
    theme_color: "#050608",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
