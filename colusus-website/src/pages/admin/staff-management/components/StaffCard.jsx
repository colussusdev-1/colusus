import React from "react";

import {
    HiOutlineChevronRight,
    HiOutlineMail,
    HiOutlineShieldCheck,
    HiOutlineOfficeBuilding,
    HiOutlineBriefcase,
} from "react-icons/hi";

import "./StaffCard.css";

const StaffCard = ({
    staff,
    onOpen,
}) => {
    if (!staff) return null;

    const staffId =
        staff?._id ||
        staff?.id;

    const name =
        staff?.name ||
        "Unnamed staff";

    const email =
        staff?.email ||
        "No email";

    const role =
        staff?.staffRole?.name ||
        staff?.staffRole?.key ||
        "No role assigned";

    const department =
        staff?.department?.name ||
        staff?.department?.key ||
        "No department";

    const position =
        staff?.position ||
        "No position assigned";

    const isActive =
        staff?.isActive === true;

    const grants =
        Array.isArray(staff?.permissionGrants)
            ? staff.permissionGrants.length
            : 0;

    const denials =
        Array.isArray(staff?.permissionDenials)
            ? staff.permissionDenials.length
            : 0;

    const permissions =
        Array.isArray(staff?.effectivePermissions)
            ? staff.effectivePermissions.length
            : Array.isArray(staff?.permissions)
                ? staff.permissions.length
                : 0;

    const getInitials = (value) => {
        const initials = String(value)
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (part) =>
                    part
                        .charAt(0)
                        .toUpperCase(),
            )
            .join("");

        return initials || "U";
    };

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            },
        ).format(date);
    };

    const handleOpen = () => {
        if (!staffId || !onOpen) return;

        onOpen(staff);
    };

    return (
        <article
            className={`staff-card ${isActive
                    ? "staff-card-active"
                    : "staff-card-inactive"
                }`}
            onClick={handleOpen}
            onKeyDown={(event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    handleOpen();
                }
            }}
            tabIndex={staffId ? 0 : -1}
            role={staffId ? "button" : undefined}
        >
            <div className="staff-card-top">
                <div className="staff-card-identity">
                    <div className="staff-card-avatar">
                        {getInitials(name)}
                    </div>

                    <div className="staff-card-name-block">
                        <strong>{name}</strong>

                        <span className="staff-card-email">
                            <HiOutlineMail />
                            {email}
                        </span>
                    </div>
                </div>

                <span
                    className={`staff-card-status ${isActive
                            ? "staff-card-status-active"
                            : "staff-card-status-inactive"
                        }`}
                >
                    <span className="staff-card-status-dot" />

                    {isActive
                        ? "Active"
                        : "Inactive"}
                </span>
            </div>

            <div className="staff-card-primary-info">
                <div className="staff-card-position">
                    <HiOutlineBriefcase />

                    <span>{position}</span>
                </div>

                <div className="staff-card-meta">
                    <div>
                        <HiOutlineShieldCheck />

                        <span>{role}</span>
                    </div>

                    <div>
                        <HiOutlineOfficeBuilding />

                        <span>{department}</span>
                    </div>
                </div>
            </div>

            <div className="staff-card-divider" />

            <div className="staff-card-access">
                <div className="staff-card-access-item">
                    <span>Permissions</span>

                    <strong>
                        {permissions}
                    </strong>
                </div>

                <div className="staff-card-access-item">
                    <span>Direct grants</span>

                    <strong>
                        {grants}
                    </strong>
                </div>

                <div className="staff-card-access-item">
                    <span>Direct denials</span>

                    <strong>
                        {denials}
                    </strong>
                </div>
            </div>

            <div className="staff-card-footer">
                <span>
                    Joined{" "}
                    {formatDate(
                        staff?.createdAt,
                    )}
                </span>

                <span className="staff-card-open">
                    View staff

                    <HiOutlineChevronRight />
                </span>
            </div>
        </article>
    );
};

export default StaffCard;