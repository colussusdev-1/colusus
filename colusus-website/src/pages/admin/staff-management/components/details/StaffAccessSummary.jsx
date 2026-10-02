
import React from "react";

import {
    HiOutlineCheckCircle,
    HiOutlineMinusCircle,
    HiOutlineShieldCheck,
} from "react-icons/hi";

import "./StaffAccessSummary.css";

const StaffAccessSummary = ({
    effectiveCount = 0,
    grantCount = 0,
    denialCount = 0,
}) => {
    const items = [
        {
            label: "Effective permissions",
            value: effectiveCount,
            icon: HiOutlineShieldCheck,
            className: "is-effective",
        },
        {
            label: "Direct grants",
            value: grantCount,
            icon: HiOutlineCheckCircle,
            className: "is-grant",
        },
        {
            label: "Direct denials",
            value: denialCount,
            icon: HiOutlineMinusCircle,
            className: "is-denial",
        },
    ];

    return (
        <div className="staff-access-summary">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.label}
                        className={`staff-access-summary-item ${item.className}`}
                    >
                        <div className="staff-access-summary-icon">
                            <Icon />
                        </div>

                        <div className="staff-access-summary-copy">
                            <strong>
                                {item.value}
                            </strong>

                            <span>
                                {item.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StaffAccessSummary;
