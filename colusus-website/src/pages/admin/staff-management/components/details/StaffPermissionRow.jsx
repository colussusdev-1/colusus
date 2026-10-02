
import React from "react";

import {
    HiOutlineCheckCircle,
    HiOutlineLockClosed,
} from "react-icons/hi";

import {
    permissionLabel,
} from "./staffManagement.constants";

import "./StaffPermissionRow.css";

const StaffPermissionRow = ({
    permission,
    effective = false,
    granted = false,
    denied = false,
    inherited = false,
    onGrant,
    onDeny,
}) => {
    const label = permissionLabel(permission);

    return (
        <div
            className={
                effective
                    ? "staff-permission-row is-effective"
                    : "staff-permission-row"
            }
        >
            <div className="staff-permission-info">
                <strong title={label}>
                    {label}
                </strong>

                <span title={permission}>
                    {permission}
                </span>
            </div>

            <div className="staff-permission-state">
                <div className="staff-permission-sources">
                    {inherited && (
                        <span className="staff-permission-source">
                            Role
                        </span>
                    )}

                    {granted && (
                        <span className="staff-permission-source is-granted">
                            Granted
                        </span>
                    )}

                    {denied && (
                        <span className="staff-permission-source is-denied">
                            Denied
                        </span>
                    )}
                </div>

                <span
                    className={
                        effective
                            ? "staff-permission-effective is-active"
                            : "staff-permission-effective"
                    }
                >
                    <span className="staff-permission-effective-dot" />
                    {effective ? "Allowed" : "Blocked"}
                </span>

                <div className="staff-permission-actions">
                    <button
                        type="button"
                        className={
                            granted
                                ? "staff-permission-action grant is-active"
                                : "staff-permission-action grant"
                        }
                        onClick={() => onGrant?.(permission)}
                        aria-label={`Directly grant ${label}`}
                        aria-pressed={granted}
                        title={
                            granted
                                ? "Direct grant active"
                                : "Grant permission directly"
                        }
                    >
                        <HiOutlineCheckCircle />
                    </button>

                    <button
                        type="button"
                        className={
                            denied
                                ? "staff-permission-action deny is-active"
                                : "staff-permission-action deny"
                        }
                        onClick={() => onDeny?.(permission)}
                        aria-label={`Directly deny ${label}`}
                        aria-pressed={denied}
                        title={
                            denied
                                ? "Direct denial active"
                                : "Deny permission directly"
                        }
                    >
                        <HiOutlineLockClosed />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffPermissionRow;
