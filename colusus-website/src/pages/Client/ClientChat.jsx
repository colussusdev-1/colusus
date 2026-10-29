import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { io } from "socket.io-client";

import {
    ArrowLeft,
    Paperclip,
    Send,
    MessageCircle,
    Search,
    Plus,
    RefreshCw,
    FileText,
    Download,
    X,
    LoaderCircle,
    LifeBuoy,
    CheckCheck,
    AlertCircle,
} from "lucide-react";

import "./ClientChat.css";

/* ============================================================
   CONFIGURATION
============================================================ */

const API_BASE = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    API_BASE.replace(/\/api\/v1\/?$/, "");

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

const ALLOWED_EXTENSIONS = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".doc",
    ".docx",
];

/* ============================================================
   AUTHENTICATION
============================================================ */

const getToken = () => {
    const tokenKeys = [
        "colossus_token",
        "token",
        "accessToken",
        "access_token",
        "authToken",
        "jwt",
    ];

    try {
        for (const key of tokenKeys) {
            const token = localStorage.getItem(key);

            if (token) return token;
        }
    } catch {
        // Local storage may be unavailable.
    }

    try {
        for (const key of tokenKeys) {
            const token = sessionStorage.getItem(key);

            if (token) return token;
        }
    } catch {
        // Session storage may be unavailable.
    }

    try {
        const user = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        if (user?.token) return user.token;
        if (user?.accessToken) return user.accessToken;
        if (user?.access_token) return user.access_token;
    } catch {
        // Ignore invalid user data.
    }

    return "";
};

/* ============================================================
   GENERAL HELPERS
============================================================ */

const getId = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
        return value;
    }

    return String(value._id || value.id || "");
};

const getName = (user) => {
    if (!user) return "Colossus Support";

    if (typeof user === "string") {
        return "Colossus Support";
    }

    return (
        user.name ||
        [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" ") ||
        user.email ||
        "Colossus Support"
    );
};

const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return date.toLocaleDateString([], {
        day: "numeric",
        month: "short",
    });
};

const getChatTitle = (chat) =>
    chat?.subject ||
    chat?.relatedApplication?.opportunitySnapshot?.title ||
    chat?.relatedApplicationDisplayName ||
    "Migration Support";

const getMessageText = (message) =>
    message?.content ||
    message?.text ||
    message?.message ||
    "";

const unwrapList = (payload, key) => {
    if (Array.isArray(payload?.data?.[key])) {
        return payload.data[key];
    }

    if (Array.isArray(payload?.[key])) {
        return payload[key];
    }

    if (Array.isArray(payload?.data?.data?.[key])) {
        return payload.data.data[key];
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    return [];
};

/* ============================================================
   API REQUEST
============================================================ */

async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    if (!token) {
        throw new Error(
            "No authentication token was found. Please sign in again."
        );
    }

    const isFormData = options.body instanceof FormData;

    const headers = {
        Accept: "application/json",

        ...(options.body && !isFormData
            ? {
                "Content-Type": "application/json",
            }
            : {}),

        Authorization: `Bearer ${token}`,

        ...options.headers,
    };

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    const contentType =
        response.headers.get("content-type") || "";

    let payload = null;

    if (contentType.includes("application/json")) {
        payload = await response.json();
    }

    if (response.status === 401) {
        throw new Error(
            "Your session has expired. Please sign in again."
        );
    }

    if (response.status === 403) {
        throw new Error(
            payload?.message ||
            "You do not have permission to access this conversation."
        );
    }

    if (!response.ok || payload?.success === false) {
        throw new Error(
            payload?.message ||
            payload?.error ||
            `Request failed (${response.status}).`
        );
    }

    return payload;
}

/* ============================================================
   CLIENT CHAT
============================================================ */

