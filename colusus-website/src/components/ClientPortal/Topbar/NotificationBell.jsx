import { useCallback, useEffect, useRef, useState } from "react";

import {
    HiOutlineBell,
    HiOutlineCheck,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineInbox,
    HiOutlineX,
} from "react-icons/hi";

import notificationService from "../../../services/notification.service";

import "./NotificationBell.css";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const getNotificationId = (notification) =>
    notification?._id || notification?.id;

const getNotificationDate = (notification) => {
    const date =
        notification?.createdAt ||
        notification?.timestamp ||
        notification?.date;

    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getNotificationList = (response) => {
    const data = response?.data ?? response;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.notifications)) {
        return data.notifications;
    }

    if (Array.isArray(data?.data?.notifications)) {
        return data.data.notifications;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
};

const getUnreadCount = (response) => {
    const data = response?.data ?? response;

    const count =
        data?.unreadCount ??
        data?.count ??
        data?.data?.unreadCount ??
        data?.data?.count;

    return Number.isFinite(Number(count)) ? Number(count) : 0;
};

const isNotificationUnread = (notification) =>
    notification?.read === false ||
    notification?.isRead === false ||
    (!notification?.readAt && !notification?.isRead);

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const NotificationBell = () => {
    const containerRef = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [processingIds, setProcessingIds] = useState([]);
    const [markingAll, setMarkingAll] = useState(false);

    /* ------------------------------------------------------------------------ */
    /* LOAD NOTIFICATIONS                                                       */
    /* ------------------------------------------------------------------------ */

    const loadNotifications = useCallback(async () => {
        try {
            setError("");

            const [notificationResponse, unreadResponse] = await Promise.all([
                notificationService.getNotifications({
                    page: 1,
                    limit: 8,
                }),

                notificationService.getUnreadCount(),
            ]);

            setNotifications(getNotificationList(notificationResponse));

            setUnreadCount(getUnreadCount(unreadResponse));
        } catch (requestError) {
            console.error(
                "Failed to load client notifications:",
                requestError,
            );

            setError(
                requestError?.response?.data?.message ||
                "Unable to load notifications.",
            );
        }
    }, []);

    /* ------------------------------------------------------------------------ */
    /* INITIAL LOAD + REFRESH                                                   */
    /* ------------------------------------------------------------------------ */

    useEffect(() => {
        loadNotifications();

        const interval = window.setInterval(() => {
            loadNotifications();
        }, 60000);

        return () => {
            window.clearInterval(interval);
        };
    }, [loadNotifications]);

    /* ------------------------------------------------------------------------ */
    /* LOAD WHEN OPENED                                                         */
    /* ------------------------------------------------------------------------ */

    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);

        loadNotifications().finally(() => {
            setLoading(false);
        });
    }, [isOpen, loadNotifications]);

    /* ------------------------------------------------------------------------ */
    /* CLOSE WHEN CLICKING OUTSIDE                                              */
    /* ------------------------------------------------------------------------ */

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    /* ------------------------------------------------------------------------ */
    /* MARK ONE AS READ                                                         */
    /* ------------------------------------------------------------------------ */

    const handleMarkAsRead = async (notification) => {
        const notificationId = getNotificationId(notification);

        if (!notificationId) return;

        if (!isNotificationUnread(notification)) return;

        if (processingIds.includes(notificationId)) return;

        setProcessingIds((previous) => [...previous, notificationId]);

        try {
            await notificationService.markAsRead(notificationId);

            setNotifications((previous) =>
                previous.map((item) =>
                    getNotificationId(item) === notificationId
                        ? {
                            ...item,
                            read: true,
                            isRead: true,
                            readAt: new Date().toISOString(),
                        }
                        : item,
                ),
            );

            setUnreadCount((previous) => Math.max(0, previous - 1));
        } catch (requestError) {
            console.error(
                "Failed to mark notification as read:",
                requestError,
            );

            setError("Unable to update this notification.");
        } finally {
            setProcessingIds((previous) =>
                previous.filter((id) => id !== notificationId),
            );
        }
    };

    /* ------------------------------------------------------------------------ */
    /* MARK ALL AS READ                                                         */
    /* ------------------------------------------------------------------------ */

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0 || markingAll) return;

        setMarkingAll(true);
        setError("");

        try {
            await notificationService.markAllAsRead();

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    read: true,
                    isRead: true,
                    readAt: new Date().toISOString(),
                })),
            );

            setUnreadCount(0);
        } catch (requestError) {
            console.error(
                "Failed to mark all notifications as read:",
                requestError,
            );

            setError("Unable to mark all notifications as read.");
        } finally {
            setMarkingAll(false);
        }
    };

    /* ------------------------------------------------------------------------ */
    /* OPEN NOTIFICATION                                                        */
    /* ------------------------------------------------------------------------ */

    const handleOpenNotification = async (notification) => {
        await handleMarkAsRead(notification);

        /*
         * Close the dropdown.
         *
         * We deliberately do not invent navigation routes here.
         * Connect notification-specific destinations to your existing
         * client portal routes when those destinations are confirmed.
         */

        setIsOpen(false);
    };

    /* ------------------------------------------------------------------------ */
    /* RENDER                                                                   */
    /* ------------------------------------------------------------------------ */

    return (
        <div className="notificationBell" ref={containerRef}>
            <button
                type="button"
                className={`notificationBell__trigger ${isOpen ? "is-open" : ""
                    }`}
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label={
                    unreadCount > 0
                        ? `${unreadCount} unread notifications`
                        : "Notifications"
                }
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                <HiOutlineBell />

                {unreadCount > 0 && (
                    <span className="notificationBell__badge">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <section
                    className="notificationBell__dropdown"
                    role="dialog"
                    aria-label="Your notifications"
                >
                    {/* HEADER */}

                    <header className="notificationBell__header">
                        <div>
                            <div className="notificationBell__heading">
                                Notifications
                            </div>

                            <p className="notificationBell__subtitle">
                                Updates about your migration journey
                            </p>
                        </div>

                        <button
                            type="button"
                            className="notificationBell__close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close notifications"
                        >
                            <HiOutlineX />
                        </button>
                    </header>

                    {/* ACTIONS */}

                    {unreadCount > 0 && (
                        <div className="notificationBell__actions">
                            <span>
                                {unreadCount} unread
                            </span>

                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={markingAll}
                            >
                                <HiOutlineCheckCircle />

                                {markingAll ? "Updating..." : "Mark all as read"}
                            </button>
                        </div>
                    )}

                    {/* ERROR */}

                    {error && (
                        <div className="notificationBell__error">
                            <span>{error}</span>

                            <button
                                type="button"
                                onClick={loadNotifications}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* NOTIFICATION LIST */}

                    <div className="notificationBell__list">
                        {loading ? (
                            <div className="notificationBell__state">
                                <span className="notificationBell__spinner" />

                                <span>Loading notifications...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="notificationBell__empty">
                                <div className="notificationBell__emptyIcon">
                                    <HiOutlineInbox />
                                </div>

                                <strong>You're all caught up</strong>

                                <p>
                                    New updates about your applications and documents
                                    will appear here.
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const notificationId =
                                    getNotificationId(notification);

                                const unread =
                                    isNotificationUnread(notification);

                                const title =
                                    notification?.title || "Colossus update";

                                const message =
                                    notification?.message ||
                                    notification?.body ||
                                    "You have a new update.";

                                const date = getNotificationDate(notification);

                                return (
                                    <article
                                        key={notificationId}
                                        className={`notificationBell__item ${unread ? "is-unread" : ""
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            className="notificationBell__itemContent"
                                            onClick={() =>
                                                handleOpenNotification(notification)
                                            }
                                        >
                                            <span className="notificationBell__itemIcon">
                                                {unread ? (
                                                    <HiOutlineBell />
                                                ) : (
                                                    <HiOutlineCheck />
                                                )}
                                            </span>

                                            <span className="notificationBell__itemText">
                                                <strong>{title}</strong>

                                                <span className="notificationBell__message">
                                                    {message}
                                                </span>

                                                {date && (
                                                    <span className="notificationBell__date">
                                                        <HiOutlineClock />
                                                        {date}
                                                    </span>
                                                )}
                                            </span>

                                            {unread && (
                                                <span className="notificationBell__unreadDot" />
                                            )}
                                        </button>

                                        {unread && (
                                            <button
                                                type="button"
                                                className="notificationBell__markRead"
                                                aria-label="Mark notification as read"
                                                title="Mark as read"
                                                disabled={processingIds.includes(
                                                    notificationId,
                                                )}
                                                onClick={() =>
                                                    handleMarkAsRead(notification)
                                                }
                                            >
                                                <HiOutlineCheck />
                                            </button>
                                        )}
                                    </article>
                                );
                            })
                        )}
                    </div>

                    {/* FOOTER */}

                    <footer className="notificationBell__footer">
                        <span>
                            Colossus Migration
                        </span>

                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                loadNotifications();
                            }}
                        >
                            Refresh
                        </button>
                    </footer>
                </section>
            )}
        </div>
    );
};

export default NotificationBell;