import { Outlet } from "react-router-dom";

import PortalSidebar from "../Sidebar/PortalSidebar";
import PortalTopbar from "../Topbar/PortalTopbar";

import "./PortalLayout.css";

const PortalLayout = () => {
    return (
        <div className="portal-layout">

            {/* Sidebar */}
            <PortalSidebar />

            {/* Main Application Area */}
            <div className="portal-main">

                {/* Top Navigation */}
                <PortalTopbar />

                {/* Page Content */}
                <main className="portal-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default PortalLayout;