// api/index.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { applyRoutes } from "./routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
