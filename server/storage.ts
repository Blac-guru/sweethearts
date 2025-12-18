import {
  type User,
  type InsertUser,
  type Hairdresser,
  type InsertHairdresser,
  type HairdresserWithLocation,
  Blog,
  InsertBlog,
  Verification,
} from "@shared/schema.js";
import {
  Message,
  InsertMessage,
  Conversation,
  InsertConversation,
} from "@shared/schema.js";
import bcrypt from "bcrypt";

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { db } from "./firebase.js"; // Firestore connection
import crypto from "crypto";
import {
  Town as SchemaTown,
  Estate as SchemaEstate,
  SubEstate as SchemaSubEstate,
} from "../shared/schema.js"; // adjust relative path

import { KENYA_LOCATIONS } from "../client/src/data/kenya-locations.js";

// keep your HairdresserWithLocation types untouched

import { FieldValue } from "firebase-admin/firestore";

console.log("Cloudinary env check:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.slice(0, 6) + "...",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "***" : undefined,
});

/* ---------------- CLOUDINARY CONFIG ---------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

console.log(process.env.CLOUDINARY_CLOUD_NAME || "");

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  filename: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename },
      (err, result) => {
        if (err) return reject(err);
        resolve(result?.secure_url || "");
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

/* ---------------- STORAGE IMPLEMENTATION ---------------- */
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllHairdressersForSitemap(): Promise<
    {
      id: string;
      updatedAt: Date;
      membershipPlan?: string;
      fullName?: string;
    }[]
  >;

  // Locations
  getTowns(): Promise<SchemaTown[]>;
  getEstatesByTown(townId: number): Promise<SchemaEstate[]>;
  getSubEstatesByEstate(estateId: number): Promise<SchemaSubEstate[]>;

  // Hairdressers
  createHairdresser(h: InsertHairdresser): Promise<Hairdresser>;
  getHairdresser(id: string): Promise<HairdresserWithLocation | undefined>;
  getAllHairdressers(): Promise<HairdresserWithLocation[]>;
  getAllHairdressersForSitemap(): Promise<
    {
      id: string;
      updatedAt: Date;
      membershipPlan?: string;
      fullName?: string;
    }[]
  >;
  searchHairdressers(filters: {
    townId?: number;
    estateId?: number;
    subEstateId?: number;
    services?: string[];
    search?: string;
  }): Promise<HairdresserWithLocation[]>;
  confirmPayment(
    hairdresserId: string,
    paymentReference: string
  ): Promise<Hairdresser>;
  getUnpaidHairdresser(
    id: string
  ): Promise<HairdresserWithLocation | undefined>;

  // Chat & Messaging
  createConversation(participantIds: string[]): Promise<string>; // returns conversation ID
  getConversation(conversationId: string): Promise<Conversation | undefined>;
  getConversationsBySender(senderId: string): Promise<Conversation[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  markMessageAsRead(messageId: string): Promise<void>;
}

// Check if object has 'buffer' property (Multer files)
function isMulterFile(obj: any): obj is Express.Multer.File {
  return obj && typeof obj === "object" && "buffer" in obj;
}

/* ---------------- FIRESTORE STORAGE ---------------- */
export class FirestoreStorage implements IStorage {
  private usersCollection = db.collection("users");
  private sweetheartsCollection = db.collection("sweethearts");
  private blogsCollection = db.collection("blogs");

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const data: Omit<Blog, "id"> = {
      ...insertBlog,
      images: insertBlog.images || [],
      createdAt: insertBlog.createdAt || new Date(),
      published: insertBlog.published ?? true,
    };

