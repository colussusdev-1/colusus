import React from "react";

import "./StaffLoading.css";

const StaffLoading = ({
    view = "grid",
}) => {
    if (view === "list") {
        return (
            <section className="staff-loading">
                <div className="staff-loading-list">
                    <div className="staff-loading-list-header" />

                    {Array.from({ length: 6 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="staff-loading-list-row"
                            >
                                <div className="staff-loading-member">
                                    <span className="staff-loading-avatar" />

                                    <div>
                                        <span className="staff-loading-line staff-loading-name" />
                                        <span className="staff-loading-line staff-loading-email" />
                                    </div>
                                </div>

                                <span className="staff-loading-line" />
                                <span className="staff-loading-line" />
                                <span className="staff-loading-line" />
                                <span className="staff-loading-line staff-loading-short" />
                                <span className="staff-loading-status" />
                            </div>
                        ),
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="staff-loading">
            <div className="staff-loading-grid">
                {Array.from({ length: 6 }).map(
                    (_, index) => (
                        <div
                            key={index}
                            className="staff-loading-card"
                        >
                            <div className="staff-loading-card-top">
                                <div className="staff-loading-member">
                                    <span className="staff-loading-avatar" />

                                    <div>
                                        <span className="staff-loading-line staff-loading-name" />
                                        <span className="staff-loading-line staff-loading-email" />
                                    </div>
                                </div>

                                <span className="staff-loading-status" />
                            </div>

                            <span className="staff-loading-line staff-loading-position" />

                            <div className="staff-loading-meta">
                                <span className="staff-loading-box" />
                                <span className="staff-loading-box" />
                            </div>

                            <div className="staff-loading-divider" />

                            <div className="staff-loading-access">
                                <span />
                                <span />
                                <span />
                            </div>

                            <div className="staff-loading-footer">
                                <span className="staff-loading-line" />
                                <span className="staff-loading-line staff-loading-short" />
                            </div>
                        </div>
                    ),
                )}
            </div>
        </section>
    );
};

export default StaffLoading;