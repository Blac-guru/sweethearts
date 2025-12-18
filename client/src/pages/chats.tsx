import { useMemo, useState, useEffect } from "react";
import { useConversationsQuery } from "@/hooks/use-chat.js";
import { getTestUserId, getApiBase } from "@/lib/chat-api";
import { ChatDialog } from "@/components/chat-dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar.jsx";
import { HairdresserWithLocation } from "@shared/schema";
import { MessageSquare, ChevronRight } from "lucide-react";
import Navbar from "@/components/navbar";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

  // For older dates, show the actual date
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: diffDay > 365 ? "numeric" : undefined,
  });
}

export default function ChatsPage() {
  const { data, isLoading, isError, error, refetch } = useConversationsQuery();
  const myId = getTestUserId();
  const [selected, setSelected] = useState<{
    id: string;
    name: string;
    photo?: string;
  } | null>(null);
  const [participants, setParticipants] = useState<
    Record<string, HairdresserWithLocation>
  >({});

  useEffect(() => {
    if (!data || data.length === 0) return;
    const allParticipantIds = Array.from(
      new Set(
        data.flatMap((c) => c.participantIds || []).filter((id) => id !== myId)
      )
    );

    Promise.all(
      allParticipantIds.map(async (id) => {
        try {
          const url = `${getApiBase()}/hairdressers/${id}`;
          console.log(`[Chat] Fetching profile for ${id} from ${url}`);
          const res = await fetch(url);

          if (res.ok) {
            const profile = await res.json();
            console.log(`[Chat] ✓ Got profile for ${id}:`, {
              name: profile.nickName || profile.fullName,
              hasPhoto: !!profile.profilePhoto,
            });
            return { id, data: profile };
          } else {
            const text = await res.text().catch(() => "");
            console.warn(
              `[Chat] ✗ Failed to fetch ${id}: ${res.status} ${res.statusText}`,
              text.slice(0, 100)
            );
          }
        } catch (err) {
          console.warn(`[Chat] ✗ Error fetching profile for ${id}:`, err);
        }
        return null;
      })
    ).then((results) => {
      const map: Record<string, HairdresserWithLocation> = {};
      const loaded = [];
      const failed = [];

      results.forEach((r) => {
        if (r && r.data) {
          map[r.id] = r.data;
          loaded.push(r.id);
        } else if (r) {
          failed.push(r.id);
        }
      });

      console.log(
        `[Chat] Loaded ${loaded.length}/${allParticipantIds.length} participants. Failed: ${failed.length}`
      );
      setParticipants(map);
    });
  }, [data, myId]);

  const list = useMemo(() => {
    return (data || []).map((c) => {
      const otherId =
        (c.participantIds || []).find((p) => p !== myId) || "unknown";
      const participant = participants[otherId];
      // Fallback label chain: nickName > fullName > "User" (since all have a profile in chats)
      const label =
        participant?.nickName ||
        participant?.fullName ||
        (otherId.startsWith("guest-") ? "Guest User" : "User");

      let lastMessageAt: Date | undefined;
      if (c.lastMessageAt) {
        try {
          // Handle Firestore timestamp object
          const rawDate = c.lastMessageAt as any;
          let d: Date | undefined;

          if (rawDate._seconds !== undefined) {
            // Firestore Timestamp object
            d = new Date(rawDate._seconds * 1000);
          } else if (
            typeof rawDate === "string" ||
            typeof rawDate === "number"
          ) {
            d = new Date(rawDate);
          } else if (rawDate instanceof Date) {
            d = rawDate;
          } else if (rawDate.toDate && typeof rawDate.toDate === "function") {
            // Firestore Timestamp with toDate method
            d = rawDate.toDate();
          }

          lastMessageAt = d && !isNaN(d.getTime()) ? d : undefined;
        } catch {
          lastMessageAt = undefined;
        }
      }

      return {
        conversationId: c.id,
        otherId,
        label,
        lastMessageAt,
        profilePhoto: participant?.profilePhoto || null,
        fullName: participant?.fullName || null,
        nickName: participant?.nickName || null,
      };
    });
  }, [data, myId, participants]);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Navbar />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Messages
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chat with your matches
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}
      {isError && (
        <div className="text-sm text-destructive">
          {(error as any)?.message || "Failed to load"}
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No conversations yet. Start one from a profile.
        </div>
      )}

      <div className="space-y-2">
        {list.map((c) => (
          <Card
            key={c.conversationId}
            className="p-4 cursor-pointer transition-all hover:shadow-md hover:bg-accent group"
            onClick={() =>
              setSelected({
                id: c.otherId,
                name: c.label,
                photo: c.profilePhoto || undefined,
              })
            }
          >
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={c.profilePhoto || ""} alt={c.label} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white font-bold">
                    {c.label.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">
                    {c.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.lastMessageAt
                      ? formatRelativeTime(c.lastMessageAt)
                      : "No messages yet"}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <ChatDialog
        open={Boolean(selected)}
        onOpenChange={(o) => !o && setSelected(null)}
        recipientId={selected?.id}
        recipientName={selected?.name || "Chat"}
        recipientPhoto={selected?.photo}
      />
    </div>
  );
}
