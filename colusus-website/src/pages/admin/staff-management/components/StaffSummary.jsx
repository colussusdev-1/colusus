import React from "react";

import "./StaffSummary.css";

const StaffSummary = ({
    total = 0,
    active = 0,
    inactive = 0,
}) => {
    return (
        <section className="admin-staff-summary">
            <div className="admin-staff-summary-item">
                <span>Total staff</span>
                <strong>{total}</strong>
            </div>

            <div className="admin-staff-summary-item">
                <span>Active</span>
                <strong>{active}</strong>
            </div>

            <div className="admin-staff-summary-item">
                <span>Inactive</span>
                <strong>{inactive}</strong>
            </div>
        </section>
    );
};

export default StaffSummary;