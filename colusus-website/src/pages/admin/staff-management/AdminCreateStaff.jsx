import React, { useEffect, useState } from "react";
import {
    HiOutlineArrowLeft,
    HiOutlineCheckCircle,
    HiOutlineLockClosed,
    HiOutlineUserAdd,
    HiOutlineXCircle,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import staffManagementService from "./staffManagement.service";

import "./AdminCreateStaff.css";


const PERMISSION_GROUPS = [
    {
        key: "dashboard",
        label: "Dashboard",
        permissions: [
            "dashboard.view",
        ],
    },
    {
        key: "applications",
        label: "Applications",
        permissions: [
            "applications.view",
            "applications.create",
            "applications.update",
            "applications.delete",
            "applications.assign",
            "applications.reassign",
            "applications.status.update",
            "applications.notes.view",
            "applications.notes.create",
        ],
    },
    {
        key: "documents",
        label: "Documents",
        permissions: [
            "documents.view",
            "documents.review",
            "documents.approve",
            "documents.reject",
        ],
    },
    {
        key: "clients",
        label: "Clients",
        permissions: [
            "clients.view",
            "clients.create",
            "clients.update",
            "clients.delete",
        ],
    },
    {
        key: "payments",
        label: "Payments",
        permissions: [
            "payments.view",
            "payments.create",
            "payments.update",
            "payments.refund",
        ],
    },
    {
        key: "invoices",
        label: "Invoices",
        permissions: [
            "invoices.view",
            "invoices.create",
            "invoices.update",
        ],
    },
    {
        key: "receipts",
        label: "Receipts",
        permissions: [
            "receipts.view",
            "receipts.create",
        ],
    },
    {
        key: "opportunities",
        label: "Opportunities",
        permissions: [
            "opportunities.view",
            "opportunities.create",
            "opportunities.update",
            "opportunities.delete",
        ],
    },
    {
        key: "analytics",
        label: "Analytics",
        permissions: [
            "analytics.view",
        ],
    },
    {
        key: "activity",
        label: "Activity & Audit",
        permissions: [
            "activity.view",
            "audit.view",
        ],
    },
    {
        key: "notifications",
        label: "Notifications",
        permissions: [
            "notifications.view",
            "notifications.manage",
        ],
    },
];


const permissionLabel = (permission) =>
    permission
        .split(".")
        .map((part) =>
            part
                .replace(/[-_]/g, " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase(),
                ),
        )
        .join(" ");


const extractData = (response) =>
    response?.data ?? response;


const extractList = (response, keys = []) => {

    const data = extractData(response);

    for (const key of keys) {

        if (Array.isArray(data?.[key])) {
            return data[key];
        }

    }

    return Array.isArray(data)
        ? data
        : [];

};


const AdminCreateStaff = () => {

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        staffRole: "",
        department: "",
        position: "",
    });

    const [permissionGrants, setPermissionGrants] = useState([]);
    const [permissionDenials, setPermissionDenials] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | LOAD OPTIONS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadOptions = async () => {

            try {

                setLoadingOptions(true);
                setError("");

                const [
                    rolesResponse,
                    departmentsResponse,
                ] = await Promise.all([
                    staffManagementService.getRoles(),
                    staffManagementService.getDepartments(),
                ]);

                setRoles(
                    extractList(
                        rolesResponse,
                        ["roles"],
                    ),
                );

                setDepartments(
                    extractList(
                        departmentsResponse,
                        ["departments"],
                    ),
                );

            } catch (err) {

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load staff configuration.",
                );

            } finally {

                setLoadingOptions(false);

            }

        };

        loadOptions();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

    };


    /*
    |--------------------------------------------------------------------------
    | PERMISSION TOGGLE
    |--------------------------------------------------------------------------
    */

    const togglePermission = (
        permission,
        type,
    ) => {

        if (type === "grant") {

            setPermissionGrants((current) => {

                if (current.includes(permission)) {
                    return current.filter(
                        (item) =>
                            item !== permission,
                    );
                }

                setPermissionDenials((denials) =>
                    denials.filter(
                        (item) =>
                            item !== permission,
                    ),
                );

                return [
                    ...current,
                    permission,
                ];

            });

            return;
        }


        setPermissionDenials((current) => {

            if (current.includes(permission)) {
                return current.filter(
                    (item) =>
                        item !== permission,
                );
            }

            setPermissionGrants((grants) =>
                grants.filter(
                    (item) =>
                        item !== permission,
                ),
            );

            return [
                ...current,
                permission,
            ];

        });

    };


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!form.name.trim()) {
            setError("Staff name is required.");
            return;
        }

        if (!form.email.trim()) {
            setError("Email address is required.");
            return;
        }

        if (!form.password) {
            setError("Password is required.");
            return;
        }

        if (form.password.length < 8) {
            setError(
                "Password must be at least 8 characters.",
            );
            return;
        }

        if (!form.staffRole) {
            setError("Select a staff role.");
            return;
        }

        try {

            setSaving(true);

            const response =
                await staffManagementService.createStaff({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    staffRole: form.staffRole,
                    department:
                        form.department || null,
                    position:
                        form.position.trim(),
                    permissionGrants,
                    permissionDenials,
                });

            const createdStaff =
                extractData(response)?.staff ||
                extractData(response)?.user ||
                extractData(response);

            const createdId =
                createdStaff?._id ||
                createdStaff?.id;

            if (createdId) {

                navigate(
                    `/admin/staff-management/${createdId}`,
                );

                return;

            }

            navigate(
                "/admin/staff-management",
            );

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to create staff member.",
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="admin-create-staff">


            {/* ============================================================
                HEADER
            ============================================================ */}

            <header className="admin-create-staff-header">

                <div>

                    <button
                        type="button"
                        className="admin-create-staff-back"
                        onClick={() =>
                            navigate(
                                "/admin/staff-management",
                            )
                        }
                    >

                        <HiOutlineArrowLeft />

                        Staff

                    </button>


                    <div>

                        <h1>
                            Add Staff Member
                        </h1>

                        <p>
                            Create an account and define its initial access.
                        </p>

                    </div>

                </div>

            </header>


            {/* ============================================================
                ERROR
            ============================================================ */}

            {error && (

                <div className="admin-create-staff-error">

                    <HiOutlineXCircle />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            <form
                className="admin-create-staff-form"
                onSubmit={handleSubmit}
            >


                {/* ========================================================
                    ACCOUNT
                ======================================================== */}

                <section className="admin-create-staff-section">

                    <div className="admin-create-staff-section-heading">

                        <div className="admin-create-staff-section-icon">

                            <HiOutlineUserAdd />

                        </div>

                        <div>

                            <h2>
                                Account information
                            </h2>

                            <p>
                                Basic information used to identify and
                                authenticate the staff member.
                            </p>

                        </div>

                    </div>


                    <div className="admin-create-staff-fields">

                        <label>

                            <span>
                                Full name
                            </span>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                autoComplete="name"
                            />

                        </label>


                        <label>

                            <span>
                                Email address
                            </span>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="staff@colossusmigration.com"
                                autoComplete="email"
                            />

                        </label>


                        <label>

                            <span>
                                Initial password
                            </span>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                autoComplete="new-password"
                            />

                        </label>

                    </div>

                </section>


                {/* ========================================================
                    ORGANISATION
                ======================================================== */}

                <section className="admin-create-staff-section">

                    <div className="admin-create-staff-section-heading">

                        <div className="admin-create-staff-section-icon">

                            <HiOutlineCheckCircle />

                        </div>

                        <div>

                            <h2>
                                Organisation
                            </h2>

                            <p>
                                Assign the staff member to a role and
                                operational department.
                            </p>

                        </div>

                    </div>


                    <div className="admin-create-staff-fields">

                        <label>

                            <span>
                                Staff role
                            </span>

                            <select
                                name="staffRole"
                                value={form.staffRole}
                                onChange={handleChange}
                                disabled={loadingOptions}
                            >

                                <option value="">
                                    Select role
                                </option>

                                {roles.map((role) => (

                                    <option
                                        key={
                                            role._id ||
                                            role.id
                                        }
                                        value={
                                            role._id ||
                                            role.id
                                        }
                                    >
                                        {role.name}
                                    </option>

                                ))}

                            </select>

                        </label>


                        <label>

                            <span>
                                Department
                            </span>

                            <select
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                disabled={loadingOptions}
                            >

                                <option value="">
                                    No department
                                </option>

                                {departments.map(
                                    (department) => (

                                        <option
                                            key={
                                                department._id ||
                                                department.id
                                            }
                                            value={
                                                department._id ||
                                                department.id
                                            }
                                        >
                                            {department.name}
                                        </option>

                                    ),
                                )}

                            </select>

                        </label>


                        <label>

                            <span>
                                Position
                            </span>

                            <input
                                type="text"
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                                placeholder="e.g. Migration Case Officer"
                            />

                        </label>

                    </div>

                </section>


                {/* ========================================================
                    PERMISSION OVERRIDES
                ======================================================== */}

                <section className="admin-create-staff-section">

                    <div className="admin-create-staff-section-heading">

                        <div className="admin-create-staff-section-icon">

                            <HiOutlineLockClosed />

                        </div>

                        <div>

                            <h2>
                                Permission overrides
                            </h2>

                            <p>
                                Optional direct grants or denials applied
                                on top of the selected staff role.
                            </p>

                        </div>

                    </div>


                    <div className="admin-create-staff-legend">

                        <span>
                            <HiOutlineCheckCircle />
                            Grant
                        </span>

                        <span>
                            <HiOutlineLockClosed />
                            Deny
                        </span>

                    </div>


                    <div className="admin-create-staff-permissions">

                        {PERMISSION_GROUPS.map(
                            (group) => (

                                <div
                                    key={group.key}
                                    className="admin-create-staff-permission-group"
                                >

                                    <div className="admin-create-staff-group-title">

                                        <strong>
                                            {group.label}
                                        </strong>

                                        <span>
                                            {
                                                group.permissions.length
                                            }
                                        </span>

                                    </div>


                                    {group.permissions.map(
                                        (permission) => {

                                            const granted =
                                                permissionGrants.includes(
                                                    permission,
                                                );

                                            const denied =
                                                permissionDenials.includes(
                                                    permission,
                                                );


                                            return (

                                                <div
                                                    key={permission}
                                                    className="admin-create-staff-permission-row"
                                                >

                                                    <div>

                                                        <strong>
                                                            {
                                                                permissionLabel(
                                                                    permission,
                                                                )
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                permission
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="admin-create-staff-permission-actions">

                                                        <button
                                                            type="button"
                                                            className={
                                                                granted
                                                                    ? "grant active"
                                                                    : "grant"
                                                            }
                                                            onClick={() =>
                                                                togglePermission(
                                                                    permission,
                                                                    "grant",
                                                                )
                                                            }
                                                            title="Grant permission"
                                                        >
                                                            <HiOutlineCheckCircle />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className={
                                                                denied
                                                                    ? "deny active"
                                                                    : "deny"
                                                            }
                                                            onClick={() =>
                                                                togglePermission(
                                                                    permission,
                                                                    "deny",
                                                                )
                                                            }
                                                            title="Deny permission"
                                                        >
                                                            <HiOutlineLockClosed />
                                                        </button>

                                                    </div>

                                                </div>

                                            );

                                        },
                                    )}

                                </div>

                            ),
                        )}

                    </div>

                </section>


                {/* ========================================================
                    ACTIONS
                ======================================================== */}

                <div className="admin-create-staff-actions">

                    <button
                        type="button"
                        className="admin-create-staff-cancel"
                        onClick={() =>
                            navigate(
                                "/admin/staff-management",
                            )
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="admin-create-staff-submit"
                        disabled={
                            saving ||
                            loadingOptions
                        }
                    >

                        <HiOutlineUserAdd />

                        {saving
                            ? "Creating..."
                            : "Create Staff Member"}

                    </button>

                </div>

            </form>

        </div>

    );

};


export default AdminCreateStaff;