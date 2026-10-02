import React from "react";

import StaffCard from "./StaffCard";

import "./StaffGrid.css";

const StaffGrid = ({
    staff = [],
    onOpenStaff,
}) => {
    return (
        <div className="staff-grid">
            {staff.map((member) => {
                const staffId =
                    member?._id ||
                    member?.id;

                return (
                    <StaffCard
                        key={staffId}
                        staff={member}
                        onOpen={onOpenStaff}
                    />
                );
            })}
        </div>
    );
};

export default StaffGrid;