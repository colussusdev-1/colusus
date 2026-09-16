import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiOutlineArrowRight,
    HiOutlineBell,
    HiOutlineCheck,
    HiOutlineCreditCard,
    HiOutlineDocumentText,
    HiOutlineFolderOpen,
    HiOutlineInformationCircle,
    HiOutlineRefresh,
    HiOutlineTrash,
    HiOutlineUser,
    HiOutlineCalendar,
    HiOutlineChatAlt2,
} from "react-icons/hi";

import {
    useNavigate,
} from "react-router-dom";

import notificationsService
    from "./notifications.service";

import "./AdminNotifications.css";


/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const PAGE_SIZE = 30;


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const toUpper = (value) => {
    return String(
        value || "",
    )
        .trim()
        .toUpperCase();
};


const formatStatus = (value) => {
    if (!value) {
        return "—";
    }

    return String(value)
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase(),
        );
};


const formatType = (value) => {
    if (!value) {
        return "Notification";
    }

    return String(value)
        .replace(/[_-]+/g, " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase(),
        );
};


const formatDate = (value) => {
    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    ).format(date);
};


const getRelativeTime = (value) => {
    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "";
    }

    const difference =
        Date.now() -
        date.getTime();

    const seconds =
        Math.floor(
            difference / 1000,
        );

    if (seconds < 60) {
        return "Just now";
    }

    const minutes =
        Math.floor(
            seconds / 60,
        );

    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours =
        Math.floor(
            minutes / 60,
        );

    if (hours < 24) {
        return `${hours}h`;
    }

    const days =
        Math.floor(
            hours / 24,
        );

    if (days < 7) {
        return `${days}d`;
    }

    return formatDate(value);
};


/*
|--------------------------------------------------------------------------
| RESPONSE NORMALIZER
|--------------------------------------------------------------------------
|
| Supports all of these:
|
| 1. service returns:
|
|    {
|      notifications: [],
|      pagination: {},
|      unreadCount: 0
|    }
|
| 2. service returns:
|
|    {
|      data: {
|        notifications: [],
|        pagination: {},
|        unreadCount: 0
|      }
|    }
|
| 3. axios response:
|
|    {
|      data: {
|        success: true,
|        data: {
|          notifications: [],
|          pagination: {},
|          unreadCount: 0
|        }
|      }
|    }
|
| 4. axios response where service has already partially
|    unwrapped the response.
|
|--------------------------------------------------------------------------
*/

const normalizeNotificationResponse = (
    response,
) => {

    let current =
        response;


    /*
    ----------------------------------------------------------
    UNWRAP REPEATED DATA OBJECTS
    ----------------------------------------------------------
    */

    for (
        let index = 0;
        index < 5;
        index += 1
    ) {

        if (
            Array.isArray(
                current,
            )
        ) {
            return {
                notifications:
                    current,

                pagination:
                    null,

                unreadCount:
                    null,
            };
        }


        if (
            !current ||
            typeof current !==
            "object"
        ) {
            break;
        }


        /*
        ------------------------------------------------------
        ALREADY AT ACTUAL PAYLOAD
        ------------------------------------------------------
        */

        if (
            Array.isArray(
                current.notifications,
            )
        ) {
            return {
                notifications:
                    current.notifications,

                pagination:
                    current.pagination ||
                    null,

                unreadCount:
                    typeof current.unreadCount ===
                        "number"
                        ? current.unreadCount
                        : null,
            };
        }


        /*
        ------------------------------------------------------
        NESTED DATA
        ------------------------------------------------------
        */

        if (
            current.data &&
            typeof current.data ===
            "object"
        ) {

            current =
                current.data;

            continue;
        }


        /*
        ------------------------------------------------------
        AXIOS RESPONSE FALLBACK
        ------------------------------------------------------
        */

        if (
            current.response &&
            typeof current.response ===
            "object"
        ) {

            current =
                current.response;

            continue;
        }


        break;
    }


    return {
        notifications:
            [],

        pagination:
            null,

        unreadCount:
            null,
    };
};


/*
|--------------------------------------------------------------------------
| UNREAD COUNT NORMALIZER
|--------------------------------------------------------------------------
*/

const normalizeUnreadCountResponse = (
    response,
) => {

    if (
        typeof response ===
        "number"
    ) {
        return response;
    }


    if (
        response &&
        typeof response ===
        "object"
    ) {

        if (
            typeof response.unreadCount ===
            "number"
        ) {
            return response.unreadCount;
        }


        if (
            response.data &&
            typeof response.data.unreadCount ===
            "number"
        ) {
            return response.data.unreadCount;
        }


        if (
            response.data?.data &&
            typeof response.data.data.unreadCount ===
            "number"
        ) {
            return response.data.data.unreadCount;
        }


        if (
            typeof response.count ===
            "number"
        ) {
            return response.count;
        }


        if (
            response.data &&
            typeof response.data.count ===
            "number"
        ) {
            return response.data.count;
        }
    }


    return 0;
};


