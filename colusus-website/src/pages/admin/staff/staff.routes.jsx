import React from "react";

import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import StaffDashboard from "./StaffDashboard";
import StaffApplications from "./StaffApplications";
import StaffApplicationDetail from "./StaffApplicationDetail";

const StaffRoutes = () => {
    return (
        <Routes>
            <Route
                index
                element={<StaffDashboard />}
            />

            <Route
                path="applications"
                element={<StaffApplications />}
            />

            <Route
                path="applications/:id"
                element={<StaffApplicationDetail />}
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to="/admin/staff"
                        replace
                    />
                }
            />
        </Routes>
    );
};

export default StaffRoutes;