
import React from "react";

import {
    HiOutlineShieldCheck,
} from "react-icons/hi";

import StaffAccessSummary from "./StaffAccessSummary";
import StaffPermissionGroup from "./StaffPermissionGroup";

import "./StaffAccessSection.css";

const StaffAccessSection = ({
    groups = [],
    effectivePermissions = new Set(),
    directGrants = new Set(),
    directDenials = new Set(),
    rolePermissions = new Set(),
    openGroups = {},
    saving = false,
    onToggleGroup,
    onGrant,
    onDeny,
    onSave,
}) => {
    return (
        <section className="staff-access-section">
            <div className="staff-access-section-heading">
                <div className="staff-access-section-copy">
                    <div className="staff-access-section-title">
                        <div className="staff-access-section-icon">
                            <HiOutlineShieldCheck />
                        </div>

                        <div>
                            <span className="staff-details-overline">
                                Access Control
                            </span>

                            <h2>
                                Permissions
                            </h2>
                        </div>
                    </div>

                    <p>
                        Manage this staff member's
                        effective access across the
                        administration system.
                    </p>
                </div>

                <button
                    type="button"
                    className="staff-access-save-button"
                    onClick={onSave}
                    disabled={saving}
                >
                    <HiOutlineShieldCheck />

                    <span>
                        {saving
                            ? "Saving..."
                            : "Save Access"}
                    </span>
                </button>
            </div>

            <StaffAccessSummary
                effectiveCount={
                    effectivePermissions.size
                }
                grantCount={
                    directGrants.size
                }
                denialCount={
                    directDenials.size
                }
            />

            <div className="staff-access-permissions">
                <div className="staff-access-permissions-heading">
                    <div>
                        <span>
                            Permission groups
                        </span>

                        <p>
                            Expand a group to review
                            or override individual
                            permissions.
                        </p>
                    </div>

                    <span className="staff-access-group-count">
                        {groups.length}{" "}
                        {groups.length === 1
                            ? "group"
                            : "groups"}
                    </span>
                </div>

                <div className="staff-permission-list">
                    {groups.map((group) => (
                        <StaffPermissionGroup
                            key={group.key}
                            group={group}
                            open={Boolean(
                                openGroups[group.key],
                            )}
                            effectivePermissions={
                                effectivePermissions
                            }
                            directGrants={
                                directGrants
                            }
                            directDenials={
                                directDenials
                            }
                            rolePermissions={
                                rolePermissions
                            }
                            onToggle={() =>
                                onToggleGroup(
                                    group.key,
                                )
                            }
                            onGrant={onGrant}
                            onDeny={onDeny}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StaffAccessSection;
