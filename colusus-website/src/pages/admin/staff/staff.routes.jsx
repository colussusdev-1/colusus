import React from "react";

import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import StaffDashboard
    from "./StaffDashboard";

import StaffApplications
    from "./StaffApplications";

import StaffApplicationDetail
    from "./StaffApplicationDetail";

import StaffFormSubmissions
    from "./StaffFormSubmissions";

import StaffFormSubmissionDetail
    from "./StaffFormSubmissionDetail";

import StaffPermissionRoute
    from "./StaffPermissionRoute";


const StaffRoutes = () => {

    return (

        <Routes>

            {/* ======================================================
                STAFF DASHBOARD
            ====================================================== */}

            <Route
                element={
                    <StaffPermissionRoute
                        permission="dashboard.view"
                    />
                }
            >

                <Route
                    index
                    element={
                        <StaffDashboard />
                    }
                />

            </Route>


            {/* ======================================================
                APPLICATIONS
            ====================================================== */}

            <Route
                element={
                    <StaffPermissionRoute
                        permission="applications.view"
                    />
                }
            >

                <Route
                    path="applications"
                    element={
                        <StaffApplications />
                    }
                />

                <Route
                    path="applications/:id"
                    element={
                        <StaffApplicationDetail />
                    }
                />

            </Route>


            {/* ======================================================
                WEBSITE FORM SUBMISSIONS
            ====================================================== */}

            <Route
                element={
                    <StaffPermissionRoute
                        permission="forms.view"
                    />
                }
            >

                <Route
                    path="form-submissions"
                    element={
                        <StaffFormSubmissions />
                    }
                />

                <Route
                    path="form-submissions/:id"
                    element={
                        <StaffFormSubmissionDetail />
                    }
                />

            </Route>


            {/* ======================================================
                FALLBACK
            ====================================================== */}

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