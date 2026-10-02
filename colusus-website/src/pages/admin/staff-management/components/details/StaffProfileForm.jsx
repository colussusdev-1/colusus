
import React from "react";

import {
    HiOutlineCheckCircle,
    HiOutlineUserCircle,
} from "react-icons/hi";

import {
    getEntityId,
} from "./staffManagement.constants";

import "./StaffProfileForm.css";

const StaffProfileForm = ({
    form = {},
    roles = [],
    departments = [],
    loadingOptions = false,
    saving = false,
    onChange,
    onSave,
    onCancel,
}) => {
    const optionsDisabled =
        loadingOptions || saving;

    return (
        <section className="staff-profile-form">
            <div className="staff-profile-form-heading">
                <div className="staff-profile-form-heading-icon">
                    <HiOutlineUserCircle />
                </div>

                <div className="staff-profile-form-heading-copy">
                    <span className="staff-details-overline">
                        Account
                    </span>

                    <h2>
                        Edit Staff Profile
                    </h2>

                    <p>
                        Update this staff member's account,
                        role, position, and organisational
                        assignment.
                    </p>
                </div>
            </div>

            <div className="staff-profile-form-divider" />

            <div className="staff-profile-form-grid">
                <label className="staff-profile-form-field">
                    <span>
                        Full name
                    </span>

                    <input
                        type="text"
                        name="name"
                        value={form.name || ""}
                        onChange={onChange}
                        autoComplete="name"
                        placeholder="Enter full name"
                        disabled={saving}
                    />
                </label>

                <label className="staff-profile-form-field">
                    <span>
                        Email address
                    </span>

                    <input
                        type="email"
                        name="email"
                        value={form.email || ""}
                        onChange={onChange}
                        autoComplete="email"
                        placeholder="name@example.com"
                        disabled={saving}
                    />
                </label>

                <label className="staff-profile-form-field">
                    <span>
                        Staff role
                    </span>

                    <select
                        name="staffRole"
                        value={form.staffRole || ""}
                        onChange={onChange}
                        disabled={optionsDisabled}
                    >
                        <option value="">
                            Select role
                        </option>

                        {roles.map((role) => {
                            const roleId =
                                getEntityId(role);

                            return (
                                <option
                                    key={roleId}
                                    value={roleId}
                                >
                                    {role.name}
                                </option>
                            );
                        })}
                    </select>

                    <small>
                        Determines the staff member's
                        baseline permissions.
                    </small>
                </label>

                <label className="staff-profile-form-field">
                    <span>
                        Department
                    </span>

                    <select
                        name="department"
                        value={form.department || ""}
                        onChange={onChange}
                        disabled={optionsDisabled}
                    >
                        <option value="">
                            No department
                        </option>

                        {departments.map((department) => {
                            const departmentId =
                                getEntityId(
                                    department,
                                );

                            return (
                                <option
                                    key={departmentId}
                                    value={departmentId}
                                >
                                    {department.name}
                                </option>
                            );
                        })}
                    </select>

                    <small>
                        Assign this staff member to an
                        operational department.
                    </small>
                </label>

                <label className="staff-profile-form-field staff-profile-form-field-wide">
                    <span>
                        Position
                    </span>

                    <input
                        type="text"
                        name="position"
                        value={form.position || ""}
                        onChange={onChange}
                        placeholder="e.g. Migration Case Officer"
                        disabled={saving}
                    />

                    <small>
                        The staff member's operational
                        position or title.
                    </small>
                </label>
            </div>

            <div className="staff-profile-form-actions">
                <button
                    type="button"
                    className="staff-profile-form-secondary"
                    onClick={onCancel}
                    disabled={saving}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="staff-profile-form-primary"
                    onClick={onSave}
                    disabled={
                        saving ||
                        loadingOptions
                    }
                >
                    <HiOutlineCheckCircle />

                    <span>
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </span>
                </button>
            </div>
        </section>
    );
};

export default StaffProfileForm;
