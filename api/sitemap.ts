// api/sitemap.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../server/storage.js";
import { toDateSafe } from "../server/utils/dates.js"; // ✅ helper

// Format date as YYYY-MM-DD (Google-safe, no milliseconds)
function formatLastMod(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const hairdressers = await storage.getAllHairdressersForSitemap();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${hairdressers
    .map((h) => {
      const lastmod = formatLastMod(toDateSafe(h.updatedAt));

      return `
      <url>
        <loc>https://www.hiresweetheart.co.ke/profile/${h.id}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
    })
    .join("")}
</urlset>`;

    res.status(200).setHeader("Content-Type", "application/xml; charset=UTF-8");
    res.send(xml);
  } catch (err: any) {
    console.error("Sitemap generation error:", err);
    res.status(500).send("Sitemap generation failed");
  }
}
