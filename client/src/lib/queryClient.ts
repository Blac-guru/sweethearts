import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// src/lib/queryClient.ts
export async function apiRequest(
  method: string,
  path: string,
  body?: any,
  token?: string
): Promise<Response> {
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only attach Content-Type if we will send JSON (not FormData)
  const isFormData = body instanceof FormData;

  const opts: RequestInit = {
    method,
    headers,
  };

  // Attach body only for non-GET/HEAD methods
  if (method !== "GET" && method !== "HEAD" && typeof body !== "undefined") {
    if (isFormData) {
      // For FormData do not set Content-Type (browser sets boundary)
      opts.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      opts.body = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  return fetch(path, opts);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