/*
|--------------------------------------------------------------------------
| GET METADATA
|--------------------------------------------------------------------------
*/

const getMetadata = (
    notification,
) => {

    const metadata =
        notification?.metadata;


    if (
        metadata &&
        typeof metadata ===
        "object"
    ) {
        return metadata;
    }


    return {};
};


/*
|--------------------------------------------------------------------------
| GET APPLICATION ID
|--------------------------------------------------------------------------
*/

const getApplicationId = (
    notification,
) => {

    const metadata =
        getMetadata(
            notification,
        );


    const entityType =
        toUpper(
            notification?.entityType,
        );


    return (
        metadata.applicationId ||
        metadata.applicationID ||
        metadata.application_id ||
        metadata.application ||
        (
            entityType ===
                "APPLICATION"
                ? notification?.entityId
                : null
        ) ||
        null
    );
};


/*
|--------------------------------------------------------------------------
| GET DOCUMENT ID
|--------------------------------------------------------------------------
*/

const getDocumentId = (
    notification,
) => {

    const metadata =
        getMetadata(
            notification,
        );


    const entityType =
        toUpper(
            notification?.entityType,
        );


    return (
        metadata.documentId ||
        metadata.documentID ||
        metadata.document_id ||
        metadata.document ||
        (
            entityType ===
                "DOCUMENT"
                ? notification?.entityId
                : null
        ) ||
        null
    );
};


/*
|--------------------------------------------------------------------------
| GET CLIENT ID
|--------------------------------------------------------------------------
*/

const getClientId = (
    notification,
) => {

    const metadata =
        getMetadata(
            notification,
        );


    const entityType =
        toUpper(
            notification?.entityType,
        );


    return (
        metadata.clientId ||
        metadata.clientID ||
        metadata.client_id ||
        metadata.userId ||
        metadata.userID ||
        (
            entityType ===
                "USER"
                ? notification?.entityId
                : null
        ) ||
        null
    );
};


/*
|--------------------------------------------------------------------------
| GET PAYMENT ID
|--------------------------------------------------------------------------
*/

const getPaymentId = (
    notification,
) => {

    const metadata =
        getMetadata(
            notification,
        );


    const entityType =
        toUpper(
            notification?.entityType,
        );


    return (
        metadata.paymentId ||
        metadata.paymentID ||
        metadata.payment_id ||
        metadata.payment ||
        (
            entityType ===
                "PAYMENT"
                ? notification?.entityId
                : null
        ) ||
        null
    );
};


/*
|--------------------------------------------------------------------------
| GET BOOKING ID
|--------------------------------------------------------------------------
*/

const getBookingId = (
    notification,
) => {

    const metadata =
        getMetadata(
            notification,
        );


    const entityType =
        toUpper(
            notification?.entityType,
        );


    return (
        metadata.bookingId ||
        metadata.bookingID ||
        metadata.booking_id ||
        metadata.booking ||
        (
            entityType ===
                "BOOKING"
                ? notification?.entityId
                : null
        ) ||
        null
    );
};


/*
|--------------------------------------------------------------------------
| GET CONVERSATION ID
|--------------------------------------------------------------------------
*/

const getConversationId = (
    notification,
) => {

    const metadata =
        getMetadata(
            notification,
        );


    return (
        metadata.conversationId ||
        metadata.conversationID ||
        metadata.conversation_id ||
        metadata.threadId ||
        metadata.threadID ||
        metadata.thread_id ||
        null
    );
};


/*
|--------------------------------------------------------------------------
| CATEGORY
|--------------------------------------------------------------------------
*/

