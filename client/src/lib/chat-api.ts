import { apiRequest } from "@/lib/queryClient.js";
import { Conversation, Message } from "@shared/schema";
import { getAuth } from "firebase/auth";

/**
 * Logout chat user by clearing localStorage
 */
export function logoutChatUser(): void {
  localStorage.removeItem("chatUserId");
  console.log("[ChatAPI] Chat user logged out");
}

/**
 * Validate if the stored chatUserId still exists in Firestore
 */
export async function validateChatUser(): Promise<boolean> {
  const chatUserId = localStorage.getItem("chatUserId");
  if (!chatUserId) return false;

  try {
    const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";
    const response = await fetch(`${apiBase}/api/auth/me`, {
      headers: {
        "x-chat-user-id": chatUserId,
      },
    });

    if (!response.ok) {
      // User doesn't exist in Firestore, clear localStorage
      logoutChatUser();
      return false;
    }

    return true;
  } catch (err) {
    console.error("[ChatAPI] Error validating chat user:", err);
    return false;
  }
}

/**
 * Get current chat user info from API
 */
export async function getChatUserInfo(): Promise<{
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
} | null> {
  const chatUserId = localStorage.getItem("chatUserId");
  if (!chatUserId) return null;

  try {
    const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";
    const response = await fetch(`${apiBase}/api/auth/me`, {
      headers: {
        "x-chat-user-id": chatUserId,
      },
    });

    if (!response.ok) {
      logoutChatUser();
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("[ChatAPI] Error getting chat user info:", err);
    return null;
  }
}

/**
 * Check if user is authenticated (has chat user ID or is Firebase auth user)
 */
export function isUserAuthenticated(): boolean {
  // Check for chat user ID (from chat login/register)
  const chatUserId = localStorage.getItem("chatUserId");
  if (chatUserId) {
    return true;
  }

  // Check for Firebase authenticated user (profile users)
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  if (firebaseUser?.uid) {
    return true;
  }

  return false;
}

/**
 * Get current user ID - prioritizes chat user ID, then Firebase UID
 * Returns null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  // Priority 1: Chat user ID (from chat login/register)
  const chatUserId = localStorage.getItem("chatUserId");
  if (chatUserId) {
    return chatUserId;
  }

  // Priority 2: Firebase authenticated user (profile users)
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  if (firebaseUser?.uid) {
    return firebaseUser.uid;
  }

  // No authentication found
  return null;
}

export function getTestUserId(): string {
  // Priority 1: Chat user ID
  const chatUserId = localStorage.getItem("chatUserId");
  if (chatUserId) {
    return chatUserId;
  }

  // Priority 2: Firebase authenticated user
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  if (firebaseUser?.uid) {
    return firebaseUser.uid;
  }

  // Return empty string if not authenticated (endpoints will reject)
  return "";
}

export function getApiBase(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL as
    | string
    | undefined;

  console.log("API Base URL:", envBase);

  // Default for dev: use relative API path which is proxied
  if (!envBase || !envBase.trim()) return "/api";

  // Normalize provided base: ensure it includes the `/api` path suffix
  const raw = envBase.trim().replace(/\/+$/, "");
  try {
    const url = new URL(raw);
    // Strip trailing slashes in pathname
    const pathname = url.pathname.replace(/\/+$/, "");
    if (pathname === "" || pathname === "/") {
      url.pathname = "/api";
    } else if (!/\/?api$/i.test(pathname)) {
      url.pathname = pathname + "/api";
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    // If it's a relative path or invalid URL, treat as path and ensure `/api` suffix
    const path = /\/?api$/i.test(raw) ? raw : `${raw}/api`;
    return path.replace(/\/+$/, "");
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const j = await res.json().catch(() => null);
      const msg = (j && (j.error || j.message)) || res.statusText;
      throw new Error(msg);
    }
    const text = (await res.text()) || res.statusText;
    if (text.startsWith("<!DOCTYPE")) {
      throw new Error("Backend not reachable: got HTML instead of JSON");
    }
    throw new Error(text);
  }
}

export async function startConversation(
  recipientId: string
): Promise<{ conversationId: string }> {
  const res = await apiRequest(
    "POST",
    `${getApiBase()}/chats/start`,
    { recipientId },
    undefined,
    { "x-user-id": getTestUserId() }
  );
  await throwIfResNotOk(res);
  return res.json();
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await apiRequest(
    "GET",
    `${getApiBase()}/chats`,
    undefined,
    undefined,
    {
      "x-user-id": getTestUserId(),
    }
  );
  await throwIfResNotOk(res);
  return res.json();
}

export async function fetchMessages(
  conversationId: string
): Promise<Message[]> {
  const res = await apiRequest(
    "GET",
    `${getApiBase()}/chats/${conversationId}/messages`,
    undefined
  );
  await throwIfResNotOk(res);
  return res.json();
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<Message> {
  const res = await apiRequest(
    "POST",
    `${getApiBase()}/chats/${conversationId}/messages`,
    { content },
    undefined,
    { "x-user-id": getTestUserId() }
  );
  await throwIfResNotOk(res);
  return res.json();
}

export async function markMessagesAsRead(
  conversationId: string
): Promise<void> {
  const res = await apiRequest(
    "POST",
    `${getApiBase()}/chats/${conversationId}/mark-read`,
    {},
    undefined,
    { "x-user-id": getTestUserId() }
  );
  await throwIfResNotOk(res);
}

export async function getUnreadCount(conversationId: string): Promise<number> {
  const res = await apiRequest(
    "GET",
    `${getApiBase()}/chats/${conversationId}/unread-count`,
    undefined,
    undefined,
    { "x-user-id": getTestUserId() }
  );
  await throwIfResNotOk(res);
  const data = await res.json();
  return data.unreadCount || 0;
}
