import type { MetadataRoute } from "next";
import { lessons } from "@/lib/lessons";

const baseUrl = "https://alifya.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/lessons`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/progress`, changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    ...pages,
    ...lessons.map((lesson) => ({ url: `${baseUrl}/lessons/${lesson.id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
