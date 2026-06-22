import { FormEvent, useEffect, useRef, useState } from "react";
import { Megaphone, MessageSquare, Send, UserPlus } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { fetchMembers } from "@/lib/api/members";
import {
  fetchConversationMessages,
  fetchConversations,
  publishAnnouncement,
  sendConversationMessage,
  startDirectConversation,
} from "@/lib/api/messages";
import type { ApiChatMessage, ApiConversationPreview, ApiMember } from "@/lib/api/types";
import { canManageMembers } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { initSocketConnection, disconnectSocket } from "@/lib/api/socket";

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function truncatePreview(content: string, max = 72) {
  return content.length > max ? `${content.slice(0, max)}…` : content;
}

export function MessagesApiDashboard() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ApiConversationPreview[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ApiChatMessage[]>([]);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [draft, setDraft] = useState("");
  const [announcementDraft, setAnnouncementDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = conversations.find((item) => item.id === activeId) ?? null;
  const canAnnounce = canManageMembers(user?.role);
  const canReply =
    activeConversation?.type === "ANNOUNCEMENT"
      ? canAnnounce
      : user?.membership?.status === "ACTIVE";

  const loadConversations = () => {
    setLoading(true);
    setErrorMessage("");

    Promise.all([fetchConversations(), fetchMembers()])
      .then(([conversationData, memberData]) => {
        setConversations(conversationData.conversations);
        setMembers(memberData.members.filter((member) => member.id !== user?.id));
        // Force la sélection de la première conversation si rien n'est sélectionné
        setActiveId((current) => {
          if (current) return current;
          return conversationData.conversations.length > 0 ? conversationData.conversations[0].id : null;
        });
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger les messages",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadConversations();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const socket = initSocketConnection();
    if (!socket) return;

    const handleNewMessage = (message: ApiChatMessage) => {
      setActiveId((currentActiveId) => {
        if (currentActiveId === message.conversationId) {
          setMessages((current) => {
            if (current.some((m) => m.id === message.id)) return current;
            return [...current, message];
          });
        }
        return currentActiveId;
      });
    };

    const handleConversationUpdated = () => {
      fetchConversations()
        .then(({ conversations: data }) => setConversations(data))
        .catch(() => undefined);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("conversationUpdated", handleConversationUpdated);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("conversationUpdated", handleConversationUpdated);
      disconnectSocket();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    setMessagesLoading(true);
    fetchConversationMessages(activeId)
      .then((data) => setMessages(data.messages))
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger la conversation",
        );
      })
      .finally(() => setMessagesLoading(false));
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeId]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeId || !draft.trim() || sending || !canReply) return;

    setSending(true);
    setErrorMessage("");

    try {
      const { message } = await sendConversationMessage(activeId, draft.trim());
      setMessages((current) => [...current, message]);
      setDraft("");
      loadConversations();
    } catch (error) {
      setErrorMessage(error instanceof ApiClientError ? error.message : "Envoi impossible");
    } finally {
      setSending(false);
    }
  };

  const handlePublishAnnouncement = async (event: FormEvent) => {
    event.preventDefault();
    if (!announcementDraft.trim() || sending || !canAnnounce) return;

    setSending(true);
    setErrorMessage("");

    try {
      await publishAnnouncement(announcementDraft.trim());
      setAnnouncementDraft("");
      loadConversations();
      if (activeConversation?.type === "ANNOUNCEMENT" && activeId) {
        const data = await fetchConversationMessages(activeId);
        setMessages(data.messages);
      }
    } catch (error) {
      setErrorMessage(error instanceof ApiClientError ? error.message : "Publication impossible");
    } finally {
      setSending(false);
    }
  };

  const handleStartDirect = async (memberId: string) => {
    setErrorMessage("");
    try {
      const { conversation } = await startDirectConversation(memberId);
      setShowNewMessage(false);
      loadConversations();
      setActiveId(conversation.id);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError ? error.message : "Conversation impossible",
      );
    }
  };

  if (loading) {
    return (
      <div className="grid h-full min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <div className="cjp-card-dark h-full animate-pulse" />
        <div className="cjp-card-dark h-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-[560px] grid-cols-1 overflow-hidden rounded-xl border border-[var(--cjp-border)] bg-[#1a1a1a] lg:grid-cols-[320px_1fr] shadow-2xl">
      <aside className="flex flex-col border-b border-[var(--cjp-border)] bg-[#141414] lg:border-r lg:border-b-0">
        <div className="border-b border-[var(--cjp-border)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="cjp-label-gold">Messagerie</p>
              <h2 className="text-lg font-bold text-[var(--cjp-white)]">Conversations</h2>
            </div>
            {user?.membership?.status === "ACTIVE" ? (
              <button
                type="button"
                onClick={() => setShowNewMessage((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--cjp-border)] text-[var(--cjp-gold)] transition-colors hover:border-[var(--cjp-gold)]"
                aria-label="Nouveau message"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        {showNewMessage ? (
          <div className="border-b border-[var(--cjp-border)] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)]">
              Contacter un membre
            </p>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {members.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleStartDirect(member.id)}
                  className="flex w-full items-center gap-3 rounded-lg border border-[var(--cjp-border)] px-3 py-2 text-left transition-colors hover:border-[var(--cjp-gold)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-xs font-bold text-[var(--cjp-black)]">
                    {member.initials}
                  </span>
                  <span className="text-sm text-[var(--cjp-white)]">
                    {member.firstName} {member.lastName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-[var(--cjp-text-muted)]">Aucune conversation pour le moment.</p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveId(conversation.id)}
                className={cn(
                  "mb-2 w-full rounded-lg border p-4 text-left transition-colors",
                  activeId === conversation.id
                    ? "border-[var(--cjp-gold)] bg-[var(--cjp-gray)]"
                    : "border-transparent hover:border-[var(--cjp-border)] hover:bg-[var(--cjp-gray)]/60",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-[var(--cjp-black)]">
                    {conversation.type === "ANNOUNCEMENT" ? (
                      <Megaphone className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-bold">
                        {conversation.otherParticipant?.initials ?? "DM"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold text-[var(--cjp-white)]">{conversation.title}</p>
                      {conversation.lastMessage ? (
                        <span className="shrink-0 text-[10px] text-[var(--cjp-text-muted)] font-medium">
                          {formatMessageTime(conversation.lastMessage.createdAt)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-[var(--cjp-text-muted)]/80">{conversation.subtitle}</p>
                    {conversation.lastMessage ? (
                      <p className="mt-2 truncate text-sm text-[var(--cjp-text-muted)]">
                        {truncatePreview(conversation.lastMessage.content)}
                      </p>
                    ) : (
                      <p className="mt-2 truncate text-sm italic text-[var(--cjp-text-muted)]/60">
                        Nouvelle conversation
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="flex min-h-[420px] flex-col">
        {errorMessage ? (
          <p className="border-b border-red-400/20 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {activeConversation ? (
          <>
            <div className="border-b border-[var(--cjp-border)] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-[var(--cjp-black)]">
                  {activeConversation.type === "ANNOUNCEMENT" ? (
                    <Megaphone className="h-4 w-4" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--cjp-white)]">{activeConversation.title}</h3>
                  <p className="text-sm text-[var(--cjp-text-muted)]">{activeConversation.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messagesLoading ? (
                <p className="text-sm text-[var(--cjp-text-muted)]">Chargement des messages…</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-[var(--cjp-text-muted)]">Aucun message dans cette conversation.</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.sent ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3",
                        message.sent
                          ? "rounded-br-sm bg-[var(--cjp-gold)] text-[var(--cjp-black)]"
                          : "rounded-bl-sm border border-[var(--cjp-border)] bg-[var(--cjp-gray)] text-[var(--cjp-white)]",
                      )}
                    >
                      {!message.sent ? (
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
                          {message.sender.firstName} {message.sender.lastName}
                        </p>
                      ) : null}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p
                        className={cn(
                          "mt-2 text-[10px]",
                          message.sent ? "text-[var(--cjp-black)]/70" : "text-[var(--cjp-text-muted)]",
                        )}
                      >
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {canReply ? (
              <form onSubmit={handleSend} className="border-t border-[var(--cjp-border)] p-4">
                <div className="flex gap-3">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={
                      activeConversation.type === "ANNOUNCEMENT"
                        ? "Publier une annonce au club…"
                        : "Écrire un message…"
                    }
                    className="flex-1 rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-gray)] px-4 py-3 text-sm text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="btn-cjp inline-flex items-center gap-2 !px-4 !py-3 !text-xs"
                  >
                    <Send className="h-4 w-4" />
                    Envoyer
                  </button>
                </div>
              </form>
            ) : (
              <div className="border-t border-[var(--cjp-border)] bg-[#141414] px-5 py-4 text-center text-sm font-medium text-[var(--cjp-text-muted)]">
                {activeConversation.type === "ANNOUNCEMENT"
                  ? "🔒 Canal en lecture seule réservé aux annonces du bureau."
                  : "Adhésion active requise pour envoyer un message."}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#1a1a1a] to-[#111111]">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2a2a2a] text-[var(--cjp-gold)] shadow-lg ring-4 ring-[#1a1a1a]">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-[var(--cjp-white)]">Vos Messages</h3>
            <p className="mb-8 max-w-sm text-sm text-[var(--cjp-text-muted)]">
              Sélectionnez une conversation existante ou démarrez une nouvelle discussion avec un membre du club.
            </p>
            {user?.membership?.status === "ACTIVE" ? (
              <button
                type="button"
                onClick={() => setShowNewMessage(true)}
                className="btn-cjp inline-flex items-center gap-2 shadow-xl shadow-black/50"
              >
                <UserPlus className="h-4 w-4" />
                Démarrer une conversation
              </button>
            ) : null}
          </div>
        )}

        {canAnnounce ? (
          <form
            onSubmit={handlePublishAnnouncement}
            className="border-t border-[var(--cjp-border)] bg-[var(--cjp-black)]/40 p-4"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)]">
              Publication rapide — annonces bureau
            </p>
            <div className="flex gap-3">
              <input
                value={announcementDraft}
                onChange={(event) => setAnnouncementDraft(event.target.value)}
                placeholder="Message officiel visible par tous les membres connectés…"
                className="flex-1 rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-gray)] px-4 py-3 text-sm text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
              />
              <button
                type="submit"
                disabled={sending || !announcementDraft.trim()}
                className="rounded-lg border border-[var(--cjp-gold)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] transition-colors hover:bg-[var(--cjp-gold)] hover:text-[var(--cjp-black)]"
              >
                Publier
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}
