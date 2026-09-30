import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineAdjustmentsHorizontal,
    HiOutlineArrowPath,
    HiOutlineCheckCircle,
    HiOutlineEye,
    HiOutlinePencilSquare,
    HiOutlinePlus,
    HiOutlineStar,
    HiOutlineXCircle,
} from "react-icons/hi2";

import opportunitiesService from "./opportunities.service";
import "./opportunities.css";

const getOpportunityId = (opportunity) =>
    opportunity?._id || opportunity?.id;

const getCountryName = (opportunity) =>
    opportunity?.countryName ||
    opportunity?.country ||
    "Unknown country";

const getOpportunityTitle = (opportunity) =>
    opportunity?.title || "Untitled opportunity";

const getStatusLabel = (active) => (active ? "Active" : "Inactive");

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [featuredFilter, setFeaturedFilter] = useState("ALL");
    const [actionId, setActionId] = useState(null);

    const loadOpportunities = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");
            setActionError("");

            const response =
                await opportunitiesService.getAllOpportunities();

            setOpportunities(response?.data || []);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to load opportunities. Please try again.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadOpportunities();
    }, [loadOpportunities]);

    const filteredOpportunities = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return opportunities.filter((opportunity) => {
            const matchesSearch =
                !normalizedSearch ||
                [
                    opportunity?.title,
                    opportunity?.countryName,
                    opportunity?.category,
                    opportunity?.type,
                    opportunity?.location,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(normalizedSearch),
                    );

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && opportunity?.active === true) ||
                (statusFilter === "INACTIVE" &&
                    opportunity?.active === false);

            const matchesFeatured =
                featuredFilter === "ALL" ||
                (featuredFilter === "FEATURED" &&
                    opportunity?.featured === true) ||
                (featuredFilter === "NOT_FEATURED" &&
                    opportunity?.featured !== true);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesFeatured
            );
        });
    }, [
        opportunities,
        search,
        statusFilter,
        featuredFilter,
    ]);

    const statistics = useMemo(() => {
        const active = opportunities.filter(
            (item) => item?.active === true,
        ).length;

        const inactive = opportunities.filter(
            (item) => item?.active === false,
        ).length;

        const featured = opportunities.filter(
            (item) => item?.featured === true,
        ).length;

        return {
            total: opportunities.length,
            active,
            inactive,
            featured,
        };
    }, [opportunities]);

    const handleToggleActive = async (opportunity) => {
        const id = getOpportunityId(opportunity);

        if (!id) return;

        const nextActive = !opportunity.active;

        try {
            setActionId(id);
            setActionError("");

            const response =
                await opportunitiesService.setOpportunityActive(
                    id,
                    nextActive,
                );

            const updated = response?.data;

            setOpportunities((current) =>
                current.map((item) =>
                    getOpportunityId(item) === id
                        ? updated || {
                            ...item,
                            active: nextActive,
                        }
                        : item,
                ),
            );
        } catch (err) {
            setActionError(
                err?.response?.data?.message ||
                "Unable to update the opportunity status.",
            );
        } finally {
            setActionId(null);
        }
    };

    const handleToggleFeatured = async (opportunity) => {
        const id = getOpportunityId(opportunity);

        if (!id) return;

        const nextFeatured = !opportunity.featured;

        try {
            setActionId(id);
            setActionError("");

            const response =
                await opportunitiesService.setOpportunityFeatured(
                    id,
                    nextFeatured,
                );

            const updated = response?.data;

            setOpportunities((current) =>
                current.map((item) =>
                    getOpportunityId(item) === id
                        ? updated || {
                            ...item,
                            featured: nextFeatured,
                        }
                        : item,
                ),
            );
        } catch (err) {
            setActionError(
                err?.response?.data?.message ||
                "Unable to update featured status.",
            );
        } finally {
            setActionId(null);
        }
    };

    const handleDeactivate = async (opportunity) => {
        const id = getOpportunityId(opportunity);

        if (!id) return;

        const confirmed = window.confirm(
            `Deactivate "${getOpportunityTitle(
                opportunity,
            )}"? This will remove it from active public opportunities.`,
        );

        if (!confirmed) return;

        try {
            setActionId(id);
            setActionError("");

            const response =
                await opportunitiesService.deactivateOpportunity(id);

            const updated = response?.data;

            setOpportunities((current) =>
                current.map((item) =>
                    getOpportunityId(item) === id
                        ? updated || {
                            ...item,
                            active: false,
                            featured: false,
                        }
                        : item,
                ),
            );
        } catch (err) {
            setActionError(
                err?.response?.data?.message ||
                "Unable to deactivate the opportunity.",
            );
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="admin-opportunities">
            <div className="admin-opportunities__header">
                <div>
                    <span className="admin-opportunities__eyebrow">
                        Opportunity management
                    </span>

                    <h1>Opportunities</h1>

                    <p>
                        Manage the migration opportunities available
                        across the client and public experience.
                    </p>
                </div>

                <div className="admin-opportunities__header-actions">
                    <button
                        type="button"
                        className="admin-opportunities__refresh"
                        onClick={() => loadOpportunities(true)}
                        disabled={refreshing || loading}
                    >
                        <HiOutlineArrowPath
                            className={refreshing ? "is-spinning" : ""}
                        />

                        <span>
                            {refreshing ? "Refreshing..." : "Refresh"}
                        </span>
                    </button>

                    <Link
                        to="/admin/opportunities/new"
                        className="admin-opportunities__create"
                    >
                        <HiOutlinePlus />
                        <span>Create opportunity</span>
                    </Link>
                </div>
            </div>

            <div className="admin-opportunities__stats">
                <div className="admin-opportunities__stat">
                    <span>Total</span>
                    <strong>{statistics.total}</strong>
                </div>

                <div className="admin-opportunities__stat">
                    <span>Active</span>
                    <strong>{statistics.active}</strong>
                </div>

                <div className="admin-opportunities__stat">
                    <span>Inactive</span>
                    <strong>{statistics.inactive}</strong>
                </div>

                <div className="admin-opportunities__stat">
                    <span>Featured</span>
                    <strong>{statistics.featured}</strong>
                </div>
            </div>

            {error && (
                <div className="admin-opportunities__alert admin-opportunities__alert--error">
                    <HiOutlineXCircle />

                    <div>
                        <strong>Could not load opportunities</strong>
                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadOpportunities()}
                    >
                        Try again
                    </button>
                </div>
            )}

            {actionError && (
                <div className="admin-opportunities__alert admin-opportunities__alert--error">
                    <HiOutlineXCircle />

                    <div>
                        <strong>Action failed</strong>
                        <span>{actionError}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setActionError("")}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <section className="admin-opportunities__panel">
                <div className="admin-opportunities__toolbar">
                    <div className="admin-opportunities__search">
                        <HiOutlineAdjustmentsHorizontal />

                        <input
                            type="search"
                            placeholder="Search opportunities, countries, categories..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="admin-opportunities__filters">
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="ALL">All statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>

                        <select
                            value={featuredFilter}
                            onChange={(event) =>
                                setFeaturedFilter(event.target.value)
                            }
                        >
                            <option value="ALL">All opportunities</option>
                            <option value="FEATURED">Featured</option>
                            <option value="NOT_FEATURED">
                                Not featured
                            </option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-opportunities__loading">
                        <div className="admin-opportunities__spinner" />
                        <span>Loading opportunities...</span>
                    </div>
                ) : filteredOpportunities.length === 0 ? (
                    <div className="admin-opportunities__empty">
                        <div className="admin-opportunities__empty-icon">
                            <HiOutlineBriefcaseFallback />
                        </div>

                        <h2>
                            {opportunities.length === 0
                                ? "No opportunities yet"
                                : "No matching opportunities"}
                        </h2>

                        <p>
                            {opportunities.length === 0
                                ? "Create the first migration opportunity to make it available for management."
                                : "Try changing your search or filters."}
                        </p>

                        {opportunities.length === 0 && (
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
                                    <th>Opportunity</th>
                                    <th>Country</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Featured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOpportunities.map(
                                    (opportunity) => {
                                        const id =
                                            getOpportunityId(opportunity);

                                        const busy = actionId === id;

                                        return (
                                            <tr key={id}>
                                                <td>
                                                    <div className="admin-opportunities__opportunity">
                                                        <div className="admin-opportunities__image">
                                                            {opportunity?.image ||
                                                                opportunity?.countryImage ? (
                                                                <img
                                                                    src={
                                                                        opportunity.image ||
                                                                        opportunity.countryImage
                                                                    }
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <span>
                                                                    {getOpportunityTitle(
                                                                        opportunity,
                                                                    )
                                                                        .charAt(0)
                                                                        .toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {getOpportunityTitle(
                                                                    opportunity,
                                                                )}
                                                            </strong>

                                                            <small>
                                                                {opportunity?.slug ||
                                                                    "No slug"}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="admin-opportunities__country">
                                                        {getCountryName(opportunity)}
                                                    </span>
                                                </td>

                                                <td>
                                                    {opportunity?.category || "—"}
                                                </td>

                                                <td>
                                                    {opportunity?.type || "—"}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`admin-opportunities__status ${opportunity?.active
                                                                ? "is-active"
                                                                : "is-inactive"
                                                            }`}
                                                        onClick={() =>
                                                            handleToggleActive(
                                                                opportunity,
                                                            )
                                                        }
                                                        disabled={busy}
                                                        title={
                                                            opportunity?.active
                                                                ? "Click to deactivate"
                                                                : "Click to activate"
                                                        }
                                                    >
                                                        {opportunity?.active ? (
                                                            <HiOutlineCheckCircle />
                                                        ) : (
                                                            <HiOutlineXCircle />
                                                        )}

                                                        {getStatusLabel(
                                                            opportunity?.active,
                                                        )}
                                                    </button>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`admin-opportunities__featured ${opportunity?.featured
                                                                ? "is-featured"
                                                                : ""
                                                            }`}
                                                        onClick={() =>
                                                            handleToggleFeatured(
                                                                opportunity,
                                                            )
                                                        }
                                                        disabled={busy}
                                                        title={
                                                            opportunity?.featured
                                                                ? "Remove from featured"
                                                                : "Mark as featured"
                                                        }
                                                    >
                                                        <HiOutlineStar />

                                                        <span>
                                                            {opportunity?.featured
                                                                ? "Featured"
                                                                : "Standard"}
                                                        </span>
                                                    </button>
                                                </td>

                                                <td>
                                                    <div className="admin-opportunities__actions">
                                                        <Link
                                                            to={`/admin/opportunities/${id}/edit`}
                                                            className="admin-opportunities__action"
                                                            title="Edit opportunity"
                                                        >
                                                            <HiOutlinePencilSquare />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            className="admin-opportunities__action"
                                                            onClick={() =>
                                                                handleDeactivate(
                                                                    opportunity,
                                                                )
                                                            }
                                                            disabled={busy}
                                                            title="Deactivate opportunity"
                                                        >
                                                            <HiOutlineXCircle />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

/*
|--------------------------------------------------------------------------
| FALLBACK ICON
|--------------------------------------------------------------------------
|
| Kept local so this page does not depend on another icon package/component.
|--------------------------------------------------------------------------
*/

const HiOutlineBriefcaseFallback = () => (
    <HiOutlineEye />
);

export default Opportunities;