export default function ClientChat() {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState("");
    const [messages, setMessages] = useState([]);

    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [sending, setSending] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [mobileChatOpen, setMobileChatOpen] = useState(false);

    const [showNewChat, setShowNewChat] = useState(false);
    const [newSubject, setNewSubject] = useState(
        "Migration Support"
    );

    const [creating, setCreating] = useState(false);

    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const fileRef = useRef(null);

    const activeChatRef = useRef("");
    const chatsRef = useRef([]);

    useEffect(() => {
        activeChatRef.current = activeChatId;
    }, [activeChatId]);

    useEffect(() => {
        chatsRef.current = chats;
    }, [chats]);

    /* ========================================================
       LOAD CONVERSATIONS
    ======================================================== */

    const loadChats = useCallback(async (quiet = false) => {
        if (!quiet) {
            setLoadingChats(true);
        }

        setError("");

        try {
            const payload = await apiRequest(
                "/chat?page=1&limit=50"
            );

            const list = unwrapList(payload, "chats");

            setChats(list);

            setActiveChatId((current) => {
                if (
                    current &&
                    list.some(
                        (chat) => getId(chat) === current
                    )
                ) {
                    return current;
                }

                return list.length
                    ? getId(list[0])
                    : "";
            });
        } catch (e) {
            setError(
                e.message ||
                "Unable to load your conversations."
            );
        } finally {
            setLoadingChats(false);
        }
    }, []);

    /* ========================================================
       LOAD MESSAGES
    ======================================================== */

    const loadMessages = useCallback(async (chatId) => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        setLoadingMessages(true);
        setError("");

        try {
            const payload = await apiRequest(
                `/chat/${encodeURIComponent(
                    chatId
                )}/messages?page=1&limit=50`
            );

            setMessages(
                unwrapList(payload, "messages")
            );

            // Best-effort read receipt.
            await apiRequest(
                `/chat/${encodeURIComponent(chatId)}/read`,
                {
                    method: "PATCH",
                }
            ).catch(() => { });
        } catch (e) {
            setMessages([]);

            setError(
                e.message ||
                "Unable to load messages."
            );
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    useEffect(() => {
        if (activeChatId.startsWith("draft-")) {
            setMessages([]);
            setLoadingMessages(false);
            return;
        }

        if (activeChatId) {
            loadMessages(activeChatId);
        } else {
            setMessages([]);
        }
    }, [activeChatId, loadMessages]);

    /* ========================================================
       SOCKET CONNECTION
    ======================================================== */

    useEffect(() => {
        const token = getToken();

        if (!token) {
            return undefined;
        }

        const socket = io(SOCKET_URL, {
            auth: {
                token,
            },

            transports: [
                "websocket",
                "polling",
            ],

            reconnection: true,
            reconnectionAttempts: 10,
        });

        socketRef.current = socket;

        const joinChats = () => {
            chatsRef.current.forEach((chat) => {
                const chatId = getId(chat);

                if (
                    chatId &&
                    !chatId.startsWith("draft-")
                ) {
                    socket.emit("chat:join", {
                        chatId,
                    });
                }
            });

            const activeId = activeChatRef.current;

            if (
                activeId &&
                !activeId.startsWith("draft-")
            ) {
                socket.emit("chat:join", {
                    chatId: activeId,
                });
            }
        };

        socket.on("connect", joinChats);

        socket.on(
            "chat:message",
            ({ chatId, message } = {}) => {
                if (!chatId || !message) return;

                setChats((old) =>
                    old.map((chat) =>
                        getId(chat) === String(chatId)
                            ? {
                                ...chat,
                                lastMessage: message,
                                lastMessageAt:
                                    message.createdAt ||
                                    new Date().toISOString(),
                            }
                            : chat
                    )
                );

                if (
                    activeChatRef.current === String(chatId)
                ) {
                    setMessages((old) => {
                        const messageId = getId(message);

                        if (
                            messageId &&
                            old.some(
                                (item) =>
                                    getId(item) === messageId
                            )
                        ) {
                            return old;
                        }

                        return [...old, message];
                    });
                }
            }
        );

        socket.on(
            "chat:updated",
            ({
                chatId,
                lastMessage,
                lastMessageAt,
            } = {}) => {
                if (!chatId) return;

                setChats((old) =>
                    old.map((chat) =>
                        getId(chat) === String(chatId)
                            ? {
                                ...chat,
                                lastMessage,
                                lastMessageAt,
                            }
                            : chat
                    )
                );
            }
        );

        socket.on(
            "chat:created",
            ({ chat } = {}) => {
                if (!chat?._id) return;

                setChats((old) =>
                    old.some(
                        (item) =>
                            getId(item) === getId(chat)
                    )
                        ? old
                        : [chat, ...old]
                );
            }
        );

        socket.on("connect_error", (e) => {
            console.warn(
                "[Client Chat] Socket connection:",
                e.message
            );
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (
            !socketRef.current?.connected ||
            !activeChatId ||
            activeChatId.startsWith("draft-")
        ) {
            return;
        }

        socketRef.current.emit("chat:join", {
            chatId: activeChatId,
        });
    }, [activeChatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    /* ========================================================
       FILTER CONVERSATIONS
    ======================================================== */

    const activeChat = chats.find(
        (chat) => getId(chat) === activeChatId
    );

    const filteredChats = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return chats;
        }

        return chats.filter((chat) => {
            const lastMessage =
                typeof chat.lastMessage === "object"
                    ? getMessageText(chat.lastMessage)
                    : "";

            return `${getChatTitle(chat)} ${lastMessage}`
                .toLowerCase()
                .includes(query);
        });
    }, [chats, search]);

    /* ========================================================
       OPEN CONVERSATION
    ======================================================== */

    const openChat = (chat) => {
        const id = getId(chat);

        setActiveChatId(id);
        setMobileChatOpen(true);
        setNotice("");

        if (
            id &&
            !id.startsWith("draft-")
        ) {
            socketRef.current?.emit("chat:join", {
                chatId: id,
            });
        }
    };

    /* ========================================================
       SEND MESSAGE
    ======================================================== */

    const handleSend = async (event) => {
        event.preventDefault();

        const content = draft.trim();

        if (
            !content ||
            !activeChatId ||
            sending
        ) {
            return;
        }

        setSending(true);
        setError("");
        setDraft("");

        try {
            // Create the server conversation when the first
            // actual message is sent.
            if (
                activeChatId.startsWith("draft-")
            ) {
                const draftChat = chatsRef.current.find(
                    (chat) =>
                        getId(chat) === activeChatId
                );

                if (!draftChat) {
                    throw new Error(
                        "This draft conversation is no longer available. Please start a new conversation."
                    );
                }

                const payload = await apiRequest(
                    "/chat",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            subject:
                                draftChat.subject ||
                                "Migration Support",

                            content,
                        }),
                    }
                );

                const createdChat =
                    payload?.data?.chat ||
                    payload?.chat ||
                    payload?.data;

                if (!createdChat?._id) {
                    throw new Error(
                        "The server did not return the new conversation."
                    );
                }

                setChats((old) => [
                    createdChat,

                    ...old.filter(
                        (chat) =>
                            getId(chat) !== activeChatId
                    ),
                ]);

                setActiveChatId(
                    getId(createdChat)
                );

                setMobileChatOpen(true);

                setNotice(
                    "Your message has been sent to Colossus Support."
                );

                return;
            }

            const payload = await apiRequest(
                `/chat/${encodeURIComponent(
                    activeChatId
                )}/messages`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        content,
                    }),
                }
            );

            const message =
                payload?.data?.message ||
                payload?.message ||
                payload?.data;

            if (
                message &&
                typeof message === "object"
            ) {
                setMessages((old) => {
                    const messageId = getId(message);

                    if (
                        messageId &&
                        old.some(
                            (item) =>
                                getId(item) === messageId
                        )
                    ) {
                        return old;
                    }

                    return [...old, message];
                });
            }

            await loadChats(true);
        } catch (e) {
            setDraft(content);

            setError(
                e.message ||
                "Message could not be sent."
            );
        } finally {
            setSending(false);
        }
    };

    /* ========================================================
       UPLOAD ATTACHMENTS
    ======================================================== */

    const handleFiles = async (event) => {
        const files = Array.from(
            event.target.files || []
        );

        event.target.value = "";

        if (
            !files.length ||
            !activeChatId
        ) {
            return;
        }

        if (
            activeChatId.startsWith("draft-")
        ) {
            setError(
                "Send your first message before uploading attachments."
            );

            return;
        }

        if (files.length > MAX_FILES) {
            setError(
                `You can upload a maximum of ${MAX_FILES} files at once.`
            );

            return;
        }

        const invalid = files.find((file) => {
            const extension =
                `.${file.name.split(".").pop()}`
                    .toLowerCase();

            return (
                file.size > MAX_FILE_SIZE ||
                !ALLOWED_EXTENSIONS.includes(
                    extension
                )
            );
        });

        if (invalid) {
            setError(
                `${invalid.name}: use PDF, JPG, PNG, WEBP, DOC, or DOCX files up to 10 MB.`
            );

            return;
        }

        const form = new FormData();

        /*
         * IMPORTANT:
         * chat.routes.js uses:
         *
         * chatUpload.array("documents", 5)
         *
         * Therefore, the frontend MUST use "documents".
         * Do not change this to "files" or "attachments".
         */

        files.forEach((file) => {
            form.append("documents", file);
        });

        setUploading(true);
        setError("");
        setNotice("");

        try {
            const payload = await apiRequest(
                `/chat/${encodeURIComponent(
                    activeChatId
                )}/attachments`,
                {
                    method: "POST",
                    body: form,
                }
            );

            const result = payload?.data;

            const newMessages = Array.isArray(
                result?.messages
            )
                ? result.messages
                : result
                    ? [result]
                    : [];

            if (newMessages.length) {
                setMessages((old) => {
                    const seen = new Set(
                        old.map(getId).filter(Boolean)
                    );

                    return [
                        ...old,

                        ...newMessages.filter(
                            (item) =>
                                !getId(item) ||
                                !seen.has(getId(item))
                        ),
                    ];
                });
            }

            setNotice(
                "Attachment uploaded successfully."
            );

            await loadChats(true);
        } catch (e) {
            setError(
                e.message ||
                "Attachment upload failed."
            );
        } finally {
            setUploading(false);
        }
    };

    /* ========================================================
       START CONVERSATION
    ======================================================== */

    const startConversation = async (event) => {
        event.preventDefault();

        const subject =
            newSubject.trim() ||
            "Migration Support";

        setCreating(true);
        setError("");
        setNotice("");

        try {
            /*
             * Open the chat interface immediately.
             * The real server conversation is created
             * when the client sends their first message.
             */

            const draftId = `draft-${Date.now()}`;
            const now = new Date().toISOString();

            const draftChat = {
                _id: draftId,
                subject,
                status: "OPEN",
                lastMessage: null,
                lastMessageAt: now,
                createdAt: now,
                isDraft: true,
            };

            setChats((old) => [
                draftChat,

                ...old.filter(
                    (chat) =>
                        getId(chat) !== draftId
                ),
            ]);

            setActiveChatId(draftId);
            setMessages([]);
            setDraft("");
            setShowNewChat(false);
            setMobileChatOpen(true);

            setNotice(
                "Chat opened. Send your first message to contact Colossus Support."
            );
        } catch (e) {
            setError(
                e.message ||
                "Could not open a conversation."
            );
        } finally {
            setCreating(false);
        }
    };

    /* ========================================================
       ATTACHMENT RENDERER
    ======================================================== */

    const renderAttachment = (
        attachment,
        index,
        chatId
    ) => {
        const attachmentId = getId(attachment);

        const name =
            attachment?.originalName ||
            attachment?.filename ||
            attachment?.name ||
            `Attachment ${index + 1}`;

        const downloadAttachment = async () => {
            if (!chatId || !attachmentId) {
                setError(
                    "This attachment does not have a valid download reference."
                );

                return;
            }

            try {
                const token = getToken();

                const response = await fetch(
                    `${API_BASE}/chat/${encodeURIComponent(
                        chatId
                    )}/attachments/${encodeURIComponent(
                        attachmentId
                    )}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "*/*",
                        },
                    }
                );

                if (!response.ok) {
                    let message =
                        "Unable to download this attachment.";

                    try {
                        const payload =
                            await response.json();

                        message =
                            payload?.message || message;
                    } catch {
                        // The response may not be JSON.
                    }

                    throw new Error(message);
                }

                const blob = await response.blob();

                const objectUrl =
                    URL.createObjectURL(blob);

                const anchor =
                    document.createElement("a");

                anchor.href = objectUrl;
                anchor.download = name;

                document.body.appendChild(anchor);

                anchor.click();
                anchor.remove();

                URL.revokeObjectURL(objectUrl);
            } catch (e) {
                setError(
                    e.message ||
                    "Unable to download this attachment."
                );
            }
        };

        return (
            <button
                className="cc-attachment"
                type="button"
                key={
                    attachmentId ||
                    `${name}-${index}`
                }
                onClick={downloadAttachment}
            >
                <FileText size={18} />

                <span>{name}</span>

                <Download size={15} />
            </button>
        );
    };

    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <main className="cc-page">
            <header className="cc-page-heading">
                <div className="cc-heading-icon">
                    <MessageCircle size={23} />
                </div>

                <div>
                    <p className="cc-eyebrow">
                        CLIENT PORTAL / SUPPORT
                    </p>

                    <h1>Messages</h1>

                    <p className="cc-heading-copy">
                        Talk to the Colossus team about your
                        migration journey.
                    </p>
                </div>

                <button
                    className="cc-new-button"
                    onClick={() => {
                        setError("");
                        setShowNewChat(true);
                    }}
                    type="button"
                >
                    <Plus size={18} />
                    New conversation
                </button>
            </header>

            {error && (
                <div className="cc-alert cc-alert-error">
                    <AlertCircle size={17} />

                    <span>{error}</span>

                    <button
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {notice && (
                <div className="cc-alert cc-alert-success">
                    <CheckCheck size={17} />

                    <span>{notice}</span>

                    <button
                        onClick={() => setNotice("")}
                        aria-label="Dismiss notice"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <section
                className={`cc-workspace ${mobileChatOpen
                        ? "cc-mobile-open"
                        : ""
                    }`}
            >
                {/* CONVERSATION LIST */}

                <aside className="cc-sidebar">
                    <div className="cc-sidebar-title">
                        <div>
                            <strong>
                                Your conversations
                            </strong>

                            <span>
                                {chats.length} conversation
                                {chats.length === 1
                                    ? ""
                                    : "s"}
                            </span>
                        </div>

                        <button
                            className="cc-icon-button"
                            onClick={() => loadChats()}
                            title="Refresh conversations"
                            type="button"
                        >
                            <RefreshCw size={17} />
                        </button>
                    </div>

                    <label className="cc-search">
                        <Search size={17} />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search conversations..."
                        />
                    </label>

                    <div className="cc-chat-list">
                        {loadingChats ? (
                            <div className="cc-state">
                                <LoaderCircle
                                    className="cc-spin"
                                    size={24}
                                />

                                <span>
                                    Loading conversations...
                                </span>
                            </div>
                        ) : filteredChats.length ? (
                            filteredChats.map((chat) => {
                                const id = getId(chat);

                                const last =
                                    typeof chat.lastMessage ===
                                        "object"
                                        ? getMessageText(
                                            chat.lastMessage
                                        )
                                        : "";

                                return (
                                    <button
                                        type="button"
                                        key={id}
                                        onClick={() =>
                                            openChat(chat)
                                        }
                                        className={`cc-chat-item ${activeChatId === id
                                                ? "active"
                                                : ""
                                            }`}
                                    >
                                        <span className="cc-avatar">
                                            <LifeBuoy size={19} />
                                        </span>

                                        <span className="cc-chat-meta">
                                            <span className="cc-chat-row">
                                                <strong>
                                                    {getChatTitle(chat)}
                                                </strong>

                                                <time>
                                                    {formatDate(
                                                        chat.lastMessageAt ||
                                                        chat.updatedAt
                                                    )}
                                                </time>
                                            </span>

                                            <span className="cc-preview">
                                                {last ||
                                                    "Start chatting with our support team"}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="cc-empty-list">
                                <MessageCircle size={26} />

                                <strong>
                                    No conversations yet
                                </strong>

                                <span>
                                    Start a conversation with
                                    the Colossus team.
                                </span>

                                <button
                                    onClick={() =>
                                        setShowNewChat(true)
                                    }
                                    type="button"
                                >
                                    Contact support
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="cc-sidebar-footer">
                        <span className="cc-online-dot" />

                        Colossus Support

                        <span className="cc-secure">
                            Private chat
                        </span>
                    </div>
                </aside>

                {/* ACTIVE CHAT */}

                <section className="cc-chat-panel">
                    {!activeChat ? (
                        <div className="cc-welcome">
                            <span className="cc-welcome-icon">
                                <MessageCircle size={32} />
                            </span>

                            <h2>How can we help?</h2>

                            <p>
                                Send a message to the Colossus
                                team and keep your migration
                                conversations in one place.
                            </p>

                            <button
                                className="cc-primary-button"
                                onClick={() =>
                                    setShowNewChat(true)
                                }
                                type="button"
                            >
                                <Plus size={17} />
                                Start a conversation
                            </button>
                        </div>
                    ) : (
                        <>
                            <header className="cc-chat-header">
                                <button
                                    className="cc-back-button"
                                    onClick={() =>
                                        setMobileChatOpen(false)
                                    }
                                    type="button"
                                    aria-label="Back to conversations"
                                >
                                    <ArrowLeft size={20} />
                                </button>

                                <span className="cc-avatar cc-avatar-large">
                                    <LifeBuoy size={21} />
                                </span>

                                <div className="cc-header-copy">
                                    <strong>
                                        {getChatTitle(activeChat)}
                                    </strong>

                                    <span>
                                        <i className="cc-online-dot" />
                                        Colossus Support Team
                                    </span>
                                </div>

                                <span className="cc-secure-label">
                                    Private conversation
                                </span>
                            </header>

                            <div className="cc-messages">
                                <div className="cc-date-divider">
                                    <span>
                                        Conversation history
                                    </span>
                                </div>

                                {loadingMessages ? (
                                    <div className="cc-state">
                                        <LoaderCircle
                                            className="cc-spin"
                                            size={24}
                                        />

                                        <span>
                                            Loading messages...
                                        </span>
                                    </div>
                                ) : messages.length ? (
                                    messages.map(
                                        (message, index) => {
                                            const mine =
                                                message.isMine === true ||
                                                message.isOwnMessage === true ||
                                                message.senderRole ===
                                                "CLIENT";

                                            const text =
                                                getMessageText(message);

                                            const attachments =
                                                Array.isArray(
                                                    message.attachments
                                                )
                                                    ? message.attachments
                                                    : message.attachment
                                                        ? [message.attachment]
                                                        : [];

                                            return (
                                                <article
                                                    key={
                                                        getId(message) ||
                                                        `${message.createdAt}-${index}`
                                                    }
                                                    className={`cc-message ${mine
                                                            ? "cc-message-mine"
                                                            : "cc-message-theirs"
                                                        }`}
                                                >
                                                    {!mine && (
                                                        <span className="cc-message-author">
                                                            {getName(
                                                                message.sender ||
                                                                message.user || {
                                                                    name: "Colossus Support",
                                                                }
                                                            )}
                                                        </span>
                                                    )}

                                                    {text && (
                                                        <div className="cc-bubble">
                                                            {text}
                                                        </div>
                                                    )}

                                                    {attachments.length > 0 && (
                                                        <div className="cc-attachments">
                                                            {attachments.map(
                                                                (
                                                                    attachment,
                                                                    attachmentIndex
                                                                ) =>
                                                                    renderAttachment(
                                                                        attachment,
                                                                        attachmentIndex,
                                                                        activeChatId
                                                                    )
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="cc-message-time">
                                                        {formatDate(
                                                            message.createdAt ||
                                                            message.sentAt
                                                        )}

                                                        {mine && (
                                                            <CheckCheck size={14} />
                                                        )}
                                                    </div>
                                                </article>
                                            );
                                        }
                                    )
                                ) : (
                                    <div className="cc-no-messages">
                                        <MessageCircle size={27} />

                                        <strong>
                                            This conversation is ready
                                        </strong>

                                        <span>
                                            Send your first message below.
                                        </span>
                                    </div>
                                )}

                                <div ref={bottomRef} />
                            </div>

                            <form
                                className="cc-composer"
                                onSubmit={handleSend}
                            >
                                <input
                                    ref={fileRef}
                                    type="file"
                                    multiple
                                    hidden
                                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                                    onChange={handleFiles}
                                />

                                <button
                                    className="cc-attach-button"
                                    type="button"
                                    title="Attach files"
                                    disabled={
                                        uploading ||
                                        activeChatId.startsWith("draft-")
                                    }
                                    onClick={() =>
                                        fileRef.current?.click()
                                    }
                                >
                                    <Paperclip size={20} />
                                </button>

                                <textarea
                                    value={draft}
                                    onChange={(event) =>
                                        setDraft(event.target.value)
                                    }
                                    placeholder="Write a message..."
                                    rows={1}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            !event.shiftKey
                                        ) {
                                            event.preventDefault();

                                            event.currentTarget.form
                                                ?.requestSubmit();
                                        }
                                    }}
                                />

                                <button
                                    className="cc-send-button"
                                    type="submit"
                                    disabled={
                                        !draft.trim() ||
                                        sending ||
                                        loadingMessages
                                    }
                                    aria-label="Send message"
                                >
                                    {sending ? (
                                        <LoaderCircle
                                            className="cc-spin"
                                            size={19}
                                        />
                                    ) : (
                                        <Send size={19} />
                                    )}
                                </button>

                                <small className="cc-composer-hint">
                                    {uploading
                                        ? "Uploading attachment..."
                                        : "Enter to send · Shift + Enter for a new line · Max file size 10 MB"}
                                </small>
                            </form>
                        </>
                    )}
                </section>
            </section>

            {/* NEW CONVERSATION MODAL */}

            {showNewChat && (
                <div
                    className="cc-modal-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowNewChat(false);
                        }
                    }}
                >
                    <form
                        className="cc-modal"
                        onSubmit={startConversation}
                    >
                        <button
                            type="button"
                            className="cc-modal-close"
                            onClick={() =>
                                setShowNewChat(false)
                            }
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <span className="cc-modal-icon">
                            <MessageCircle size={25} />
                        </span>

                        <h2>
                            Contact Colossus Support
                        </h2>

                        <p>
                            Start a private conversation with
                            our team about your migration journey.
                        </p>

                        <label htmlFor="cc-subject">
                            Conversation subject
                        </label>

                        <input
                            id="cc-subject"
                            value={newSubject}
                            onChange={(event) =>
                                setNewSubject(event.target.value)
                            }
                            maxLength={100}
                            placeholder="e.g. Application support"
                        />

                        <div className="cc-modal-actions">
                            <button
                                type="button"
                                className="cc-cancel-button"
                                onClick={() =>
                                    setShowNewChat(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="cc-primary-button"
                                disabled={creating}
                            >
                                {creating ? (
                                    <LoaderCircle
                                        className="cc-spin"
                                        size={17}
                                    />
                                ) : (
                                    <Send size={17} />
                                )}

                                {creating
                                    ? "Starting..."
                                    : "Open chat"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}