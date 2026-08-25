import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiOutlineBell,
    HiOutlineCheck,
    HiOutlineCheckCircle,
    HiOutlineChevronRight,
    HiOutlineClock,
    HiOutlineDocumentText,
    HiOutlineExclamationCircle,
    HiOutlineTrash,
    HiOutlineRefresh,
} from "react-icons/hi";

import notificationService from "../../../services/notification.service";

import "./ClientUpdates.css";


/*
============================================================
HELPERS
============================================================
*/

const formatNotificationDate = (date) => {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const now = new Date();

    const diff =
        now.getTime() -
        parsedDate.getTime();

    const minute =
        60 * 1000;

    const hour =
        60 * minute;

    const day =
        24 * hour;

    if (diff < minute) {
        return "Just now";
    }

    if (diff < hour) {
        const minutes =
            Math.floor(diff / minute);

        return `${minutes}m ago`;
    }

    if (diff < day) {
        const hours =
            Math.floor(diff / hour);

        return `${hours}h ago`;
    }

    if (
        parsedDate.toDateString() ===
        new Date(
            now.getTime() - day,
        ).toDateString()
    ) {
        return "Yesterday";
    }

    return parsedDate.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    );
};


const getNotificationGroup = (
    date,
) => {
    if (!date) {
        return "Earlier";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime(),
        )
    ) {
        return "Earlier";
    }

    const now = new Date();

    const today =
        now.toDateString();

    const yesterday =
        new Date(
            now.getTime() -
            24 * 60 * 60 * 1000,
        ).toDateString();

    if (
        parsedDate.toDateString() ===
        today
    ) {
        return "Today";
    }

    if (
        parsedDate.toDateString() ===
        yesterday
    ) {
        return "Yesterday";
    }

    return "Earlier";
};


const getNotificationConfig = (
    type,
) => {
    switch (type) {
        case "DOCUMENT_APPROVED":
            return {
                icon:
                    HiOutlineCheckCircle,

                className:
                    "approved",

                label:
                    "Document approved",
            };

        case "DOCUMENT_REJECTED":
            return {
                icon:
                    HiOutlineExclamationCircle,

                className:
                    "rejected",

                label:
                    "Document rejected",
            };

        case "DOCUMENT_REUPLOAD":
            return {
                icon:
                    HiOutlineRefresh,

                className:
                    "action",

                label:
                    "Action required",
            };

        case "APPLICATION_STATUS_CHANGED":
            return {
                icon:
                    HiOutlineClock,

                className:
                    "status",

                label:
                    "Application update",
            };

        case "APPLICATION_UPDATE":
            return {
                icon:
                    HiOutlineDocumentText,

                className:
                    "application",

                label:
                    "Application update",
            };

        default:
            return {
                icon:
                    HiOutlineBell,

                className:
                    "general",

                label:
                    "Update",
            };
    }
};


/*
============================================================
CLIENT UPDATES
============================================================
*/

