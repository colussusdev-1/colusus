
import React from "react";

import {
    HiOutlineBriefcase,
    HiOutlineOfficeBuilding,
    HiOutlineShieldCheck,
    HiOutlineUserCircle,
} from "react-icons/hi";

import "./StaffInformation.css";

const StaffInformation = ({
    staff,
    roleName,
    departmentName,
}) => {
    if (!staff) {
        return null;
    }

    const items = [
        {
            label: "Role",
            value: roleName || "No role assigned",
            icon: HiOutlineShieldCheck,
        },
        {
            label: "Department",
            value:
                departmentName ||
                "No department assigned",
            icon: HiOutlineOfficeBuilding,
        },
        {
            label: "Position",
            value:
                staff.position ||
                "Not specified",
            icon: HiOutlineBriefcase,
        },
        {
            label: "Account Type",
            value:
                staff.role ||
                "STAFF",
            icon: HiOutlineUserCircle,
        },
    ];

    return (
        <section className="staff-information">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.label}
                        className="staff-information-item"
                    >
                        <div className="staff-information-icon">
                            <Icon />
                        </div>

                        <div className="staff-information-copy">
                            <span>
                                {item.label}
                            </span>

                            <strong
                                title={item.value}
                            >
                                {item.value}
                            </strong>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default StaffInformation;

