
import React from "react";

import {
    HiOutlineChevronRight,
    HiOutlineMail,
} from "react-icons/hi";

import "./StaffList.css";

const StaffList = ({
    staff = [],
    onOpenStaff,
}) => {
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

    const getRoleName = (member) =>
        member?.staffRole?.name ||
        member?.staffRole?.key ||
        "No role assigned";

    const getDepartmentName = (member) =>
        member?.department?.name ||
        member?.department?.key ||
        "No department";

    const getPermissionCount = (member) => {
        if (
            Array.isArray(
                member?.effectivePermissions,
            )
        ) {
            return member.effectivePermissions.length;
        }

        if (
            Array.isArray(
                member?.permissions,
            )
        ) {
            return member.permissions.length;
        }

        return 0;
    };

    return (
        <div className="staff-list-wrapper">
            <table className="staff-list">
                <thead>
                    <tr>
                        <th>Staff member</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Access</th>
                        <th>Status</th>
                        <th aria-label="Open" />
                    </tr>
                </thead>

                <tbody>
                    {staff.map((member) => {
                        const staffId =
                            member?._id ||
                            member?.id;

                        const isActive =
                            member?.isActive === true;

                        const grants =
                            Array.isArray(
                                member?.permissionGrants,
                            )
                                ? member.permissionGrants.length
                                : 0;

                        const denials =
                            Array.isArray(
                                member?.permissionDenials,
                            )
                                ? member.permissionDenials.length
                                : 0;

                        return (
                            <tr
                                key={staffId}
                                className={
                                    !isActive
                                        ? "staff-list-row-inactive"
                                        : ""
                                }
                                onClick={() =>
                                    onOpenStaff?.(
                                        member,
                                    )
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key ===
                                        "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();

                                        onOpenStaff?.(
                                            member,
                                        );
                                    }
                                }}
                                tabIndex={
                                    staffId ? 0 : -1
                                }
                            >
                                <td>
                                    <div className="staff-list-member">
                                        <div className="staff-list-avatar">
                                            {getInitials(
                                                member?.name,
                                            )}
                                        </div>

                                        <div className="staff-list-member-info">
                                            <strong>
                                                {member?.name ||
                                                    "Unnamed staff"}
                                            </strong>

                                            <span>
                                                <HiOutlineMail />

                                                {member?.email ||
                                                    "No email"}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span className="staff-list-role">
                                        {getRoleName(
                                            member,
                                        )}
                                    </span>
                                </td>

                                <td>
                                    <span className="staff-list-secondary">
                                        {getDepartmentName(
                                            member,
                                        )}
                                    </span>
                                </td>

                                <td>
                                    <span className="staff-list-secondary">
                                        {member?.position ||
                                            "—"}
                                    </span>
                                </td>

                                <td>
                                    <div className="staff-list-access">
                                        <strong>
                                            {getPermissionCount(
                                                member,
                                            )}
                                        </strong>

                                        <span>
                                            permissions
                                        </span>

                                        {(grants > 0 ||
                                            denials > 0) && (
                                                <small>
                                                    {grants} grants
                                                    {" · "}
                                                    {denials} denials
                                                </small>
                                            )}
                                    </div>
                                </td>

                                <td>
                                    <span
                                        className={
                                            isActive
                                                ? "staff-list-status staff-list-status-active"
                                                : "staff-list-status staff-list-status-inactive"
                                        }
                                    >
                                        <span />

                                        {isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>

                                <td>
                                    <HiOutlineChevronRight className="staff-list-arrow" />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default StaffList;
