import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import StaffHeader from "./components/StaffHeader";
import StaffSummary from "./components/StaffSummary";
import StaffToolbar from "./components/StaffToolbar";
import StaffGrid from "./components/StaffGrid";
import StaffList from "./components/StaffList";
import StaffEmptyState from "./components/StaffEmptyState";
import StaffLoading from "./components/StaffLoading";

import staffManagementService
    from "./staffManagement.service";

import "./AdminStaff.css";

const AdminStaff = () => {
    const navigate = useNavigate();

    const [staff, setStaff] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [roleFilter, setRoleFilter] =
        useState("ALL");

    const [departmentFilter, setDepartmentFilter] =
        useState("ALL");

    const [view, setView] =
        useState("grid");

    const loadStaff = useCallback(
        async ({
            silent = false,
        } = {}) => {
            try {
                if (silent) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response =
                    await staffManagementService.getStaffList();

                const data =
                    response?.data ||
                    response?.staff ||
                    response ||
                    [];

                setStaff(
                    Array.isArray(data)
                        ? data
                        : [],
                );
            } catch (err) {
                console.error(
                    "Failed to load staff:",
                    err,
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load staff members.",
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [],
    );

    useEffect(() => {
        loadStaff();
    }, [loadStaff]);

    const roles = useMemo(() => {
        return [
            ...new Set(
                staff
                    .map(
                        (member) =>
                            member?.staffRole?.name ||
                            member?.staffRole?.key ||
                            "",
                    )
                    .map((value) =>
                        String(value).trim(),
                    )
                    .filter(Boolean),
            ),
        ].sort((a, b) =>
            a.localeCompare(b),
        );
    }, [staff]);

    const departments = useMemo(() => {
        return [
            ...new Set(
                staff
                    .map(
                        (member) =>
                            member?.department?.name ||
                            member?.department?.key ||
                            "",
                    )
                    .map((value) =>
                        String(value).trim(),
                    )
                    .filter(Boolean),
            ),
        ].sort((a, b) =>
            a.localeCompare(b),
        );
    }, [staff]);

    const filteredStaff = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return staff.filter((member) => {
            const name =
                String(
                    member?.name || "",
                ).toLowerCase();

            const email =
                String(
                    member?.email || "",
                ).toLowerCase();

            const position =
                String(
                    member?.position || "",
                ).toLowerCase();

            const role =
                String(
                    member?.staffRole?.name ||
                    member?.staffRole?.key ||
                    "",
                ).trim();

            const department =
                String(
                    member?.department?.name ||
                    member?.department?.key ||
                    "",
                ).trim();

            const isActive =
                member?.isActive === true;

            const matchesSearch =
                !normalizedSearch ||
                name.includes(
                    normalizedSearch,
                ) ||
                email.includes(
                    normalizedSearch,
                ) ||
                position.includes(
                    normalizedSearch,
                ) ||
                role
                    .toLowerCase()
                    .includes(
                        normalizedSearch,
                    ) ||
                department
                    .toLowerCase()
                    .includes(
                        normalizedSearch,
                    );

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" &&
                    isActive) ||
                (statusFilter === "INACTIVE" &&
                    !isActive);

            const matchesRole =
                roleFilter === "ALL" ||
                role === roleFilter;

            const matchesDepartment =
                departmentFilter === "ALL" ||
                department ===
                departmentFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesRole &&
                matchesDepartment
            );
        });
    }, [
        staff,
        search,
        statusFilter,
        roleFilter,
        departmentFilter,
    ]);

    const summary = useMemo(() => {
        const active = staff.filter(
            (member) =>
                member?.isActive === true,
        ).length;

        return {
            total: staff.length,
            active,
            inactive:
                staff.length - active,
        };
    }, [staff]);

    const hasActiveFilters =
        Boolean(search.trim()) ||
        statusFilter !== "ALL" ||
        roleFilter !== "ALL" ||
        departmentFilter !== "ALL";

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setRoleFilter("ALL");
        setDepartmentFilter("ALL");
    };

    const handleAddStaff = () => {
        navigate(
            "/admin/staff-management/new",
        );
    };

    const handleOpenStaff = (member) => {
        const staffId =
            member?._id ||
            member?.id;

        if (!staffId) return;

        navigate(
            `/admin/staff-management/${staffId}`,
        );
    };

    const handleRetry = () => {
        loadStaff();
    };

    return (
        <main className="admin-staff-page">
            <StaffHeader
                refreshing={refreshing}
                onRefresh={() =>
                    loadStaff({
                        silent: true,
                    })
                }
                onAddStaff={handleAddStaff}
            />

            <StaffSummary
                total={summary.total}
                active={summary.active}
                inactive={summary.inactive}
            />

            <StaffToolbar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                roleFilter={roleFilter}
                onRoleChange={setRoleFilter}
                departmentFilter={
                    departmentFilter
                }
                onDepartmentChange={
                    setDepartmentFilter
                }
                roles={roles}
                departments={departments}
                view={view}
                onViewChange={setView}
                hasActiveFilters={
                    hasActiveFilters
                }
                onClearFilters={
                    clearFilters
                }
            />

            {loading ? (
                <StaffLoading view={view} />
            ) : error ? (
                <section className="admin-staff-error">
                    <div className="admin-staff-error-icon">
                        !
                    </div>

                    <div className="admin-staff-error-copy">
                        <h3>
                            Unable to load staff
                        </h3>

                        <p>{error}</p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRetry}
                    >
                        Try again
                    </button>
                </section>
            ) : filteredStaff.length === 0 ? (
                <StaffEmptyState
                    hasFilters={
                        hasActiveFilters
                    }
                    onClearFilters={
                        clearFilters
                    }
                    onAddStaff={
                        handleAddStaff
                    }
                />
            ) : view === "grid" ? (
                <StaffGrid
                    staff={filteredStaff}
                    onOpenStaff={
                        handleOpenStaff
                    }
                />
            ) : (
                <StaffList
                    staff={filteredStaff}
                    onOpenStaff={
                        handleOpenStaff
                    }
                />
            )}
        </main>
    );
};

export default AdminStaff;