import React from "react";

import "./StaffStatusBadge.css";

const STATUS_LABELS = {
    DRAFT: "Draft",
    IN_PROGRESS: "In Progress",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    DOCUMENT_REQUEST: "Document Request",
    PROCESSING: "Processing",
    APPROVED: "Approved",
    REJECTED: "Rejected",
};

const StaffStatusBadge = ({
    status = "DRAFT",
}) => {
    const normalizedStatus =
        String(status)
            .toUpperCase()
            .replace(/\s+/g, "_");

    const label =
        STATUS_LABELS[
        normalizedStatus
        ] ||
        String(status)
            .replace(/_/g, " ")
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase(),
            );

    return (
        <span
            className={`staffStatusBadge staffStatusBadge--${normalizedStatus.toLowerCase()}`}
        >
            {label}
        </span>
    );
};

export default StaffStatusBadge;