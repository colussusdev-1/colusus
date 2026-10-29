import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { io } from "socket.io-client";
import {
    Search,
    Plus,
    Send,
    Paperclip,
    MoreHorizontal,
    MessageSquare,
    FileText,
    File,
    Download,
    ExternalLink,
    X,
    ArrowLeft,
    UserRound,
    Clock3,
    CheckCheck,
    LoaderCircle,
    RefreshCw,
    MessageCircle,
    BriefcaseBusiness,
    PanelRightClose,
    PanelRightOpen,
    Archive,
    LockKeyhole,
    CircleAlert,
} from "lucide-react";

import "./AdminChat.css";

const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    API_BASE.replace(/\/api\/v1\/?$/, "");

const PAGE_SIZE = 30;
const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".doc",
    ".docx",
];

const extractJwt = (value, depth = 0) => {
    if (depth > 4 || value == null) return "";

    if (typeof value === "string") {
        const trimmed = value.trim();

        // The backend expects a signed JWT (three dot-separated segments).
        if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(trimmed)) {
            return trimmed;
        }

        // Some applications store authentication data as JSON.
        try {
            return extractJwt(JSON.parse(trimmed), depth + 1);
        } catch {
            return "";
        }
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const token = extractJwt(item, depth + 1);
            if (token) return token;
        }
        return "";
    }

    if (typeof value === "object") {
        const preferredKeys = [
            "token",
            "accessToken",
            "access_token",
            "authToken",
            "jwt",
            "bearerToken",
            "authorization",
            "data",
            "auth",
            "session",
            "user",
        ];

        for (const key of preferredKeys) {
            if (key in value) {
                const token = extractJwt(value[key], depth + 1);
                if (token) return token;
            }
        }
    }

    return "";
};

const getToken = () => {
    const knownKeys = [
        "token",
        "accessToken",
        "access_token",
        "authToken",
        "jwt",
        "bearerToken",
        "authorization",
        "colossusToken",
        "adminToken",
        "userToken",
        "auth",
        "session",
        "user",
        "currentUser",
    ];

    const stores = [];

    try {
        stores.push(window.localStorage);
    } catch {
        // Storage may be unavailable in restricted browser contexts.
    }

    try {
        stores.push(window.sessionStorage);
    } catch {
        // Storage may be unavailable in restricted browser contexts.
    }

    for (const store of stores) {
        for (const key of knownKeys) {
            try {
                const token = extractJwt(store.getItem(key));
                if (token) return token;
            } catch {
                // Continue searching other keys.
            }
        }

        // Fallback: inspect other stored auth/session objects without
        // exposing or logging their contents.
        try {
            for (let index = 0; index < store.length; index += 1) {
                const key = store.key(index);
                if (!key) continue;

                const token = extractJwt(store.getItem(key));
                if (token) return token;
            }
        } catch {
            // Continue to the next storage mechanism.
        }
    }

    return "";
};

const getId = (value) => {
    if (!value) return "";

    if (typeof value === "string") return value;

    return String(value._id || value.id || "");
};

const getDisplayName = (user) => {
    if (!user) return "Unknown user";

    if (typeof user === "string") return user || "Unknown user";

    // Admin client-list responses may wrap the actual user in { user, profile, ... }.
    const person = user.user && typeof user.user === "object" ? user.user : user;

    return (
        person.name ||
        [person.firstName, person.lastName].filter(Boolean).join(" ") ||
        person.email ||
        "Unnamed client"
    );
};

const getInitials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] || "")
        .join("")
        .toUpperCase() || "CL";

const formatTime = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    return parsed.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatDate = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (parsed.toDateString() === today.toDateString()) {
        return formatTime(date);
    }

    if (parsed.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return parsed.toLocaleDateString([], {
        day: "numeric",
        month: "short",
    });
};

const getApplication = (chat) => {
    const application = chat?.relatedApplication;

    if (!application) return null;

    // The API may return a populated application, an ObjectId, or an ID plus
    // display metadata resolved by the chat service. Preserve all available data.
    if (typeof application === "object" && !Array.isArray(application)) {
        return {
            ...application,
            relatedApplicationDisplayName:
                application.relatedApplicationDisplayName ||
                chat?.relatedApplicationDisplayName ||
                "",
            relatedApplicationReference:
                application.relatedApplicationReference ||
                chat?.relatedApplicationReference ||
                "",
            relatedApplicationDestination:
                application.relatedApplicationDestination ||
                chat?.relatedApplicationDestination ||
                "",
        };
    }

    return {
        _id: String(application),
        relatedApplicationDisplayName: chat?.relatedApplicationDisplayName || "",
        relatedApplicationReference: chat?.relatedApplicationReference || "",
        relatedApplicationDestination: chat?.relatedApplicationDestination || "",
    };
};

const firstText = (...values) => {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) return value.trim();
        if (typeof value === "number" && Number.isFinite(value)) return String(value);
    }
    return "";
};

const getApplicationLabel = (application) => {
    if (!application) return "Migration application";

    // This is the actual programme title stored on Colossus applications.
    // It must be checked before generic fields such as type or destination.
    const snapshotTitle = firstText(
        application.opportunitySnapshot?.title,
        application.opportunitySnapshot?.name,
        application.opportunity?.title,
        application.opportunity?.name,
        application.opportunity?.programName,
        application.relatedApplicationDisplayName,
    );

    if (snapshotTitle) return snapshotTitle;

    const nested = [
        application.application,
        application.program,
        application.selectedProgram,
        application.migrationProgram,
        application.service,
        application.serviceDetails,
        application.relatedService,
        application.course,
        application.opportunity,
        application.relatedOpportunity,
        application.offer,
        application.destinationDetails,
        application.applicationDetails,
    ].filter((value) => value && typeof value === "object");

    const directName = firstText(
        application.applicationName,
        application.programName,
        application.migrationProgramName,
        application.serviceName,
        application.courseName,
        application.offerName,
        application.opportunityName,
        application.productName,
        application.pathwayName,
        application.applicationTitle,
        application.name,
        application.title,
        ...nested.flatMap((item) => [
            item.applicationName,
            item.programName,
            item.migrationProgramName,
            item.serviceName,
            item.courseName,
            item.offerName,
            item.opportunityName,
            item.pathwayName,
            item.applicationTitle,
            item.name,
            item.title,
        ]),
    );

    if (directName) return directName;

    // Country is a useful fallback, but avoid showing a MongoDB ObjectId.
    const destination = firstText(
        application.destinationCountry,
        application.opportunitySnapshot?.countryName,
        application.opportunity?.countryName,
        application.relatedApplicationDestination,
        application.destination,
        application.country,
        application.preferredDestination,
        ...nested.flatMap((item) => [
            item.destinationCountry,
            item.countryName,
            item.destination,
            item.country,
        ]),
    );

    if (destination) return destination;

    const reference = firstText(
        application.applicationNumber,
        application.referenceNumber,
        application.reference,
        application.applicationReference,
        application.relatedApplicationReference,
    );

    if (reference && !/^[a-f0-9]{24}$/i.test(reference)) return reference;

    return "Migration application";
};

