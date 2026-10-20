import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiCheck,
    FiChevronRight,
    FiClock,
    FiEdit3,
    FiExternalLink,
    FiGlobe,
    FiImage,
    FiLoader,
    FiMapPin,
    FiRefreshCw,
    FiSearch,
    FiShield,
    FiStar,
    FiX,
    FiAlertTriangle,
    FiSave,
} from "react-icons/fi";

import destinationsService from "../services/destination.service";

import "./destinations.css";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

const normalizeSlug = (value = "") =>
    String(value)
        .trim()
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const getDestinationDetails = (response) => {
    if (!response) return null;

    if (response.destination) {
        return response.destination;
    }

    if (response.data?.destination) {
        return response.data.destination;
    }

    if (response.data) {
        return response.data;
    }

    return response;
};

const getDestinationArray = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.destinations)) {
        return response.destinations;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.destinations)) {
        return response.data.destinations;
    }

    return [];
};

const EMPTY_FORM = {
    countryFlag: "",
    countryImage: "",
    applicants: "",
    countryCategories: [],
    countryVisa: "",
    countryDuration: "",
    countryProcessingTime: "",
    countryDescription: "",
    opportunityScore: "",
    successRate: "",
};

const formatNumber = (value) =>
    new Intl.NumberFormat("en-NG").format(Number(value) || 0);

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

