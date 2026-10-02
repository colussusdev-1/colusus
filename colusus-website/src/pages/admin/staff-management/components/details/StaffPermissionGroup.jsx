
import React from "react";

import {
    HiOutlineChevronDown,
    HiOutlineCollection,
} from "react-icons/hi";

import StaffPermissionRow from "./StaffPermissionRow";

import "./StaffPermissionGroup.css";

const StaffPermissionGroup = ({
    group,
    open = false,
    effectivePermissions,
    directGrants,
    directDenials,
    rolePermissions,
    onToggle,
    onGrant,
    onDeny,
}) => {
    if (!group) {
        return null;
    }

    const permissionCount =
        group.permissions?.length || 0;

    const effectiveCount =
        group.permissions?.filter((permission) =>
            effectivePermissions.has(permission),
        ).length || 0;

    return (
        <section
            className={
                open
                    ? "staff-permission-group is-open"
                    : "staff-permission-group"
            }
        >
            <button
                type="button"
                className="staff-permission-group-header"
                onClick={onToggle}
                aria-expanded={open}
            >
                <div className="staff-permission-group-heading">
                    <div className="staff-permission-group-icon">
                        <HiOutlineCollection />
                    </div>

                    <div className="staff-permission-group-copy">
                        <strong>
                            {group.label}
                        </strong>

                        <span>
                            {permissionCount}{" "}
                            {permissionCount === 1
                                ? "permission"
                                : "permissions"}
                        </span>
                    </div>
                </div>

                <div className="staff-permission-group-summary">
                    <span>
                        {effectiveCount} active
                    </span>

                    <HiOutlineChevronDown
                        className={
                            open
                                ? "staff-permission-chevron is-open"
                                : "staff-permission-chevron"
                        }
                    />
                </div>
            </button>

            {open && (
                <div className="staff-permission-group-content">
                    <div className="staff-permission-group-rows">
                        {group.permissions.map(
                            (permission) => (
                                <StaffPermissionRow
                                    key={permission}
                                    permission={
                                        permission
                                    }
                                    effective={effectivePermissions.has(
                                        permission,
                                    )}
                                    granted={directGrants.has(
                                        permission,
                                    )}
                                    denied={directDenials.has(
                                        permission,
                                    )}
                                    inherited={rolePermissions.has(
                                        permission,
                                    )}
                                    onGrant={onGrant}
                                    onDeny={onDeny}
                                />
                            ),
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default StaffPermissionGroup;
