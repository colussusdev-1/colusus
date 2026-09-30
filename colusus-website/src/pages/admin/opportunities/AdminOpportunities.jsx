import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineAdjustments,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamationCircle,
    HiOutlineEye,
    HiOutlineFilter,
    HiOutlinePlus,
    HiOutlineRefresh,
    HiOutlineSearch,
    HiOutlineStar,
    HiOutlineXCircle,
    HiPencil,
    HiStar,
} from "react-icons/hi";

import opportunitiesService from "./opportunities.service";
import "./opportunities.css";


const getResponseData = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.opportunities)) {
        return response.data.opportunities;
    }

    if (Array.isArray(response?.opportunities)) {
        return response.opportunities;
    }

    return [];
};


const getOpportunityId = (opportunity) => {
    return (
        opportunity?._id ||
        opportunity?.id ||
        opportunity?.legacyId
    );
};


const getCountryName = (opportunity) => {
    return (
        opportunity?.countryName ||
        opportunity?.country?.name ||
        "—"
    );
};


const formatSalary = (salary) => {
    if (!salary) {
        return "—";
    }

    if (typeof salary === "string") {
        return salary;
    }

    if (typeof salary === "number") {
        return salary.toLocaleString();
    }

    if (typeof salary === "object") {
        if (salary.display) {
            return salary.display;
        }

        if (salary.amount) {
            return `${salary.currency || ""}${Number(
                salary.amount
            ).toLocaleString()}`;
        }

        if (salary.min || salary.max) {
            const currency =
                salary.currency || "";

            const min = salary.min
                ? `${currency}${Number(
                    salary.min
                ).toLocaleString()}`
                : "";

            const max = salary.max
                ? `${currency}${Number(
                    salary.max
                ).toLocaleString()}`
                : "";

            if (min && max) {
                return `${min} - ${max}`;
            }

            return min || max || "—";
        }
    }

    return "—";
};


