import React from "react";

import {
    HiOutlineSearch,
    HiOutlineViewGrid,
    HiOutlineViewList,
    HiOutlineX,
} from "react-icons/hi";
import "./StaffToolbar.css";

const StaffToolbar = ({
    search,
    onSearchChange,

    statusFilter,
    onStatusChange,

    roleFilter,
    onRoleChange,

    departmentFilter,
    onDepartmentChange,

    roles = [],
    departments = [],

    view,
    onViewChange,

    hasActiveFilters,
    onClearFilters,
}) => {
    return (
        <section className="admin-staff-toolbar">
            <div className="admin-staff-search">
                <HiOutlineSearch />

                <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                        onSearchChange(
                            event.target.value,
                        )
                    }
                    placeholder="Search staff..."
                    aria-label="Search staff"
                />

                {search && (
                    <button
                        type="button"
                        className="admin-staff-search-clear"
                        onClick={() =>
                            onSearchChange("")
                        }
                        aria-label="Clear search"
                    >
                        <HiOutlineX />
                    </button>
                )}
            </div>

            <div className="admin-staff-filters">
                <select
                    value={statusFilter}
                    onChange={(event) =>
                        onStatusChange(
                            event.target.value,
                        )
                    }
                    aria-label="Filter by status"
                >
                    <option value="ALL">
                        All statuses
                    </option>

                    <option value="ACTIVE">
                        Active
                    </option>

                    <option value="INACTIVE">
                        Inactive
                    </option>
                </select>

                <select
                    value={roleFilter}
                    onChange={(event) =>
                        onRoleChange(
                            event.target.value,
                        )
                    }
                    aria-label="Filter by role"
                >
                    <option value="ALL">
                        All roles
                    </option>

                    {roles.map((role) => (
                        <option
                            key={role}
                            value={role}
                        >
                            {role}
                        </option>
                    ))}
                </select>

                <select
                    value={departmentFilter}
                    onChange={(event) =>
                        onDepartmentChange(
                            event.target.value,
                        )
                    }
                    aria-label="Filter by department"
                >
                    <option value="ALL">
                        All departments
                    </option>

                    {departments.map((department) => (
                        <option
                            key={department}
                            value={department}
                        >
                            {department}
                        </option>
                    ))}
                </select>
            </div>

            <div className="admin-staff-toolbar-right">
                {hasActiveFilters && (
                    <button
                        type="button"
                        className="admin-staff-clear-filters"
                        onClick={onClearFilters}
                    >
                        <HiOutlineX />
                        <span>Clear</span>
                    </button>
                )}

                <div
                    className="admin-staff-view-toggle"
                    aria-label="Staff view"
                >
                    <button
                        type="button"
                        className={
                            view === "grid"
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            onViewChange("grid")
                        }
                        aria-label="Grid view"
                        aria-pressed={
                            view === "grid"
                        }
                    >
                        <HiOutlineViewGrid />
                    </button>

                    <button
                        type="button"
                        className={
                            view === "list"
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            onViewChange("list")
                        }
                        aria-label="List view"
                        aria-pressed={
                            view === "list"
                        }
                    >
                        <HiOutlineViewList />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default StaffToolbar;