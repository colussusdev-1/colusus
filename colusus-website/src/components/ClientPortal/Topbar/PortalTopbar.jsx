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
    HiOutlineMenu,
    HiChevronDown,
} from "react-icons/hi";

import clientProfileService from "../../../services/clientPortal.service";

import NotificationBell from "./NotificationBell";

import "./PortalTopbar.css";


/*
============================================================
COLOSSUS — CLIENT PORTAL TOPBAR
============================================================

RESPONSIBILITIES

- Mobile navigation trigger
- Current page context
- Client notifications
- Authenticated client identity
- Profile navigation

The notification interface is handled by the existing
NotificationBell component.

The profile endpoint remains the authoritative account source.

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
                "colossus — FAILED TO READ STORED USER:",
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
                        "colossus — INVALID STORED USER:",
                        error,
                    );

                }

            }


            /*
            ------------------------------------------------
            SECOND: BACKEND PROFILE
            ------------------------------------------------
            */

            try {

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
                            "colossus — FAILED TO SYNC USER:",
                            error,
                        );

                    }

                }

            } catch (error) {

                /*
                --------------------------------------------
                PRESERVE LOCAL USER IF REQUEST FAILS
                --------------------------------------------
                */

                console.warn(
                    "colossus TOPBAR — PROFILE REQUEST FAILED:",
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
                    "colossus — FAILED TO UPDATE USER:",
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
            "colossus:user-updated",
            handleUserUpdate,
        );


        return () => {

            mounted = false;


            window.removeEventListener(
                "storage",
                handleStorageChange,
            );


            window.removeEventListener(
                "colossus:user-updated",
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
    ACCOUNT NAVIGATION
    ============================================================
    */

    const handleAccountClick = () => {

        navigate("/portal/profile");

    };


    /*
    ============================================================
    MOBILE MENU
    ============================================================
    */

    const handleMobileMenu = () => {

        window.dispatchEvent(
            new CustomEvent(
                "colossus:open-mobile-menu",
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

                <div className="portal-topbar__notification-wrapper">

                    <NotificationBell />

                </div>


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