const ClientUpdates = () => {
    const [
        notifications,
        setNotifications,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        activeFilter,
        setActiveFilter,
    ] = useState("ALL");

    const [
        unreadCount,
        setUnreadCount,
    ] = useState(0);

    const [
        processingId,
        setProcessingId,
    ] = useState(null);


    /*
    ==========================================================
    LOAD NOTIFICATIONS
    ==========================================================
    */

    const loadNotifications =
        useCallback(
            async ({
                silent = false,
            } = {}) => {
                try {
                    if (silent) {
                        setRefreshing(true);
                    } else {
                        setLoading(true);
                    }

                    setError("");

                    const response =
                        await notificationService.getNotifications(
                            {
                                limit: 100,
                            },
                        );

                    const result =
                        response?.data ||
                        response ||
                        {};

                    const list =
                        Array.isArray(
                            result,
                        )
                            ? result
                            : Array.isArray(
                                result.notifications,
                            )
                                ? result.notifications
                                : [];

                    setNotifications(
                        list,
                    );

                    if (
                        typeof result.unreadCount ===
                        "number"
                    ) {
                        setUnreadCount(
                            result.unreadCount,
                        );
                    } else {
                        setUnreadCount(
                            list.filter(
                                (item) =>
                                    !item.read,
                            ).length,
                        );
                    }
                } catch (requestError) {
                    console.error(
                        "FAILED TO LOAD NOTIFICATIONS:",
                        requestError,
                    );

                    setError(
                        requestError
                            ?.response
                            ?.data
                            ?.message ||
                        "Unable to load your updates.",
                    );
                } finally {
                    setLoading(false);
                    setRefreshing(false);
                }
            },
            [],
        );


    /*
    ==========================================================
    INITIAL LOAD
    ==========================================================
    */

    useEffect(() => {
        loadNotifications();
    }, [
        loadNotifications,
    ]);


    /*
    ==========================================================
    FILTER
    ==========================================================
    */

    const filteredNotifications =
        useMemo(() => {
            if (
                activeFilter ===
                "UNREAD"
            ) {
                return notifications.filter(
                    (notification) =>
                        !notification.read,
                );
            }

            return notifications;
        }, [
            notifications,
            activeFilter,
        ]);


    /*
    ==========================================================
    GROUP
    ==========================================================
    */

    const groupedNotifications =
        useMemo(() => {
            const groups = {
                Today: [],
                Yesterday: [],
                Earlier: [],
            };

            filteredNotifications.forEach(
                (notification) => {
                    const group =
                        getNotificationGroup(
                            notification.createdAt,
                        );

                    if (!groups[group]) {
                        groups[group] = [];
                    }

                    groups[group].push(
                        notification,
                    );
                },
            );

            return Object.entries(
                groups,
            ).filter(
                ([, items]) =>
                    items.length > 0,
            );
        }, [
            filteredNotifications,
        ]);


    /*
    ==========================================================
    MARK AS READ
    ==========================================================
    */

    const handleMarkAsRead =
        async (notification) => {
            if (
                notification.read ||
                processingId
            ) {
                return;
            }

            try {
                setProcessingId(
                    notification._id,
                );

                await notificationService.markAsRead(
                    notification._id,
                );

                setNotifications(
                    (current) =>
                        current.map(
                            (item) =>
                                item._id ===
                                    notification._id
                                    ? {
                                        ...item,
                                        read: true,
                                    }
                                    : item,
                        ),
                );

                setUnreadCount(
                    (current) =>
                        Math.max(
                            current - 1,
                            0,
                        ),
                );
            } catch (requestError) {
                console.error(
                    "FAILED TO MARK NOTIFICATION AS READ:",
                    requestError,
                );
            } finally {
                setProcessingId(null);
            }
        };


    /*
    ==========================================================
    MARK ALL AS READ
    ==========================================================
    */

    const handleMarkAllAsRead =
        async () => {
            if (!unreadCount) {
                return;
            }

            try {
                setProcessingId(
                    "all",
                );

                await notificationService.markAllAsRead();

                setNotifications(
                    (current) =>
                        current.map(
                            (item) => ({
                                ...item,
                                read: true,
                            }),
                        ),
                );

                setUnreadCount(0);
            } catch (requestError) {
                console.error(
                    "FAILED TO MARK ALL NOTIFICATIONS AS READ:",
                    requestError,
                );
            } finally {
                setProcessingId(null);
            }
        };


    /*
    ==========================================================
    DELETE
    ==========================================================
    */

    const handleDelete =
        async (notification) => {
            if (
                processingId
            ) {
                return;
            }

            try {
                setProcessingId(
                    notification._id,
                );

                await notificationService.deleteNotification(
                    notification._id,
                );

                setNotifications(
                    (current) =>
                        current.filter(
                            (item) =>
                                item._id !==
                                notification._id,
                        ),
                );

                if (
                    !notification.read
                ) {
                    setUnreadCount(
                        (current) =>
                            Math.max(
                                current - 1,
                                0,
                            ),
                    );
                }
            } catch (requestError) {
                console.error(
                    "FAILED TO DELETE NOTIFICATION:",
                    requestError,
                );
            } finally {
                setProcessingId(null);
            }
        };


    /*
    ==========================================================
    RETRY
    ==========================================================
    */

    const handleRetry =
        () => {
            loadNotifications({
                silent: false,
            });
        };


    /*
    ==========================================================
    RENDER
    ==========================================================
    */

    return (
        <main className="client-updates">

            {/* ==================================================
          HEADER
      ================================================== */}

            <header className="updates-header">

                <div className="updates-header-copy">

                    <span className="updates-eyebrow">
                        COLUSUS UPDATES
                    </span>

                    <h1>
                        Stay up to date
                    </h1>

                    <p>
                        Important updates about your
                        applications, documents and
                        migration journey will appear here.
                    </p>

                </div>


                <div className="updates-header-actions">

                    <button
                        type="button"
                        className="updates-refresh"
                        onClick={() =>
                            loadNotifications({
                                silent: true,
                            })
                        }
                        disabled={refreshing}
                    >
                        <HiOutlineRefresh
                            className={
                                refreshing
                                    ? "is-refreshing"
                                    : ""
                            }
                        />

                        <span>
                            Refresh
                        </span>
                    </button>

                </div>

            </header>


            {/* ==================================================
          SUMMARY
      ================================================== */}

            <section className="updates-summary">

                <div className="updates-summary-icon">
                    <HiOutlineBell />
                </div>

                <div className="updates-summary-copy">

                    <span>
                        Notifications
                    </span>

                    <strong>
                        {notifications.length}
                    </strong>

                    <small>
                        Total updates
                    </small>

                </div>


                <div className="updates-summary-divider" />


                <div className="updates-summary-copy">

                    <span>
                        Unread
                    </span>

                    <strong>
                        {unreadCount}
                    </strong>

                    <small>
                        Need your attention
                    </small>

                </div>


                <div className="updates-summary-action">

                    <button
                        type="button"
                        onClick={
                            handleMarkAllAsRead
                        }
                        disabled={
                            !unreadCount ||
                            processingId === "all"
                        }
                    >
                        <HiOutlineCheck />

                        Mark all as read

                    </button>

                </div>

            </section>


            {/* ==================================================
          FILTERS
      ================================================== */}

            <div className="updates-toolbar">

                <div className="updates-filters">

                    <button
                        type="button"
                        className={
                            activeFilter ===
                                "ALL"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter(
                                "ALL",
                            )
                        }
                    >
                        All

                        <span>
                            {notifications.length}
                        </span>
                    </button>


                    <button
                        type="button"
                        className={
                            activeFilter ===
                                "UNREAD"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter(
                                "UNREAD",
                            )
                        }
                    >
                        Unread

                        <span>
                            {unreadCount}
                        </span>
                    </button>

                </div>

            </div>


            {/* ==================================================
          ERROR
      ================================================== */}

            {error && (
                <div className="updates-error">

                    <HiOutlineExclamationCircle />

                    <div>
                        <strong>
                            Couldn't load updates
                        </strong>

                        <span>
                            {error}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleRetry
                        }
                    >
                        Try again
                    </button>

                </div>
            )}


            {/* ==================================================
          LOADING
      ================================================== */}

            {loading ? (

                <section className="updates-loading">

                    {[
                        1,
                        2,
                        3,
                    ].map(
                        (item) => (
                            <div
                                key={item}
                                className="updates-loading-card"
                            >
                                <span />
                                <div>
                                    <b />
                                    <i />
                                    <em />
                                </div>
                            </div>
                        ),
                    )}

                </section>

            ) : filteredNotifications.length ===
                0 ? (

                /* ================================================
                   EMPTY
                ================================================= */

                <section className="updates-empty">

                    <div className="updates-empty-icon">
                        <HiOutlineBell />
                    </div>

                    <span>
                        {activeFilter ===
                            "UNREAD"
                            ? "ALL CAUGHT UP"
                            : "NO UPDATES YET"}
                    </span>

                    <h2>
                        {activeFilter ===
                            "UNREAD"
                            ? "You're all caught up"
                            : "Nothing new here"}
                    </h2>

                    <p>
                        {activeFilter ===
                            "UNREAD"
                            ? "You have no unread notifications right now."
                            : "Updates from your Colusus application journey will appear here."}
                    </p>

                </section>

            ) : (

                /* ================================================
                   NOTIFICATION GROUPS
                ================================================= */

                <section className="updates-feed">

                    {groupedNotifications.map(
                        ([group, items]) => (
                            <div
                                key={group}
                                className="updates-group"
                            >

                                <div className="updates-group-heading">
                                    <span>
                                        {group}
                                    </span>

                                    <i />
                                </div>


                                <div className="updates-list">

                                    {items.map(
                                        (
                                            notification,
                                        ) => {

                                            const config =
                                                getNotificationConfig(
                                                    notification.type,
                                                );

                                            const Icon =
                                                config.icon;

                                            const isProcessing =
                                                processingId ===
                                                notification._id;

                                            return (
                                                <article
                                                    key={
                                                        notification._id
                                                    }
                                                    className={`
                            update-card
                            ${!notification.read
                                                            ? "unread"
                                                            : ""
                                                        }
                          `}
                                                >

                                                    {/* UNREAD MARKER */}

                                                    {!notification.read && (
                                                        <span className="update-unread-dot" />
                                                    )}


                                                    {/* ICON */}

                                                    <div
                                                        className={`
                              update-icon
                              ${config.className}
                            `}
                                                    >
                                                        <Icon />
                                                    </div>


                                                    {/* CONTENT */}

                                                    <div className="update-content">

                                                        <div className="update-topline">

                                                            <span className="update-type">
                                                                {config.label}
                                                            </span>

                                                            <time>
                                                                {formatNotificationDate(
                                                                    notification.createdAt,
                                                                )}
                                                            </time>

                                                        </div>


                                                        <h3>
                                                            {notification.title}
                                                        </h3>


                                                        <p>
                                                            {notification.message}
                                                        </p>


                                                        {/* METADATA */}

                                                        {notification.metadata && (
                                                            <div className="update-meta">

                                                                {notification
                                                                    .metadata
                                                                    .documentName && (
                                                                        <span>
                                                                            <HiOutlineDocumentText />

                                                                            {
                                                                                notification
                                                                                    .metadata
                                                                                    .documentName
                                                                            }
                                                                        </span>
                                                                    )}

                                                                {notification
                                                                    .metadata
                                                                    .applicationId && (
                                                                        <span>
                                                                            Application
                                                                        </span>
                                                                    )}

                                                            </div>
                                                        )}


                                                        {/* ACTIONS */}

                                                        <div className="update-actions">

                                                            {!notification.read && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleMarkAsRead(
                                                                            notification,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isProcessing
                                                                    }
                                                                >
                                                                    <HiOutlineCheck />

                                                                    Mark as read
                                                                </button>
                                                            )}

                                                            {notification
                                                                .metadata
                                                                ?.applicationId && (
                                                                    <button
                                                                        type="button"
                                                                        className="update-view-button"
                                                                        onClick={() =>
                                                                            handleMarkAsRead(
                                                                                notification,
                                                                            )
                                                                        }
                                                                    >
                                                                        View update

                                                                        <HiOutlineChevronRight />
                                                                    </button>
                                                                )}

                                                        </div>

                                                    </div>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="update-delete"
                                                        aria-label="Delete notification"
                                                        onClick={() =>
                                                            handleDelete(
                                                                notification,
                                                            )
                                                        }
                                                        disabled={
                                                            isProcessing
                                                        }
                                                    >
                                                        <HiOutlineTrash />
                                                    </button>

                                                </article>
                                            );
                                        },
                                    )}

                                </div>

                            </div>
                        ),
                    )}

                </section>

            )}

        </main>
    );
};


export default ClientUpdates;