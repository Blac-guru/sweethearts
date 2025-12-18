import { useMemo, useState, useEffect } from "react";
import { useConversationsQuery } from "@/hooks/use-chat.js";
import { getTestUserId } from "@/lib/chat-api";
import { ChatDialog } from "@/components/chat-dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { HairdresserWithLocation } from "@shared/schema";

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
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(
    null
  );
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
          const res = await fetch(`/api/hairdressers/${id}`);
          if (res.ok) {
            const profile = await res.json();
            return { id, data: profile };
          }
        } catch (err) {
          console.warn(`Failed to fetch profile for ${id}:`, err);
        }
        return null;
      })
    ).then((results) => {
      const map: Record<string, HairdresserWithLocation> = {};
      results.forEach((r) => {
        if (r && r.data) {
          map[r.id] = r.data;
        }
      });
      console.log("Loaded participants:", map);
      setParticipants(map);
    });
  }, [data, myId]);

  const list = useMemo(() => {
    return (data || []).map((c) => {
      const otherId =
        (c.participantIds || []).find((p) => p !== myId) || "unknown";
      const participant = participants[otherId];
      const label =
        participant?.nickName ||
        participant?.fullName ||
        (otherId.startsWith("guest-") ? otherId : otherId);

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
      };
    });
  }, [data, myId, participants]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chats</h1>
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

      <div className="space-y-3">
        {list.map((c) => (
          <Card key={c.conversationId} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground">
                  Last activity:{" "}
                  {c.lastMessageAt
                    ? formatRelativeTime(c.lastMessageAt)
                    : "n/a"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setSelected({ id: c.otherId, name: c.label })}
                >
                  Open
                </Button>
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
      />
    </div>
  );
}
