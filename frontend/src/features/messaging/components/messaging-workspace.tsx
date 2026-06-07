import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  CONVERSATION_PREVIEWS,
  DEFAULT_CONVERSATION_ID,
  getConversationDetail,
  type ChatMessage,
  type ConversationPreview,
} from "@/features/messaging/data/messaging-data";
import { cn } from "@/lib/utils";

function ConversationListItem({
  conversation,
  active,
  onSelect,
}: {
  conversation: ConversationPreview;
  active: boolean;
  onSelect: () => void;
}) {
  if (conversation.type === "group") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-full cursor-pointer rounded-sm p-md text-left",
          active
            ? "border-l-4 border-secondary bg-secondary-container/20"
            : "hover:bg-surface-container",
        )}
      >
        <div className="mb-1 flex justify-between">
          <span className="text-body-md font-bold text-primary">{conversation.title}</span>
          <span className="text-[10px] uppercase text-on-surface-variant">{conversation.time}</span>
        </div>
        <p className="truncate text-body-md text-on-surface-variant">{conversation.preview}</p>
        {conversation.memberAvatars ? (
          <div className="mt-2 flex -space-x-2">
            {conversation.memberAvatars.map((avatar) => (
              <img key={avatar} src={avatar} alt="" className="h-5 w-5 rounded-full border border-white" />
            ))}
            {conversation.extraMembers ? (
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-surface-variant text-[8px]">
                +{conversation.extraMembers}
              </div>
            ) : null}
          </div>
        ) : null}
      </button>
    );
  }

  if (conversation.type === "direct") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "relative w-full cursor-pointer rounded-sm p-md text-left transition-colors",
          active ? "border-l-4 border-secondary bg-secondary-container/20" : "hover:bg-surface-container",
        )}
      >
        <div className="flex items-center gap-md">
          <div className="relative">
            <img src={conversation.avatar} alt="" className="h-10 w-10 rounded-full" />
            {conversation.online ? (
              <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-secondary" />
            ) : null}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-baseline justify-between">
              <span className="text-body-md font-bold">{conversation.title}</span>
              <span className="text-[10px] text-on-surface-variant">{conversation.time}</span>
            </div>
            <p className="truncate text-body-md text-on-surface-variant">{conversation.preview}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full cursor-pointer rounded-sm p-md text-left transition-colors",
        active ? "border-l-4 border-secondary bg-secondary-container/20" : "hover:bg-surface-container",
      )}
    >
      <div className="flex items-center gap-md text-error">
        <Icon name="campaign" />
        <div className="flex-1">
          <div className="flex items-baseline justify-between text-on-surface">
            <span className="text-body-md font-bold">{conversation.title}</span>
            <span className="text-[10px] text-on-surface-variant">{conversation.time}</span>
          </div>
          <p className="text-body-md font-bold text-on-surface-variant">{conversation.preview}</p>
        </div>
      </div>
    </button>
  );
}

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  if (message.type === "text" && !message.sent) {
    return (
      <div className="flex max-w-[80%] items-start gap-md">
        <img src={message.authorAvatar} alt="" className="h-8 w-8 rounded-full" />
        <div>
          <div className="mb-1 flex items-baseline gap-sm">
            <span className="text-body-md font-bold">{message.author}</span>
            <span className="text-label-md text-on-surface-variant">{message.time}</span>
          </div>
          <div className="rounded-xl rounded-tl-none bg-surface-container p-md">
            <p className="text-body-md">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "attachment") {
    return (
      <div className="flex max-w-[80%] items-start gap-md">
        <img src={message.authorAvatar} alt="" className="h-8 w-8 rounded-full" />
        <div className="flex-1">
          <div className="rounded-xl rounded-tl-none border border-outline-variant bg-surface-container p-md">
            <div className="flex items-center gap-md rounded border border-outline-variant bg-white p-sm">
              <Icon name="description" filled className="text-error" />
              <div className="flex-1">
                <p className="text-body-md font-bold">{message.fileName}</p>
                <p className="text-label-md text-on-surface-variant">{message.fileSize}</p>
              </div>
              <button type="button" aria-label="Télécharger">
                <Icon name="download" className="text-on-surface-variant hover:text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "text" && message.sent) {
    return (
      <div className="flex max-w-[80%] flex-row-reverse items-start gap-md self-end">
        <img src={message.authorAvatar} alt="" className="h-8 w-8 rounded-full" />
        <div className="flex flex-col items-end">
          <div className="mb-1 flex flex-row-reverse items-baseline gap-sm">
            <span className="text-body-md font-bold">{message.author}</span>
            <span className="text-label-md text-on-surface-variant">{message.time}</span>
          </div>
          <div className="rounded-xl rounded-tr-none bg-primary p-md text-on-primary shadow-sm">
            <p className="text-body-md">{message.content}</p>
          </div>
          {message.seen ? (
            <span className="mt-1 flex items-center gap-1 text-[10px] text-secondary">
              <Icon name="done_all" className="text-[12px]" />
              Seen
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (message.type === "code") {
    return (
      <div className="flex max-w-[80%] flex-row-reverse items-start gap-md self-end">
        <img src={message.authorAvatar} alt="" className="h-8 w-8 rounded-full" />
        <div className="w-full">
          <div className="rounded-xl rounded-tr-none bg-primary-container p-md text-on-primary-container">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-code-sm text-label-md">{message.fileName}</span>
              <button type="button" aria-label="Copier">
                <Icon name="content_copy" className="text-sm" />
              </button>
            </div>
            <pre className="overflow-x-auto rounded bg-black/20 p-sm font-code-sm text-code-sm">
              <code>{message.code}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function MessagingWorkspace() {
  const [activeConversationId, setActiveConversationId] = useState(DEFAULT_CONVERSATION_ID);
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const conversation = getConversationDetail(activeConversationId);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [activeConversationId]);

  const handleTextareaInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <>
      <div className="hidden w-80 flex-col border-r border-outline-variant bg-surface-container-low lg:flex">
        <div className="flex items-center justify-between border-b border-outline-variant p-md">
          <h2 className="text-headline-md">Conversations</h2>
          <Icon name="filter_list" className="cursor-pointer text-on-surface-variant" />
        </div>
        <div className="flex-1 space-y-xs overflow-y-auto p-sm">
          {CONVERSATION_PREVIEWS.map((item) => (
            <ConversationListItem
              key={item.id}
              conversation={item}
              active={item.id === activeConversationId}
              onSelect={() => setActiveConversationId(item.id)}
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col bg-surface-container-lowest">
        <div className="glass-effect sticky top-0 z-10 flex h-16 items-center justify-between border-b border-outline-variant px-lg">
          <div className="flex items-center gap-md">
            <button type="button" className="md:hidden" aria-label="Menu">
              <Icon name="menu" />
            </button>
            <div>
              <h3 className="text-headline-md text-primary">{conversation.title}</h3>
              <div className="flex items-center gap-xs">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-label-md text-on-surface-variant">{conversation.activeMembers}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <button type="button" aria-label="Appel">
              <Icon name="call" className="text-on-surface-variant hover:text-primary" />
            </button>
            <button type="button" aria-label="Visio">
              <Icon name="videocam" className="text-on-surface-variant hover:text-primary" />
            </button>
            <button type="button" aria-label="Informations">
              <Icon name="info" className="text-on-surface-variant hover:text-primary" />
            </button>
          </div>
        </div>

        <div
          ref={messagesRef}
          className="flex flex-1 flex-col space-y-lg overflow-y-auto p-lg pb-20 md:pb-lg"
        >
          <div className="flex justify-center">
            <span className="rounded-full bg-surface-container-high px-md py-xs text-label-md text-on-surface-variant">
              Today
            </span>
          </div>
          {conversation.messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
        </div>

        <div className="border-t border-outline-variant bg-surface-container-lowest p-lg pb-20 md:pb-lg">
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-xs transition-colors focus-within:border-secondary">
            <div className="mb-xs flex items-center gap-sm border-b border-outline-variant/30 px-sm py-xs">
              <button type="button" className="rounded p-1 hover:bg-surface-container-high" aria-label="Gras">
                <Icon name="format_bold" className="text-on-surface-variant hover:text-primary" />
              </button>
              <button type="button" className="rounded p-1 hover:bg-surface-container-high" aria-label="Italique">
                <Icon name="format_italic" className="text-on-surface-variant hover:text-primary" />
              </button>
              <button type="button" className="rounded p-1 hover:bg-surface-container-high" aria-label="Code">
                <Icon name="code" className="text-on-surface-variant hover:text-primary" />
              </button>
              <div className="mx-1 h-4 w-px bg-outline-variant" />
              <button type="button" className="rounded p-1 hover:bg-surface-container-high" aria-label="Lien">
                <Icon name="link" className="text-on-surface-variant hover:text-primary" />
              </button>
            </div>
            <div className="flex items-end gap-md p-sm">
              <button
                type="button"
                className="rounded-full p-2 hover:bg-surface-container-high"
                aria-label="Ajouter"
              >
                <Icon name="add_circle" className="text-on-surface-variant" />
              </button>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  handleTextareaInput();
                }}
                rows={1}
                placeholder={conversation.placeholder}
                className="h-12 max-h-32 flex-1 resize-none border-none bg-transparent py-2 text-body-md focus:ring-0"
              />
              <div className="flex items-center gap-sm pb-1">
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-surface-container-high"
                  aria-label="Emoji"
                >
                  <Icon name="mood" className="text-on-surface-variant" />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-on-secondary transition-all hover:opacity-90 active:scale-95"
                  aria-label="Envoyer"
                >
                  <Icon name="send" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {conversation.members.length > 0 ? (
        <aside className="hidden w-72 flex-col border-l border-outline-variant bg-surface xl:flex">
          <div className="border-b border-outline-variant p-lg text-center">
            <div className="mx-auto mb-md flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary-container">
              <Icon name="hub" className="text-[40px] text-on-secondary-container" />
            </div>
            <h4 className="text-headline-md">{conversation.title}</h4>
            <p className="text-body-md text-on-surface-variant">{conversation.subtitle}</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-lg">
              <div className="mb-md flex items-center justify-between">
                <h5 className="text-body-md font-bold">Members</h5>
                <button type="button" className="text-label-md font-bold text-secondary">
                  Add
                </button>
              </div>
              <div className="space-y-md">
                {conversation.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-md">
                    <img src={member.avatar} alt="" className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <p className="text-body-md font-bold">{member.name}</p>
                      <p className="text-label-md text-on-surface-variant">{member.role}</p>
                    </div>
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        member.online ? "bg-secondary" : "bg-outline-variant",
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            {conversation.sharedFiles.length > 0 ? (
              <div className="border-t border-outline-variant p-lg">
                <h5 className="mb-md text-body-md font-bold">Shared Files</h5>
                <div className="grid grid-cols-2 gap-sm">
                  {conversation.sharedFiles.map((file) =>
                    file.type === "image" ? (
                      <div
                        key={file.id}
                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-surface-container"
                      >
                        <img src={file.image} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Icon name="visibility" className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div
                        key={file.id}
                        className="flex cursor-pointer flex-col items-center justify-center gap-xs rounded-lg bg-surface-container p-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
                      >
                        <Icon name="description" className="text-xl text-primary" />
                        <span className="w-full truncate text-center text-[10px] font-bold">{file.label}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-outline-variant p-lg">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-sm py-sm text-body-md font-bold text-error transition-colors hover:rounded hover:bg-error-container/20"
            >
              <Icon name="logout" />
              Leave Group
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
