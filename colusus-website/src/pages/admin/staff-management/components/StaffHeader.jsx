
import React from "react";

import {
    HiOutlinePlus,
    HiOutlineRefresh,
    HiOutlineUserGroup,
} from "react-icons/hi";

import "./StaffHeader.css";

const StaffHeader = ({
    refreshing = false,
    onRefresh,
    onAddStaff,
}) => {
    return (
        <header className="admin-staff-header">
            <div className="admin-staff-header-main">
                <div className="admin-staff-header-icon">
                    <HiOutlineUserGroup />
                </div>

                <div className="admin-staff-header-copy">
                    <div className="admin-staff-eyebrow">
                        Team management
                    </div>

                    <div className="admin-staff-title-row">
                        <h1>Staff</h1>

                        <span className="admin-staff-title-divider" />

                        <span className="admin-staff-title-context">
                            Operations
                        </span>
                    </div>

                    <p>
                        Manage staff responsibilities, roles,
                        departments and access.
                    </p>
                </div>
            </div>

            <div className="admin-staff-header-actions">
                <button
                    type="button"
                    className="admin-staff-refresh-button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    aria-label="Refresh staff"
                >
                    <HiOutlineRefresh
                        className={
                            refreshing
                                ? "is-spinning"
                                : ""
                        }
                    />

                    <span>
                        {refreshing
                            ? "Refreshing"
                            : "Refresh"}
                    </span>
                </button>

                <button
                    type="button"
                    className="admin-staff-primary-button"
                    onClick={onAddStaff}
                >
                    <HiOutlinePlus />

                    <span>Add staff</span>
                </button>
            </div>
        </header>
    );
};

export default StaffHeader;