const getCategory = (
    notification,
) => {

    const type =
        toUpper(
            notification?.type,
        );


    const entityType =
        toUpper(
            notification?.entityType,
        );


    const metadata =
        getMetadata(
            notification,
        );


    /*
    ----------------------------------------------------------
    DOCUMENT
    ----------------------------------------------------------
    */

    if (
        entityType ===
        "DOCUMENT" ||
        type.includes(
            "DOCUMENT",
        ) ||
        Boolean(
            metadata.documentId,
        ) ||
        Boolean(
            metadata.documentID,
        )
    ) {
        return "DOCUMENT";
    }


    /*
    ----------------------------------------------------------
    APPLICATION
    ----------------------------------------------------------
    */

    if (
        entityType ===
        "APPLICATION" ||
        type.includes(
            "APPLICATION",
        ) ||
        Boolean(
            metadata.applicationId,
        ) ||
        Boolean(
            metadata.applicationID,
        )
    ) {
        return "APPLICATION";
    }


    /*
    ----------------------------------------------------------
    PAYMENT
    ----------------------------------------------------------
    */

    if (
        entityType ===
        "PAYMENT" ||
        type.includes(
            "PAYMENT",
        ) ||
        Boolean(
            metadata.paymentId,
        ) ||
        Boolean(
            metadata.paymentID,
        )
    ) {
        return "PAYMENT";
    }


    /*
    ----------------------------------------------------------
    BOOKING
    ----------------------------------------------------------
    */

    if (
        entityType ===
        "BOOKING" ||
        type.includes(
            "BOOKING",
        ) ||
        Boolean(
            metadata.bookingId,
        ) ||
        Boolean(
            metadata.bookingID,
        )
    ) {
        return "BOOKING";
    }


    /*
    ----------------------------------------------------------
    PROFILE / USER
    ----------------------------------------------------------
    */

    if (
        entityType ===
        "PROFILE" ||
        entityType ===
        "USER" ||
        type.includes(
            "PROFILE",
        ) ||
        type.includes(
            "USER",
        )
    ) {
        return "PROFILE";
    }


    /*
    ----------------------------------------------------------
    MESSAGE
    ----------------------------------------------------------
    */

    if (
        type.includes(
            "MESSAGE",
        ) ||
        entityType ===
        "MESSAGE"
    ) {
        return "MESSAGE";
    }


    /*
    ----------------------------------------------------------
    GENERAL
    ----------------------------------------------------------
    */

    return "GENERAL";
};


/*
|--------------------------------------------------------------------------
| ICON
|--------------------------------------------------------------------------
*/

const getIcon = (
    notification,
) => {

    switch (
    getCategory(
        notification,
    )
    ) {

        case "DOCUMENT":
            return HiOutlineFolderOpen;

        case "APPLICATION":
            return HiOutlineDocumentText;

        case "PROFILE":
            return HiOutlineUser;

        case "PAYMENT":
            return HiOutlineCreditCard;

        case "BOOKING":
            return HiOutlineCalendar;

        case "MESSAGE":
            return HiOutlineChatAlt2;

        default:
            return HiOutlineInformationCircle;
    }
};


/*
|--------------------------------------------------------------------------
| DESTINATION
|--------------------------------------------------------------------------
|
| CRITICAL:
|
| This function is pure.
|
| It does not depend on read/unread state.
| It does not depend on local component state.
| It does not mutate the notification.
|
| Therefore a notification remains navigable after:
|
| - being read
| - page refresh
| - returning to the notification page
| - opening it multiple times
|
|--------------------------------------------------------------------------
*/

const getDestination = (
    notification,
) => {

    if (
        !notification
    ) {
        return null;
    }


    const category =
        getCategory(
            notification,
        );


    /*
    ========================================================
    DOCUMENT
    ========================================================
    */

    if (
        category ===
        "DOCUMENT"
    ) {

        const applicationId =
            getApplicationId(
                notification,
            );


        const documentId =
            getDocumentId(
                notification,
            );


        /*
        ------------------------------------------------------
        DOCUMENTS LIVE INSIDE APPLICATION DETAILS
        ------------------------------------------------------
        */

        if (
            applicationId
        ) {

            return {

                category:
                    "DOCUMENT",

                path:
                    `/admin/applications/${applicationId}`,

                state: {

                    openDocuments:
                        true,

                    documentId:
                        documentId ||
                        null,

                    autoOpenDocument:
                        Boolean(
                            documentId,
                        ),

                    notificationId:
                        notification?._id ||
                        null,

                },

                label:
                    documentId
                        ? "View document"
                        : "Open documents",

            };
        }


        /*
        ------------------------------------------------------
        NO APPLICATION ID
        ------------------------------------------------------
        */

        return null;
    }


    /*
    ========================================================
    APPLICATION
    ========================================================
    */

    if (
        category ===
        "APPLICATION"
    ) {

        const applicationId =
            getApplicationId(
                notification,
            );


        if (
            !applicationId
        ) {
            return null;
        }


        return {

            category:
                "APPLICATION",

            path:
                `/admin/applications/${applicationId}`,

            state: {

                openDocuments:
                    false,

                documentId:
                    null,

                autoOpenDocument:
                    false,

                notificationId:
                    notification?._id ||
                    null,

            },

            label:
                "Open application",

        };
    }


    /*
    ========================================================
    PROFILE
    ========================================================
    */

    if (
        category ===
        "PROFILE"
    ) {

        const clientId =
            getClientId(
                notification,
            );


        if (
            !clientId
        ) {
            return null;
        }


        return {

            category:
                "PROFILE",

            path:
                `/admin/clients/${clientId}`,

            state: {

                notificationId:
                    notification?._id ||
                    null,

            },

            label:
                "Open client",

        };
    }


    /*
    ========================================================
    PAYMENT
    ========================================================
    */

    if (
        category ===
        "PAYMENT"
    ) {

        const paymentId =
            getPaymentId(
                notification,
            );


        if (
            !paymentId
        ) {
            return null;
        }


        return {

            category:
                "PAYMENT",

            path:
                `/admin/payments/${paymentId}`,

            state: {

                notificationId:
                    notification?._id ||
                    null,

            },

            label:
                "Open payment",

        };
    }


    /*
    ========================================================
    BOOKING
    ========================================================
    */

    if (
        category ===
        "BOOKING"
    ) {

        const bookingId =
            getBookingId(
                notification,
            );


        if (
            !bookingId
        ) {
            return null;
        }


        return {

            category:
                "BOOKING",

            path:
                `/admin/bookings/${bookingId}`,

            state: {

                notificationId:
                    notification?._id ||
                    null,

            },

            label:
                "Open booking",

        };
    }


    /*
    ========================================================
    MESSAGE
    ========================================================
    */

    if (
        category ===
        "MESSAGE"
    ) {

        const conversationId =
            getConversationId(
                notification,
            );


        if (
            !conversationId
        ) {
            return null;
        }


        return {

            category:
                "MESSAGE",

            path:
                `/admin/messages/${conversationId}`,

            state: {

                notificationId:
                    notification?._id ||
                    null,

            },

            label:
                "Open message",

        };
    }


    /*
    ========================================================
    GENERAL
    ========================================================
    */

    return null;
};


