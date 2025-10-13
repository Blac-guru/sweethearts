import { z } from "zod";
import Timestamp from "firebase-admin/firestore";

/* ---------------- USERS ---------------- */
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6), // enforce a min length
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export type User = {
  id: string;
  username: string;
  password: string; // hashed before saving
};

/* ---------------- LOCATIONS ---------------- */
export type Town = {
  id: number;
  name: string;
  estates?: Estate[];
};

export type Estate = {
  id: number;
  townId: number;
  name: string;
  subEstates?: SubEstate[];
};

export type SubEstate = {
  id: number;
  estateId: number;
  name: string;
};

/* ---------------- VERIFICATION ---------------- */
// ✅ New structure for verification data attached to a Hairdresser
export interface VerificationData {
  country?: string;
  idNumber?: string;
  idFront?: string; // Cloudinary URL
  idBack?: string;  // Cloudinary URL
  selfie?: string;  // Cloudinary URL
  status?: "pending" | "approved" | "rejected";
  submittedAt?: string; // ISO string for time of submission
  reviewedAt?: string;  // Optional - when admin approves/rejects
  reviewerId?: string;  // Optional - admin who reviewed
  rejectionReason?: string; // Optional
}

/* ---------------- HAIRDRESSERS ---------------- */
export const insertHairdresserSchema = z.object({
  fullName: z.string().min(1),
  nickName: z.string().min(1),
  age: z.string().min(1),
  gender: z.string().min(1),
  orientation: z.string().min(1),
  phoneNumber: z.string().min(1),
  views: z.number().optional(),
  whatsappNumber: z.string().optional(),
  email: z.string().optional(),
  townId: z.number(),
  estateId: z.number(),
  subEstateId: z.number(),
  services: z.array(z.string()),
  isAdult: z.boolean().optional(),

  // Firestore will just store strings (URLs or Base64)
  profilePhoto: z.string().nullable().optional(),
  serviceImages: z.array(z.string()).optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  isPaid: z.boolean().optional(),
  paymentReference: z.string().optional(),
  paymentDate: z.date().optional(),
  nextPaymentDate: z.date().optional(),
  nextPaymentFee: z.number().optional(),
  registrationFee: z.number().optional(),
  membershipPlan: z.string(),

  // 🔹 new field for ownership
  firebaseUid: z.string().optional(),

  // ✅ new verification section
  verification: z
    .object({
      country: z.string().optional(),
      idNumber: z.string().optional(),
      idFront: z.string().optional(),
      idBack: z.string().optional(),
      selfie: z.string().optional(),
      status: z.enum(["pending", "approved", "rejected"]).optional(),
      submittedAt: z.string().optional(),
      reviewedAt: z.string().optional(),
      reviewerId: z.string().optional(),
      rejectionReason: z.string().optional(),
    })
    .optional(),
});

export type InsertHairdresser = z.infer<typeof insertHairdresserSchema>;

export type Hairdresser = {
  id: string;
  fullName: string;
  nickName: string;
  age: string;
  gender: string;
  orientation: string;
  phoneNumber: string;
  whatsappNumber?: string | null;
  email?: string | null;
  townId: number;
  views?: number;
  estateId: number;
  subEstateId: number;
  services: string[];
  profilePhoto?: string | null;
  serviceImages?: string[];
  createdAt: Date;
  updatedAt?: Date;
  isPaid: boolean;
  paymentReference?: string | null;
  paymentDate?: Date | null;
  registrationFee: number;
  nextPaymentDate?: Date | null;
  nextPaymentFee?: number | null;
  membershipPlan: string;
  firebaseUid: string | null;
  isAdult: boolean;

  // ✅ new optional verification data
  verification?: VerificationData;
};

/* ---------------- COMPOSITE ---------------- */
export type HairdresserWithLocation = Hairdresser & {
  town: Town;
  estate: Estate;
  subEstate: SubEstate;
};

/* ---------------- BLOGS ---------------- */
export const insertBlogSchema = z.object({
  title: z.string().min(1),
  businessName: z.string().min(1),
  content: z.string().min(1),
  images: z.array(z.string()).optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  createdAt: z.date().optional(),
});

export type InsertBlog = z.infer<typeof insertBlogSchema>;

export type Blog = {
  id: string;
  title: string;
  businessName: string;
  content: string;
  images?: string[];
  contactPhone?: string | null;
  contactEmail?: string | null;
  tags?: string[];
  published?: boolean;
  createdAt: Date;
};
