import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import authService from "../../../services/authService";


/*
|--------------------------------------------------------------------------
| ADMIN ROLE ROUTE
|--------------------------------------------------------------------------
|
| Shared protection for the Operations Portal.
|
| ADMIN:
|   Can access the full Admin portal.
|
| STAFF:
|   Can only access the Staff workspace.
|
| CLIENT:
|   Cannot access the Operations Portal.
|
|--------------------------------------------------------------------------
*/


const AdminRoleRoute = ({
    allowedRoles = [],
}) => {

    const location = useLocation();

    const token =
        localStorage.getItem("colossus_token");


    /*
    |--------------------------------------------------------------------------
    | NOT AUTHENTICATED
    |--------------------------------------------------------------------------
    */

    if (!token) {

        return (
            <Navigate
                to="/admin/login"
                replace
                state={{
                    from: location,
                }}
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | CURRENT USER
    |--------------------------------------------------------------------------
    */

    const user =
        authService.getCurrentUser();


    const role = String(
        user?.role || ""
    )
        .trim()
        .toUpperCase();


    /*
    |--------------------------------------------------------------------------
    | INVALID SESSION / UNKNOWN ROLE
    |--------------------------------------------------------------------------
    */

    if (!role) {

        authService.logout();

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | ROLE CHECK
    |--------------------------------------------------------------------------
    */

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(role)
    ) {

        /*
        ----------------------------------------------------------
        STAFF
        ----------------------------------------------------------
        |
        | Staff attempting to enter an Admin-only location
        | gets sent back to their own workspace.
        |
        ----------------------------------------------------------
        */

        if (role === "STAFF") {

            return (
                <Navigate
                    to="/admin/staff"
                    replace
                />
            );

        }


        /*
        ----------------------------------------------------------
        OTHER ROLES
        ----------------------------------------------------------
        */

        authService.logout();

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | AUTHORIZED
    |--------------------------------------------------------------------------
    */

    return <Outlet />;

};


export default AdminRoleRoute;