    const docRef = this.blogsCollection.doc();
    await docRef.set(data);
    return { ...data, id: docRef.id };
  }

  async getBlog(id: string): Promise<Blog | undefined> {
    const doc = await this.blogsCollection.doc(id).get();
    if (!doc.exists) return undefined;
    const raw = doc.data() as any;
    return {
      ...(raw as Blog),
      id: doc.id,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    };
  }

  async getAllBlogs({ onlyPublished = true } = {}): Promise<Blog[]> {
    let q = this.blogsCollection as FirebaseFirestore.Query;
    if (onlyPublished) q = q.where("published", "==", false);
    const snap = await q.orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => ({ ...(d.data() as any), id: d.id }));
  }

  async updateBlog(id: string, data: Partial<Blog>): Promise<Blog> {
    const docRef = this.blogsCollection.doc(id);
    await docRef.update(data);
    const updated = await docRef.get();
    return { ...(updated.data() as any), id: updated.id } as Blog;
  }

  async deleteBlog(id: string): Promise<void> {
    await this.blogsCollection.doc(id).delete();
  }

  async incrementProfileViews(
    hairdresserId: string,
    viewerUid?: string,
    sessionId?: string
  ) {
    try {
      const docRef = this.sweetheartsCollection.doc(hairdresserId);
      const doc = await docRef.get();

      if (!doc.exists) return;

      const data = doc.data();
      if (!data) return;

      // 🔹 Only increment if hairdresser has paid
      if (!data.isPaid) {
        console.log("Skipping view increment: profile not paid");
        return;
      }

      // 🔹 Prevent owner from incrementing their own profile
      if (viewerUid && data.firebaseUid === viewerUid) {
        console.log("Skipping view increment: viewer is the owner");
        return;
      }

      // 🔹 Deduplicate per session
      if (sessionId) {
        const sessionField = `viewSessions.${sessionId}`;
        if (data.viewSessions && data.viewSessions[sessionId]) {
          console.log("Skipping view increment: session already counted");
          return;
        }

        await docRef.update({
          views: FieldValue.increment(1),
          [sessionField]: true, // mark this session
        });
      } else {
        // Guest without session tracking → increment always
        await docRef.update({
          views: FieldValue.increment(1),
        });
      }
    } catch (err) {
      console.error("Error incrementing views:", err);
    }
  }

  async uploadFileToCloudinary(
    file: Express.Multer.File,
    folder: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (err, result) => {
          if (err) return reject(err);
          resolve(result?.secure_url || "");
        }
      );
      stream.end(file.buffer);
    });
  }

  async uploadVerificationFile(
    file: Express.Multer.File,
    folder = "hairdresser-connect/verification"
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (err, result) => {
          if (err) return reject(err);
          resolve(result?.secure_url || "");
        }
      );
      stream.end(file.buffer);
    });
  }

  /* ---------- USERS ---------- */
  async getUser(id: string): Promise<User | undefined> {
    const doc = await this.usersCollection.doc(id).get();
    return doc.exists ? (doc.data() as User) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await this.usersCollection
      .where("username", "==", username)
      .limit(1)
      .get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const existing = await this.usersCollection
      .where("username", "==", insertUser.username)
      .get();
    if (!existing.empty) throw new Error("Username already exists");

    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const newUser: User = {
      id: crypto.randomUUID(),
      username: insertUser.username,
      password: hashedPassword,
    };
    await this.usersCollection.doc(newUser.id).set(newUser);
    return newUser;
  }

  async verifyUser(username: string, password: string): Promise<User | null> {
    const snapshot = await this.usersCollection
      .where("username", "==", username)
      .limit(1)
      .get();
    if (snapshot.empty) return null;

    const user = snapshot.docs[0].data() as User;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  /* ---------- LOCATIONS ---------- */
  // Ensure returned Estates/SubEstates have townId / estateId so they match shared/schema.ts

  /* ---------- LOCATIONS ---------- */
  async getTowns(): Promise<SchemaTown[]> {
    return KENYA_LOCATIONS.flatMap((loc) =>
      loc.towns.map<SchemaTown>((t) => ({
        id: t.id,
        name: t.name,
        estates: (t.estates ?? []).map<SchemaEstate>((e) => ({
          id: e.id,
          name: e.name,
          townId: t.id,
          subEstates: (e.subEstates ?? []).map<SchemaSubEstate>((s) => ({
            id: s.id,
            name: s.name,
            estateId: e.id,
          })),
        })),
      }))
    );
  }

  async getEstatesByTown(townId: number): Promise<SchemaEstate[]> {
    const towns = await this.getTowns();
    return towns.find((t) => t.id === townId)?.estates ?? [];
  }

  async getSubEstatesByEstate(estateId: number): Promise<SchemaSubEstate[]> {
    const towns = await this.getTowns();
    const estates = towns.flatMap((t) => t.estates ?? []);
    return estates.find((e) => e.id === estateId)?.subEstates ?? [];
  }

  /* ---------- HAIRDRESSERS ---------- */
  async createHairdresser(
    insertHairdresser: InsertHairdresser
  ): Promise<Hairdresser> {
    if (!insertHairdresser.firebaseUid) {
      throw new Error("firebaseUid is required to create hairdresser");
    }

    const services = Array.isArray(insertHairdresser.services)
      ? Array.from(new Set(insertHairdresser.services))
      : [];

    const membershipPlan =
      insertHairdresser.membershipPlan?.toUpperCase() || "REGULAR";

    let nextPaymentFee = 0;
    switch (membershipPlan) {
      case "VIP":
        nextPaymentFee = 2000;
        break;
      case "PRIME":
        nextPaymentFee = 1500;
        break;
      case "REGULAR":
      default:
        nextPaymentFee = 1000;
        break;
    }

    // ✅ Default verification object (always present)
    const defaultVerification: Verification = {
      country: null,
      idType: null,
      idNumber: null,
      idFront: null,
      idBack: null,
      selfie: null,
      status: "pending",
      submittedAt: null,
    };

    const hairdresserData: Omit<Hairdresser, "id"> = {
      ...insertHairdresser,
      services,
      profilePhoto: insertHairdresser.profilePhoto || null,
      serviceImages: insertHairdresser.serviceImages || [],
      createdAt: new Date(),
      age: insertHairdresser.age ?? "0",
      isPaid: false,
      isAdult: true,
      views: 0,
      paymentReference: null,
      membershipPlan, // ✅ Use passed plan
      paymentDate: null,
      nextPaymentDate: null,
      nextPaymentFee,
      registrationFee: 500,
      firebaseUid: insertHairdresser.firebaseUid,

      // ✅ Always initialize verification properly
      verification: insertHairdresser.verification ?? defaultVerification,
      isVerified: false,
    };

    const docRef = db.collection("sweethearts").doc();
    await docRef.set(hairdresserData);

    return { ...hairdresserData, id: docRef.id };
  }

  // Example
  /* ---------- HAIRDRESSERS ---------- */
  async getHairdresser(
    id: string
  ): Promise<HairdresserWithLocation | undefined> {
    // First, try direct document ID lookup (for generic users like "hair-001")
    let doc = await this.sweetheartsCollection.doc(id).get();

    // If not found and ID looks like a firebaseUid, try querying by firebaseUid field
    if (!doc.exists) {
      console.log(
        `[Storage] Direct lookup failed for ${id}, trying firebaseUid query...`
      );
      const snapshot = await this.sweetheartsCollection
        .where("firebaseUid", "==", id)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        doc = snapshot.docs[0];
        console.log(`[Storage] Found document by firebaseUid: ${id}`);
      } else {
        console.log(`[Storage] No document found for ID or firebaseUid: ${id}`);
        return undefined;
      }
    }

    const rawData = doc.data() as any;

    // Ensure createdAt is a Date
    const createdAt =
      rawData.createdAt instanceof Date
        ? rawData.createdAt
        : rawData.createdAt
        ? new Date(rawData.createdAt)
        : new Date();

    // Flatten services array
    let services: string[] = [];
    if (Array.isArray(rawData.services)) {
      rawData.services.forEach((item: any) => {
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
    }

    // Default profile photo and serviceImages if missing
    const profilePhoto = rawData.profilePhoto || null;
    const serviceImages = Array.isArray(rawData.serviceImages)
      ? rawData.serviceImages
      : [];

    const hairdresser: Hairdresser = {
      ...rawData,
      id: doc.id,
      createdAt,
      services,
      profilePhoto,
      serviceImages,
    };

    // Add location data
    const [hd] = await this.addLocationData([hairdresser]);
    return hd;
  }

  async getHairdresserByUid(
    uid: string
  ): Promise<HairdresserWithLocation | undefined> {
    const cleanUid = String(uid).trim();
    const snapshot = await this.sweetheartsCollection
      .where("firebaseUid", "==", cleanUid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.warn(`No hairdresser found for UID: ${cleanUid}`);
      return undefined;
    }

    const doc = snapshot.docs[0];
    const rawData = doc.data() as Hairdresser;

    const hairdresser: Hairdresser = {
      ...rawData,
      id: doc.id,
    };

    const [hd] = await this.addLocationData([hairdresser]);
    return hd;
  }

  // in FirestoreStorage class
  // inside FirestoreStorage class
  async updateHairdresser(
    id: string,
    data: Partial<Hairdresser>
  ): Promise<Hairdresser> {
    const docRef = this.sweetheartsCollection.doc(id);
    const snapshotBefore = await docRef.get();

    if (!snapshotBefore.exists) {
      throw new Error("Hairdresser not found before update");
    }

    const existingData = snapshotBefore.data() as Partial<Hairdresser>;

    const dataToUpdate = {
      ...data,
      updatedAt: new Date(),
    };
    await docRef.set(dataToUpdate, { merge: true });

    // Fetch updated document
    const snapshot = await docRef.get();
    if (!snapshot.exists) throw new Error("Hairdresser not found after update");

    const raw = snapshot.data() as any;

    const createdAt =
      raw.createdAt instanceof Date
        ? raw.createdAt
        : raw.createdAt
        ? new Date(raw.createdAt)
        : new Date();

    const updatedAt =
      raw.updatedAt instanceof Date
        ? raw.updatedAt
        : raw.updatedAt
        ? new Date(raw.updatedAt)
        : undefined;

    return {
      ...(raw as Hairdresser),
      id: snapshot.id,
      createdAt,
      updatedAt,
    } as Hairdresser;
  }

  async updateHairdresserVerification(
    id: string,
    data: {
      country?: string;
      idNumber?: string;
      idFront?: string;
      idBack?: string;
      selfie?: string;
      status?: "pending" | "approved" | "rejected";
    }
  ) {
    const docRef = this.sweetheartsCollection.doc(id);
    const updateData = {
      verification: {
        ...data,
        submittedAt: new Date().toISOString(),
      },
    };
    await docRef.set(updateData, { merge: true });
  }

  async getAllHairdressers(): Promise<HairdresserWithLocation[]> {
    const snapshot = await this.sweetheartsCollection
      .where("isPaid", "==", true) // ✅ only fetch paid users
      .get();

    // Map and filter logic handled in code (not Firestore query)
    const hairdressers: Hairdresser[] = snapshot.docs
      .map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }))
      // ✅ Only show verified OR legacy profiles (no isVerified field)
      .filter((hairdresser: any) => {
        // If isVerified is undefined → assume old user → include
        if (hairdresser.isVerified === undefined) return true;
        // Include only verified ones
        return hairdresser.isVerified === true;
      });

    return this.addLocationData(hairdressers);
  }

  /**
   * Get all hairdressers (paid only) for sitemap generation
   * Returns only essential fields to keep sitemap lean
   */
  // inside FirestoreStorage class

  async getAllHairdressersForSitemap(): Promise<
    {
      id: string;
      updatedAt: Date;
      membershipPlan?: string;
      fullName?: string;
    }[]
  > {
    const snapshot = await this.sweetheartsCollection
      .where("isPaid", "==", true) // include only paid profiles that are visible
      .get();

    return snapshot.docs.map((doc: any) => {
      const d = doc.data() as any;

      // prefer an explicit updatedAt if present; otherwise fallback to paymentDate, createdAt
      const updatedAt = d.updatedAt
        ? new Date(d.updatedAt)
        : d.paymentDate
        ? new Date(d.paymentDate)
        : d.createdAt
        ? new Date(d.createdAt)
        : new Date();

      return {
        id: doc.id,
        updatedAt,
        membershipPlan: d.membershipPlan || undefined,
        fullName: d.fullName || d.nickName || undefined,
      };
    });
  }

  private async addLocationData(
    hairdressers: Hairdresser[]
  ): Promise<HairdresserWithLocation[]> {
    const towns = await this.getTowns();
    const estates = towns.flatMap((t) => t.estates ?? []);
    const subEstates = estates.flatMap((e) => e.subEstates ?? []);

    return hairdressers.map((h) => {
      const town =
        towns.find((t) => t.id === h.townId) ??
        ({ id: h.townId, name: "Unknown Town", estates: [] } as SchemaTown);

      const estate =
        estates.find((e) => e.id === h.estateId && e.townId === h.townId) ??
        ({
          id: h.estateId,
          townId: h.townId,
          name: "Unknown Estate",
          subEstates: [],
        } as SchemaEstate);

      const subEstate =
        subEstates.find(
          (s) => s.id === h.subEstateId && s.estateId === h.estateId
        ) ??
        ({
          id: h.subEstateId,
          estateId: h.estateId,
          name: "Unknown SubEstate",
        } as SchemaSubEstate);

      // normalize services
      let services: string[] = [];
      if (Array.isArray(h.services)) {
        h.services.forEach((item) => {
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
      }

      return {
        ...h,
        town,
        estate,
        subEstate,
        services,
        profilePhoto: (h as any).profilePhoto || null,
        serviceImages: Array.isArray((h as any).serviceImages)
          ? (h as any).serviceImages
          : [],
      } as HairdresserWithLocation;
    });
  }

  async searchHairdressers(filters: any): Promise<HairdresserWithLocation[]> {
    let query: FirebaseFirestore.Query = this.sweetheartsCollection;

    if (filters.townId) {
      query = query.where("townId", "==", filters.townId);
    }
    if (filters.estateId) {
      query = query.where("estateId", "==", filters.estateId);
    }
    if (filters.subEstateId) {
      query = query.where("subEstateId", "==", filters.subEstateId);
    }

    const snapshot = await query.get();
    let results = snapshot.docs.map((doc) => doc.data() as Hairdresser);

    // 🔹 Services filter (array-contains-any)
    if (filters.services?.length > 0) {
      results = results.filter((h) =>
        h.services?.some((s) => filters.services.includes(s))
      );
    }

    // 🔹 Text search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (h) =>
          h.fullName.toLowerCase().includes(searchLower) ||
          h.nickName?.toLowerCase().includes(searchLower) ||
          h.services?.some((s) => s.toLowerCase().includes(searchLower))
      );
    }

    return this.addLocationData(results);
  }

  async confirmPayment(
    hairdresserId: string,
    paymentReference: string
  ): Promise<Hairdresser> {
    const doc = await this.sweetheartsCollection.doc(hairdresserId).get();
    if (!doc.exists) throw new Error("Hairdresser not found");

    const h = doc.data() as Hairdresser;
    h.isPaid = true;
    h.paymentReference = paymentReference;
    h.paymentDate = new Date();

    await this.sweetheartsCollection.doc(h.id).set(h);
    return h;
  }

  async getUnpaidHairdresser(
    id: string
  ): Promise<HairdresserWithLocation | undefined> {
    const doc = await this.sweetheartsCollection.doc(id).get();
    if (!doc.exists) return undefined;

    const h = doc.data() as Hairdresser;
    if (h.isPaid) return undefined;

    // 🔹 Reuse the same addLocationData logic for consistency
    const [hd] = await this.addLocationData([{ ...h, id: doc.id }]);
    return hd;
  }

  /* ========== CHAT & MESSAGING ========== */
  async createConversation(participantIds: string[]): Promise<string> {
    const sortedIds = participantIds.sort();
    const conversationId = sortedIds.join("_");

    const existing = await db
      .collection("conversations")
      .doc(conversationId)
      .get();

    if (existing.exists) {
      return conversationId;
    }

    const conversation: Omit<Conversation, "lastMessage"> = {
      id: conversationId,
      participantIds: sortedIds,
      lastMessageAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("conversations").doc(conversationId).set(conversation);
    return conversationId;
  }

  async getConversation(
    conversationId: string
  ): Promise<Conversation | undefined> {
    const doc = await db.collection("conversations").doc(conversationId).get();
    if (!doc.exists) return undefined;
    return { ...(doc.data() as any), id: doc.id } as Conversation;
  }

  async getConversationsBySender(senderId: string): Promise<Conversation[]> {
    const snap = await db
      .collection("conversations")
      .where("participantIds", "array-contains", senderId)
      .orderBy("updatedAt", "desc")
      .get();

    return snap.docs.map(
      (d) => ({ ...(d.data() as any), id: d.id } as Conversation)
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const messageData: Omit<Message, "id"> = {
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt || new Date(),
      readAt: message.readAt || null,
    };

    const docRef = db
      .collection("conversations")
      .doc(message.conversationId)
      .collection("messages")
      .doc();

    await docRef.set(messageData);

    await db.collection("conversations").doc(message.conversationId).update({
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    });

    return { ...messageData, id: docRef.id };
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    const snap = await db
      .collection("conversations")
      .doc(conversationId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .get();

    return snap.docs.map(
      (d) => ({ ...(d.data() as any), id: d.id } as Message)
    );
  }

  async markMessageAsRead(_messageId: string): Promise<void> {
    // Placeholder: message documents are scoped by conversationId; implement when structure is available
    return;
  }
}

/* ---------------- EXPORT INSTANCE ---------------- */

export const storage = new FirestoreStorage();
