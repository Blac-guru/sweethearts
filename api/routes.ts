// server/routes.ts
import type { Express } from "express";
import { createServer } from "http";
import express from "express";
import multer from "multer";
import crypto from "crypto";
import { SitemapStream } from "sitemap";
import { createGzip } from "zlib";

import { storage } from "./storage.js";
import {
  InsertHairdresser,
  Verification,
  insertBlogSchema,
  insertHairdresserSchema,
} from "../shared/schema.js";

// top of routes.ts imports
import {
  RekognitionClient,
  CompareFacesCommand,
} from "@aws-sdk/client-rekognition";
import vision from "@google-cloud/vision"; // uses GOOGLE_APPLICATION_CREDENTIALS env var or ADC

import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { auth } from "./firebase.js";

import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export async function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // contains uid, email, etc.
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
}

function toDateSafe(value?: Date | Timestamp | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if ((value as Timestamp).toDate) return (value as Timestamp).toDate();
  return null;
}

// ---------------- MULTER CONFIG ----------------
// Use memory storage (works better with Firebase or external storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export function applyRoutes(app: Express) {
  // route - /sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const hostname =
        process.env.CLIENT_BASE_URL ||
        "https://sweetheart-next-door.vercel.app";
      const smStream = new SitemapStream({ hostname });

      // pipe sitemap -> gzip -> response
      res.writeHead(200, {
        "Content-Type": "application/xml",
        "Content-Encoding": "gzip",
      });
      const pipeline = smStream.pipe(createGzip());
      pipeline.pipe(res);

      // add static pages (adjust changefreq/priority as you like)
      const staticPages = [
        { url: "/", changefreq: "daily", priority: 1.0 },
        { url: "/register", changefreq: "daily", priority: 0.9 },
        { url: "/register/details", changefreq: "daily", priority: 0.9 },
        { url: "/contact", changefreq: "monthly", priority: 0.5 },
        { url: "/terms", changefreq: "yearly", priority: 0.2 },
        { url: "/privacy", changefreq: "yearly", priority: 0.2 },
        { url: "/parental", changefreq: "yearly", priority: 0.2 },
        { url: "/cookies", changefreq: "yearly", priority: 0.2 },
      ];
      for (const p of staticPages) smStream.write(p);

      // hairdressers from storage helper
      const items = await storage.getAllHairdressersForSitemap();
      for (const hd of items) {
        smStream.write({
          url: `/profile/${hd.id}`,
          changefreq: "daily",
          priority: hd.membershipPlan === "VIP" ? 0.9 : 0.7,
          lastmod: hd.updatedAt.toISOString(),
        } as any); // cast because some sitemap types are strict
      }

      smStream.end();
    } catch (err) {
      console.error("Failed to generate sitemap:", err);
      res.status(500).end();
    }
  });

  // ---------------- LOCATIONS ----------------

  app.get("/api/towns", async (_req, res) => {
    try {
      const towns = await storage.getTowns();
      res.json(towns);
    } catch (error) {
      console.error("Error fetching towns:", error);
      res.status(500).json({ message: "Failed to fetch towns" });
    }
  });

  app.get("/api/towns/:townId/estates", async (req, res) => {
    try {
      const townId = parseInt(req.params.townId);
      if (isNaN(townId)) {
        return res.status(400).json({ message: "Invalid town ID" });
      }
      const estates = await storage.getEstatesByTown(townId);
      res.json(estates);
    } catch (error) {
      console.error("Error fetching estates:", error);
      res.status(500).json({ message: "Failed to fetch estates" });
    }
  });

  app.get("/api/estates/:estateId/sub-estates", async (req, res) => {
    try {
      const estateId = parseInt(req.params.estateId);
      if (isNaN(estateId)) {
        return res.status(400).json({ message: "Invalid estate ID" });
      }
      const subEstates = await storage.getSubEstatesByEstate(estateId);
      res.json(subEstates);
    } catch (error) {
      console.error("Error fetching sub-estates:", error);
      res.status(500).json({ message: "Failed to fetch sub-estates" });
    }
  });

  // ---------------- HAIRDRESSERS ----------------

  // routes.ts (replace the existing handler)
  app.get("/api/hairdressers", async (req, res) => {
    try {
      const { townId, estateId, subEstateId, services, search } = req.query;
      const filters: any = {};

      if (townId && !isNaN(Number(townId))) filters.townId = Number(townId);
      if (estateId && !isNaN(Number(estateId)))
        filters.estateId = Number(estateId);
      if (subEstateId && !isNaN(Number(subEstateId)))
        filters.subEstateId = Number(subEstateId);
      if (search) filters.search = String(search);
      if (services) {
        filters.services = Array.isArray(services)
          ? (services as string[])
          : [String(services)];
      }

      // fetch either search results or all
      let hairdressers =
        Object.keys(filters).length > 0
          ? await storage.searchHairdressers(filters)
          : await storage.getAllHairdressers();

      // ---------- Normalize and sort by membershipPlan: VIP > PRIME > REGULAR ----------
      const planOrder: Record<string, number> = {
        VIP: 1,
        PRIME: 2,
        REGULAR: 3,
      };

      hairdressers.sort((a, b) => {
        const planA = (a.membershipPlan || "PRIME").toString().toUpperCase();
        const planB = (b.membershipPlan || "PRIME").toString().toUpperCase();
        const orderA = planOrder[planA] ?? 2;
        const orderB = planOrder[planB] ?? 2;
        if (orderA !== orderB) return orderA - orderB;

        // Tie-breaker: createdAt desc
        const dateA = toDateSafe(a.createdAt);
        const dateB = toDateSafe(b.createdAt);

        if (dateA && dateB) {
          return dateB.getTime() - dateA.getTime();
        }
        return 0;
      });

      // ---------- Special-case: demote one specific email to bottom of VIPs ----------
      const TARGET_EMAIL = "githinjilucy03@gmail.com";
      const targetIndex = hairdressers.findIndex(
        (h) =>
          (h.email || "").toString().toLowerCase() ===
          TARGET_EMAIL.toLowerCase()
      );

      if (targetIndex !== -1) {
        // remove target from array
        const [targetUser] = hairdressers.splice(targetIndex, 1);

        // find last VIP index in the current array
        let lastVIPIndex = -1;
        for (let i = 0; i < hairdressers.length; i++) {
          const plan = (hairdressers[i].membershipPlan || "PRIME")
            .toString()
            .toUpperCase();
          if (plan === "VIP") lastVIPIndex = i;
        }

        // compute insertion index: after last VIP, else at position 0 if no VIPs
        const insertIndex = lastVIPIndex >= 0 ? lastVIPIndex + 1 : 0;

        hairdressers.splice(insertIndex, 0, targetUser);
      }

      res.json(hairdressers);
    } catch (error) {
      console.error("Error fetching hairdressers:", error);
      res.status(500).json({ message: "Failed to fetch hairdressers" });
    }
  });

  app.get("/api/hairdressers/:id", async (req, res) => {
    try {
      const hairdresserId = req.params.id;
      console.log(`[API] Fetching hairdresser: ${hairdresserId}`);

      // 🔹 Extract viewer UID if logged in
      let viewerUid: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = await auth.verifyIdToken(token);
          viewerUid = decoded.uid;
        } catch (err) {
          console.warn("Invalid or expired token, treating as guest view");
        }
      }

      // 🔹 Session ID (from cookie or header)
      let sessionId = req.cookies?.sessionId;
      if (!sessionId) {
        sessionId = uuidv4();
        res.cookie("sessionId", sessionId, { httpOnly: true });
      }

      // ✅ Increment views only if rules pass
      await storage.incrementProfileViews(hairdresserId, viewerUid, sessionId);

      const hairdresser = await storage.getHairdresser(hairdresserId);

      if (!hairdresser) {
        console.warn(`[API] Hairdresser not found: ${hairdresserId}`);
        return res.status(404).json({ message: "Hairdresser not found" });
      }

      console.log(`[API] ✓ Found hairdresser ${hairdresserId}:`, {
        name: hairdresser.nickName || hairdresser.fullName,
        hasPhoto: !!hairdresser.profilePhoto,
      });
      res.json(hairdresser);
    } catch (err) {
      console.error("Error fetching hairdresser:", err);
      res
        .status(500)
        .json({ message: "Server error", error: (err as any)?.message });
    }
  });

  // New: get hairdresser for current authenticated firebase user
  // frontend should send Authorization: Bearer <firebase-id-token>
  app.get("/api/hairdressers/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const uid = decoded.uid;

      console.log("🔑 Firebase UID from token:", uid);

      const hairdresser = await storage.getHairdresserByUid(uid);
      console.log(
        "🎯 Found hairdresser:",
        hairdresser ? hairdresser.id : "none"
      );

      if (!hairdresser) {
        return res.status(404).json({ message: "Hairdresser not found" });
      }

      return res.json(hairdresser);
    } catch (err) {
      console.error("Error in /api/hairdressers/me:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // config / thresholds (tweak as you like)
  const FACE_SIMILARITY_THRESHOLD = Number(
    process.env.FACE_SIMILARITY_THRESHOLD ?? 80
  ); // percent
  const FACE_MINIMUM_CONFIDENCE = Number(
    process.env.FACE_MINIMUM_CONFIDENCE ?? 70
  ); // Rekognition confidence

  // initialize providers (once)
  const rekClient = new RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: process.env.AWS_ACCESS_KEY_ID
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      : undefined,
  });

  const visionClient = new vision.ImageAnnotatorClient({
    // If running on GCP with service account, set GOOGLE_APPLICATION_CREDENTIALS env var.
    // Otherwise pass credentials here: keyFilename or credentials.
  });

  // inside applyRoutes(app) — place where your other routes are defined
  app.post(
    "/api/verification",
    upload.fields([
      { name: "idFront", maxCount: 1 },
      { name: "idBack", maxCount: 1 },
      { name: "selfie", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const { country, idNumber, idType, hairdresserId } = req.body;

        if (!hairdresserId) {
          return res.status(400).json({ message: "Missing hairdresserId" });
        }

        // get files (may be undefined)
        const idFrontFile = (req.files as any)?.idFront?.[0] as
          | Express.Multer.File
          | undefined;
        const idBackFile = (req.files as any)?.idBack?.[0] as
          | Express.Multer.File
          | undefined;
        const selfieFile = (req.files as any)?.selfie?.[0] as
          | Express.Multer.File
          | undefined;

        // Upload present files to Cloudinary (parallel)
        const uploaded = await Promise.all([
          idFrontFile
            ? storage.uploadFileToCloudinary(
                idFrontFile,
                "hairdresser-connect/verification"
              )
            : null,
          idBackFile
            ? storage.uploadFileToCloudinary(
                idBackFile,
                "hairdresser-connect/verification"
              )
            : null,
          selfieFile
            ? storage.uploadFileToCloudinary(
                selfieFile,
                "hairdresser-connect/verification"
              )
            : null,
        ]);

        const [idFrontUrl, idBackUrl, selfieUrl] = uploaded;

        // Build verification object
        const verificationPayload = {
          country: country || null,
          idType: idType || null,
          idNumber: idNumber || null,
          idFront: idFrontUrl || null,
          idBack: idBackUrl || null,
          selfie: selfieUrl || null,
          status: "pending",
          submittedAt: new Date().toISOString(),
        };

        // Update the hairdresser doc with verification object
        const updated = await storage.updateHairdresser(hairdresserId, {
          verification: verificationPayload,
        });

        // Return success and the verification data (or updated doc)
        return res.status(200).json({
          message: "Verification submitted successfully",
          verification: updated.verification ?? verificationPayload,
        });
      } catch (err: any) {
        console.error("Verification upload error:", err);
        return res.status(500).json({
          message: "Failed to submit verification",
          error: err?.message,
        });
      }
    }
  );

  app.post(
    "/api/hairdressers",
    upload.fields([
      { name: "profilePhoto", maxCount: 1 },
      { name: "serviceImages", maxCount: 10 },
    ]),
    async (req, res) => {
      try {
        // ---------------- PARSE SERVICES ----------------
        let services: string[] = [];
        // req.body.services may be a string, array of strings, or not provided
        const rawServices = Array.isArray(req.body.services)
          ? req.body.services
          : req.body.services
          ? [req.body.services]
          : [];

        rawServices.forEach((item: any) => {
          if (typeof item === "string") {
            try {
              const parsed = JSON.parse(item);
              if (Array.isArray(parsed)) services.push(...parsed);
              else services.push(parsed);
            } catch {
              services.push(item);
            }
          }
        });

        // ---------------- UPLOAD PROFILE PHOTO ----------------
        let profilePhotoUrl: string | null = null;
        if (req.files && (req.files as any).profilePhoto) {
          const file = (req.files as any).profilePhoto[0];
          profilePhotoUrl = await storage.uploadFileToCloudinary(
            file,
            "hairdresser-connect/profile"
          );
        }

        // ---------------- UPLOAD SERVICE IMAGES ----------------
        let serviceImagesUrls: string[] = [];
        if (req.files && (req.files as any).serviceImages) {
          const files = (req.files as any)
            .serviceImages as Express.Multer.File[];
          serviceImagesUrls = await Promise.all(
            files.map((file) =>
              storage.uploadFileToCloudinary(
                file,
                "hairdresser-connect/services"
              )
            )
          );
        }

        // ---------------- CREATE HAIRDRESSER DATA ----------------
        const hairdresserData = {
          ...req.body,
          townId: Number(req.body.townId),
          estateId: Number(req.body.estateId),
          subEstateId: Number(req.body.subEstateId),
          profilePhoto: profilePhotoUrl, // ✅ Must be URL string
          serviceImages: serviceImagesUrls, // ✅ Must be array of strings
          services, // ✅ Flattened array
        };

        if (
          isNaN(hairdresserData.townId) ||
          isNaN(hairdresserData.estateId) ||
          isNaN(hairdresserData.subEstateId)
        ) {
          return res.status(400).json({ message: "Invalid location data" });
        }

        // ---------------- VALIDATE ----------------
        const validatedData = insertHairdresserSchema.parse(hairdresserData);

        // ---------------- SAVE ----------------
        const createdHairdresser = await storage.createHairdresser(
          validatedData
        );
        res.status(201).json(createdHairdresser);
      } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({
          message:
            error instanceof Error
              ? error.message
              : JSON.stringify(error, null, 2),
        });
      }
    }
  );

  //Auth Route
  app.post("/api/hairdressers/:id/link-auth", async (req, res) => {
    const { id } = req.params;
    const { firebaseUid } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // ✅ verify token
      const decoded = await auth.verifyIdToken(token);

      if (decoded.uid !== firebaseUid) {
        return res.status(403).json({ message: "Forbidden: UID mismatch" });
      }

      // ✅ fetch hairdresser
      const hairdresser = await storage.getHairdresser(id);
      if (!hairdresser) {
        return res.status(404).json({ message: "Hairdresser not found" });
      }

      // ✅ update firestore doc
      await storage.updateHairdresser(id, { firebaseUid });

      return res.json({ success: true, firebaseUid });
    } catch (error) {
      console.error("Error linking auth:", error);
      return res.status(500).json({ message: "Failed to link auth" });
    }
  });

  // Get hairdresser profile by Firebase UID
  app.get("/api/hairdressers/by-uid/:uid", async (req, res) => {
    try {
      const uid = req.params.uid;
      const hairdresser = await storage.getHairdresserByUid(uid);

      if (!hairdresser) {
        return res.status(404).json({ message: "Hairdresser not found" });
      }

      res.json(hairdresser);
    } catch (error) {
      console.error("Error fetching hairdresser by uid:", error);
      res.status(500).json({ message: "Failed to fetch hairdresser" });
    }
  });

  // ---------------- PAYMENTS ----------------

  // Initialize payment - returns Paystack authorization_url & reference
  // Initialize payment - returns Paystack authorization_url & reference
  app.post("/api/hairdressers/:id/initiate-payment", async (req, res) => {
    try {
      const { id } = req.params;
      const { phoneNumber, email, amount: clientAmount } = req.body;

      const hairdresser = await storage.getHairdresser(id);
      if (!hairdresser)
        return res.status(404).json({ message: "Hairdresser not found" });

      // Determine registration fee based on membership plan
      const membershipPlan = hairdresser.membershipPlan || "PRIME";
      const registrationFees: Record<string, number> = {
        REGULAR: 500,
        PRIME: 1000,
        VIP: 1500,
      };
      const amountKES = registrationFees[membershipPlan.toUpperCase()] || 1000;

      const amount = Math.round(amountKES * 100); // Paystack expects kobo

      // fallback email if none: Paystack requires an email format
      const customerEmail =
        email || hairdresser.email || `no-reply+${id}@sweetheart.local`;

      const callbackBase =
        process.env.CLIENT_BASE_URL || `http://localhost:3000`;
      const callbackUrl = `${callbackBase}/paystack-callback?hairdresserId=${encodeURIComponent(
        id
      )}`;

      const payload = {
        email: customerEmail,
        amount,
        callback_url: callbackUrl,
        metadata: {
          hairdresserId: id,
          phoneNumber: phoneNumber || null,
        },
      };

      const initRes = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await initRes.json();
      if (!initRes.ok) {
        return res.status(initRes.status).json(data);
      }
      return res.json(data);
    } catch (err) {
      console.error("initiate-payment error:", err);
      return res.status(500).json({ message: "Failed to initiate payment" });
    }
  });

  // Verify payment - called by callback
  app.post("/api/hairdressers/:id/verify-payment", async (req, res) => {
    try {
      const { id } = req.params;
      const { reference } = req.body;
      if (!reference)
        return res.status(400).json({ message: "Missing reference" });

      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(
          reference
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const json = await verifyRes.json();
      if (!verifyRes.ok) {
        return res.status(verifyRes.status).json(json);
      }

      const payData = json.data;

      if (payData.status !== "success") {
        return res
          .status(400)
          .json({ message: "Payment is not successful", data: json });
      }

      // Determine expected registration fee based on membership plan
      const hairdresser = await storage.getHairdresser(id);
      if (!hairdresser)
        return res.status(404).json({ message: "Hairdresser not found" });

      const membershipPlan = hairdresser.membershipPlan || "PRIME";
      const registrationFees: Record<string, number> = {
        REGULAR: 500,
        PRIME: 1000,
        VIP: 1500,
      };
      const expectedKES =
        registrationFees[membershipPlan.toUpperCase()] || 1000;
      const expected = Math.round(expectedKES * 100);

      if (typeof payData.amount === "number" && payData.amount < expected) {
        return res.status(400).json({
          message: "Paid amount is less than required registration fee",
          data: { expected, received: payData.amount },
        });
      }

      const paymentDate = new Date();
      const nextPaymentDate = new Date(paymentDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      await storage.updateHairdresser(id, {
        isPaid: true,
        paymentReference: reference,
        paymentDate,
        nextPaymentDate,
      });

      return res.json({ success: true, payData });
    } catch (err) {
      console.error("verify-payment error:", err);
      return res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  // Optional: webhook endpoint (recommended for production)
  // This route must be configured in Paystack dashboard to point to YOUR /api/paystack/webhook endpoint.
  // Use express.raw to receive raw body for signature verification.
  app.post(
    "/api/paystack/webhook",
    express.raw({ type: "*/*" }),
    async (req, res) => {
      try {
        const signature = (req.headers["x-paystack-signature"] || "") as string;
        const hash = crypto
          .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
          .update(req.body)
          .digest("hex");

        if (hash !== signature) {
          console.warn("Invalid Paystack webhook signature");
          return res.status(401).send("invalid signature");
        }

        const event = JSON.parse(req.body.toString());
        // Example: handle charge.success
        if (event.event === "charge.success") {
          const { reference, metadata } = event.data;
          const hairdresserId = metadata?.hairdresserId;
          if (hairdresserId) {
            await storage.updateHairdresser(hairdresserId, {
              isPaid: true,
              paymentReference: reference,
              paymentDate: new Date(),
            });
          }
        }

        // acknowledge receipt
        res.status(200).send("ok");
      } catch (err) {
        console.error("webhook error:", err);
        res.status(500).send("error");
      }
    }
  );

  // ---------------- BLOGS ----------------

  // app.get("/api/blogs", async (req, res) => {
  //   try {
  //     // optional query param: ?published=false to show all
  //     const onlyPublished =
  //       req.query && typeof req.query.published !== "undefined"
  //         ? req.query.published !== "false"
  //         : true;
  //     const blogs = await storage.getAllBlogs({ onlyPublished });
  //     res.json(blogs);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Failed to fetch blogs" });
  //   }
  // });

  // app.get("/api/blogs/:id", async (req, res) => {
  //   try {
  //     const blog = await storage.getBlog(req.params.id);
  //     if (!blog) return res.status(404).json({ message: "Not found" });
  //     res.json(blog);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Failed to fetch blog" });
  //   }
  // });

  // // create blog (multipart: images)
  // app.post("/api/blogs", upload.fields([{ name: "images", maxCount: 10 }]), async (req, res) => {
  //   try {
  //     // ---------------- FILE HANDLING ----------------
  //     let files: Express.Multer.File[] = [];

  //     // multer may set req.files as either an array (if single field) or an object keyed by fieldname
  //     if (Array.isArray((req as any).files)) {
  //       files = (req as any).files as Express.Multer.File[];
  //     } else if (req.files && typeof req.files === "object") {
  //       const filesObj = req.files as { [key: string]: Express.Multer.File[] };
  //       if (Array.isArray(filesObj["images"])) {
  //         files = filesObj["images"];
  //       } else {
  //         // gather any files present
  //         files = Object.values(filesObj).flat();
  //       }
  //     }

  //     const imagesUrls: string[] = [];
  //     for (const f of files) {
  //       const url = await storage.uploadFileToCloudinary(f, "blogs/images");
  //       imagesUrls.push(url);
  //     }

  //     // ---------------- BODY ----------------
  //     const payload = {
  //       title: req.body.title,
  //       businessName: req.body.businessName,
  //       content: req.body.content,
  //       images: imagesUrls,
  //       contactPhone: req.body.contactPhone || null,
  //       contactEmail: req.body.contactEmail || null,
  //       tags: req.body.tags
  //         ? Array.isArray(req.body.tags)
  //           ? req.body.tags
  //           : [req.body.tags]
  //         : [],
  //       published: req.body.published === "true" || req.body.published === true,
  //     };

  //     // ---------------- VALIDATION ----------------
  //     const validated = insertBlogSchema.parse({
  //       ...payload,
  //       createdAt: new Date(),
  //     });

  //     // ---------------- SAVE ----------------
  //     const created = await storage.createBlog(validated);
  //     res.status(201).json(created);
  //   } catch (error) {
  //     console.error("Create blog error:", error);
  //     res.status(400).json({
  //       message: error instanceof Error ? error.message : "Bad request",
  //     });
  //   }
  // });

  // // update blog
  // app.put("/api/blogs/:id", async (req, res) => {
  //   try {
  //     const updated = await storage.updateBlog(req.params.id, req.body);
  //     res.json(updated);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(400).json({
  //       message: err instanceof Error ? err.message : "Update failed",
  //     });
  //   }
  // });

  // // delete blog
  // app.delete("/api/blogs/:id", async (req, res) => {
  //   try {
  //     await storage.deleteBlog(req.params.id);
  //     res.json({ ok: true });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Delete failed" });
  //   }
  // });

  // ---------------- UTILITIES ----------------

  app.get("/api/placeholder/:width/:height", (req, res) => {
    const { width, height } = req.params;
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">
          ${width}×${height}
        </text>
      </svg>
    `;
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  });

  /* ========== CHAT API ENDPOINTS (Auth-optional for testing) ========== */

  app.post("/api/chats/start", async (req, res) => {
    try {
      const { recipientId } = req.body;
      const userId =
        (req as any).user?.uid ||
        (req.headers["x-user-id"] as string) ||
        (req.query.userId as string) ||
        (req.body?.userId as string);

      if (!recipientId || recipientId === userId) {
        return res.status(400).json({ error: "Invalid recipient" });
      }
      if (!userId) {
        return res.status(400).json({ error: "Missing user identity" });
      }

      const conversationId = await storage.createConversation([
        userId,
        recipientId,
      ]);
      res.json({ conversationId });
    } catch (err: any) {
      console.error("Error starting chat:", err);
      res.status(500).json({ error: err.message || "Failed to start chat" });
    }
  });

  app.get("/api/chats", async (req, res) => {
    try {
      const userId =
        (req as any).user?.uid ||
        (req.headers["x-user-id"] as string) ||
        (req.query.userId as string) ||
        (req.body?.userId as string);
      if (!userId) {
        return res.status(400).json({ error: "Missing user identity" });
      }
      const conversations = await storage.getConversationsBySender(userId);
      res.json(conversations);
    } catch (err: any) {
      console.error("Error fetching conversations:", err);
      res
        .status(500)
        .json({ error: err.message || "Failed to fetch conversations" });
    }
  });

  app.get("/api/chats/:conversationId/messages", async (req, res) => {
    try {
      const { conversationId } = req.params;
      const messages = await storage.getMessagesByConversation(conversationId);
      res.json(messages);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      res
        .status(500)
        .json({ error: err.message || "Failed to fetch messages" });
    }
  });

  app.post("/api/chats/:conversationId/messages", async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { content } = req.body;
      const userId =
        (req as any).user?.uid ||
        (req.headers["x-user-id"] as string) ||
        (req.query.userId as string) ||
        (req.body?.userId as string);

      if (!content || !content.trim()) {
        return res
          .status(400)
          .json({ error: "Message content cannot be empty" });
      }
      if (!userId) {
        return res.status(400).json({ error: "Missing user identity" });
      }

      const message = await storage.createMessage({
        conversationId,
        senderId: userId,
        content: content.trim(),
        createdAt: new Date(),
      });

      res.json(message);
    } catch (err: any) {
      console.error("Error sending message:", err);
      res.status(500).json({ error: err.message || "Failed to send message" });
    }
  });

  // ---------------- SERVER ----------------

  const httpServer = createServer(app);
  return httpServer;
}

export async function registerRoutes(app: Express) {
  applyRoutes(app);
  return { listen: () => {} } as any;
}
