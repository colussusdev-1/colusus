
import React from "react";

import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import StaffDashboard from "./StaffDashboard";
import StaffApplications from "./StaffApplications";
import StaffApplicationDetail from "./StaffApplicationDetail";
import StaffFormSubmissions from "./StaffFormSubmissions";
import StaffFormSubmissionDetail from "./StaffFormSubmissionDetail";

const StaffRoutes = () => {
    return (
        <Routes>
            {/* Staff Dashboard */}
            <Route
                index
                element={<StaffDashboard />}
            />

            {/* Applications */}
            <Route
                path="applications"
                element={<StaffApplications />}
            />

            <Route
                path="applications/:id"
                element={<StaffApplicationDetail />}
            />

            {/* Website Form Submissions */}
            <Route
                path="form-submissions"
                element={<StaffFormSubmissions />}
            />

            <Route
                path="form-submissions/:id"
                element={<StaffFormSubmissionDetail />}
            />

            {/* Fallback */}
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