const getApplicationDestination = (application) => {
    if (!application) return "No application linked";

    const nested = [
        application.application,
        application.program,
        application.selectedProgram,
        application.migrationProgram,
        application.service,
        application.serviceDetails,
        application.relatedService,
        application.course,
        application.opportunity,
        application.relatedOpportunity,
        application.offer,
        application.destinationDetails,
        application.applicationDetails,
    ].filter((value) => value && typeof value === "object");

    return firstText(
        application.destinationCountry,
        application.opportunitySnapshot?.countryName,
        application.opportunity?.countryName,
        application.relatedApplicationDestination,
        application.destination,
        application.country,
        application.preferredDestination,
        ...nested.flatMap((item) => [
            item.destinationCountry,
            item.countryName,
            item.destination,
            item.country,
        ]),
    ) || "Migration application";
};

const getApplicationStatus = (application) => {
    if (!application) return "Status unavailable";
    const nested = application.application && typeof application.application === "object"
        ? application.application
        : {};
    return firstText(
        application.status,
        application.applicationStatus,
        nested.status,
        nested.applicationStatus,
    ) || "Status unavailable";
};

const getMessagePreview = (message) => {
    if (!message || typeof message !== "object") {
        return "Start a conversation";
    }

    if (message.content?.trim()) return message.content;

    if (message.attachments?.length) {
        return `Document${message.attachments.length > 1 ? "s" : ""} attached`;
    }

    return "New message";
};

const getAttachmentName = (attachment) =>
    attachment?.originalName ||
    attachment?.name ||
    attachment?.filename ||
    "Document";

const getAttachmentId = (attachment) =>
    getId(attachment?._id || attachment?.id);

const isAdminRole = (user) =>
    ["ADMIN", "SUPER_ADMIN"].includes(
        String(user?.role || "").toUpperCase(),
    );

const getClientFromChat = (chat) => {
    if (!chat) return null;

    if (chat.client && typeof chat.client === "object") {
        return chat.client;
    }

    return (
        (chat.participants || []).find((participant) => {
            return !isAdminRole(participant);
        }) || null
    );
};

async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    if (!token) {
        throw new Error(
            "Your login token was not found in browser storage. Please sign out and sign in again, then reload Chat."
        );
    }

    const headers = {
        ...(options.body instanceof FormData
            ? {}
            : options.body
                ? { "Content-Type": "application/json" }
                : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    const contentType = response.headers.get("content-type") || "";

    const payload = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
        throw new Error(
            payload?.message || `Request failed with status ${response.status}.`,
        );
    }

    return payload;
}

const Avatar = ({ user, size = "normal" }) => {
    const name = getDisplayName(user);
    const image = user?.avatar || user?.profileImage || user?.profilePicture;

    return (
        <div className={`ac-avatar ac-avatar--${size}`}>
            {image ? (<img src={image} alt={name} className="ac-avatar-image" />
            ) : (<span>{getInitials(name)}</span>
            )} </div>
    );
};

const AttachmentCard = ({ attachment, onOpen }) => {
    const filename = getAttachmentName(attachment);

    const size =
        typeof attachment?.size === "number"
            ? attachment.size >= 1024 * 1024
                ? `${(attachment.size / (1024 * 1024)).toFixed(1)} MB`
                : `${Math.max(1, Math.round(attachment.size / 1024))} KB`
            : "Document";

    return (
        <button
            type="button"
            className="ac-attachment"
            onClick={() => onOpen(attachment)}
            title={`Open ${filename}`}
        > <span className="ac-attachment-icon"> <FileText size={19} /> </span>


            <span className="ac-attachment-info">
                <span className="ac-attachment-name">{filename}</span>
                <span className="ac-attachment-size">{size}</span>
            </span>

            <Download size={17} className="ac-attachment-download" />
        </button>


    );
};

const ApplicationCard = ({ application, onOpen }) => {
    if (!application) {
        return (<div className="ac-application-empty"> <span className="ac-application-icon"> <BriefcaseBusiness size={18} /> </span>


            <span>
                <strong>No application linked</strong>
                <small>This conversation has no application reference.</small>
            </span>
        </div>
        );


    }

    return (
        <button
            type="button"
            className="ac-application-card"
            onClick={() => onOpen(application)}
        > <span className="ac-application-icon"> <BriefcaseBusiness size={19} /> </span>


            <span className="ac-application-copy">
                <small>LINKED APPLICATION</small>
                <strong>{getApplicationLabel(application)}</strong>
                <span>{getApplicationDestination(application)}</span>

                <span className="ac-application-status">
                    {getApplicationStatus(application)}
                </span>
            </span>

            <ExternalLink size={16} />
        </button>


    );
};

