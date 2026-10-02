import React from "react";

import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import useStaffAccess
    from "./hooks/useStaffAccess";


const StaffPermissionRoute = ({
    permission,
    redirectTo = "/admin/staff",
}) => {

    const location =
        useLocation();


    const {
        loading,
        error,
        hasPermission,
        permissions,
    } = useStaffAccess(true);


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="admin-page-loading">

                <span>
                    Loading workspace access...
                </span>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | ACCESS ERROR
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="admin-page-loading">

                <div>

                    <h3>
                        Unable to load workspace access
                    </h3>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | REQUIRED PERMISSION EXISTS
    |--------------------------------------------------------------------------
    */

    if (
        hasPermission(permission)
    ) {

        return <Outlet />;

    }


    /*
    |--------------------------------------------------------------------------
    | FIND A SAFE STAFF DESTINATION
    |--------------------------------------------------------------------------
    |
    | Never blindly redirect to /admin/staff.
    |
    | A staff member may not have dashboard.view.
    |
    | We therefore check the staff member's actual effective
    | permissions and send them to the first workspace they
    | are allowed to use.
    |
    */


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    if (
        permissions.includes(
            "dashboard.view",
        )
    ) {

        if (
            location.pathname !==
            "/admin/staff"
        ) {

            return (

                <Navigate
                    to="/admin/staff"
                    replace
                />

            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | APPLICATIONS
    |--------------------------------------------------------------------------
    */

    if (
        permissions.includes(
            "applications.view",
        )
    ) {

        if (
            !location.pathname.startsWith(
                "/admin/staff/applications",
            )
        ) {

            return (

                <Navigate
                    to="/admin/staff/applications"
                    replace
                />

            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | WEBSITE ENQUIRIES
    |--------------------------------------------------------------------------
    */

    if (
        permissions.includes(
            "forms.view",
        )
    ) {

        if (
            !location.pathname.startsWith(
                "/admin/staff/form-submissions",
            )
        ) {

            return (

                <Navigate
                    to="/admin/staff/form-submissions"
                    replace
                />

            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | CUSTOM REDIRECT
    |--------------------------------------------------------------------------
    |
    | If a specific fallback was supplied and the current route
    | is not already there, use it before showing the no-access
    | state.
    |
    */

    if (
        redirectTo &&
        location.pathname !== redirectTo
    ) {

        /*
        --------------------------------------------------------------
        | Only use the custom destination when the staff member
        | actually has access to the destination's permission.
        |
        | The standard workspace permissions above remain the
        | authoritative fallback.
        --------------------------------------------------------------
        */

        if (
            redirectTo ===
            "/admin/staff"
        ) {

            if (
                permissions.includes(
                    "dashboard.view",
                )
            ) {

                return (

                    <Navigate
                        to={redirectTo}
                        replace
                    />

                );

            }

        }

    }


    /*
    |--------------------------------------------------------------------------
    | NO ACCESSIBLE WORKSPACE
    |--------------------------------------------------------------------------
    */

    return (

        <div className="admin-page-loading">

            <div>

                <h3>
                    No workspace access
                </h3>

                <p>
                    Your staff account does not currently
                    have permission to access any workspace.
                    Contact an administrator.
                </p>

            </div>

        </div>

    );

};


export default StaffPermissionRoute;