/*
|--------------------------------------------------------------------------
| NOTIFICATION CONTEXT
|--------------------------------------------------------------------------
*/

const getNotificationContext = (
    notification,
) => {

    const metadata =
        getMetadata(
            notification,
        );


    const category =
        getCategory(
            notification,
        );


    const context = [];


    /*
    ----------------------------------------------------------
    CLIENT
    ----------------------------------------------------------
    */

    if (
        metadata.clientName
    ) {

        context.push({

            label:
                "Client",

            value:
                metadata.clientName,

        });
    }


    /*
    ----------------------------------------------------------
    APPLICATION
    ----------------------------------------------------------
    */

    if (
        metadata.applicationReference
    ) {

        context.push({

            label:
                "Application",

            value:
                metadata.applicationReference,

        });
    }


    /*
    ----------------------------------------------------------
    DOCUMENT
    ----------------------------------------------------------
    */

    if (
        category ===
        "DOCUMENT" &&
        (
            metadata.documentName ||
            metadata.documentType
        )
    ) {

        context.push({

            label:
                "Document",

            value:
                metadata.documentName ||
                metadata.documentType,

        });
    }


    /*
    ----------------------------------------------------------
    DESTINATION
    ----------------------------------------------------------
    */

    if (
        metadata.destinationCountry
    ) {

        context.push({

            label:
                "Destination",

            value:
                metadata.destinationCountry,

        });
    }


    /*
    ----------------------------------------------------------
    STATUS
    ----------------------------------------------------------
    */

    const status =
        metadata.applicationStatus ||
        metadata.documentStatus ||
        metadata.newStatus ||
        metadata.toStatus ||
        null;


    if (
        status
    ) {

        context.push({

            label:
                "Status",

            value:
                formatStatus(
                    status,
                ),

        });
    }


    /*
    ----------------------------------------------------------
    STEP
    ----------------------------------------------------------
    */

    if (
        metadata.currentStep
    ) {

        context.push({

            label:
                "Step",

            value:
                formatStatus(
                    metadata.currentStep,
                ),

        });
    }


    return context.slice(
        0,
        4,
    );
};


/*
|--------------------------------------------------------------------------
| CONTEXT COMPONENT
|--------------------------------------------------------------------------
*/

