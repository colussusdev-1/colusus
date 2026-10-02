import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    HiOutlineRefresh,
    HiOutlineXCircle,
} from "react-icons/hi";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import staffManagementService
    from "./staffManagement.service";

import StaffDetailsHeader
    from "./components/StaffHeader";

import StaffDetailsFeedback
    from "./components/details/StaffDetailsFeedback";

import StaffProfileCard
    from "./components/details/StaffProfileCard";

import StaffProfileForm
    from "./components/details/StaffProfileForm";

import StaffInformation
    from "./components/details/StaffInformation";

import StaffAccessSection
    from "./components/details/StaffAccessSection";

import {
    PERMISSION_GROUPS,
    extractAccess,
    extractList,
    extractStaff,
    getEntityId,
} from "./components/details/staffManagement.constants";

import "./AdminStaffDetails.css";

const createEmptyAccess = () => ({
    staffRole: null,
    permissions: [],
    permissionGrants: [],
    permissionDenials: [],
    unrestricted: false,
});

const createEmptyProfileForm = () => ({
    name: "",
    email: "",
    staffRole: "",
    department: "",
    position: "",
});

const AdminStaffDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();


    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const [staff, setStaff] =
        useState(null);

    const [access, setAccess] =
        useState(createEmptyAccess());

    const [roles, setRoles] =
        useState([]);

    const [departments, setDepartments] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | UI STATE
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [loadingOptions, setLoadingOptions] =
        useState(true);

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [savingAccess, setSavingAccess] =
        useState(false);

    const [statusUpdating, setStatusUpdating] =
        useState(false);

    const [editingProfile, setEditingProfile] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | FORMS
    |--------------------------------------------------------------------------
    */

    const [profileForm, setProfileForm] =
        useState(createEmptyProfileForm());


    /*
    |--------------------------------------------------------------------------
    | PERMISSION UI
    |--------------------------------------------------------------------------
    */

    const [openGroups, setOpenGroups] =
        useState({
            dashboard: true,
            applications: true,
            documents: true,
            forms: true,
        });


    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    const resetFeedback = useCallback(() => {
        setError("");
        setSuccess("");
    }, []);


    const buildProfileForm = useCallback((staffData) => {
        return {
            name:
                staffData?.name ||
                "",

            email:
                staffData?.email ||
                "",

            staffRole:
                getEntityId(
                    staffData?.staffRole,
                ),

            department:
                getEntityId(
                    staffData?.department,
                ),

            position:
                staffData?.position ||
                "",
        };
    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOAD STAFF
    |--------------------------------------------------------------------------
    */

    const loadStaff = useCallback(
        async ({
            silent = false,
        } = {}) => {
            if (!id) {
                setError(
                    "Staff ID is missing.",
                );

                setLoading(false);

                return;
            }

            try {
                if (silent) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const [
                    staffResponse,
                    accessResponse,
                ] = await Promise.all([
                    staffManagementService.getStaffById(id),
                    staffManagementService.getStaffAccess(id),
                ]);

                const staffData =
                    extractStaff(
                        staffResponse,
                    );

                const accessData =
                    extractAccess(
                        accessResponse,
                    );

                if (!staffData) {
                    setStaff(null);
                    setAccess(
                        createEmptyAccess(),
                    );

                    return;
                }

                setStaff(staffData);

                setAccess({
                    staffRole:
                        accessData?.staffRole ||
                        staffData?.staffRole ||
                        null,

                    permissions:
                        Array.isArray(
                            accessData?.permissions,
                        )
                            ? accessData.permissions
                            : [],

                    permissionGrants:
                        Array.isArray(
                            accessData?.permissionGrants,
                        )
                            ? accessData.permissionGrants
                            : Array.isArray(
                                staffData?.permissionGrants,
                            )
                                ? staffData.permissionGrants
                                : [],

                    permissionDenials:
                        Array.isArray(
                            accessData?.permissionDenials,
                        )
                            ? accessData.permissionDenials
                            : Array.isArray(
                                staffData?.permissionDenials,
                            )
                                ? staffData.permissionDenials
                                : [],

                    unrestricted:
                        Boolean(
                            accessData?.unrestricted,
                        ),
                });

                setProfileForm(
                    buildProfileForm(
                        staffData,
                    ),
                );
            } catch (err) {
                console.error(
                    "Failed to load staff member:",
                    err,
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load staff member.",
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [
            id,
            buildProfileForm,
        ],
    );


    /*
    |--------------------------------------------------------------------------
    | LOAD ROLE / DEPARTMENT OPTIONS
    |--------------------------------------------------------------------------
    */

    const loadOptions = useCallback(
        async () => {
            try {
                setLoadingOptions(true);

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
                console.error(
                    "Failed to load staff configuration:",
                    err,
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load staff configuration.",
                );
            } finally {
                setLoadingOptions(false);
            }
        },
        [],
    );


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadStaff();
        loadOptions();
    }, [
        loadStaff,
        loadOptions,
    ]);


    /*
    |--------------------------------------------------------------------------
    | EFFECTIVE PERMISSIONS
    |--------------------------------------------------------------------------
    */

    const effectivePermissions =
        useMemo(
            () =>
                new Set(
                    Array.isArray(
                        access.permissions,
                    )
                        ? access.permissions
                        : [],
                ),
            [
                access.permissions,
            ],
        );


    const directGrants =
        useMemo(
            () =>
                new Set(
                    Array.isArray(
                        access.permissionGrants,
                    )
                        ? access.permissionGrants
                        : [],
                ),
            [
                access.permissionGrants,
            ],
        );


    const directDenials =
        useMemo(
            () =>
                new Set(
                    Array.isArray(
                        access.permissionDenials,
                    )
                        ? access.permissionDenials
                        : [],
                ),
            [
                access.permissionDenials,
            ],
        );


    const rolePermissions =
        useMemo(() => {
            const permissions =
                access.staffRole?.permissions ||
                staff?.staffRole?.permissions ||
                [];

            return new Set(
                Array.isArray(permissions)
                    ? permissions
                    : [],
            );
        }, [
            access.staffRole,
            staff,
        ]);


    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */

    const handleProfileChange = useCallback(
        (event) => {
            const {
                name,
                value,
            } = event.target;

            setProfileForm(
                (current) => ({
                    ...current,
                    [name]: value,
                }),
            );
        },
        [],
    );


    const handleSaveProfile = useCallback(
        async () => {
            const name =
                profileForm.name.trim();

            const email =
                profileForm.email.trim();

            if (!name) {
                setError(
                    "Staff name is required.",
                );

                return;
            }

            if (!email) {
                setError(
                    "Email address is required.",
                );

                return;
            }

            if (!profileForm.staffRole) {
                setError(
                    "Staff role is required.",
                );

                return;
            }

            try {
                setSavingProfile(true);
                resetFeedback();

                await staffManagementService.updateStaff(
                    id,
                    {
                        name,

                        email,

                        staffRole:
                            profileForm.staffRole,

                        department:
                            profileForm.department ||
                            null,

                        position:
                            profileForm.position.trim(),
                    },
                );

                setEditingProfile(false);

                setSuccess(
                    "Staff profile updated successfully.",
                );

                await loadStaff();
            } catch (err) {
                console.error(
                    "Failed to update staff profile:",
                    err,
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to update staff profile.",
                );
            } finally {
                setSavingProfile(false);
            }
        },
        [
            id,
            profileForm,
            loadStaff,
            resetFeedback,
        ],
    );


    const handleCancelProfileEdit =
        useCallback(() => {
            if (staff) {
                setProfileForm(
                    buildProfileForm(
                        staff,
                    ),
                );
            }

            setEditingProfile(false);
            setError("");
        }, [
            staff,
            buildProfileForm,
        ]);


    /*
    |--------------------------------------------------------------------------
    | PERMISSION GROUPS
    |--------------------------------------------------------------------------
    */

    const toggleGroup =
        useCallback((key) => {
            setOpenGroups(
                (current) => ({
                    ...current,
                    [key]:
                        !current[key],
                }),
            );
        }, []);


    /*
    |--------------------------------------------------------------------------
    | DIRECT GRANTS
    |--------------------------------------------------------------------------
    */

    const toggleGrant =
        useCallback((permission) => {
            setAccess(
                (current) => {
                    const grants =
                        new Set(
                            current.permissionGrants ||
                            [],
                        );

                    const denials =
                        new Set(
                            current.permissionDenials ||
                            [],
                        );

                    if (
                        grants.has(
                            permission,
                        )
                    ) {
                        grants.delete(
                            permission,
                        );
                    } else {
                        grants.add(
                            permission,
                        );

                        denials.delete(
                            permission,
                        );
                    }

                    return {
                        ...current,

                        permissionGrants:
                            [...grants],

                        permissionDenials:
                            [...denials],
                    };
                },
            );

            setSuccess("");
            setError("");
        }, []);


    /*
    |--------------------------------------------------------------------------
    | DIRECT DENIALS
    |--------------------------------------------------------------------------
    */

    const toggleDenial =
        useCallback((permission) => {
            setAccess(
                (current) => {
                    const grants =
                        new Set(
                            current.permissionGrants ||
                            [],
                        );

                    const denials =
                        new Set(
                            current.permissionDenials ||
                            [],
                        );

                    if (
                        denials.has(
                            permission,
                        )
                    ) {
                        denials.delete(
                            permission,
                        );
                    } else {
                        denials.add(
                            permission,
                        );

                        grants.delete(
                            permission,
                        );
                    }

                    return {
                        ...current,

                        permissionGrants:
                            [...grants],

                        permissionDenials:
                            [...denials],
                    };
                },
            );

            setSuccess("");
            setError("");
        }, []);


    /*
    |--------------------------------------------------------------------------
    | SAVE ACCESS
    |--------------------------------------------------------------------------
    */

    const handleSaveAccess =
        useCallback(async () => {
            try {
                setSavingAccess(true);
                resetFeedback();

                await staffManagementService.updateStaffAccess(
                    id,
                    {
                        permissionGrants:
                            access.permissionGrants,

                        permissionDenials:
                            access.permissionDenials,
                    },
                );

                setSuccess(
                    "Staff access updated successfully.",
                );

                await loadStaff();
            } catch (err) {
                console.error(
                    "Failed to update staff access:",
                    err,
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to update staff access.",
                );
            } finally {
                setSavingAccess(false);
            }
        }, [
            id,
            access.permissionGrants,
            access.permissionDenials,
            loadStaff,
            resetFeedback,
        ]);


    /*
    |--------------------------------------------------------------------------
    | STATUS
    |--------------------------------------------------------------------------
    */

    const handleStatusChange =
        useCallback(async () => {
            if (!staff) {
                return;
            }

            const nextStatus =
                !Boolean(
                    staff.isActive,
                );

            try {
                setStatusUpdating(true);
                resetFeedback();

                await staffManagementService.updateStaffStatus(
                    id,
                    nextStatus,
                );

                setStaff(
                    (current) => ({
                        ...current,
                        isActive:
                            nextStatus,
                    }),
                );

                setSuccess(
                    nextStatus
                        ? "Staff member activated."
                        : "Staff member deactivated.",
                );
            } catch (err) {
                console.error(
                    "Failed to update staff status:",
                    err,
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to update staff status.",
                );
            } finally {
                setStatusUpdating(false);
            }
        }, [
            id,
            staff,
            resetFeedback,
        ]);


    /*
    |--------------------------------------------------------------------------
    | NAVIGATION
    |--------------------------------------------------------------------------
    */

    const handleBack = useCallback(() => {
        navigate(
            "/admin/staff-management",
        );
    }, [
        navigate,
    ]);


    const handleEditProfile =
        useCallback(() => {
            setEditingProfile(true);
            resetFeedback();
        }, [
            resetFeedback,
        ]);


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="admin-staff-details">
                <div className="admin-staff-details-loading">
                    <HiOutlineRefresh />

                    <span>
                        Loading staff profile...
                    </span>
                </div>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!staff) {
        return (
            <div className="admin-staff-details">
                <div className="admin-staff-details-error">
                    <HiOutlineXCircle />

                    <h2>
                        Staff member not found
                    </h2>

                    <p>
                        The requested staff account
                        could not be loaded.
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                    >
                        Back to Staff
                    </button>
                </div>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | DISPLAY DATA
    |--------------------------------------------------------------------------
    */

    const roleName =
        staff.staffRole?.name ||
        access.staffRole?.name ||
        "No role assigned";

    const departmentName =
        staff.department?.name ||
        "No department assigned";


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <main className="admin-staff-details">
            <StaffDetailsHeader
                staff={staff}
                refreshing={refreshing}
                statusUpdating={statusUpdating}
                onBack={handleBack}
                onRefresh={() =>
                    loadStaff({
                        silent: true,
                    })
                }
                onEdit={handleEditProfile}
                onStatusChange={
                    handleStatusChange
                }
            />

            <StaffDetailsFeedback
                error={error}
                success={success}
            />

            <StaffProfileCard
                staff={staff}
            />

            {editingProfile && (
                <StaffProfileForm
                    form={profileForm}
                    roles={roles}
                    departments={departments}
                    loadingOptions={
                        loadingOptions
                    }
                    saving={savingProfile}
                    onChange={
                        handleProfileChange
                    }
                    onSave={
                        handleSaveProfile
                    }
                    onCancel={
                        handleCancelProfileEdit
                    }
                />
            )}

            <StaffInformation
                staff={staff}
                roleName={roleName}
                departmentName={
                    departmentName
                }
            />

            <StaffAccessSection
                groups={PERMISSION_GROUPS}
                effectivePermissions={
                    effectivePermissions
                }
                directGrants={
                    directGrants
                }
                directDenials={
                    directDenials
                }
                rolePermissions={
                    rolePermissions
                }
                openGroups={openGroups}
                saving={savingAccess}
                onToggleGroup={
                    toggleGroup
                }
                onGrant={
                    toggleGrant
                }
                onDeny={
                    toggleDenial
                }
                onSave={
                    handleSaveAccess
                }
            />
        </main>
    );


};

export default AdminStaffDetails;
