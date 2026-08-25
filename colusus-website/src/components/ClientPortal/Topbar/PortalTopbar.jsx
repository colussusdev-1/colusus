import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineBell,
    HiOutlineMenu,
    HiChevronDown,
} from "react-icons/hi";

import clientProfileService from "../../../services/clientPortal.service";

import "./PortalTopbar.css";


/*
============================================================
COLUSUS — CLIENT PORTAL TOPBAR
============================================================

USER SOURCE

The profile endpoint returns:

profile.user

Example:

{
    id: "...",
    name: "DEVTEST",
    email: "olaide@colossus.com",
    role: "CLIENT"
}

The topbar therefore uses the backend profile as the
authoritative account source.

localStorage.user is used immediately while the profile
request is loading.

============================================================
*/


const PortalTopbar = () => {

    const navigate = useNavigate();

    const location = useLocation();


    /*
    ============================================================
    USER STATE
    ============================================================
    */

    const [user, setUser] = useState(() => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "COLUSUS — FAILED TO READ STORED USER:",
                error,
            );

            return null;

        }

    });


    /*
    ============================================================
    LOAD AUTHENTICATED USER
    ============================================================
    */

    useEffect(() => {

        let mounted = true;


        const loadAuthenticatedUser = async () => {

            try {

                /*
                ------------------------------------------------
                FIRST: LOCAL USER
                ------------------------------------------------
                */

                const storedUser =
                    localStorage.getItem("user");


                if (storedUser) {

                    try {

                        const parsedUser =
                            JSON.parse(storedUser);


                        if (
                            mounted &&
                            parsedUser
                        ) {

                            setUser(parsedUser);

                        }

                    } catch (error) {

                        console.error(
                            "COLUSUS — INVALID STORED USER:",
                            error,
                        );

                    }

                }


                /*
                ------------------------------------------------
                SECOND: BACKEND PROFILE
                ------------------------------------------------

                This is the authoritative source.
                */

                const profile =
                    await clientProfileService.getProfile();


                if (!mounted) {
                    return;
                }


                const backendUser =
                    profile?.user;


                if (
                    backendUser &&
                    typeof backendUser === "object"
                ) {

                    console.log(
                        "[COLUSUS TOPBAR] Backend user:",
                        backendUser,
                    );


                    setUser(backendUser);


                    /*
                    --------------------------------------------
                    KEEP LOCAL STORAGE IN SYNC
                    --------------------------------------------
                    */

                    try {

                        localStorage.setItem(
                            "user",
                            JSON.stringify(
                                backendUser,
                            ),
                        );

                    } catch (error) {

                        console.warn(
                            "COLUSUS — FAILED TO SYNC USER:",
                            error,
                        );

                    }

                }

            } catch (error) {

                /*
                ------------------------------------------------
                PROFILE REQUEST FAILED
                ------------------------------------------------

                Do NOT wipe the existing local user.

                The portal can continue displaying the
                locally stored authenticated account.
                */

                console.warn(
                    "COLUSUS TOPBAR — PROFILE REQUEST FAILED:",
                    error,
                );

            }

        };


        loadAuthenticatedUser();


        /*
        --------------------------------------------------------
        STORAGE CHANGES
        --------------------------------------------------------
        */

        const handleStorageChange = () => {

            try {

                const storedUser =
                    localStorage.getItem("user");


                if (!storedUser) {
                    return;
                }


                const parsedUser =
                    JSON.parse(storedUser);


                if (mounted) {

                    setUser(parsedUser);

                }

            } catch (error) {

                console.error(
                    "COLUSUS — FAILED TO UPDATE USER:",
                    error,
                );

            }

        };


        /*
        --------------------------------------------------------
        SAME-TAB USER UPDATE
        --------------------------------------------------------
        */

        const handleUserUpdate = () => {

            loadAuthenticatedUser();

        };


        window.addEventListener(
            "storage",
            handleStorageChange,
        );


        window.addEventListener(
            "colusus:user-updated",
            handleUserUpdate,
        );


        return () => {

            mounted = false;


            window.removeEventListener(
                "storage",
                handleStorageChange,
            );


            window.removeEventListener(
                "colusus:user-updated",
                handleUserUpdate,
            );

        };

    }, []);


    /*
    ============================================================
    PAGE TITLE
    ============================================================
    */

    const pageTitle = useMemo(() => {

        const pathname =
            location.pathname;


        if (
            pathname === "/portal" ||
            pathname === "/portal/"
        ) {

            return "Migration Dashboard";

        }


        if (
            pathname.startsWith(
                "/portal/applications",
            )
        ) {

            return "Applications";

        }


        if (
            pathname.startsWith(
                "/portal/documents",
            )
        ) {

            return "Documents";

        }


        if (
            pathname.startsWith(
                "/portal/updates",
            )
        ) {

            return "Updates";

        }


        if (
            pathname.startsWith(
                "/portal/profile",
            )
        ) {

            return "Profile";

        }


        if (
            pathname.startsWith(
                "/portal/opportunities",
            )
        ) {

            return "Migration Opportunities";

        }


        return "Migration Dashboard";

    }, [location.pathname]);


    /*
    ============================================================
    ACCOUNT NAME
    ============================================================
    */

    const accountName =
        typeof user?.name === "string" &&
            user.name.trim()
            ? user.name.trim()
            : "Client";


    /*
    ============================================================
    ACCOUNT EMAIL
    ============================================================
    */

    const accountEmail =
        typeof user?.email === "string" &&
            user.email.trim()
            ? user.email.trim()
            : "";


    /*
    ============================================================
    USER INITIALS
    ============================================================
    */

    const userInitials = useMemo(() => {

        const name =
            accountName.trim();


        if (!name) {
            return "C";
        }


        const parts =
            name
                .split(/\s+/)
                .filter(Boolean);


        if (parts.length === 1) {

            return parts[0]
                .charAt(0)
                .toUpperCase();

        }


        return parts
            .slice(0, 2)
            .map(
                (part) =>
                    part
                        .charAt(0)
                        .toUpperCase(),
            )
            .join("");

    }, [accountName]);


    /*
    ============================================================
    ACCOUNT
    ============================================================
    */

    const handleAccountClick = () => {

        navigate("/portal/profile");

    };


    /*
    ============================================================
    NOTIFICATIONS
    ============================================================
    */

    const handleNotifications = () => {

        navigate("/portal/updates");

    };


    /*
    ============================================================
    MOBILE MENU
    ============================================================
    */

    const handleMobileMenu = () => {

        window.dispatchEvent(
            new CustomEvent(
                "colusus:open-mobile-menu",
            ),
        );

    };


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <header className="portal-topbar">


            {/* ==================================================
                MOBILE MENU
            ================================================== */}

            <button
                type="button"
                className="portal-topbar__menu"
                aria-label="Open navigation menu"
                onClick={handleMobileMenu}
            >

                <HiOutlineMenu />

            </button>


            {/* ==================================================
                PAGE CONTEXT
            ================================================== */}

            <div className="portal-topbar__context">

                <span className="portal-topbar__context-label">
                    Client Portal
                </span>

                <h1>
                    {pageTitle}
                </h1>

            </div>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="portal-topbar__actions">


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <button
                    type="button"
                    className="
                        portal-topbar__icon-btn
                        portal-topbar__notification
                    "
                    aria-label="Open notifications and updates"
                    onClick={handleNotifications}
                >

                    <HiOutlineBell />

                    <span
                        className="
                            portal-topbar__notification-dot
                        "
                        aria-hidden="true"
                    />

                </button>


                {/* =================================================
                    DIVIDER
                ================================================= */}

                <span
                    className="portal-topbar__divider"
                    aria-hidden="true"
                />


                {/* =================================================
                    USER ACCOUNT
                ================================================= */}

                <button
                    type="button"
                    className="portal-topbar__user"
                    onClick={handleAccountClick}
                    aria-label={`Open ${accountName} profile`}
                >

                    <div
                        className="portal-topbar__avatar"
                        aria-hidden="true"
                    >
                        {userInitials}
                    </div>


                    <div className="portal-topbar__user-info">

                        <strong>
                            {accountName}
                        </strong>


                        {accountEmail && (
                            <span>
                                {accountEmail}
                            </span>
                        )}

                    </div>


                    <HiChevronDown
                        className="portal-topbar__chevron"
                        aria-hidden="true"
                    />

                </button>

            </div>

        </header>

    );

};


export default PortalTopbar;