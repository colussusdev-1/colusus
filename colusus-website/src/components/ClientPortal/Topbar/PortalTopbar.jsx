import {
    HiOutlineSearch,
    HiOutlineBell,
    HiOutlineMenu,
    HiChevronDown,
} from "react-icons/hi";

import "./PortalTopbar.css";

const PortalTopbar = () => {

    return (
        <header className="portal-topbar">

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
                type="button"
                className="portal-topbar__menu"
                aria-label="Open navigation menu"
            >

                <HiOutlineMenu />

            </button>


            {/* =================================================
                PAGE CONTEXT
            ================================================= */}

            <div className="portal-topbar__context">

                <span className="portal-topbar__context-label">
                    Client Portal
                </span>

                <h1>
                    Migration Dashboard
                </h1>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="portal-topbar__actions">

                {/* Search */}

                <button
                    type="button"
                    className="portal-topbar__icon-btn"
                    aria-label="Search"
                >

                    <HiOutlineSearch />

                </button>


                {/* Notifications */}

                <button
                    type="button"
                    className="portal-topbar__icon-btn portal-topbar__notification"
                    aria-label="Notifications"
                >

                    <HiOutlineBell />

                    <span className="portal-topbar__notification-dot" />

                </button>


                {/* Divider */}

                <span className="portal-topbar__divider" />


                {/* User */}

                <button
                    type="button"
                    className="portal-topbar__user"
                >

                    <div className="portal-topbar__avatar">
                        J
                    </div>

                    <div className="portal-topbar__user-info">

                        <strong>
                            Client
                        </strong>

                        <span>
                            Client Account
                        </span>

                    </div>

                    <HiChevronDown className="portal-topbar__chevron" />

                </button>

            </div>

        </header>
    );
};

export default PortalTopbar;