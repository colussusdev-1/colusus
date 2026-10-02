
import React from "react";

import {
    HiOutlineOfficeBuilding,
    HiOutlineShieldCheck,
    HiOutlineUserCircle,
} from "react-icons/hi";

import "./StaffProfileCard.css";

const getInitials = (name = "") => {
    return String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) =>
            part.charAt(0).toUpperCase(),
        )
        .join("") || "U";
};

const getRoleName = (staff) => {
    if (
        typeof staff?.staffRole === "object" &&
        staff.staffRole?.name
    ) {
        return staff.staffRole.name;
    }

    return (
        staff?.staffRoleName ||
        staff?.roleName ||
        "Staff Member"
    );
};

const getDepartmentName = (staff) => {
    if (
        typeof staff?.department === "object" &&
        staff.department?.name
    ) {
        return staff.department.name;
    }

    return (
        staff?.departmentName ||
        "No department assigned"
    );
};

const StaffProfileCard = ({
    staff,
}) => {
    if (!staff) {
        return null;
    }

    const name =
        staff.name ||
        "Unnamed Staff";

    const email =
        staff.email ||
        "No email address";

    const position =
        staff.position ||
        "Staff member";

    const roleName =
        getRoleName(staff);

    const departmentName =
        getDepartmentName(staff);

    const isActive =
        staff.isActive === true;

    return (
        <section className="staff-profile-card">
            <div className="staff-profile-identity">
                <div className="staff-profile-avatar">
                    <span>
                        {getInitials(name)}
                    </span>
                </div>

                <div className="staff-profile-copy">
                    <span className="staff-profile-overline">
                        Staff Account
                    </span>

                    <h2>
                        {name}
                    </h2>

                    <p>
                        {email}
                    </p>
                </div>
            </div>

            <div className="staff-profile-meta">
                <div className="staff-profile-meta-item">
                    <div className="staff-profile-meta-icon">
                        <HiOutlineUserCircle />
                    </div>

                    <div>
                        <span>
                            Position
                        </span>

                        <strong>
                            {position}
                        </strong>
                    </div>
                </div>

                <div className="staff-profile-meta-item">
                    <div className="staff-profile-meta-icon">
                        <HiOutlineShieldCheck />
                    </div>

                    <div>
                        <span>
                            Role
                        </span>

                        <strong>
                            {roleName}
                        </strong>
                    </div>
                </div>

                <div className="staff-profile-meta-item">
                    <div className="staff-profile-meta-icon">
                        <HiOutlineOfficeBuilding />
                    </div>

                    <div>
                        <span>
                            Department
                        </span>

                        <strong>
                            {departmentName}
                        </strong>
                    </div>
                </div>

                <div
                    className={
                        isActive
                            ? "staff-profile-account-state is-active"
                            : "staff-profile-account-state is-inactive"
                    }
                >
                    <span className="staff-profile-state-dot" />

                    <span>
                        {isActive
                            ? "Account active"
                            : "Account inactive"}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default StaffProfileCard;