const NotificationContext = ({
    notification,
}) => {

    const items =
        getNotificationContext(
            notification,
        );


    if (
        !items.length
    ) {
        return null;
    }


    return (

        <div className="adminNotifications__context">

            {items.map(
                (item) => (

                    <div
                        className="adminNotifications__contextItem"
                        key={`${item.label}-${item.value}`}
                    >

                        <span>
                            {item.label}
                        </span>


                        <strong
                            title={
                                item.value
                            }
                        >
                            {item.value}
                        </strong>

                    </div>

                ),
            )}

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| STATUS TRANSITION
|--------------------------------------------------------------------------
*/

const NotificationTransition = ({
    notification,
}) => {

    const metadata =
        getMetadata(
            notification,
        );


    const from =
        metadata.fromStatus ||
        metadata.previousStatus ||
        metadata.previousDocumentStatus ||
        null;


    const to =
        metadata.toStatus ||
        metadata.newStatus ||
        metadata.newDocumentStatus ||
        null;


    if (
        !from ||
        !to ||
        from === to
    ) {
        return null;
    }


    return (

        <div className="adminNotifications__transition">

            <span>
                {formatStatus(
                    from,
                )}
            </span>


            <HiOutlineArrowRight />


            <strong>
                {formatStatus(
                    to,
                )}
            </strong>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| NOTIFICATION ROW
|--------------------------------------------------------------------------
*/

const NotificationRow = ({
    notification,
    onRead,
    onDelete,
    onOpen,
}) => {

    const Icon =
        getIcon(
            notification,
        );


    const destination =
        getDestination(
            notification,
        );


    const unread =
        !notification?.read;


    const category =
        getCategory(
            notification,
        );


    const handleOpen =
        () => {

            if (
                !destination
            ) {

                console.warn(
                    "NOTIFICATION HAS NO NAVIGATION DESTINATION",
                    {
                        id:
                            notification?._id,

                        type:
                            notification?.type,

                        entityType:
                            notification?.entityType,

                        entityId:
                            notification?.entityId,

                        metadata:
                            notification?.metadata,
                    },
                );

                return;
            }


            onOpen(
                notification,
                destination,
            );
        };


    const handleKeyDown =
        (event) => {

            if (
                !destination
            ) {
                return;
            }


            if (
                event.key ===
                "Enter" ||
                event.key ===
                " "
            ) {

                event.preventDefault();

                handleOpen();
            }
        };


    return (

        <article
            className={[
                "adminNotifications__row",

                unread
                    ? "adminNotifications__row--unread"
                    : "",

                destination
                    ? "adminNotifications__row--clickable"
                    : "",

            ].join(" ")}

            onClick={
                destination
                    ? handleOpen
                    : undefined
            }

            onKeyDown={
                destination
                    ? handleKeyDown
                    : undefined
            }

            tabIndex={
                destination
                    ? 0
                    : undefined
            }

            role={
                destination
                    ? "button"
                    : undefined
            }
        >

            {/* =========================================================
                ICON
            ========================================================= */}

            <div
                className={[
                    "adminNotifications__rowIcon",
                    `adminNotifications__rowIcon--${category.toLowerCase()}`,
                ].join(" ")}
            >

                <Icon />

            </div>


            {/* =========================================================
                CONTENT
            ========================================================= */}

            <div className="adminNotifications__rowMain">

                <div className="adminNotifications__rowHeader">

                    <div className="adminNotifications__title">

                        {unread && (
                            <span
                                className="adminNotifications__dot"
                            />
                        )}


                        <h3>
                            {notification?.title ||
                                "Notification"}
                        </h3>

                    </div>


                    <time
                        dateTime={
                            notification?.createdAt
                        }
                        title={
                            formatDate(
                                notification?.createdAt,
                            )
                        }
                    >
                        {getRelativeTime(
                            notification?.createdAt,
                        )}
                    </time>

                </div>


                <p className="adminNotifications__message">

                    {notification?.message ||
                        "No additional information available."}

                </p>


                <NotificationContext
                    notification={
                        notification
                    }
                />


                <NotificationTransition
                    notification={
                        notification
                    }
                />


                <div className="adminNotifications__rowFooter">

                    <div className="adminNotifications__rowMeta">

                        <span
                            className="adminNotifications__type"
                        >
                            {formatType(
                                notification?.type,
                            )}
                        </span>


                        {notification?.priority &&
                            notification.priority !==
                            "NORMAL" && (

                                <span
                                    className={[
                                        "adminNotifications__priority",

                                        `adminNotifications__priority--${String(
                                            notification.priority,
                                        ).toLowerCase()}`,

                                    ].join(" ")}
                                >

                                    {
                                        notification.priority
                                    }

                                </span>
                            )}

                    </div>


                    {destination && (

                        <button
                            type="button"
                            className="adminNotifications__open"

                            onClick={
                                (event) => {

                                    event.stopPropagation();

                                    handleOpen();
                                }
                            }
                        >

                            {destination.label}

                            <HiOutlineArrowRight />

                        </button>

                    )}

                </div>

            </div>


            {/* =========================================================
                ACTIONS
            ========================================================= */}

            <div
                className="adminNotifications__rowActions"

                onClick={
                    (event) => {
                        event.stopPropagation();
                    }
                }
            >

                {unread && (

                    <button
                        type="button"
                        title="Mark as read"
                        aria-label="Mark notification as read"

                        onClick={
                            (event) => {

                                event.stopPropagation();

                                onRead(
                                    notification?._id,
                                );
                            }
                        }
                    >

                        <HiOutlineCheck />

                    </button>

                )}


                <button
                    type="button"
                    title="Delete notification"
                    aria-label="Delete notification"
                    className="adminNotifications__delete"

                    onClick={
                        (event) => {

                            event.stopPropagation();

                            onDelete(
                                notification?._id,
                            );
                        }
                    }
                >

                    <HiOutlineTrash />

                </button>

            </div>

        </article>
    );
};


/*
|--------------------------------------------------------------------------
| MAIN PAGE
|--------------------------------------------------------------------------
*/

const AdminNotifications = () => {

    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [
        notifications,
        setNotifications,
    ] = useState([]);


    const [
        unreadCount,
        setUnreadCount,
    ] = useState(0);


    const [
        activeFilter,
        setActiveFilter,
    ] = useState("ALL");


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
        page,
        setPage,
    ] = useState(1);


    const [
        pagination,
        setPagination,
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | LOAD NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    const loadNotifications =
        useCallback(
            async ({
                refresh = false,
                targetPage = 1,
            } = {}) => {

                try {

                    if (
                        refresh
                    ) {

                        setRefreshing(
                            true,
                        );

                    } else {

                        setLoading(
                            true,
                        );
                    }


                    setError("");


                    console.log(
                        "LOADING ADMIN NOTIFICATIONS",
                        {
                            page:
                                targetPage,

                            limit:
                                PAGE_SIZE,

                            unreadOnly:
                                activeFilter ===
                                "UNREAD",
                        },
                    );


                    const response =
                        await notificationsService
                            .getNotifications({
                                page:
                                    targetPage,

                                limit:
                                    PAGE_SIZE,

                                unreadOnly:
                                    activeFilter ===
                                    "UNREAD",
                            });


                    /*
                    ------------------------------------------------------
                    NORMALIZE API RESPONSE
                    ------------------------------------------------------
                    */

                    const normalized =
                        normalizeNotificationResponse(
                            response,
                        );


                    console.log(
                        "NORMALIZED ADMIN NOTIFICATIONS",
                        normalized,
                    );


                    setNotifications(
                        normalized.notifications,
                    );


                    setPagination(
                        normalized.pagination,
                    );


                    /*
                    ------------------------------------------------------
                    UNREAD COUNT
                    ------------------------------------------------------
                    */

                    if (
                        typeof normalized.unreadCount ===
                        "number"
                    ) {

                        setUnreadCount(
                            normalized.unreadCount,
                        );

                    } else {

                        try {

                            const unreadResponse =
                                await notificationsService
                                    .getUnreadCount();


                            setUnreadCount(
                                normalizeUnreadCountResponse(
                                    unreadResponse,
                                ),
                            );

                        } catch (
                        unreadError
                        ) {

                            console.warn(
                                "FAILED TO LOAD UNREAD COUNT:",
                                unreadError,
                            );


                            /*
                            ------------------------------------------------
                            FALLBACK TO CURRENT PAGE
                            ------------------------------------------------
                            */

                            setUnreadCount(
                                normalized.notifications
                                    .filter(
                                        (
                                            notification,
                                        ) =>
                                            !notification.read,
                                    ).length,
                            );
                        }
                    }

                } catch (
                requestError
                ) {

                    console.error(
                        "FAILED TO LOAD NOTIFICATIONS:",
                        requestError,
                    );


                    setNotifications(
                        [],
                    );


                    setPagination(
                        null,
                    );


                    setError(
                        requestError
                            ?.response
                            ?.data
                            ?.message ||
                        requestError?.message ||
                        "Unable to load notifications.",
                    );

                } finally {

                    setLoading(
                        false,
                    );

                    setRefreshing(
                        false,
                    );
                }

            },
            [
                activeFilter,
            ],
        );


    /*
    |--------------------------------------------------------------------------
    | FILTER CHANGE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setPage(
            1,
        );

    }, [
        activeFilter,
    ]);


    /*
    |--------------------------------------------------------------------------
    | INITIAL / PAGE LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadNotifications({
            targetPage:
                page,
        });

    }, [
        page,
        loadNotifications,
    ]);


    /*
    |--------------------------------------------------------------------------
    | MARK ONE AS READ
    |--------------------------------------------------------------------------
    */

    const handleMarkAsRead =
        async (
            notificationId,
        ) => {

            if (
                !notificationId
            ) {
                return;
            }


            try {

                await notificationsService
                    .markAsRead(
                        notificationId,
                    );


                /*
                ----------------------------------------------------------
                IMPORTANT
                ----------------------------------------------------------
                |
                | We only change read/readAt.
                |
                | Metadata, entityId, entityType and everything else
                | remain untouched.
                |
                ----------------------------------------------------------
                */

                setNotifications(
                    (current) =>
                        current.map(
                            (
                                notification,
                            ) =>
                                notification._id ===
                                    notificationId
                                    ? {
                                        ...notification,

                                        read:
                                            true,

                                        readAt:
                                            notification.readAt ||
                                            new Date()
                                                .toISOString(),
                                    }
                                    : notification,
                        ),
                );


                setUnreadCount(
                    (current) =>
                        Math.max(
                            0,
                            current - 1,
                        ),
                );

            } catch (
            requestError
            ) {

                console.error(
                    "FAILED TO MARK NOTIFICATION AS READ:",
                    requestError,
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | OPEN NOTIFICATION
    |--------------------------------------------------------------------------
    */

    const handleOpen =
        async (
            notification,
            destination,
        ) => {

            if (
                !notification ||
                !destination
            ) {
                return;
            }


            /*
            ----------------------------------------------------------
            | SAVE DESTINATION BEFORE ANY ASYNC WORK
            ----------------------------------------------------------
            */

            const finalPath =
                destination.path;


            const finalState = {
                ...(destination.state ||
                    {}),

                notificationId:
                    notification?._id ||
                    null,
            };


            console.log(
                "colossus NOTIFICATION CLICK",
                {
                    id:
                        notification?._id,

                    type:
                        notification?.type,

                    entityType:
                        notification?.entityType,

                    entityId:
                        notification?.entityId,

                    metadata:
                        notification?.metadata,

                    destination:
                        finalPath,

                    state:
                        finalState,
                },
            );


            /*
            ----------------------------------------------------------
            | MARK AS READ
            ----------------------------------------------------------
            |
            | Failure here must NEVER prevent navigation.
            |
            ----------------------------------------------------------
            */

            if (
                !notification.read
            ) {

                try {

                    await notificationsService
                        .markAsRead(
                            notification._id,
                        );


                    setNotifications(
                        (current) =>
                            current.map(
                                (
                                    item,
                                ) =>
                                    item._id ===
                                        notification._id
                                        ? {
                                            ...item,

                                            read:
                                                true,

                                            readAt:
                                                item.readAt ||
                                                new Date()
                                                    .toISOString(),
                                        }
                                        : item,
                            ),
                    );


                    setUnreadCount(
                        (current) =>
                            Math.max(
                                0,
                                current - 1,
                            ),
                    );

                } catch (
                requestError
                ) {

                    console.error(
                        "FAILED TO MARK NOTIFICATION AS READ. CONTINUING NAVIGATION:",
                        requestError,
                    );
                }
            }


            /*
            ----------------------------------------------------------
            | NAVIGATE
            ----------------------------------------------------------
            */

            navigate(
                finalPath,
                {
                    state:
                        finalState,
                },
            );
        };


    /*
    |--------------------------------------------------------------------------
    | MARK ALL AS READ
    |--------------------------------------------------------------------------
    */

    const handleMarkAll =
        async () => {

            if (
                unreadCount <=
                0
            ) {
                return;
            }


            try {

                await notificationsService
                    .markAllAsRead();


                setNotifications(
                    (current) =>
                        current.map(
                            (
                                notification,
                            ) => ({
                                ...notification,

                                read:
                                    true,

                                readAt:
                                    notification.readAt ||
                                    new Date()
                                        .toISOString(),
                            }),
                        ),
                );


                setUnreadCount(
                    0,
                );

            } catch (
            requestError
            ) {

                console.error(
                    "FAILED TO MARK ALL NOTIFICATIONS AS READ:",
                    requestError,
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    const handleDelete =
        async (
            notificationId,
        ) => {

            if (
                !notificationId
            ) {
                return;
            }


            try {

                const target =
                    notifications.find(
                        (
                            item,
                        ) =>
                            item._id ===
                            notificationId,
                    );


                await notificationsService
                    .deleteNotification(
                        notificationId,
                    );


                setNotifications(
                    (current) =>
                        current.filter(
                            (
                                item,
                            ) =>
                                item._id !==
                                notificationId,
                        ),
                );


                if (
                    target &&
                    !target.read
                ) {

                    setUnreadCount(
                        (current) =>
                            Math.max(
                                0,
                                current - 1,
                            ),
                    );
                }

            } catch (
            requestError
            ) {

                console.error(
                    "FAILED TO DELETE NOTIFICATION:",
                    requestError,
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | COUNTS
    |--------------------------------------------------------------------------
    */

    const total =
        pagination?.total ??
        notifications.length;


    const totalPages =
        pagination?.pages ||
        pagination?.totalPages ||
        1;


    const filterLabel =
        activeFilter ===
            "UNREAD"
            ? "Unread"
            : "All notifications";


    /*
    |--------------------------------------------------------------------------
    | SUMMARY
    |--------------------------------------------------------------------------
    */

    const summary =
        useMemo(
            () => {

                const actionable =
                    notifications.filter(
                        (
                            notification,
                        ) =>
                            Boolean(
                                getDestination(
                                    notification,
                                ),
                            ),
                    ).length;


                return {
                    actionable,
                };

            },
            [
                notifications,
            ],
        );


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <main className="adminNotifications">

            {/* =========================================================
                HEADER
            ========================================================= */}

            <header className="adminNotifications__header">

                <div className="adminNotifications__heading">

                    <div className="adminNotifications__headingIcon">

                        <HiOutlineBell />

                    </div>


                    <div>

                        <div className="adminNotifications__eyebrow">
                            Operations
                        </div>


                        <div className="adminNotifications__titleBlock">

                            <h1>
                                Notifications
                            </h1>


                            {unreadCount > 0 && (

                                <span className="adminNotifications__headerCount">

                                    {unreadCount}
                                    {" "}
                                    unread

                                </span>

                            )}

                        </div>


                        <p>
                            Recent activity across applications,
                            documents and client operations.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="adminNotifications__refresh"

                    onClick={
                        () =>
                            loadNotifications({
                                refresh:
                                    true,

                                targetPage:
                                    page,
                            })
                    }

                    disabled={
                        refreshing
                    }
                >

                    <HiOutlineRefresh
                        className={
                            refreshing
                                ? "is-spinning"
                                : ""
                        }
                    />


                    <span>
                        Refresh
                    </span>

                </button>

            </header>


            {/* =========================================================
                TOOLBAR
            ========================================================= */}

            <div className="adminNotifications__toolbar">

                <div className="adminNotifications__filter">

                    <button
                        type="button"

                        className={
                            activeFilter ===
                                "ALL"
                                ? "is-active"
                                : ""
                        }

                        onClick={
                            () =>
                                setActiveFilter(
                                    "ALL",
                                )
                        }
                    >
                        All
                    </button>


                    <button
                        type="button"

                        className={
                            activeFilter ===
                                "UNREAD"
                                ? "is-active"
                                : ""
                        }

                        onClick={
                            () =>
                                setActiveFilter(
                                    "UNREAD",
                                )
                        }
                    >

                        Unread


                        {unreadCount > 0 && (

                            <span>
                                {unreadCount}
                            </span>

                        )}

                    </button>

                </div>


                <div className="adminNotifications__toolbarRight">

                    <span className="adminNotifications__resultCount">

                        {total}

                        {" "}

                        {
                            total === 1
                                ? "notification"
                                : "notifications"
                        }

                    </span>


                    {summary.actionable > 0 && (

                        <span className="adminNotifications__actionableCount">

                            {summary.actionable}
                            {" "}
                            actionable

                        </span>

                    )}


                    {unreadCount > 0 && (

                        <button
                            type="button"
                            className="adminNotifications__markAll"

                            onClick={
                                handleMarkAll
                            }
                        >

                            <HiOutlineCheck />

                            Mark all read

                        </button>

                    )}

                </div>

            </div>


            {/* =========================================================
                ERROR
            ========================================================= */}

            {error && (

                <div className="adminNotifications__error">

                    <HiOutlineInformationCircle />


                    <span>
                        {error}
                    </span>


                    <button
                        type="button"

                        onClick={
                            () =>
                                loadNotifications({
                                    targetPage:
                                        page,
                                })
                        }
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =========================================================
                NOTIFICATION SURFACE
            ========================================================= */}

            <section className="adminNotifications__surface">

                <div className="adminNotifications__surfaceHeader">

                    <span>
                        {filterLabel}
                    </span>


                    <span>
                        Latest first
                    </span>

                </div>


                {loading ? (

                    <div className="adminNotifications__state">

                        <div className="adminNotifications__spinner" />


                        <span>
                            Loading activity...
                        </span>

                    </div>

                ) : notifications.length === 0 ? (

                    <div className="adminNotifications__state adminNotifications__state--empty">

                        <div className="adminNotifications__emptyIcon">

                            <HiOutlineBell />

                        </div>


                        <strong>
                            Nothing here
                        </strong>


                        <span>

                            {
                                activeFilter ===
                                    "UNREAD"
                                    ? "You have no unread notifications."
                                    : "New operational activity will appear here."
                            }

                        </span>

                    </div>

                ) : (

                    <div className="adminNotifications__list">

                        {notifications.map(
                            (
                                notification,
                            ) => (

                                <NotificationRow

                                    key={
                                        notification?._id
                                    }

                                    notification={
                                        notification
                                    }

                                    onRead={
                                        handleMarkAsRead
                                    }

                                    onDelete={
                                        handleDelete
                                    }

                                    onOpen={
                                        handleOpen
                                    }

                                />

                            ),
                        )}

                    </div>

                )}

            </section>


            {/* =========================================================
                PAGINATION
            ========================================================= */}

            {!loading &&
                totalPages > 1 && (

                    <div className="adminNotifications__pagination">

                        <button
                            type="button"

                            disabled={
                                page <=
                                1
                            }

                            onClick={
                                () =>
                                    setPage(
                                        (
                                            current,
                                        ) =>
                                            Math.max(
                                                1,
                                                current -
                                                1,
                                            ),
                                    )
                            }
                        >
                            Previous
                        </button>


                        <span>
                            {page}
                            {" / "}
                            {totalPages}
                        </span>


                        <button
                            type="button"

                            disabled={
                                page >=
                                totalPages
                            }

                            onClick={
                                () =>
                                    setPage(
                                        (
                                            current,
                                        ) =>
                                            Math.min(
                                                totalPages,
                                                current +
                                                1,
                                            ),
                                    )
                            }
                        >
                            Next
                        </button>

                    </div>

                )}

        </main>
    );
};

export default AdminNotifications;