function AdminOpportunities() {
    const navigate = useNavigate();

    const [opportunities, setOpportunities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [countryFilter, setCountryFilter] =
        useState("ALL");

    const [categoryFilter, setCategoryFilter] =
        useState("ALL");


    const loadOpportunities = async ({
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
                await opportunitiesService.getAllOpportunities();

            setOpportunities(
                getResponseData(response)
            );
        } catch (err) {
            console.error(
                "Failed to load opportunities:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load opportunities."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadOpportunities();
    }, []);


    useEffect(() => {
        if (!success) {
            return undefined;
        }

        const timer = setTimeout(() => {
            setSuccess("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [success]);


    const stats = useMemo(() => {
        const total =
            opportunities.length;

        const active =
            opportunities.filter(
                (item) =>
                    item?.active !== false
            ).length;

        const inactive =
            opportunities.filter(
                (item) =>
                    item?.active === false
            ).length;

        const featured =
            opportunities.filter(
                (item) =>
                    item?.featured === true
            ).length;

        return {
            total,
            active,
            inactive,
            featured,
        };
    }, [opportunities]);


    const countries = useMemo(() => {
        return [
            ...new Set(
                opportunities
                    .map(getCountryName)
                    .filter(
                        (country) =>
                            country !== "—"
                    )
            ),
        ].sort();
    }, [opportunities]);


    const categories = useMemo(() => {
        return [
            ...new Set(
                opportunities
                    .map(
                        (item) =>
                            item?.category
                    )
                    .filter(Boolean)
            ),
        ].sort();
    }, [opportunities]);


    const filteredOpportunities = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return opportunities.filter(
            (opportunity) => {
                const country =
                    getCountryName(
                        opportunity
                    );

                const searchableText = [
                    opportunity?.title,
                    opportunity?.slug,
                    country,
                    opportunity?.category,
                    opportunity?.type,
                    opportunity?.location,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                const matchesSearch =
                    !query ||
                    searchableText.includes(
                        query
                    );

                const matchesStatus =
                    statusFilter === "ALL" ||
                    (statusFilter ===
                        "ACTIVE" &&
                        opportunity?.active !==
                        false) ||
                    (statusFilter ===
                        "INACTIVE" &&
                        opportunity?.active ===
                        false) ||
                    (statusFilter ===
                        "FEATURED" &&
                        opportunity?.featured ===
                        true);

                const matchesCountry =
                    countryFilter ===
                    "ALL" ||
                    country === countryFilter;

                const matchesCategory =
                    categoryFilter ===
                    "ALL" ||
                    opportunity?.category ===
                    categoryFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesCountry &&
                    matchesCategory
                );
            }
        );
    }, [
        opportunities,
        search,
        statusFilter,
        countryFilter,
        categoryFilter,
    ]);


    const hasFilters =
        Boolean(search.trim()) ||
        statusFilter !== "ALL" ||
        countryFilter !== "ALL" ||
        categoryFilter !== "ALL";


    const clearFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setCountryFilter("ALL");
        setCategoryFilter("ALL");
    };


    const handleRefresh = async () => {
        setSuccess("");

        await loadOpportunities({
            silent: true,
        });
    };


    const handleToggleActive = async (
        opportunity
    ) => {
        const id =
            getOpportunityId(opportunity);

        if (!id) {
            setError(
                "This opportunity does not have a valid ID."
            );
            return;
        }

        const nextActive =
            opportunity?.active === false;

        try {
            setActionLoading(
                `active-${id}`
            );

            setError("");
            setSuccess("");

            await opportunitiesService.setOpportunityActive(
                id,
                nextActive
            );

            setOpportunities(
                (current) =>
                    current.map((item) =>
                        getOpportunityId(
                            item
                        ) === id
                            ? {
                                ...item,
                                active: nextActive,
                            }
                            : item
                    )
            );

            setSuccess(
                nextActive
                    ? "Opportunity activated successfully."
                    : "Opportunity deactivated successfully."
            );
        } catch (err) {
            console.error(
                "Failed to update opportunity status:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update opportunity status."
            );
        } finally {
            setActionLoading("");
        }
    };


    const handleToggleFeatured = async (
        opportunity
    ) => {
        const id =
            getOpportunityId(opportunity);

        if (!id) {
            setError(
                "This opportunity does not have a valid ID."
            );
            return;
        }

        const nextFeatured =
            opportunity?.featured !== true;

        try {
            setActionLoading(
                `featured-${id}`
            );

            setError("");
            setSuccess("");

            await opportunitiesService.setOpportunityFeatured(
                id,
                nextFeatured
            );

            setOpportunities(
                (current) =>
                    current.map((item) =>
                        getOpportunityId(
                            item
                        ) === id
                            ? {
                                ...item,
                                featured:
                                    nextFeatured,
                            }
                            : item
                    )
            );

            setSuccess(
                nextFeatured
                    ? "Opportunity marked as featured."
                    : "Opportunity removed from featured."
            );
        } catch (err) {
            console.error(
                "Failed to update featured status:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to update featured status."
            );
        } finally {
            setActionLoading("");
        }
    };


    const handleDeactivate = async (
        opportunity
    ) => {
        const id =
            getOpportunityId(opportunity);

        if (!id) {
            setError(
                "This opportunity does not have a valid ID."
            );
            return;
        }

        const title =
            opportunity?.title ||
            "this opportunity";

        const confirmed =
            window.confirm(
                `Deactivate "${title}"?\n\nThis will remove it from active opportunity listings.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(
                `delete-${id}`
            );

            setError("");
            setSuccess("");

            await opportunitiesService.deactivateOpportunity(
                id
            );

            setOpportunities(
                (current) =>
                    current.map((item) =>
                        getOpportunityId(
                            item
                        ) === id
                            ? {
                                ...item,
                                active: false,
                            }
                            : item
                    )
            );

            setSuccess(
                "Opportunity deactivated successfully."
            );
        } catch (err) {
            console.error(
                "Failed to deactivate opportunity:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to deactivate opportunity."
            );
        } finally {
            setActionLoading("");
        }
    };


    const handleEdit = (
        opportunity
    ) => {
        const id =
            getOpportunityId(opportunity);

        if (!id) {
            setError(
                "This opportunity does not have a valid ID."
            );
            return;
        }

        navigate(
            `/admin/opportunities/${id}/edit`
        );
    };


    return (
        <div className="admin-opportunities">

            <div className="admin-opportunities__header">

                <div>
                    <span className="admin-opportunities__eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Opportunities
                    </h1>

                    <p>
                        Manage migration
                        opportunities, job
                        listings, publishing
                        status, and featured
                        opportunities.
                    </p>
                </div>


                <div className="admin-opportunities__header-actions">

                    <button
                        type="button"
                        className="admin-opportunities__refresh"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loading ||
                            refreshing
                        }
                    >
                        <HiOutlineRefresh
                            className={
                                refreshing
                                    ? "is-spinning"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>


                    <Link
                        to="/admin/opportunities/new"
                        className="admin-opportunities__create"
                    >
                        <HiOutlinePlus />

                        Add Opportunity
                    </Link>

                </div>

            </div>


            {error && (
                <div className="admin-opportunities__alert admin-opportunities__alert--error">

                    <HiOutlineExclamationCircle />

                    <div>
                        <strong>
                            Something went wrong
                        </strong>

                        <span>
                            {error}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        Dismiss
                    </button>

                </div>
            )}


            {success && (
                <div
                    className="admin-opportunities__alert"
                    style={{
                        border:
                            "1px solid #bbf7d0",
                        background:
                            "#f0fdf4",
                        color:
                            "#15803d",
                    }}
                >
                    <HiOutlineCheckCircle />

                    <div>
                        <strong>
                            Success
                        </strong>

                        <span
                            style={{
                                color:
                                    "#166534",
                            }}
                        >
                            {success}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                    >
                        Dismiss
                    </button>
                </div>
            )}


            <div className="admin-opportunities__stats">

                <div className="admin-opportunities__stat">
                    <span>
                        Total opportunities
                    </span>

                    <strong>
                        {stats.total}
                    </strong>
                </div>


                <div className="admin-opportunities__stat">
                    <span>
                        Active
                    </span>

                    <strong>
                        {stats.active}
                    </strong>
                </div>


                <div className="admin-opportunities__stat">
                    <span>
                        Inactive
                    </span>

                    <strong>
                        {stats.inactive}
                    </strong>
                </div>


                <div className="admin-opportunities__stat">
                    <span>
                        Featured
                    </span>

                    <strong>
                        {stats.featured}
                    </strong>
                </div>

            </div>


            <div className="admin-opportunities__panel">

                <div className="admin-opportunities__toolbar">

                    <div className="admin-opportunities__search">

                        <HiOutlineSearch />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search opportunities..."
                        />

                    </div>


                    <div className="admin-opportunities__filters">

                        <select
                            value={
                                statusFilter
                            }
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <option value="ALL">
                                All statuses
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>

                            <option value="FEATURED">
                                Featured
                            </option>
                        </select>


                        <select
                            value={
                                countryFilter
                            }
                            onChange={(event) =>
                                setCountryFilter(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <option value="ALL">
                                All countries
                            </option>

                            {countries.map(
                                (country) => (
                                    <option
                                        key={
                                            country
                                        }
                                        value={
                                            country
                                        }
                                    >
                                        {country}
                                    </option>
                                )
                            )}
                        </select>


                        <select
                            value={
                                categoryFilter
                            }
                            onChange={(event) =>
                                setCategoryFilter(
                                    event.target
                                        .value
                                )
                            }
                        >
                            <option value="ALL">
                                All categories
                            </option>

                            {categories.map(
                                (category) => (
                                    <option
                                        key={
                                            category
                                        }
                                        value={
                                            category
                                        }
                                    >
                                        {category}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                </div>


                {loading ? (
                    <div className="admin-opportunities__loading">

                        <div className="admin-opportunities__spinner" />

                        <span>
                            Loading opportunities...
                        </span>

                    </div>
                ) : filteredOpportunities.length ===
                    0 ? (
                    <div className="admin-opportunities__empty">

                        <div className="admin-opportunities__empty-icon">
                            <HiOutlineAdjustments />
                        </div>

                        <h2>
                            {hasFilters
                                ? "No opportunities found"
                                : "No opportunities yet"}
                        </h2>

                        <p>
                            {hasFilters
                                ? "Try adjusting your search or filters."
                                : "Create your first migration opportunity to start managing your listings."}
                        </p>

                        {hasFilters ? (
                            <button
                                type="button"
                                className="admin-opportunities__refresh"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear filters
                            </button>
                        ) : (
                            <Link
                                to="/admin/opportunities/new"
                                className="admin-opportunities__create"
                            >
                                <HiOutlinePlus />

                                Create opportunity
                            </Link>
                        )}

                    </div>
                ) : (
                    <div className="admin-opportunities__table-wrap">

                        <table className="admin-opportunities__table">

                            <thead>
                                <tr>
                                    <th>
                                        Opportunity
                                    </th>

                                    <th>
                                        Country
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Salary
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Featured
                                    </th>

                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>


                            <tbody>
                                {filteredOpportunities.map(
                                    (
                                        opportunity
                                    ) => {
                                        const id =
                                            getOpportunityId(
                                                opportunity
                                            );

                                        const active =
                                            opportunity?.active !==
                                            false;

                                        const featured =
                                            opportunity?.featured ===
                                            true;

                                        const activeLoading =
                                            actionLoading ===
                                            `active-${id}`;

                                        const featuredLoading =
                                            actionLoading ===
                                            `featured-${id}`;

                                        const deactivateLoading =
                                            actionLoading ===
                                            `delete-${id}`;

                                        return (
                                            <tr
                                                key={
                                                    id
                                                }
                                            >

                                                <td>
                                                    <div className="admin-opportunities__opportunity">

                                                        <div className="admin-opportunities__image">

                                                            {opportunity?.image ? (
                                                                <img
                                                                    src={
                                                                        opportunity.image
                                                                    }
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <span>
                                                                    {(
                                                                        opportunity?.title ||
                                                                        "O"
                                                                    )
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            )}

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {
                                                                    opportunity?.title ||
                                                                    "Untitled opportunity"
                                                                }
                                                            </strong>

                                                            <small>
                                                                /
                                                                {opportunity?.slug ||
                                                                    "no-slug"}
                                                            </small>

                                                        </div>

                                                    </div>
                                                </td>


                                                <td>
                                                    <span className="admin-opportunities__country">
                                                        {
                                                            getCountryName(
                                                                opportunity
                                                            )
                                                        }
                                                    </span>
                                                </td>


                                                <td>
                                                    {
                                                        opportunity?.category ||
                                                        "—"
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        opportunity?.type ||
                                                        "—"
                                                    }
                                                </td>


                                                <td>
                                                    {formatSalary(
                                                        opportunity?.salary
                                                    )}
                                                </td>


                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`admin-opportunities__status ${active
                                                                ? ""
                                                                : "is-inactive"
                                                            }`}
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                opportunity
                                                            )
                                                        }
                                                        disabled={
                                                            activeLoading
                                                        }
                                                    >
                                                        {active ? (
                                                            <>
                                                                <HiOutlineCheckCircle />

                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <HiOutlineXCircle />

                                                                Inactive
                                                            </>
                                                        )}
                                                    </button>
                                                </td>


                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`admin-opportunities__featured ${featured
                                                                ? "is-featured"
                                                                : ""
                                                            }`}
                                                        onClick={() =>
                                                            handleToggleFeatured(
                                                                opportunity
                                                            )
                                                        }
                                                        disabled={
                                                            featuredLoading
                                                        }
                                                    >
                                                        {featured ? (
                                                            <HiStar />
                                                        ) : (
                                                            <HiOutlineStar />
                                                        )}

                                                        {featured
                                                            ? "Featured"
                                                            : "Feature"}
                                                    </button>
                                                </td>


                                                <td>
                                                    <div className="admin-opportunities__actions">

                                                        <Link
                                                            to={`/opportunities/${opportunity?.countrySlug}/${opportunity?.slug}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="admin-opportunities__action"
                                                            title="View opportunity"
                                                        >
                                                            <HiOutlineEye />
                                                        </Link>


                                                        <button
                                                            type="button"
                                                            className="admin-opportunities__action"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    opportunity
                                                                )
                                                            }
                                                            title="Edit opportunity"
                                                        >
                                                            <HiPencil />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="admin-opportunities__action"
                                                            onClick={() =>
                                                                handleDeactivate(
                                                                    opportunity
                                                                )
                                                            }
                                                            disabled={
                                                                deactivateLoading ||
                                                                !active
                                                            }
                                                            title="Deactivate opportunity"
                                                        >
                                                            <HiOutlineXCircle />
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}


export default AdminOpportunities;