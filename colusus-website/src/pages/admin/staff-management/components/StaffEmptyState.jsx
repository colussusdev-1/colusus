import React from "react";

import {
    HiOutlineUsers,
    HiOutlinePlus,
    HiOutlineX,
} from "react-icons/hi";

import "./StaffEmptyState.css";

const StaffEmptyState = ({
    hasFilters = false,
    onClearFilters,
    onAddStaff,
}) => {
    return (
        <section className="staff-empty-state">
            <div className="staff-empty-icon">
                <HiOutlineUsers />
            </div>

            <div className="staff-empty-copy">
                <h3>
                    {hasFilters
                        ? "No staff match your filters"
                        : "No staff members yet"}
                </h3>

                <p>
                    {hasFilters
                        ? "Try adjusting your search or filters to find another staff member."
                        : "Create your first staff account to start managing responsibilities and access."}
                </p>
            </div>

            <div className="staff-empty-actions">
                {hasFilters && (
                    <button
                        type="button"
                        className="staff-empty-secondary"
                        onClick={onClearFilters}
                    >
                        <HiOutlineX />
                        <span>Clear filters</span>
                    </button>
                )}

                {!hasFilters && (
                    <button
                        type="button"
                        className="staff-empty-primary"
                        onClick={onAddStaff}
                    >
                        <HiOutlinePlus />
                        <span>Add staff</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default StaffEmptyState;