function DestinationsPage() {
    const navigate = useNavigate();

    const [destinations, setDestinations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedSlug, setSelectedSlug] = useState("");
    const [selectedDestination, setSelectedDestination] =
        useState(null);

    const [form, setForm] = useState(EMPTY_FORM);

    const [error, setError] = useState("");
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    /* ---------------------------------------------------------------------- */
    /* LOAD AND DEDUPLICATE DESTINATIONS                                      */
    /* ---------------------------------------------------------------------- */

    const loadDestinations = useCallback(
        async ({ silent = false } = {}) => {
            try {
                if (silent) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response =
                    await destinationsService.getDestinations();

                const data = getDestinationArray(response);

                const groups = new Map();

                for (const destination of data) {
                    const slug = normalizeSlug(
                        destination.countrySlug,
                    );

                    if (!slug) continue;

                    if (!groups.has(slug)) {
                        groups.set(slug, {
                            ...destination,

                            countrySlug: slug,

                            countryName:
                                destination.countryName ||
                                "Unknown destination",

                            countryId:
                                destination.countryId ?? null,

                            countryFlag:
                                destination.countryFlag || "",

                            countryImage:
                                destination.countryImage || "",

                            observedIds: new Set(),
                            observedNames: new Set(),
                        });
                    }

                    const existing = groups.get(slug);

                    if (
                        destination.countryId !== null &&
                        destination.countryId !== undefined &&
                        destination.countryId !== ""
                    ) {
                        existing.observedIds.add(
                            String(destination.countryId),
                        );
                    }

                    if (destination.countryName) {
                        existing.observedNames.add(
                            String(destination.countryName)
                                .trim()
                                .toLowerCase(),
                        );
                    }

                    /*
                     * These values are totals from the aggregation
                     * endpoint, not individual offer records.
                     */
                    existing.offerCount = Math.max(
                        Number(existing.offerCount || 0),
                        Number(destination.offerCount || 0),
                    );

                    existing.activeOfferCount = Math.max(
                        Number(existing.activeOfferCount || 0),
                        Number(destination.activeOfferCount || 0),
                    );

                    existing.inactiveOfferCount = Math.max(
                        Number(existing.inactiveOfferCount || 0),
                        Number(destination.inactiveOfferCount || 0),
                    );

                    existing.featuredOfferCount = Math.max(
                        Number(existing.featuredOfferCount || 0),
                        Number(destination.featuredOfferCount || 0),
                    );

                    /*
                     * Fill missing display metadata without choosing
                     * a different country identity.
                     */
                    const displayFields = [
                        "countryFlag",
                        "countryImage",
                        "applicants",
                        "countryVisa",
                        "countryDuration",
                        "countryProcessingTime",
                        "countryDescription",
                        "opportunityScore",
                        "successRate",
                    ];

                    for (const field of displayFields) {
                        if (
                            !existing[field] &&
                            destination[field]
                        ) {
                            existing[field] = destination[field];
                        }
                    }

                    if (
                        (!Array.isArray(existing.countryCategories) ||
                            existing.countryCategories.length === 0) &&
                        Array.isArray(destination.countryCategories)
                    ) {
                        existing.countryCategories =
                            destination.countryCategories;
                    }
                }

                const normalized = Array.from(groups.values())
                    .map((destination) => {
                        const observedIds = [
                            ...destination.observedIds,
                        ];

                        const observedNames = [
                            ...destination.observedNames,
                        ];

                        const hasIdentityConflicts =
                            observedIds.length > 1 ||
                            observedNames.length > 1 ||
                            destination.hasIdentityConflicts === true;

                        return {
                            ...destination,

                            observedIds,
                            observedNames,

                            hasIdentityConflicts,
                        };
                    })
                    .sort((a, b) =>
                        a.countryName.localeCompare(
                            b.countryName,
                        ),
                    );

                setDestinations(normalized);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [],
    );

    useEffect(() => {
        loadDestinations();
    }, [loadDestinations]);

    /* ---------------------------------------------------------------------- */
    /* FILTER DESTINATIONS                                                    */
    /* ---------------------------------------------------------------------- */

    const filteredDestinations = useMemo(() => {
        const query = search.trim().toLowerCase();

        return destinations.filter((destination) => {
            const matchesSearch =
                !query ||
                [
                    destination.countryName,
                    destination.countrySlug,
                    destination.countryId,
                    destination.countryVisa,
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(query),
                );

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "CONFLICTS" &&
                    destination.hasIdentityConflicts) ||
                (statusFilter === "HEALTHY" &&
                    !destination.hasIdentityConflicts);

            return matchesSearch && matchesStatus;
        });
    }, [destinations, search, statusFilter]);

    /* ---------------------------------------------------------------------- */
    /* STATISTICS                                                             */
    /* ---------------------------------------------------------------------- */

    const stats = useMemo(
        () => ({
            destinations: destinations.length,

            offers: destinations.reduce(
                (total, destination) =>
                    total + destination.offerCount,
                0,
            ),

            activeOffers: destinations.reduce(
                (total, destination) =>
                    total + destination.activeOfferCount,
                0,
            ),

            featuredOffers: destinations.reduce(
                (total, destination) =>
                    total + destination.featuredOfferCount,
                0,
            ),

            conflicts: destinations.filter(
                (destination) =>
                    destination.hasIdentityConflicts,
            ).length,
        }),
        [destinations],
    );

    /* ---------------------------------------------------------------------- */
    /* OPEN EDIT MODAL                                                        */
    /* ---------------------------------------------------------------------- */

    const handleOpenModal = async (destination) => {
        setSelectedSlug(destination.countrySlug);
        setSelectedDestination(destination);

        setModalError("");
        setModalSuccess("");
        setError("");

        setForm({
            countryFlag: destination.countryFlag || "",
            countryImage: destination.countryImage || "",
            applicants: destination.applicants || "",

            countryCategories: Array.isArray(
                destination.countryCategories,
            )
                ? destination.countryCategories
                : [],

            countryVisa: destination.countryVisa || "",
            countryDuration: destination.countryDuration || "",

            countryProcessingTime:
                destination.countryProcessingTime || "",

            countryDescription:
                destination.countryDescription || "",

            opportunityScore:
                destination.opportunityScore || "",

            successRate: destination.successRate || "",
        });

        try {
            const response =
                await destinationsService.getDestinationBySlug(
                    destination.countrySlug,
                );

            const details = getDestinationDetails(response);

            if (!details) {
                throw new Error(
                    "Destination details could not be loaded.",
                );
            }

            setSelectedDestination({
                ...destination,
                ...details,
            });

            setForm({
                countryFlag: details.countryFlag || "",
                countryImage: details.countryImage || "",
                applicants: details.applicants || "",

                countryCategories: Array.isArray(
                    details.countryCategories,
                )
                    ? details.countryCategories
                    : [],

                countryVisa: details.countryVisa || "",
                countryDuration: details.countryDuration || "",

                countryProcessingTime:
                    details.countryProcessingTime || "",

                countryDescription:
                    details.countryDescription || "",

                opportunityScore:
                    details.opportunityScore || "",

                successRate: details.successRate || "",
            });
        } catch (err) {
            setModalError(getErrorMessage(err));
        }
    };

    /* ---------------------------------------------------------------------- */
    /* CLOSE EDIT MODAL                                                       */
    /* ---------------------------------------------------------------------- */

    const handleCloseModal = useCallback(() => {
        if (saving) return;

        setSelectedSlug("");
        setSelectedDestination(null);
        setForm(EMPTY_FORM);

        setModalError("");
        setModalSuccess("");
    }, [saving]);

    useEffect(() => {
        if (!selectedDestination) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !saving) {
                handleCloseModal();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            document.body.style.overflow = previousOverflow;
        };
    }, [selectedDestination, saving, handleCloseModal]);

    /* ---------------------------------------------------------------------- */
    /* FORM CHANGES                                                           */
    /* ---------------------------------------------------------------------- */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleCategoriesChange = (event) => {
        const countryCategories = event.target.value
            .split(",")
            .map((category) => category.trim())
            .filter(Boolean);

        setForm((current) => ({
            ...current,
            countryCategories,
        }));
    };

    /* ---------------------------------------------------------------------- */
    /* SAVE DESTINATION                                                       */
    /* ---------------------------------------------------------------------- */

    const handleSave = async (event) => {
        event.preventDefault();

        if (!selectedSlug || !selectedDestination) return;

        try {
            setSaving(true);
            setModalError("");
            setModalSuccess("");

            /*
             * Do not send countryId, countryName, or countrySlug.
             * The backend intentionally protects identity fields.
             */
            const payload = {
                countryFlag: form.countryFlag.trim(),
                countryImage: form.countryImage.trim(),
                applicants: form.applicants.trim(),

                countryCategories: form.countryCategories,

                countryVisa: form.countryVisa.trim(),
                countryDuration: form.countryDuration.trim(),

                countryProcessingTime:
                    form.countryProcessingTime.trim(),

                countryDescription:
                    form.countryDescription.trim(),

                opportunityScore:
                    form.opportunityScore.trim(),

                successRate: form.successRate.trim(),
            };

            const response =
                await destinationsService.updateDestination(
                    selectedSlug,
                    payload,
                );

            setModalSuccess(
                response?.message ||
                `${selectedDestination.countryName} updated successfully.`,
            );

            await loadDestinations({ silent: true });

            try {
                const refreshedResponse =
                    await destinationsService.getDestinationBySlug(
                        selectedSlug,
                    );

                const refreshed =
                    getDestinationDetails(refreshedResponse);

                if (refreshed) {
                    setSelectedDestination((current) => ({
                        ...current,
                        ...refreshed,
                    }));

                    setForm({
                        countryFlag: refreshed.countryFlag || "",
                        countryImage: refreshed.countryImage || "",
                        applicants: refreshed.applicants || "",

                        countryCategories: Array.isArray(
                            refreshed.countryCategories,
                        )
                            ? refreshed.countryCategories
                            : [],

                        countryVisa: refreshed.countryVisa || "",
                        countryDuration:
                            refreshed.countryDuration || "",

                        countryProcessingTime:
                            refreshed.countryProcessingTime || "",

                        countryDescription:
                            refreshed.countryDescription || "",

                        opportunityScore:
                            refreshed.opportunityScore || "",

                        successRate: refreshed.successRate || "",
                    });
                }
            } catch {
                /*
                 * The metadata update succeeded. Keep the modal open
                 * if refreshing the destination details fails.
                 */
            }
        } catch (err) {
            setModalError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <main className="destinations-page">
            <header className="destinations-page__header">
                <div className="destinations-page__heading">
                    <button
                        type="button"
                        className="destinations-page__back"
                        onClick={() =>
                            navigate("/admin/opportunities")
                        }
                    >
                        <FiArrowLeft />
                        <span>Back to offers</span>
                    </button>

                    <div className="destinations-page__title-row">
                        <div className="destinations-page__title-icon">
                            <FiGlobe />
                        </div>

                        <div>
                            <p className="destinations-page__eyebrow">
                                COLOSSUS / OFFER MANAGEMENT
                            </p>

                            <h1>Destinations</h1>

                            <p className="destinations-page__subtitle">
                                Manage country profiles, migration
                                information, and destination metadata.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="destinations-page__header-actions">
                    <button
                        type="button"
                        className="destinations-button destinations-button--secondary"
                        onClick={() =>
                            window.open(
                                "/opportunities",
                                "_blank",
                                "noopener,noreferrer",
                            )
                        }
                    >
                        <FiExternalLink />
                        <span>View catalogue</span>
                    </button>

                    <button
                        type="button"
                        className="destinations-button destinations-button--primary"
                        onClick={() =>
                            loadDestinations({ silent: true })
                        }
                        disabled={refreshing || loading}
                    >
                        {refreshing ? (
                            <FiLoader className="destinations-spin" />
                        ) : (
                            <FiRefreshCw />
                        )}

                        <span>
                            {refreshing ? "Refreshing" : "Refresh"}
                        </span>
                    </button>
                </div>
            </header>

            {error && (
                <div className="destinations-notice destinations-notice--error">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                    >
                        <FiX />
                    </button>
                </div>
            )}

            {/* STATISTICS */}

            <section className="destinations-stats">
                <article className="destinations-stat">
                    <div className="destinations-stat__top">
                        <span>Total destinations</span>
                        <div className="destinations-stat__icon">
                            <FiGlobe />
                        </div>
                    </div>

                    <strong>
                        {loading
                            ? "—"
                            : formatNumber(stats.destinations)}
                    </strong>

                    <small>Unique country profiles</small>
                </article>

                <article className="destinations-stat">
                    <div className="destinations-stat__top">
                        <span>Total offers</span>
                        <div className="destinations-stat__icon">
                            <FiMapPin />
                        </div>
                    </div>

                    <strong>
                        {loading ? "—" : formatNumber(stats.offers)}
                    </strong>

                    <small>Across all destinations</small>
                </article>

                <article className="destinations-stat">
                    <div className="destinations-stat__top">
                        <span>Active offers</span>
                        <div className="destinations-stat__icon destinations-stat__icon--green">
                            <FiCheck />
                        </div>
                    </div>

                    <strong>
                        {loading
                            ? "—"
                            : formatNumber(stats.activeOffers)}
                    </strong>

                    <small>Currently available</small>
                </article>

                <article className="destinations-stat">
                    <div className="destinations-stat__top">
                        <span>Featured offers</span>
                        <div className="destinations-stat__icon destinations-stat__icon--gold">
                            <FiStar />
                        </div>
                    </div>

                    <strong>
                        {loading
                            ? "—"
                            : formatNumber(stats.featuredOffers)}
                    </strong>

                    <small>Featured in the catalogue</small>
                </article>

                <article
                    className={`destinations-stat ${stats.conflicts
                            ? "destinations-stat--warning"
                            : ""
                        }`}
                >
                    <div className="destinations-stat__top">
                        <span>Identity conflicts</span>
                        <div className="destinations-stat__icon destinations-stat__icon--warning">
                            <FiShield />
                        </div>
                    </div>

                    <strong>
                        {loading
                            ? "—"
                            : formatNumber(stats.conflicts)}
                    </strong>

                    <small>Require identity review</small>
                </article>
            </section>

            {/* DESTINATION LIST */}

            <section className="destinations-panel">
                <div className="destinations-panel__header">
                    <div>
                        <h2>Country profiles</h2>

                        <p>
                            Select a destination to edit its shared
                            metadata.
                        </p>
                    </div>

                    <span className="destinations-panel__count">
                        {filteredDestinations.length} results
                    </span>
                </div>

                <div className="destinations-toolbar">
                    <div className="destinations-search">
                        <FiSearch />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search country, slug, or ID..."
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <FiX />
                            </button>
                        )}
                    </div>

                    <div className="destinations-filter">
                        <label htmlFor="destination-status">
                            Status
                        </label>

                        <select
                            id="destination-status"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="ALL">
                                All destinations
                            </option>

                            <option value="HEALTHY">
                                Consistent identities
                            </option>

                            <option value="CONFLICTS">
                                Identity conflicts
                            </option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="destinations-state">
                        <FiLoader className="destinations-spin" />
                        <p>Loading destination profiles...</p>
                    </div>
                ) : filteredDestinations.length === 0 ? (
                    <div className="destinations-state">
                        <FiGlobe />
                        <h3>No destinations found</h3>

                        <p>
                            Try a different search or change the
                            selected status filter.
                        </p>

                        {(search || statusFilter !== "ALL") && (
                            <button
                                type="button"
                                className="destinations-button destinations-button--secondary"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("ALL");
                                }}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="destinations-table-wrap">
                        <table className="destinations-table">
                            <thead>
                                <tr>
                                    <th>Destination</th>
                                    <th>Country ID</th>
                                    <th>Offers</th>
                                    <th>Featured</th>
                                    <th>Data status</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDestinations.map(
                                    (destination) => (
                                        <tr key={destination.countrySlug}>
                                            <td>
                                                <div className="destination-identity">
                                                    <div className="destination-identity__flag">
                                                        {destination.countryFlag ||
                                                            <FiGlobe />}
                                                    </div>

                                                    <div className="destination-identity__details">
                                                        <strong>
                                                            {destination.countryName}
                                                        </strong>

                                                        <span>
                                                            /{destination.countrySlug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="destination-id">
                                                    {destination.observedIds.join(
                                                        ", ",
                                                    ) || "Unassigned"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="destination-count">
                                                    <strong>
                                                        {formatNumber(
                                                            destination.offerCount,
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {destination.activeOfferCount} active
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="destination-featured">
                                                    <FiStar />
                                                    {destination.featuredOfferCount}
                                                </span>
                                            </td>

                                            <td>
                                                {destination.hasIdentityConflicts ? (
                                                    <span className="destination-badge destination-badge--warning">
                                                        <FiAlertTriangle />
                                                        Review required
                                                    </span>
                                                ) : (
                                                    <span className="destination-badge destination-badge--success">
                                                        <FiCheck />
                                                        Consistent
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="destination-manage-button"
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            destination,
                                                        )
                                                    }
                                                >
                                                    <FiEdit3 />
                                                    <span>Manage</span>
                                                    <FiChevronRight />
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <footer className="destinations-panel__footer">
                    <span>
                        Showing {filteredDestinations.length} of{" "}
                        {destinations.length} destinations
                    </span>

                    <span>
                        Destination metadata applies to associated offers.
                    </span>
                </footer>
            </section>

            {/* EDIT MODAL */}

            {selectedDestination && (
                <div
                    className="destination-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            handleCloseModal();
                        }
                    }}
                >
                    <section
                        className="destination-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="destination-modal-title"
                    >
                        <header className="destination-modal__header">
                            <div className="destination-modal__identity">
                                <div className="destination-modal__flag">
                                    {form.countryFlag || <FiGlobe />}
                                </div>

                                <div>
                                    <span>DESTINATION SETTINGS</span>

                                    <h2 id="destination-modal-title">
                                        {selectedDestination.countryName}
                                    </h2>

                                    <p>
                                        Edit shared country metadata.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="destination-modal__close"
                                onClick={handleCloseModal}
                                disabled={saving}
                                aria-label="Close editor"
                            >
                                <FiX />
                            </button>
                        </header>

                        <div className="destination-modal__identity-bar">
                            <div>
                                <span>Country ID</span>

                                <strong>
                                    {selectedDestination.countryId ??
                                        "Unassigned"}
                                </strong>
                            </div>

                            <div>
                                <span>Country slug</span>

                                <strong>
                                    {selectedDestination.countrySlug}
                                </strong>
                            </div>

                            <div>
                                <span>Associated offers</span>

                                <strong>
                                    {selectedDestination.offerCount ??
                                        selectedDestination.offers?.length ??
                                        0}
                                </strong>
                            </div>
                        </div>

                        {selectedDestination.hasIdentityConflicts && (
                            <div className="destination-modal__warning">
                                <FiShield />

                                <div>
                                    <strong>
                                        Destination identity conflict
                                    </strong>

                                    <p>
                                        This destination has conflicting
                                        identity information. This editor
                                        changes metadata only; country IDs,
                                        names, and slugs require a separate
                                        integrity repair.
                                    </p>
                                </div>
                            </div>
                        )}

                        {modalError && (
                            <div className="destinations-notice destinations-notice--error">
                                <span>{modalError}</span>

                                <button
                                    type="button"
                                    onClick={() => setModalError("")}
                                    aria-label="Dismiss error"
                                >
                                    <FiX />
                                </button>
                            </div>
                        )}

                        {modalSuccess && (
                            <div className="destinations-notice destinations-notice--success">
                                <FiCheck />
                                <span>{modalSuccess}</span>
                            </div>
                        )}

                        <form
                            className="destination-modal__form"
                            onSubmit={handleSave}
                        >
                            <div className="destination-form-section">
                                <div className="destination-form-section__heading">
                                    <div>
                                        <h3>Country profile</h3>

                                        <p>
                                            Information displayed across
                                            the migration catalogue.
                                        </p>
                                    </div>
                                </div>

                                <div className="destination-form-grid">
                                    <label className="destination-field">
                                        <span>Country flag</span>

                                        <input
                                            name="countryFlag"
                                            value={form.countryFlag}
                                            onChange={handleChange}
                                            placeholder="🇬🇧"
                                        />
                                    </label>

                                    <label className="destination-field">
                                        <span>Applicants count</span>

                                        <input
                                            name="applicants"
                                            value={form.applicants}
                                            onChange={handleChange}
                                            placeholder="2.8k"
                                        />
                                    </label>

                                    <label className="destination-field destination-field--full">
                                        <span>
                                            <FiImage />
                                            Country image URL
                                        </span>

                                        <input
                                            name="countryImage"
                                            type="url"
                                            value={form.countryImage}
                                            onChange={handleChange}
                                            placeholder="https://example.com/country.jpg"
                                        />

                                        {form.countryImage && (
                                            <div className="destination-image-preview">
                                                <img
                                                    src={form.countryImage}
                                                    alt={`${selectedDestination.countryName} preview`}
                                                    onError={(event) => {
                                                        event.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />

                                                <span>Image preview</span>
                                            </div>
                                        )}
                                    </label>

                                    <label className="destination-field destination-field--full">
                                        <span>Country categories</span>

                                        <input
                                            value={form.countryCategories.join(
                                                ", ",
                                            )}
                                            onChange={
                                                handleCategoriesChange
                                            }
                                            placeholder="popular, work, pr"
                                        />

                                        <small>
                                            Separate categories with commas.
                                        </small>
                                    </label>

                                    <label className="destination-field destination-field--full">
                                        <span>Description</span>

                                        <textarea
                                            name="countryDescription"
                                            value={form.countryDescription}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Describe migration and work opportunities..."
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="destination-form-section">
                                <div className="destination-form-section__heading">
                                    <div>
                                        <h3>Migration information</h3>

                                        <p>
                                            Visa information and estimated
                                            processing timelines.
                                        </p>
                                    </div>
                                </div>

                                <div className="destination-form-grid">
                                    <label className="destination-field">
                                        <span>Visa category</span>

                                        <input
                                            name="countryVisa"
                                            value={form.countryVisa}
                                            onChange={handleChange}
                                            placeholder="Skilled Worker Visa"
                                        />
                                    </label>

                                    <label className="destination-field">
                                        <span>
                                            <FiClock />
                                            Duration
                                        </span>

                                        <input
                                            name="countryDuration"
                                            value={form.countryDuration}
                                            onChange={handleChange}
                                            placeholder="3–6 months"
                                        />
                                    </label>

                                    <label className="destination-field">
                                        <span>
                                            <FiClock />
                                            Processing time
                                        </span>

                                        <input
                                            name="countryProcessingTime"
                                            value={
                                                form.countryProcessingTime
                                            }
                                            onChange={handleChange}
                                            placeholder="12 weeks"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="destination-form-section">
                                <div className="destination-form-section__heading">
                                    <div>
                                        <h3>Destination metrics</h3>

                                        <p>
                                            Optional display values for
                                            the country profile.
                                        </p>
                                    </div>
                                </div>

                                <div className="destination-form-grid">
                                    <label className="destination-field">
                                        <span>Opportunity score</span>

                                        <input
                                            name="opportunityScore"
                                            value={form.opportunityScore}
                                            onChange={handleChange}
                                            placeholder="High"
                                        />
                                    </label>

                                    <label className="destination-field">
                                        <span>Success rate</span>

                                        <input
                                            name="successRate"
                                            value={form.successRate}
                                            onChange={handleChange}
                                            placeholder="85%"
                                        />
                                    </label>
                                </div>
                            </div>

                            <footer className="destination-modal__footer">
                                <button
                                    type="button"
                                    className="destinations-button destinations-button--secondary"
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="destinations-button destinations-button--primary"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <FiLoader className="destinations-spin" />
                                    ) : (
                                        <FiSave />
                                    )}

                                    <span>
                                        {saving
                                            ? "Saving changes..."
                                            : "Save destination"}
                                    </span>
                                </button>
                            </footer>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}

export default DestinationsPage;