// server/firebase.ts
import admin from "firebase-admin";

function parseServiceAccountFromEnv() {
  // Option A: full JSON in FIREBASE_SERVICE_ACCOUNT (stringified JSON)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err);
    }
  }

  // Option B: individual env vars
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
    return {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: privateKey,
    };
  }

  // Option C: local file (development)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const local = require("../sweetheart.json");
    return local;
  } catch (err) {
    console.warn("No local service account file found at ./sweetheart_key.json");
    return null;
  }
}

const serviceAccount = parseServiceAccountFromEnv();

if (!serviceAccount) {
  console.error("No Firebase service account available. Please set FIREBASE_SERVICE_ACCOUNT or individual FIREBASE_* env vars.");
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    });
  } else {
    // fallback to default credentials (may fail in many environments)
    try {
      admin.initializeApp();
    } catch (err) {
      console.error("Failed to initialize firebase admin:", err);
      // do not throw here — let functions handle missing DB with friendly errors
    }
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
