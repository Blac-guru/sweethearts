import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar.jsx";
import { useToast } from "@/hooks/use-toast.js";
import {
  useMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
  useMarkMessagesAsReadMutation,
} from "@/hooks/use-chat.js";
import { Loader2, X } from "lucide-react";
import { getTestUserId, validateChatUser } from "@/lib/chat-api";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId?: string | null;
  recipientName: string;
  recipientPhoto?: string;
}

export function ChatDialog({
  open,
  onOpenChange,
  recipientId,
  recipientName,
  recipientPhoto,
}: ChatDialogProps) {
  const { toast } = useToast();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pendingContent, setPendingContent] = useState("");
  const startMutation = useStartConversationMutation();
  const sendMutation = useSendMessageMutation();
  const markAsReadMutation = useMarkMessagesAsReadMutation();
  const messagesQuery = useMessagesQuery(conversationId || undefined);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasStartedRef = useRef(false);
  const hasMarkedReadRef = useRef(false);

  // Validate chat user on dialog open
  useEffect(() => {
    if (open) {
      validateChatUser();
    }
  }, [open]);

  const currentUid = getTestUserId();

  // Start conversation when dialog opens
  useEffect(() => {
    if (!open) {
      hasStartedRef.current = false;
      hasMarkedReadRef.current = false;
      return;
    }
    if (!recipientId) {
      toast({
        title: "Chat unavailable",
        description: "This profile is missing a chat recipient id.",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }
    if (conversationId || hasStartedRef.current) return;

    hasStartedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const { conversationId: newId } = await startMutation.mutateAsync(
          recipientId
        );
        if (!cancelled) {
          setConversationId(newId);
        }
      } catch (err: any) {
        if (cancelled) return;
        const message = err?.message || "Failed to start chat";
        toast({
          title: "Unable to start chat",
          description: message,
          variant: "destructive",
        });
        onOpenChange(false);
        hasStartedRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, recipientId, conversationId]);

  // Mark messages as read when conversation opens
  useEffect(() => {
    if (
      open &&
      conversationId &&
      !hasMarkedReadRef.current &&
      !markAsReadMutation.isPending
    ) {
      hasMarkedReadRef.current = true;
      markAsReadMutation.mutate(conversationId);
    }
  }, [open, conversationId, markAsReadMutation]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesQuery.data]);

  const isSending = sendMutation.isPending;
  const isStarting = startMutation.isPending && !conversationId;

  const canSend = useMemo(() => {
    return (
      Boolean(pendingContent.trim()) && Boolean(conversationId) && !isSending
    );
  }, [pendingContent, conversationId, isSending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || !conversationId) return;
    const content = pendingContent.trim();
    setPendingContent("");
    try {
      await sendMutation.mutateAsync({ conversationId, content });
    } catch (err: any) {
      const message = err?.message || "Failed to send message";
      toast({
        title: "Send failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const showAuthWarning = false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 flex flex-col h-[600px]">
        <DialogHeader className="border-b px-6 py-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={recipientPhoto || ""} alt={recipientName} />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white font-bold">
                {recipientName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {recipientName}
              </h2>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex h-[480px] flex-col">
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="flex flex-col gap-3">
              {messagesQuery.isLoading || isStarting ? (
                <div className="flex justify-center py-10 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading chat...
                </div>
              ) : messagesQuery.data && messagesQuery.data.length > 0 ? (
                messagesQuery.data.map((msg) => {
                  const isMine = msg.senderId === currentUid;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
                          isMine
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        <p className="mt-1 text-[11px] opacity-80">
                          {(() => {
                            try {
                              const d =
                                typeof msg.createdAt === "string" ||
                                typeof msg.createdAt === "number"
                                  ? new Date(msg.createdAt)
                                  : msg.createdAt instanceof Date
                                  ? msg.createdAt
                                  : null;
                              return d &&
                                d instanceof Date &&
                                !isNaN(d.getTime())
                                ? d.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "";
                            } catch {
                              return "";
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No messages yet. Say hello!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 border-t px-6 py-4"
          >
            <Input
              value={pendingContent}
              onChange={(e) => setPendingContent(e.target.value)}
              placeholder={"Type a message"}
              disabled={isSending || isStarting || !conversationId}
            />
            <Button type="submit" disabled={!canSend}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                </>
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