const AdminChat = () => {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState("");
    const [messages, setMessages] = useState([]);

    const [messageInput, setMessageInput] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [creating, setCreating] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetails, setShowDetails] = useState(true);
    const [mobileChatOpen, setMobileChatOpen] = useState(false);

    const [clientOptions, setClientOptions] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);

    const [newClientId, setNewClientId] = useState("");
    const [newSubject, setNewSubject] = useState("Migration Support");

    const [newApplicationId, setNewApplicationId] = useState("");
    const [applicationSearch, setApplicationSearch] = useState("");
    const [applicationOptions, setApplicationOptions] = useState([]);
    const [loadingApplications, setLoadingApplications] = useState(false);

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [previewAttachment, setPreviewAttachment] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const socketRef = useRef(null);
    const activeChatRef = useRef("");
    const currentUserIdRef = useRef("");
    const joinedChatsRef = useRef(new Set());
    const sentMessageIdsRef = useRef(new Set());

    const currentUserId = useMemo(() => {
        try {
            const raw =
                localStorage.getItem("user") ||
                localStorage.getItem("currentUser");


            if (raw) {
                return getId(JSON.parse(raw));
            }
        } catch {
            // Ignore malformed local storage.
        }

        return localStorage.getItem("userId") || "";


    }, []);

    useEffect(() => {
        currentUserIdRef.current = currentUserId;
    }, [currentUserId]);

    const activeChat = useMemo(
        () => chats.find((chat) => getId(chat) === activeChatId) || null,
        [chats, activeChatId],
    );

    const client = useMemo(
        () => getClientFromChat(activeChat),
        [activeChat],
    );

    const linkedApplication = useMemo(
        () => getApplication(activeChat),
        [activeChat],
    );

    const filteredChats = useMemo(() => {
        return chats.filter((chat) => {
            const chatClient = getClientFromChat(chat);


            const name = getDisplayName(chatClient).toLowerCase();
            const subject = String(chat.subject || "").toLowerCase();

            const application = getApplicationLabel(
                getApplication(chat),
            ).toLowerCase();

            const query = search.trim().toLowerCase();

            const matchesSearch =
                !query ||
                name.includes(query) ||
                subject.includes(query) ||
                application.includes(query);

            const status = String(chat.status || "OPEN").toUpperCase();

            const matchesFilter =
                filter === "ALL" ||
                (filter === "OPEN" && status === "OPEN") ||
                (filter === "CLOSED" && status === "CLOSED") ||
                (filter === "ARCHIVED" && status === "ARCHIVED");

            return matchesSearch && matchesFilter;
        });


    }, [chats, search, filter]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, []);

    const loadChats = useCallback(async () => {
        setLoadingChats(true);


        try {
            const response = await apiRequest("/chat?page=1&limit=50");

            const list = Array.isArray(response?.data?.chats)
                ? response.data.chats
                : Array.isArray(response?.chats)
                    ? response.chats
                    : Array.isArray(response?.data?.data?.chats)
                        ? response.data.data.chats
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];

            setChats(list);

            setActiveChatId((currentId) => {
                if (currentId && list.some((chat) => getId(chat) === currentId)) {
                    return currentId;
                }

                return getId(list[0]) || "";
            });

            setError("");
        } catch (requestError) {
            setError(requestError.message || "Unable to load conversations.");
        } finally {
            setLoadingChats(false);
        }


    }, []);

    const loadMessages = useCallback(async (chatId) => {
        if (!chatId) {
            setMessages([]);
            return;
        }


        setLoadingMessages(true);

        try {
            const response = await apiRequest(
                `/chat/${encodeURIComponent(chatId)}/messages?page=1&limit=${PAGE_SIZE}`,
            );

            const list = Array.isArray(response?.data?.messages)
                ? response.data.messages
                : Array.isArray(response?.messages)
                    ? response.messages
                    : Array.isArray(response?.data?.data?.messages)
                        ? response.data.data.messages
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];

            setMessages(list);

            await apiRequest(`/chat/${encodeURIComponent(chatId)}/read`, {
                method: "PATCH",
            }).catch(() => { });
        } catch (requestError) {
            setError(requestError.message || "Unable to load messages.");
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }


    }, []);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    useEffect(() => {
        activeChatRef.current = activeChatId;


        if (!activeChatId) {
            setMessages([]);
            return;
        }

        loadMessages(activeChatId);


    }, [activeChatId, loadMessages]);

    /*
    
    * Socket connection.
    *
    * Connect once per authenticated user. Joining rooms is handled
    * separately when the chat list or active conversation changes.
      */
    useEffect(() => {
        const token = getToken();


        if (!token) return undefined;



        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            joinedChatsRef.current.clear();

            const chatIds = new Set([
                ...chats.map((chat) => getId(chat)),
                activeChatRef.current,
            ]);

            chatIds.forEach((chatId) => {
                if (!chatId) return;

                socket.emit("chat:join", { chatId }, (result) => {
                    if (result?.success) {
                        joinedChatsRef.current.add(chatId);
                    }
                });
            });
        });

        socket.on("chat:message", ({ chatId, message } = {}) => {
            if (!chatId || !message) return;

            const messageId = getId(message);

            if (
                messageId &&
                sentMessageIdsRef.current.has(messageId)
            ) {
                sentMessageIdsRef.current.delete(messageId);
            }

            if (activeChatRef.current === String(chatId)) {
                setMessages((previous) => {
                    if (
                        messageId &&
                        previous.some((item) => getId(item) === messageId)
                    ) {
                        return previous;
                    }

                    return [...previous, message];
                });

                requestAnimationFrame(scrollToBottom);

                const senderId = getId(message.sender);

                if (
                    !currentUserIdRef.current ||
                    senderId !== currentUserIdRef.current
                ) {
                    apiRequest(`/chat/${encodeURIComponent(chatId)}/read`, {
                        method: "PATCH",
                    }).catch(() => { });
                }
            }

            setChats((previous) =>
                previous.map((chat) =>
                    getId(chat) === String(chatId)
                        ? {
                            ...chat,
                            lastMessage: message,
                            lastMessageAt: message.createdAt || new Date().toISOString(),
                        }
                        : chat,
                ),
            );
        });

        socket.on("chat:updated", ({ chatId, lastMessage, lastMessageAt } = {}) => {
            if (!chatId) return;

            setChats((previous) =>
                previous.map((chat) =>
                    getId(chat) === String(chatId)
                        ? {
                            ...chat,
                            lastMessage: lastMessage || chat.lastMessage,
                            lastMessageAt: lastMessageAt || chat.lastMessageAt,
                        }
                        : chat,
                ),
            );
        });

        socket.on("chat:created", ({ chat } = {}) => {
            if (!chat?._id) return;

            setChats((previous) => {
                const exists = previous.some(
                    (item) => getId(item) === getId(chat),
                );

                return exists
                    ? previous.map((item) =>
                        getId(item) === getId(chat) ? chat : item,
                    )
                    : [chat, ...previous];
            });
        });

        socket.on("chat:status", ({ chatId, status } = {}) => {
            if (!chatId || !status) return;

            setChats((previous) =>
                previous.map((chat) =>
                    getId(chat) === String(chatId) ? { ...chat, status } : chat,
                ),
            );
        });

        socket.on("chat:read", ({ chatId, userId } = {}) => {
            if (!chatId || !userId) return;

            if (activeChatRef.current !== String(chatId)) return;

            setMessages((previous) =>
                previous.map((message) => {
                    const senderId = getId(message.sender);

                    if (senderId !== currentUserIdRef.current) {
                        return message;
                    }

                    const readBy = Array.isArray(message.readBy)
                        ? message.readBy
                        : [];

                    if (readBy.some((entry) => getId(entry.user) === String(userId))) {
                        return message;
                    }

                    return {
                        ...message,
                        readBy: [
                            ...readBy,
                            { user: userId, readAt: new Date().toISOString() },
                        ],
                    };
                }),
            );
        });

        socket.on("connect_error", (socketError) => {
            console.error(
                "[Admin Chat] Socket connection failed:",
                socketError.message,
            );
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
            joinedChatsRef.current.clear();
        };


    }, [scrollToBottom]);

    /*
    
    * Join conversations after the chat list has loaded and when
    * the administrator selects another conversation.
      */
    useEffect(() => {
        const socket = socketRef.current;


        if (!socket?.connected) return;



        const chatIds = new Set([
            ...chats.map((chat) => getId(chat)),
            activeChatId,
        ]);

        chatIds.forEach((chatId) => {
            if (!chatId || joinedChatsRef.current.has(chatId)) return;

            socket.emit("chat:join", { chatId }, (result) => {
                if (result?.success) {
                    joinedChatsRef.current.add(chatId);
                }
            });
        });


    }, [chats, activeChatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    /*
     * Load clients from the existing admin client-list endpoint.
     * The endpoint returns records shaped like { user, profile, applications, documents },
     * so normalize each record to the nested user before rendering the dropdown.
     */
    useEffect(() => {
        if (!showCreateModal) return undefined;

        let cancelled = false;

        const loadClients = async () => {
            setLoadingClients(true);
            setClientOptions([]);

            try {
                const response = await apiRequest("/admin/clients?page=1&limit=100");

                const candidates = [
                    response?.data?.clients,
                    response?.data?.users,
                    response?.data?.data,
                    response?.data,
                    response?.clients,
                    response?.users,
                ];

                const list = candidates.find(Array.isArray) || [];

                const normalizedClients = list
                    .map((record) => (
                        record?.user && typeof record.user === "object"
                            ? record.user
                            : record
                    ))
                    .filter((user) => {
                        if (!user || typeof user !== "object" || !getId(user)) {
                            return false;
                        }

                        return String(user.role || "CLIENT").toUpperCase() === "CLIENT";
                    })
                    .sort((a, b) =>
                        getDisplayName(a).localeCompare(getDisplayName(b))
                    );

                if (!cancelled) {
                    setClientOptions(normalizedClients);
                    setNewClientId((currentId) =>
                        normalizedClients.some((user) => getId(user) === currentId)
                            ? currentId
                            : ""
                    );

                    if (normalizedClients.length === 0) {
                        setError("The client endpoint returned no usable client records.");
                    } else {
                        setError("");
                    }
                }
            } catch (requestError) {
                if (!cancelled) {
                    setClientOptions([]);
                    setError(
                        requestError.message ||
                        "Unable to load clients. Check the admin client-list endpoint."
                    );
                }
            } finally {
                if (!cancelled) setLoadingClients(false);
            }
        };

        loadClients();

        return () => {
            cancelled = true;
        };
    }, [showCreateModal]);
    /*
     * Load only applications belonging to the selected client.
     * API responses may expose the owner as client, user, applicant, or nested
     * under a client/application profile object, so normalize those shapes.
     */
    useEffect(() => {
        if (!showCreateModal || !newClientId) {
            setApplicationOptions([]);
            setNewApplicationId("");
            setApplicationSearch("");
            return undefined;
        }

        let cancelled = false;

        const getOwnerId = (application) => {
            const possibleOwners = [
                application?.client,
                application?.clientId,
                application?.user,
                application?.userId,
                application?.applicant,
                application?.applicantId,
                application?.createdBy,
                application?.owner,
                application?.customer,
                application?.profile?.user,
                application?.client?.user,
                application?.application?.client,
                application?.application?.user,
            ];

            for (const owner of possibleOwners) {
                const ownerId = getId(owner);
                if (ownerId) return ownerId;
            }

            return "";
        };

        const unwrapApplicationList = (response) => {
            const candidates = [
                response?.data?.applications,
                response?.data?.items,
                response?.data?.results,
                response?.data?.data,
                response?.data,
                response?.applications,
                response?.items,
                response?.results,
            ];

            return candidates.find(Array.isArray) || null;
        };

        const loadApplications = async () => {
            setLoadingApplications(true);
            setApplicationOptions([]);
            setNewApplicationId("");

            const encodedClientId = encodeURIComponent(newClientId);
            const endpoints = [
                `/admin/clients/${encodedClientId}/applications`,
                `/applications?client=${encodedClientId}`,
                `/applications?clientId=${encodedClientId}`,
                `/applications?user=${encodedClientId}`,
                `/applications?userId=${encodedClientId}`,
                `/admin/applications?client=${encodedClientId}`,
                `/admin/applications?clientId=${encodedClientId}`,
                `/admin/applications?userId=${encodedClientId}`,
            ];

            try {
                for (const endpoint of endpoints) {
                    if (cancelled) return;

                    try {
                        const response = await apiRequest(endpoint);
                        const list = unwrapApplicationList(response);

                        if (!list) continue;

                        // Never show applications whose owner is another client.
                        // A client-specific endpoint may omit the owner field, so
                        // accept ownerless records only from that explicit endpoint.
                        const isClientScopedEndpoint = endpoint.startsWith(
                            `/admin/clients/${encodedClientId}/applications`,
                        );

                        const filtered = list.filter((application) => {
                            if (!application || typeof application !== "object") {
                                return false;
                            }

                            const ownerId = getOwnerId(application);
                            return ownerId
                                ? ownerId === newClientId
                                : isClientScopedEndpoint;
                        });

                        if (filtered.length > 0 || isClientScopedEndpoint) {
                            if (!cancelled) setApplicationOptions(filtered);
                            return;
                        }
                    } catch {
                        // Try the next supported application endpoint.
                    }
                }

                if (!cancelled) setApplicationOptions([]);
            } finally {
                if (!cancelled) setLoadingApplications(false);
            }
        };

        loadApplications();

        return () => {
            cancelled = true;
        };
    }, [showCreateModal, newClientId]);

    const openChat = (chatId) => {
        setActiveChatId(chatId);
        setMobileChatOpen(true);
        setError("");
        setNotice("");


        const socket = socketRef.current;

        if (socket && chatId && !joinedChatsRef.current.has(chatId)) {
            socket.emit("chat:join", { chatId }, (result) => {
                if (result?.success) joinedChatsRef.current.add(chatId);
            });
        }


    };

    const handleSend = async (event) => {
        event.preventDefault();


        const content = messageInput.trim();

        if (!content || !activeChatId || sending) return;

        setSending(true);
        setError("");
        setMessageInput("");

        try {
            const response = await apiRequest(
                `/chat/${encodeURIComponent(activeChatId)}/messages`,
                {
                    method: "POST",
                    body: JSON.stringify({ content }),
                },
            );

            const message = response?.data;

            if (message) {
                const messageId = getId(message);

                if (messageId) sentMessageIdsRef.current.add(messageId);

                setMessages((previous) => {
                    if (
                        messageId &&
                        previous.some((item) => getId(item) === messageId)
                    ) {
                        return previous;
                    }

                    return [...previous, message];
                });

                setChats((previous) =>
                    previous.map((chat) =>
                        getId(chat) === activeChatId
                            ? {
                                ...chat,
                                lastMessage: message,
                                lastMessageAt: message.createdAt || new Date().toISOString(),
                            }
                            : chat,
                    ),
                );

                requestAnimationFrame(scrollToBottom);
            }
        } catch (requestError) {
            setMessageInput(content);
            setError(requestError.message || "Message could not be sent.");
        } finally {
            setSending(false);
            messageInputRef.current?.focus();
        }


    };

    const handleFiles = async (event) => {
        const files = Array.from(event.target.files || []);


        if (!files.length || !activeChatId) return;

        if (files.length > MAX_FILES) {
            setError(`You can upload a maximum of ${MAX_FILES} files at a time.`);
            event.target.value = "";
            return;
        }

        for (const file of files) {
            const extension = `.${file.name.split(".").pop().toLowerCase()}`;

            if (!ALLOWED_EXTENSIONS.includes(extension)) {
                setError(`Unsupported file type: ${file.name}`);
                event.target.value = "";
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setError(`${file.name} exceeds the 10 MB file-size limit.`);
                event.target.value = "";
                return;
            }

            if (file.size === 0) {
                setError(`${file.name} is empty.`);
                event.target.value = "";
                return;
            }
        }

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("documents", file);
        });

        const content = messageInput.trim();

        if (content) {
            formData.append("content", content);
        }

        setUploading(true);
        setError("");
        setMessageInput("");

        try {
            const response = await apiRequest(
                `/chat/${encodeURIComponent(activeChatId)}/attachments`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            const message = response?.data;

            if (message) {
                setMessages((previous) => {
                    const messageId = getId(message);

                    if (
                        messageId &&
                        previous.some((item) => getId(item) === messageId)
                    ) {
                        return previous;
                    }

                    return [...previous, message];
                });

                setChats((previous) =>
                    previous.map((chat) =>
                        getId(chat) === activeChatId
                            ? {
                                ...chat,
                                lastMessage: message,
                                lastMessageAt: message.createdAt || new Date().toISOString(),
                            }
                            : chat,
                    ),
                );
            }

            requestAnimationFrame(scrollToBottom);
        } catch (uploadError) {
            setMessageInput(content);
            setError(uploadError.message || "Document upload failed.");
        } finally {
            setUploading(false);
            event.target.value = "";
        }


    };

    const createConversation = async (event) => {
        event.preventDefault();


        if (!newClientId) {
            setError("Select a client first.");
            return;
        }

        setCreating(true);
        setError("");

        try {
            const body = {
                clientId: newClientId,
                subject: newSubject.trim() || "Migration Support",
            };

            if (newApplicationId) {
                body.relatedApplication = newApplicationId;
            }

            const response = await apiRequest("/chat", {
                method: "POST",
                body: JSON.stringify(body),
            });

            const createdChat = response?.data;

            if (!createdChat?._id) {
                throw new Error("The server did not return the new conversation.");
            }

            setChats((previous) => {
                const exists = previous.some(
                    (chat) => getId(chat) === getId(createdChat),
                );

                return exists
                    ? previous.map((chat) =>
                        getId(chat) === getId(createdChat) ? createdChat : chat,
                    )
                    : [createdChat, ...previous];
            });

            setActiveChatId(getId(createdChat));
            setMobileChatOpen(true);
            setShowCreateModal(false);
            setNewClientId("");
            setNewApplicationId("");
            setNewSubject("Migration Support");
            setNotice("Conversation created successfully.");

            socketRef.current?.emit("chat:join", {
                chatId: getId(createdChat),
            });
        } catch (requestError) {
            setError(requestError.message || "Could not create conversation.");
        } finally {
            setCreating(false);
        }


    };

    const handleAttachmentOpen = async (attachment) => {
        if (!activeChatId) return;


        const attachmentId = getAttachmentId(attachment);

        if (!attachmentId) {
            setError("This attachment has no valid identifier.");
            return;
        }

        setLoadingPreview(true);
        setError("");

        try {
            const token = getToken();

            const response = await fetch(
                `${API_BASE}/chat/${encodeURIComponent(activeChatId)}/attachments/${encodeURIComponent(attachmentId)}?inline=true`,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                },
            );

            if (!response.ok) {
                let message = "Unable to open this attachment.";

                try {
                    const payload = await response.json();
                    message = payload.message || message;
                } catch {
                    // Ignore non-JSON response.
                }

                throw new Error(message);
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            setPreviewAttachment({
                name: getAttachmentName(attachment),
                mimeType: attachment.mimeType || blob.type,
                url: objectUrl,
            });
        } catch (requestError) {
            setError(requestError.message || "Unable to open attachment.");
        } finally {
            setLoadingPreview(false);
        }


    };

    const closePreview = () => {
        if (previewAttachment?.url) {
            URL.revokeObjectURL(previewAttachment.url);
        }


        setPreviewAttachment(null);


    };

    useEffect(() => {
        return () => {
            if (previewAttachment?.url) {
                URL.revokeObjectURL(previewAttachment.url);
            }
        };
    }, [previewAttachment]);

    const closeConversation = async () => {
        if (!activeChatId || !activeChat) return;


        const nextStatus = activeChat.status === "OPEN" ? "CLOSED" : "OPEN";

        try {
            const response = await apiRequest(
                `/chat/${encodeURIComponent(activeChatId)}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status: nextStatus }),
                },
            );

            const updatedChat = response?.data;

            setChats((previous) =>
                previous.map((chat) =>
                    getId(chat) === activeChatId
                        ? { ...chat, ...(updatedChat || {}), status: nextStatus }
                        : chat,
                ),
            );

            setNotice(`Conversation ${nextStatus.toLowerCase()}.`);
        } catch (requestError) {
            setError(requestError.message || "Unable to update conversation status.");
        }


    };

    const archiveConversation = async () => {
        if (!activeChatId || !activeChat) return;


        try {
            const response = await apiRequest(
                `/chat/${encodeURIComponent(activeChatId)}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status: "ARCHIVED" }),
                },
            );

            setChats((previous) =>
                previous.map((chat) =>
                    getId(chat) === activeChatId
                        ? { ...chat, ...(response?.data || {}), status: "ARCHIVED" }
                        : chat,
                ),
            );

            setNotice("Conversation archived.");
        } catch (requestError) {
            setError(requestError.message || "Unable to archive conversation.");
        }


    };

    const handleApplicationOpen = (application) => {
        setSelectedApplication(application);
    };

    const renderMessage = (message) => {
        const senderId = getId(message.sender);


        const mine = currentUserId && senderId
            ? currentUserId === senderId
            : false;

        const attachments = Array.isArray(message.attachments)
            ? message.attachments
            : [];

        const hasReadReceipt = (message.readBy || []).some(
            (entry) => getId(entry.user) !== senderId,
        );

        return (
            <div
                key={getId(message) || `${message.createdAt}-${message.content}`}
                className={`ac-message-row ${mine ? "ac-message-row--mine" : ""}`}
            >
                {!mine && <Avatar user={message.sender} size="small" />}

                <div className={`ac-message ${mine ? "ac-message--mine" : ""}`}>
                    {!mine && (
                        <span className="ac-message-sender">
                            {getDisplayName(message.sender)}
                        </span>
                    )}

                    {message.content && (
                        <p className="ac-message-content">{message.content}</p>
                    )}

                    {attachments.length > 0 && (
                        <div className="ac-message-attachments">
                            {attachments.map((attachment, index) => (
                                <AttachmentCard
                                    key={getAttachmentId(attachment) || index}
                                    attachment={attachment}
                                    onOpen={handleAttachmentOpen}
                                />
                            ))}
                        </div>
                    )}

                    <div className="ac-message-meta">
                        <span>{formatTime(message.createdAt)}</span>

                        {mine && (
                            <CheckCheck
                                size={14}
                                className={
                                    hasReadReceipt
                                        ? "ac-read-receipt ac-read-receipt--read"
                                        : "ac-read-receipt"
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        );


    };

    return (<div className="ac-page"> <header className="ac-page-header"> <div> <div className="ac-eyebrow">CLIENT RELATIONSHIP MANAGEMENT</div> <h1>Messages</h1> <p>Manage client conversations and migration applications.</p> </div>


        <button
            type="button"
            className="ac-primary-button"
            onClick={() => {
                setError("");
                setShowCreateModal(true);
            }}
        >
            <Plus size={18} />
            <span>New conversation</span>
        </button>
    </header>

        {(error || notice) && (
            <div
                className={`ac-alert ${error ? "ac-alert--error" : "ac-alert--success"}`}
                role={error ? "alert" : "status"}
            >
                {error && <CircleAlert size={17} />}
                <span>{error || notice}</span>

                <button
                    type="button"
                    onClick={() => {
                        setError("");
                        setNotice("");
                    }}
                    aria-label="Dismiss notification"
                >
                    <X size={16} />
                </button>
            </div>
        )}

        <main className="ac-workspace">
            <aside
                className={`ac-inbox ${mobileChatOpen ? "ac-inbox--mobile-hidden" : ""}`}
            >
                <div className="ac-inbox-heading">
                    <div>
                        <h2>Inbox</h2>
                        <span>{chats.length} conversations</span>
                    </div>

                    <button
                        type="button"
                        className="ac-icon-button"
                        onClick={loadChats}
                        title="Refresh conversations"
                        aria-label="Refresh conversations"
                    >
                        <RefreshCw size={17} />
                    </button>
                </div>

                <label className="ac-search">
                    <Search size={17} />

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search conversations..."
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <X size={15} />
                        </button>
                    )}
                </label>

                <div className="ac-filter-tabs">
                    {["ALL", "OPEN", "CLOSED", "ARCHIVED"].map((item) => (
                        <button
                            type="button"
                            key={item}
                            className={filter === item ? "is-active" : ""}
                            onClick={() => setFilter(item)}
                        >
                            {item === "ALL"
                                ? "All"
                                : item[0] + item.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div className="ac-conversation-list">
                    {loadingChats ? (
                        <div className="ac-centered-state">
                            <LoaderCircle className="ac-spin" size={25} />
                            <span>Loading conversations...</span>
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="ac-empty-state">
                            <span className="ac-empty-icon">
                                <MessageSquare size={25} />
                            </span>

                            <strong>No conversations found</strong>

                            <p>Start a conversation with a Colossus client.</p>

                            <button
                                type="button"
                                className="ac-text-button"
                                onClick={() => setShowCreateModal(true)}
                            >
                                Start a conversation
                            </button>
                        </div>
                    ) : (
                        filteredChats.map((chat) => {
                            const chatId = getId(chat);
                            const chatClient = getClientFromChat(chat);
                            const application = getApplication(chat);
                            const isActive = chatId === activeChatId;

                            return (
                                <button
                                    type="button"
                                    key={chatId}
                                    className={`ac-conversation ${isActive ? "ac-conversation--active" : ""}`}
                                    onClick={() => openChat(chatId)}
                                >
                                    <Avatar user={chatClient} />

                                    <span className="ac-conversation-main">
                                        <span className="ac-conversation-top">
                                            <strong>{getDisplayName(chatClient)}</strong>
                                            <time>
                                                {formatDate(chat.lastMessageAt || chat.updatedAt)}
                                            </time>
                                        </span>

                                        <span className="ac-conversation-subject">
                                            {chat.subject || "Migration Support"}
                                        </span>

                                        <span className="ac-conversation-bottom">
                                            <span className="ac-conversation-preview">
                                                {getMessagePreview(
                                                    typeof chat.lastMessage === "object"
                                                        ? chat.lastMessage
                                                        : null,
                                                )}
                                            </span>

                                            {application && (
                                                <span
                                                    className="ac-linked-indicator"
                                                    title="Application linked"
                                                >
                                                    <BriefcaseBusiness size={13} />
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>

                <div className="ac-inbox-footer">
                    <span className="ac-live-indicator" />
                    <span>Chat service</span>
                    <span className="ac-footer-live">API connected</span>
                </div>
            </aside>

            <section
                className={`ac-conversation-panel ${mobileChatOpen ? "ac-conversation-panel--mobile-visible" : ""}`}
            >
                {!activeChat ? (
                    <div className="ac-welcome">
                        <div className="ac-welcome-icon">
                            <MessageCircle size={34} />
                        </div>

                        <h2>Your conversations, in one place.</h2>

                        <p>
                            Select a client conversation to read messages, share documents,
                            and review linked migration applications.
                        </p>

                        <button
                            type="button"
                            className="ac-primary-button"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus size={18} />
                            Start a conversation
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="ac-chat-header">
                            <button
                                type="button"
                                className="ac-icon-button ac-mobile-back"
                                onClick={() => setMobileChatOpen(false)}
                                aria-label="Back to conversations"
                            >
                                <ArrowLeft size={19} />
                            </button>

                            <Avatar user={client} />

                            <div className="ac-chat-header-info">
                                <h2>{getDisplayName(client)}</h2>

                                <span>
                                    <span className="ac-status-dot" />
                                    {activeChat.status === "OPEN"
                                        ? "Conversation open"
                                        : `Conversation ${String(activeChat.status || "").toLowerCase()}`}
                                </span>
                            </div>

                            <div className="ac-chat-header-actions">
                                <button
                                    type="button"
                                    className="ac-secondary-button ac-status-action"
                                    onClick={closeConversation}
                                >
                                    {activeChat.status === "OPEN"
                                        ? "Close conversation"
                                        : "Reopen conversation"}
                                </button>

                                <button
                                    type="button"
                                    className="ac-icon-button"
                                    onClick={() => setShowDetails((value) => !value)}
                                    title={showDetails ? "Hide details" : "Show details"}
                                    aria-label={showDetails ? "Hide details" : "Show details"}
                                >
                                    {showDetails ? (
                                        <PanelRightClose size={19} />
                                    ) : (
                                        <PanelRightOpen size={19} />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="ac-icon-button"
                                    title="Archive conversation"
                                    aria-label="Archive conversation"
                                    onClick={archiveConversation}
                                >
                                    <Archive size={18} />
                                </button>
                            </div>
                        </div>

                        {linkedApplication && (
                            <div className="ac-chat-application-bar">
                                <BriefcaseBusiness size={16} />

                                <span>
                                    Application:{" "}
                                    <strong>{getApplicationLabel(linkedApplication)}</strong>
                                </span>

                                <span className="ac-application-destination">
                                    {getApplicationDestination(linkedApplication)}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => handleApplicationOpen(linkedApplication)}
                                >
                                    View details <ExternalLink size={14} />
                                </button>
                            </div>
                        )}

                        <div className="ac-message-area">
                            {loadingMessages ? (
                                <div className="ac-centered-state">
                                    <LoaderCircle className="ac-spin" size={26} />
                                    <span>Loading messages...</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="ac-empty-messages">
                                    <div className="ac-empty-icon">
                                        <MessageCircle size={25} />
                                    </div>

                                    <strong>This is the beginning of your conversation</strong>

                                    <p>
                                        Send a message or share a document with this client.
                                    </p>
                                </div>
                            ) : (
                                <div className="ac-message-list">
                                    <div className="ac-message-day">
                                        <span>Conversation history</span>
                                    </div>

                                    {messages.map(renderMessage)}

                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        <form className="ac-composer" onSubmit={handleSend}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                multiple
                                accept={ALLOWED_EXTENSIONS.join(",")}
                                onChange={handleFiles}
                            />

                            <div className="ac-composer-toolbar">
                                <button
                                    type="button"
                                    className="ac-composer-tool"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={
                                        uploading ||
                                        activeChat.status !== "OPEN"
                                    }
                                    title="Attach documents"
                                >
                                    {uploading ? (
                                        <LoaderCircle className="ac-spin" size={19} />
                                    ) : (
                                        <Paperclip size={19} />
                                    )}

                                    <span>
                                        {uploading ? "Uploading..." : "Attach files"}
                                    </span>
                                </button>

                                <span className="ac-composer-hint">
                                    PDF, Word or images · Max 5 files · 10 MB each
                                </span>
                            </div>

                            <div className="ac-composer-input-row">
                                <textarea
                                    ref={messageInputRef}
                                    value={messageInput}
                                    onChange={(event) => setMessageInput(event.target.value)}
                                    placeholder={
                                        activeChat.status === "OPEN"
                                            ? "Write a message to the client..."
                                            : "Reopen this conversation to send messages."
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            !event.shiftKey &&
                                            !event.nativeEvent.isComposing
                                        ) {
                                            event.preventDefault();
                                            handleSend(event);
                                        }
                                    }}
                                    rows={1}
                                    maxLength={10000}
                                    disabled={
                                        activeChat.status !== "OPEN" ||
                                        uploading
                                    }
                                />

                                <button
                                    type="submit"
                                    className="ac-send-button"
                                    disabled={
                                        !messageInput.trim() ||
                                        sending ||
                                        uploading ||
                                        activeChat.status !== "OPEN"
                                    }
                                    aria-label="Send message"
                                    title="Send message"
                                >
                                    {sending ? (
                                        <LoaderCircle className="ac-spin" size={19} />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>

                            <div className="ac-composer-bottom">
                                <span>
                                    <Clock3 size={13} />
                                    Messages are saved to the conversation.
                                </span>

                                <span>{messageInput.length}/10000</span>
                            </div>
                        </form>
                    </>
                )}
            </section>

            {showDetails && activeChat && (
                <aside className="ac-details-panel">
                    <div className="ac-details-heading">
                        <h3>Conversation details</h3>

                        <button
                            type="button"
                            className="ac-icon-button"
                            onClick={() => setShowDetails(false)}
                            aria-label="Close details"
                        >
                            <X size={17} />
                        </button>
                    </div>

                    <div className="ac-client-profile">
                        <Avatar user={client} size="large" />

                        <h2>{getDisplayName(client)}</h2>

                        <p>{client?.email || "Client email unavailable"}</p>

                        <span className="ac-client-role">
                            {client?.role || "Colossus client"}
                        </span>
                    </div>

                    <div className="ac-details-divider" />

                    <section className="ac-details-section">
                        <div className="ac-section-heading">
                            <BriefcaseBusiness size={17} />
                            <h4>Linked application</h4>
                        </div>

                        <ApplicationCard
                            application={linkedApplication}
                            onOpen={handleApplicationOpen}
                        />

                        {linkedApplication && (
                            <p className="ac-details-note">
                                This conversation is associated with the application
                                reference above.
                            </p>
                        )}
                    </section>

                    <div className="ac-details-divider" />

                    <section className="ac-details-section">
                        <div className="ac-section-heading">
                            <MessageSquare size={17} />
                            <h4>Conversation information</h4>
                        </div>

                        <div className="ac-detail-row">
                            <span>Subject</span>
                            <strong>
                                {activeChat.subject || "Migration Support"}
                            </strong>
                        </div>

                        <div className="ac-detail-row">
                            <span>Status</span>

                            <span
                                className={`ac-status-badge ac-status-badge--${String(activeChat.status || "OPEN").toLowerCase()}`}
                            >
                                {activeChat.status || "OPEN"}
                            </span>
                        </div>

                        <div className="ac-detail-row">
                            <span>Created</span>
                            <strong>
                                {activeChat.createdAt
                                    ? new Date(activeChat.createdAt).toLocaleDateString()
                                    : "—"}
                            </strong>
                        </div>

                        <div className="ac-detail-row">
                            <span>Last activity</span>
                            <strong>
                                {activeChat.lastMessageAt
                                    ? formatDate(activeChat.lastMessageAt)
                                    : "No messages"}
                            </strong>
                        </div>
                    </section>

                    <div className="ac-details-divider" />

                    <section className="ac-details-section">
                        <div className="ac-section-heading">
                            <UserRound size={17} />
                            <h4>Participants</h4>
                        </div>

                        {(activeChat.participants || []).map((participant) => (
                            <div
                                className="ac-participant"
                                key={getId(participant)}
                            >
                                <Avatar user={participant} size="small" />

                                <span>
                                    <strong>{getDisplayName(participant)}</strong>
                                    <small>{participant.role || "Participant"}</small>
                                </span>
                            </div>
                        ))}
                    </section>
                </aside>
            )}
        </main>

        {showCreateModal && (
            <div
                className="ac-modal-backdrop"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        setShowCreateModal(false);
                    }
                }}
            >
                <form className="ac-modal" onSubmit={createConversation}>
                    <div className="ac-modal-heading">
                        <div>
                            <span className="ac-eyebrow">CLIENT COMMUNICATION</span>
                            <h2>New conversation</h2>

                            <p>
                                Start a conversation and optionally link a migration
                                application.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="ac-icon-button"
                            onClick={() => setShowCreateModal(false)}
                            aria-label="Close"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    <label className="ac-form-field">
                        <span>
                            Select client <b>*</b>
                        </span>

                        <select
                            value={newClientId}
                            onChange={(event) => setNewClientId(event.target.value)}
                            required
                        >
                            <option value="">
                                {loadingClients ? "Loading clients..." : "Choose a client..."}
                            </option>

                            {clientOptions.map((user) => (
                                <option key={getId(user)} value={getId(user)}>
                                    {getDisplayName(user)}{user.email ? ` — ${user.email}` : ""}
                                </option>
                            ))}
                        </select>

                        {!loadingClients && clientOptions.length === 0 && (
                            <small>
                                No clients were returned by the admin client-list endpoint.
                                Refresh the page or check the backend response.
                            </small>
                        )}
                    </label>

                    <label className="ac-form-field">
                        <span>Conversation subject</span>

                        <input
                            value={newSubject}
                            onChange={(event) => setNewSubject(event.target.value)}
                            placeholder="e.g. Canada migration application"
                            maxLength={200}
                        />
                    </label>

                    <label className="ac-form-field">
                        <span>
                            Link migration application <small>(optional)</small>
                        </span>

                        <select
                            value={newApplicationId}
                            onChange={(event) => setNewApplicationId(event.target.value)}
                            disabled={!newClientId || loadingApplications}
                        >
                            <option value="">
                                {loadingApplications
                                    ? "Loading applications..."
                                    : "No application selected"}
                            </option>

                            {applicationOptions.map((application) => (
                                <option
                                    key={getId(application)}
                                    value={getId(application)}
                                >
                                    {getApplicationLabel(application)} —{" "}
                                    {getApplicationDestination(application)}
                                </option>
                            ))}
                        </select>

                        {newClientId &&
                            !loadingApplications &&
                            applicationOptions.length === 0 && (
                                <small>
                                    No applications were returned by the attempted existing
                                    application endpoints. You can still create the
                                    conversation without an application reference.
                                </small>
                            )}
                    </label>

                    <div className="ac-modal-footer">
                        <button
                            type="button"
                            className="ac-secondary-button"
                            onClick={() => setShowCreateModal(false)}
                            disabled={creating}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="ac-primary-button"
                            disabled={creating || !newClientId}
                        >
                            {creating ? (
                                <>
                                    <LoaderCircle className="ac-spin" size={17} />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus size={17} />
                                    Create conversation
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {selectedApplication && (
            <div
                className="ac-modal-backdrop"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        setSelectedApplication(null);
                    }
                }}
            >
                <div className="ac-modal ac-application-modal">
                    <div className="ac-modal-heading">
                        <div>
                            <span className="ac-eyebrow">MIGRATION APPLICATION</span>

                            <h2>{getApplicationLabel(selectedApplication)}</h2>

                            <p>{getApplicationDestination(selectedApplication)}</p>
                        </div>

                        <button
                            type="button"
                            className="ac-icon-button"
                            onClick={() => setSelectedApplication(null)}
                            aria-label="Close application details"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    <div className="ac-application-detail-grid">
                        <div>
                            <span>Application / Program</span>
                            <strong>{getApplicationLabel(selectedApplication)}</strong>
                        </div>

                        <div>
                            <span>Destination</span>
                            <strong>
                                {getApplicationDestination(selectedApplication)}
                            </strong>
                        </div>

                        <div>
                            <span>Status</span>
                            <strong>{getApplicationStatus(selectedApplication)}</strong>
                        </div>

                        <div>
                            <span>Submitted</span>
                            <strong>
                                {selectedApplication.submittedAt ||
                                    selectedApplication.createdAt
                                    ? new Date(
                                        selectedApplication.submittedAt ||
                                        selectedApplication.createdAt,
                                    ).toLocaleDateString()
                                    : "Not available"}
                            </strong>
                        </div>
                    </div>

                    <p className="ac-application-disclaimer">
                        Application information is displayed using fields returned by
                        your existing API. No application records are changed by this
                        view.
                    </p>

                    <div className="ac-modal-footer">
                        <button
                            type="button"
                            className="ac-primary-button"
                            onClick={() => setSelectedApplication(null)}
                        >
                            Close details
                        </button>
                    </div>
                </div>
            </div>
        )}

        {previewAttachment && (
            <div
                className="ac-preview-backdrop"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) closePreview();
                }}
            >
                <section className="ac-preview-modal">
                    <header className="ac-preview-header">
                        <div>
                            <FileText size={19} />
                            <strong>{previewAttachment.name}</strong>
                        </div>

                        <button
                            type="button"
                            className="ac-icon-button"
                            onClick={closePreview}
                            aria-label="Close preview"
                        >
                            <X size={19} />
                        </button>
                    </header>

                    <div className="ac-preview-content">
                        {previewAttachment.mimeType === "application/pdf" ? (
                            <iframe
                                title={previewAttachment.name}
                                src={previewAttachment.url}
                                className="ac-preview-frame"
                            />
                        ) : previewAttachment.mimeType?.startsWith("image/") ? (
                            <img
                                src={previewAttachment.url}
                                alt={previewAttachment.name}
                                className="ac-preview-image"
                            />
                        ) : (
                            <div className="ac-preview-unavailable">
                                <FileText size={38} />
                                <h3>Preview unavailable</h3>
                                <p>This document type must be downloaded to view.</p>

                                <a
                                    href={previewAttachment.url}
                                    download={previewAttachment.name}
                                    className="ac-primary-button"
                                >
                                    <Download size={17} />
                                    Download document
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        )}

        {loadingPreview && (
            <div className="ac-loading-toast">
                <LoaderCircle className="ac-spin" size={18} />
                Opening document...
            </div>
        )}
    </div>


    );
};

export default AdminChat;
