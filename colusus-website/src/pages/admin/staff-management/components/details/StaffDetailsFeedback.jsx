
import React from "react";

import {
    HiOutlineCheckCircle,
    HiOutlineXCircle,
} from "react-icons/hi";

import "./StaffDetailsFeedback.css";

const StaffDetailsFeedback = ({
    error = "",
    success = "",
}) => {
    if (!error && !success) {
        return null;
    }

    return (
        <div
            className="staff-details-feedback-stack"
            aria-live="polite"
            aria-atomic="true"
        >
            {error && (
                <div
                    className="staff-details-feedback staff-details-feedback-error"
                    role="alert"
                >
                    <div className="staff-details-feedback-icon">
                        <HiOutlineXCircle />
                    </div>

                    <div className="staff-details-feedback-content">
                        <strong>Something went wrong</strong>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {success && (
                <div
                    className="staff-details-feedback staff-details-feedback-success"
                    role="status"
                >
                    <div className="staff-details-feedback-icon">
                        <HiOutlineCheckCircle />
                    </div>

                    <div className="staff-details-feedback-content">
                        <strong>Changes saved</strong>
                        <span>{success}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDetailsFeedback;

