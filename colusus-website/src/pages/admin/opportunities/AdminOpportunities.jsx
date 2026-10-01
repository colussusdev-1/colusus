import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import opportunitiesService from "./opportunities.service";
import "./opportunities.css";

// Components
import OffersHeader from "./components/OffersHeader";
import OffersStats from "./components/OffersStats";
import OffersAttention from "./components/OffersAttention";
import OffersDestinations from "./components/OffersDestinations";
import OffersFeatured from "./components/OffersFeatured";
import OffersRecent from "./components/OffersRecent";
import OffersToolbar from "./components/OffersToolbar";
import OffersList from "./components/OffersList";
import OffersEmptyState from "./components/OffersEmptyState";

// Helpers
import {
    getCountryName,
    getOpportunityCategory,
    getOpportunityId,
    getOpportunityLocation,
    getOpportunityTitle,
    getOpportunityType,
    getPublicOpportunityPath,
    getResponseData,
} from "./utils/offer.helpers";

function AdminOpportunities() {
    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [actionLoading, setActionLoading] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [countryFilter, setCountryFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    // --------------------------------------------------
    // LOAD OFFERS
    // --------------------------------------------------

    const loadOpportunities = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response =
                    await opportunitiesService.getAllOpportunities();

                const data = getResponseData(response);

                setOpportunities(data);
            } catch (err) {
                console.error(
                    "Failed to load opportunities:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load offers."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadOpportunities();
    }, [loadOpportunities]);

    // --------------------------------------------------
    // FEEDBACK
    // --------------------------------------------------

    const clearFeedback = useCallback(() => {
        setError("");
        setSuccess("");
    }, []);

    // --------------------------------------------------
    // HEADER ACTIONS
    // --------------------------------------------------

    const handleRefresh = useCallback(
        async () => {
            clearFeedback();
            await loadOpportunities(true);
        },
        [
            clearFeedback,
            loadOpportunities,
        ]
    );

    const handleCreate = useCallback(() => {
        navigate("/admin/opportunities/new");
    }, [navigate]);

    // --------------------------------------------------
    // OFFER NAVIGATION
    // --------------------------------------------------

    const handleEdit = useCallback(
        (opportunity) => {
            const id =
                getOpportunityId(
                    opportunity
                );

            if (!id) {
                return;
            }

            navigate(
                `/admin/opportunities/${id}/edit`
            );
        },
        [navigate]
    );

    /*
     * Opens the existing public opportunity page
     * in the same browser tab.
     *
     * Public route:
     * /opportunities/:country/:slug
     */
    const handleView = useCallback(
        (opportunity) => {
            const path =
                getPublicOpportunityPath(
                    opportunity
                );

            if (!path) {
                setError(
                    "This offer does not have a valid public URL."
                );

                return;
            }

            navigate(path);
        },
        [navigate]
    );

    const handleDestinationView = useCallback(
        (destination) => {
            if (!destination?.name) {
                return;
            }

            setSearch("");
            setStatusFilter("ALL");
            setCountryFilter(destination.name);
            setCategoryFilter("ALL");

            window.setTimeout(() => {
                const catalogue =
                    document.querySelector(
                        ".admin-offers__catalogue"
                    );

                catalogue?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 100);
        },
        []
    );

    // --------------------------------------------------
    // OFFER STATUS
    // --------------------------------------------------

    const handleToggleActive = useCallback(
        async (opportunity) => {
            const id =
                getOpportunityId(
                    opportunity
                );

            if (!id) {
                return;
            }

            const nextActive =
                opportunity?.active === false;

            try {
                clearFeedback();

                setActionLoading(
                    `active:${id}`
                );

                await opportunitiesService.setOpportunityActive(
                    id,
                    nextActive
                );

                setOpportunities(
                    (current) =>
                        current.map(
                            (item) => {
                                const itemId =
                                    getOpportunityId(
                                        item
                                    );

                                if (
                                    itemId !==
                                    id
                                ) {
                                    return item;
                                }

                                return {
                                    ...item,
                                    active:
                                        nextActive,
                                };
                            }
                        )
                );

                setSuccess(
                    nextActive
                        ? "Offer published successfully."
                        : "Offer moved to inactive."
                );
            } catch (err) {
                console.error(
                    "Failed to update offer status:",
                    err
                );

                setError(
                    err?.response?.data
                        ?.message ||
                    err?.message ||
                    "Unable to update offer status."
                );
            } finally {
                setActionLoading("");
            }
        },
        [clearFeedback]
    );

    // --------------------------------------------------
    // FEATURED STATUS
    // --------------------------------------------------

    const handleToggleFeatured = useCallback(
        async (opportunity) => {
            const id =
                getOpportunityId(
                    opportunity
                );

            if (!id) {
                return;
            }

            const nextFeatured =
                opportunity?.featured !== true;

            try {
                clearFeedback();

                setActionLoading(
                    `featured:${id}`
                );

                await opportunitiesService.setOpportunityFeatured(
                    id,
                    nextFeatured
                );

                setOpportunities(
                    (current) =>
                        current.map(
                            (item) => {
                                const itemId =
                                    getOpportunityId(
                                        item
                                    );

                                if (
                                    itemId !==
                                    id
                                ) {
                                    return item;
                                }

                                return {
                                    ...item,
                                    featured:
                                        nextFeatured,
                                };
                            }
                        )
                );

                setSuccess(
                    nextFeatured
                        ? "Offer added to featured."
                        : "Offer removed from featured."
                );
            } catch (err) {
                console.error(
                    "Failed to update featured status:",
                    err
                );

                setError(
                    err?.response?.data
                        ?.message ||
                    err?.message ||
                    "Unable to update featured status."
                );
            } finally {
                setActionLoading("");
            }
        },
        [clearFeedback]
    );

    // --------------------------------------------------
    // DEACTIVATE
    // --------------------------------------------------

    const handleDeactivate = useCallback(
        async (opportunity) => {
            const id =
                getOpportunityId(
                    opportunity
                );

            if (!id) {
                return;
            }

            try {
                clearFeedback();

                setActionLoading(
                    `deactivate:${id}`
                );

                await opportunitiesService.deactivateOpportunity(
                    id
                );

                setOpportunities(
                    (current) =>
                        current.map(
                            (item) => {
                                const itemId =
                                    getOpportunityId(
                                        item
                                    );

                                if (
                                    itemId !==
                                    id
                                ) {
                                    return item;
                                }

                                return {
                                    ...item,
                                    active: false,
                                };
                            }
                        )
                );

                setSuccess(
                    "Offer deactivated successfully."
                );
            } catch (err) {
                console.error(
                    "Failed to deactivate offer:",
                    err
                );

                setError(
                    err?.response?.data
                        ?.message ||
                    err?.message ||
                    "Unable to deactivate offer."
                );
            } finally {
                setActionLoading("");
            }
        },
        [clearFeedback]
    );

    // --------------------------------------------------
    // FILTERS
    // --------------------------------------------------

    const handleClearFilters = useCallback(
        () => {
            setSearch("");
            setStatusFilter("ALL");
            setCountryFilter("ALL");
            setCategoryFilter("ALL");
        },
        []
    );

    // --------------------------------------------------
    // STATS
    // --------------------------------------------------

    const stats = useMemo(() => {
        const total =
            opportunities.length;

        const published =
            opportunities.filter(
                (opportunity) =>
                    opportunity?.active !== false
            ).length;

        const inactive =
            opportunities.filter(
                (opportunity) =>
                    opportunity?.active === false
            ).length;

        const featured =
            opportunities.filter(
                (opportunity) =>
                    opportunity?.featured === true
            ).length;

        return {
            total,
            published,
            inactive,
            featured,
        };
    }, [opportunities]);

    // --------------------------------------------------
    // FILTER OPTIONS
    // --------------------------------------------------

    const countries = useMemo(() => {
        const values =
            opportunities
                .map((opportunity) =>
                    getCountryName(
                        opportunity
                    )
                )
                .filter(
                    (country) =>
                        country &&
                        country !== "—"
                );

        return [
            ...new Set(values),
        ].sort((a, b) =>
            a.localeCompare(b)
        );
    }, [opportunities]);

    const categories = useMemo(() => {
        const values =
            opportunities
                .map((opportunity) =>
                    getOpportunityCategory(
                        opportunity
                    )
                )
                .filter(
                    (category) =>
                        category &&
                        category !==
                        "Uncategorized"
                );

        return [
            ...new Set(values),
        ].sort((a, b) =>
            a.localeCompare(b)
        );
    }, [opportunities]);

    // --------------------------------------------------
    // DESTINATIONS
    // --------------------------------------------------

    const destinations = useMemo(() => {
        const destinationMap =
            new Map();

        opportunities.forEach(
            (opportunity) => {
                const name =
                    getCountryName(
                        opportunity
                    );

                if (
                    !name ||
                    name === "—"
                ) {
                    return;
                }

                if (
                    !destinationMap.has(
                        name
                    )
                ) {
                    destinationMap.set(
                        name,
                        {
                            name,
                            total: 0,
                            published: 0,
                            featured: 0,
                        }
                    );
                }

                const destination =
                    destinationMap.get(
                        name
                    );

                destination.total += 1;

                if (
                    opportunity?.active !==
                    false
                ) {
                    destination.published += 1;
                }

                if (
                    opportunity?.featured ===
                    true
                ) {
                    destination.featured += 1;
                }
            }
        );

        return [
            ...destinationMap.values(),
        ].sort((a, b) => {
            if (
                b.total !==
                a.total
            ) {
                return (
                    b.total -
                    a.total
                );
            }

            return a.name.localeCompare(
                b.name
            );
        });
    }, [opportunities]);

    // --------------------------------------------------
    // FEATURED / ATTENTION / RECENT
    // --------------------------------------------------

    const featuredOffers = useMemo(
        () =>
            opportunities.filter(
                (opportunity) =>
                    opportunity?.featured ===
                    true
            ),
        [opportunities]
    );

    const attentionOffers = useMemo(
        () =>
            opportunities.filter(
                (opportunity) =>
                    opportunity?.active ===
                    false
            ),
        [opportunities]
    );

    const recentOffers = useMemo(
        () =>
            opportunities.slice(0, 6),
        [opportunities]
    );

    // --------------------------------------------------
    // CATALOGUE FILTERING
    // --------------------------------------------------

    const filteredOffers = useMemo(() => {
        const normalizedSearch =
            search
                .trim()
                .toLowerCase();

        return opportunities.filter(
            (opportunity) => {
                const title =
                    getOpportunityTitle(
                        opportunity
                    ).toLowerCase();

                const country =
                    getCountryName(
                        opportunity
                    ).toLowerCase();

                const category =
                    getOpportunityCategory(
                        opportunity
                    ).toLowerCase();

                const type =
                    getOpportunityType(
                        opportunity
                    ).toLowerCase();

                const location =
                    getOpportunityLocation(
                        opportunity
                    ).toLowerCase();

                const matchesSearch =
                    !normalizedSearch ||
                    title.includes(
                        normalizedSearch
                    ) ||
                    country.includes(
                        normalizedSearch
                    ) ||
                    category.includes(
                        normalizedSearch
                    ) ||
                    type.includes(
                        normalizedSearch
                    ) ||
                    location.includes(
                        normalizedSearch
                    );

                const matchesStatus =
                    statusFilter ===
                    "ALL" ||
                    (statusFilter ===
                        "PUBLISHED" &&
                        opportunity?.active !==
                        false) ||
                    (statusFilter ===
                        "INACTIVE" &&
                        opportunity?.active ===
                        false);

                const matchesCountry =
                    countryFilter ===
                    "ALL" ||
                    country ===
                    countryFilter.toLowerCase();

                const matchesCategory =
                    categoryFilter ===
                    "ALL" ||
                    category ===
                    categoryFilter.toLowerCase();

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

    const hasActiveFilters =
        Boolean(search.trim()) ||
        statusFilter !== "ALL" ||
        countryFilter !== "ALL" ||
        categoryFilter !== "ALL";

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className="admin-offers">
            <OffersHeader
                onRefresh={handleRefresh}
                onCreate={handleCreate}
                refreshing={refreshing}
            />

            <OffersStats stats={stats} />

            {error && (
                <div className="admin-offers__feedback admin-offers__feedback--error">
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-offers__feedback admin-offers__feedback--success">
                    {success}
                </div>
            )}

            {/* ------------------------------------------
                OVERVIEW
            ------------------------------------------ */}

            <div className="admin-offers__overview-grid">
                <OffersAttention
                    offers={attentionOffers}
                    onEdit={handleEdit}
                    onView={handleView}
                    actionLoading={actionLoading}
                />

                <OffersDestinations
                    destinations={destinations}
                    onView={handleDestinationView}
                />
            </div>

            {/* ------------------------------------------
                FEATURED
            ------------------------------------------ */}

            <OffersFeatured
                offers={featuredOffers}
                onEdit={handleEdit}
                onView={handleView}
                onToggleFeatured={
                    handleToggleFeatured
                }
                actionLoading={actionLoading}
            />

            {/* ------------------------------------------
                RECENT
            ------------------------------------------ */}

            <OffersRecent
                offers={recentOffers}
                onEdit={handleEdit}
                onView={handleView}
                onToggleActive={
                    handleToggleActive
                }
                onToggleFeatured={
                    handleToggleFeatured
                }
                onDeactivate={
                    handleDeactivate
                }
                actionLoading={actionLoading}
            />

            {/* ------------------------------------------
                FULL CATALOGUE
            ------------------------------------------ */}

            <section className="admin-offers__catalogue">
                <OffersToolbar
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={
                        setStatusFilter
                    }
                    countryFilter={countryFilter}
                    setCountryFilter={
                        setCountryFilter
                    }
                    categoryFilter={
                        categoryFilter
                    }
                    setCategoryFilter={
                        setCategoryFilter
                    }
                    countries={countries}
                    categories={categories}
                    onClearFilters={
                        handleClearFilters
                    }
                    hasActiveFilters={
                        hasActiveFilters
                    }
                />

                {loading ? (
                    <div className="admin-offers__loading">
                        Loading offers...
                    </div>
                ) : filteredOffers.length ===
                    0 ? (
                    <OffersEmptyState
                        hasFilters={
                            hasActiveFilters
                        }
                        onClearFilters={
                            handleClearFilters
                        }
                        onCreate={
                            handleCreate
                        }
                    />
                ) : (
                    <OffersList
                        offers={filteredOffers}
                        onEdit={handleEdit}
                        onView={handleView}
                        onToggleActive={
                            handleToggleActive
                        }
                        onToggleFeatured={
                            handleToggleFeatured
                        }
                        onDeactivate={
                            handleDeactivate
                        }
                        actionLoading={
                            actionLoading
                        }
                    />
                )}
            </section>
        </div>
    );
}

export default AdminOpportunities;