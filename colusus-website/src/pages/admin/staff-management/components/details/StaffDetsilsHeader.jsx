
import React from "react";

import {
    HiOutlineArrowLeft,
    HiOutlineCheckCircle,
    HiOutlinePencil,
    HiOutlineRefresh,
    HiOutlineXCircle,
} from "react-icons/hi";

import "./StaffDetailsHeader.css";

const StaffDetailsHeader = ({
    staff,
    refreshing = false,
    statusUpdating = false,
    onBack,
    onRefresh,
    onEdit,
    onStatusChange,
}) => {
    const isActive = staff?.isActive === true;

    return (
        <header className="staff-details-header">
            <div className="staff-details-heading-area">
                <button
                    type="button"
                    className="staff-details-back-button"
                    onClick={onBack}
                >
                    <HiOutlineArrowLeft />

                    <span>Back to Staff</span>
                </button>

                <div className="staff-details-heading">
                    <div className="staff-details-title-row">
                        <h1>
                            {staff?.name || "Staff member"}
                        </h1>

                        <span
                            className={
                                isActive
                                    ? "staff-details-status is-active"
                                    : "staff-details-status is-inactive"
                            }
                        >
                            {isActive ? (
                                <HiOutlineCheckCircle />
                            ) : (
                                <HiOutlineXCircle />
                            )}

                            {isActive
                                ? "Active"
                                : "Inactive"}
                        </span>
                    </div>

                    <p>
                        Manage this staff account, role,
                        profile information, and access.
                    </p>
                </div>
            </div>

            <div className="staff-details-header-actions">
                <button
                    type="button"
                    className="staff-details-secondary-button"
                    onClick={onRefresh}
                    disabled={refreshing}
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
                            ? "Refreshing..."
                            : "Refresh"}
                    </span>
                </button>

                <button
                    type="button"
                    className="staff-details-secondary-button"
                    onClick={onEdit}
                >
                    <HiOutlinePencil />

                    <span>Edit Profile</span>
                </button>

                <button
                    type="button"
                    className={
                        isActive
                            ? "staff-details-danger-button"
                            : "staff-details-primary-button"
                    }
                    onClick={onStatusChange}
                    disabled={statusUpdating}
                >
                    {isActive ? (
                        <HiOutlineXCircle />
                    ) : (
                        <HiOutlineCheckCircle />
                    )}

                    <span>
                        {statusUpdating
                            ? "Updating..."
                            : isActive
                                ? "Deactivate"
                                : "Activate"}
                    </span>
                </button>
            </div>
        </header>
    );
};

export default StaffDetailsHeader;
