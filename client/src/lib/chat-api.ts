import { apiRequest } from "@/lib/queryClient.js";
import { Conversation, Message } from "@shared/schema";

export function getTestUserId(): string {
  const key = "chat_test_user_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `guest-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
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
