import { useMemo, useState, useEffect } from "react";
import {
  useConversationsQuery,
  useConversationUnreadCount,
} from "@/hooks/use-chat.js";
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
import { Badge } from "@/components/ui/badge.jsx";
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

interface ConversationCardProps {
  conversationId: string;
  label: string;
  profilePhoto: string | null;
  lastMessageAt?: Date;
  onSelect: () => void;
}

function ConversationCard({
  conversationId,
  label,
  profilePhoto,
  lastMessageAt,
  onSelect,
}: ConversationCardProps) {
  const { data: unreadCount = 0 } = useConversationUnreadCount(conversationId);

  return (
    <Card
      className="p-4 cursor-pointer transition-all hover:shadow-md hover:bg-accent group"
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={profilePhoto || ""} alt={label} />
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white font-bold">
              {label.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground truncate">
              {label}
            </div>
            <div className="text-xs text-muted-foreground">
              {lastMessageAt
                ? formatRelativeTime(lastMessageAt)
                : "No messages yet"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {unreadCount > 0 && (
            <Badge className="bg-pink-500 hover:bg-pink-600 text-white">
              {unreadCount}
            </Badge>
          )}
          <div className="text-muted-foreground group-hover:text-foreground transition-colors">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Card>
  );
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
          // Try fetching as hairdresser first
          const hairdresserUrl = `${getApiBase()}/hairdressers/${id}`;
          console.log(
            `[Chat] Fetching profile for ${id} from ${hairdresserUrl}`
          );
          const hairdresserRes = await fetch(hairdresserUrl);

          if (hairdresserRes.ok) {
            const profile = await hairdresserRes.json();
            console.log(`[Chat] ✓ Got hairdresser profile for ${id}:`, {
              name: profile.nickName || profile.fullName,
              hasPhoto: !!profile.profilePhoto,
            });
            return { id, data: profile, type: "hairdresser" };
          }

          // If hairdresser fetch failed, try fetching as chat user
          const chatUserUrl = `${getApiBase()}/chat-users/${id}`;
          console.log(`[Chat] Trying chat user for ${id} from ${chatUserUrl}`);
          const chatUserRes = await fetch(chatUserUrl);

          if (chatUserRes.ok) {
            const chatUser = await chatUserRes.json();
            console.log(`[Chat] ✓ Got chat user for ${id}:`, {
              name: chatUser.name,
            });
            // Transform chat user to match hairdresser structure for display
            return {
              id,
              data: {
                id: chatUser.id,
                fullName: chatUser.name,
                nickName: chatUser.name,
                profilePhoto: null,
              },
              type: "chatUser",
            };
          } else {
            const text = await chatUserRes.text().catch(() => "");
            console.warn(
              `[Chat] ✗ Failed to fetch ${id} as both hairdresser and chat user`,
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
    // Deduplicate by participant identity (handles both firebaseUid and document id)
    const seenParticipants = new Map<string, string>(); // key -> canonical participant id
    const deduplicated: any[] = [];

    const items = (data || []).map((c) => {
      const otherId =
        (c.participantIds || []).find((p) => p !== myId) || "unknown";
      const participant = participants[otherId];

      // Create canonical identifier using actual profile data if available
      const canonicalId = participant
        ? participant.firebaseUid || participant.id
        : otherId;

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
        canonicalId, // Add canonical identifier
        label,
        lastMessageAt,
        profilePhoto: participant?.profilePhoto || null,
        fullName: participant?.fullName || null,
        nickName: participant?.nickName || null,
      };
    });

    // Sort by most recent message first
    items.sort(
      (a, b) =>
        (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0)
    );

    // Keep only the first (most recent) conversation per canonical participant
    items.forEach((item) => {
      const existingConversationId = seenParticipants.get(item.canonicalId);

      if (!existingConversationId) {
        // First conversation with this participant - keep it
        seenParticipants.set(item.canonicalId, item.conversationId);
        deduplicated.push(item);
      } else {
        // Duplicate conversation with same participant - skip
        console.log(
          `[Chats] Skipping duplicate conversation ${item.conversationId} (already have ${existingConversationId} for ${item.label})`
        );
      }
    });

    return deduplicated;
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
          <ConversationCard
            key={c.conversationId}
            conversationId={c.conversationId}
            label={c.label}
            profilePhoto={c.profilePhoto}
            lastMessageAt={c.lastMessageAt}
            onSelect={() =>
              setSelected({
                id: c.otherId,
                name: c.label,
                photo: c.profilePhoto || undefined,
              })
            }
          />
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
