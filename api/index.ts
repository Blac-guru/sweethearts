// api/index.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { applyRoutes } from "./routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic CORS handling for cross-origin client calls (e.g., Vercel domains)
app.use((req: any, res: any, next: any) => {
  const allowed: string[] = [];
  if (process.env.CLIENT_BASE_URL) allowed.push(process.env.CLIENT_BASE_URL);
  // Common defaults
  allowed.push("https://hiresweetheart.co.ke");
  allowed.push("http://localhost:3000");
  allowed.push("http://localhost:5173");

  const origin = req.headers.origin as string | undefined;
  const allowOrigin =
    origin && allowed.includes(origin) ? origin : allowed[0] || "*";

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-user-id"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

applyRoutes(app);

// minimal error guard (keeps JSON shape consistent)
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err?.status || err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Let Express handle the request
export default function handler(req: VercelRequest, res: VercelResponse) {
  return (app as any)(req, res);
}
