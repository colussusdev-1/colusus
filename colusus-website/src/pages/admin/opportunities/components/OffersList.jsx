import { useMemo, useState } from "react";
import {
    FiColumns,
    FiGrid,
    FiList,
    FiSliders,
} from "react-icons/fi";

import OfferCard from "./OfferCard";

import {
    getCountryName,
    getOpportunityCategory,
    getOpportunityId,
    getOpportunityTitle,
} from "../utils/offer.helpers";

import "./OffersList.css";

const VIEW_MODES = [
    {
        id: "grid",
        label: "Grid",
        icon: FiGrid,
    },
    {
        id: "list",
        label: "List",
        icon: FiList,
    },
    {
        id: "kanban",
        label: "Kanban",
        icon: FiColumns,
    },
];

const KANBAN_GROUPS = [
    {
        id: "category",
        label: "Category",
    },
    {
        id: "destination",
        label: "Destination",
    },
    {
        id: "attention",
        label: "Attention",
    },
];

const ACCENTS = [
    {
        surface: "#f1f6fb",
        border: "#dce8f3",
        accent: "#4c78a4",
    },
    {
        surface: "#f2f7f3",
        border: "#dceade",
        accent: "#568166",
    },
    {
        surface: "#f8f4ed",
        border: "#eee2d0",
        accent: "#9a7544",
    },
    {
        surface: "#f5f2f9",
        border: "#e5def0",
        accent: "#765e98",
    },
    {
        surface: "#f0f6f6",
        border: "#d9e9e9",
        accent: "#4d8181",
    },
    {
        surface: "#f8f2f4",
        border: "#eddde2",
        accent: "#99616e",
    },
];

function getAccent(index) {
    return ACCENTS[index % ACCENTS.length];
}

function getOfferAttentionState(offer) {
    /*
     * Approval workflow support.
     *
     * Once the backend exposes a dedicated workflow field,
     * this helper can consume it without changing the views.
     */

    const status = String(
        offer?.status ||
        offer?.approvalStatus ||
        offer?.workflowStatus ||
        ""
    ).toUpperCase();

    if (
        status === "PENDING_APPROVAL" ||
        status === "PENDING_REVIEW" ||
        status === "PENDING"
    ) {
        return "Needs approval";
    }

    if (
        status === "CHANGES_REQUESTED" ||
        status === "REVIEW_REQUIRED"
    ) {
        return "Needs changes";
    }

    if (offer?.active === false) {
        return "Inactive";
    }

    return null;
}

function getGroupKey(offer, groupBy) {
    if (groupBy === "destination") {
        return (
            getCountryName(offer) ||
            "Unassigned destination"
        );
    }

    if (groupBy === "attention") {
        return getOfferAttentionState(offer);
    }

    return (
        getOpportunityCategory(offer) ||
        "Uncategorized"
    );
}

function getAttentionPriority(groupName) {
    const priority = {
        "Needs approval": 1,
        "Needs changes": 2,
        Inactive: 3,
    };

    return priority[groupName] || 99;
}

function OffersList({
    offers = [],
    onEdit,
    onView,
    onToggleActive,
    onToggleFeatured,
    onDeactivate,
    actionLoading = "",
}) {
    const [viewMode, setViewMode] = useState("grid");

    const [kanbanGroupBy, setKanbanGroupBy] =
        useState("category");

    /*
     * --------------------------------------------------
     * ACTIVE CATALOGUE
     * --------------------------------------------------
     *
     * Deactivated offers remain available to the parent
     * page for stats / inactive counts, but they are never
     * treated as available catalogue offers here.
     */
    const activeOffers = useMemo(
        () =>
            offers.filter(
                (offer) =>
                    offer?.active !== false
            ),
        [offers]
    );

    /*
     * --------------------------------------------------
     * KANBAN GROUPS
     * --------------------------------------------------
     *
     * Only active offers enter the catalogue.
     *
     * Attention mode is different:
     * it only shows offers that actually need attention.
     * Normal offers are not placed into a useless
     * "No action required" column.
     */
    const groupedOffers = useMemo(() => {
        const groups = new Map();

        const sourceOffers =
            kanbanGroupBy === "attention"
                ? activeOffers.filter(
                      (offer) =>
                          getOfferAttentionState(
                              offer
                          )
                )
                : activeOffers;

        sourceOffers.forEach((offer) => {
            const groupName =
                getGroupKey(
                    offer,
                    kanbanGroupBy
                );

            if (!groupName) {
                return;
            }

            if (!groups.has(groupName)) {
                groups.set(groupName, []);
            }

            groups
                .get(groupName)
                .push(offer);
        });

        return Array.from(
            groups.entries()
        )
            .sort(([nameA], [nameB]) => {
                if (
                    kanbanGroupBy ===
                    "attention"
                ) {
                    const priorityA =
                        getAttentionPriority(
                            nameA
                        );

                    const priorityB =
                        getAttentionPriority(
                            nameB
                        );

                    if (
                        priorityA !==
                        priorityB
                    ) {
                        return (
                            priorityA -
                            priorityB
                        );
                    }
                }

                return nameA.localeCompare(
                    nameB
                );
            })
            .map(
                (
                    [name, groupOffers],
                    index
                ) => ({
                    id: `${kanbanGroupBy}-${name}`,
                    name,
                    offers: groupOffers,
                    accent: getAccent(index),
                })
            );
    }, [
        activeOffers,
        kanbanGroupBy,
    ]);

    /*
     * --------------------------------------------------
     * CARD RENDERER
     * --------------------------------------------------
     */

    const renderOffer = (
        offer,
        index,
        variant = "grid"
    ) => {
        const id =
            getOpportunityId(offer);

        return (
            <OfferCard
                key={
                    id ||
                    getOpportunityTitle(
                        offer
                    )
                }
                offer={offer}
                onEdit={onEdit}
                onView={onView}
                onToggleActive={
                    onToggleActive
                }
                onToggleFeatured={
                    onToggleFeatured
                }
                onDeactivate={
                    onDeactivate
                }
                actionLoading={
                    actionLoading
                }
                accent={getAccent(index)}
                variant={variant}
            />
        );
    };

    /*
     * --------------------------------------------------
     * EMPTY STATE
     * --------------------------------------------------
     */

    const isEmpty =
        activeOffers.length === 0;

    const attentionIsEmpty =
        kanbanGroupBy === "attention" &&
        groupedOffers.length === 0;

    return (
        <section className="offers-list">

            {/* --------------------------------------------------
                HEADER
            -------------------------------------------------- */}

            <div className="offers-list__header">
                <div className="offers-list__identity">
                    <span className="offers-list__eyebrow">
                        CATALOGUE RESULTS
                    </span>

                    <div className="offers-list__title-row">
                        <h3 className="offers-list__title">
                            Available offers
                        </h3>

                        <span className="offers-list__count">
                            {activeOffers.length}
                        </span>
                    </div>
                </div>

                <div className="offers-list__controls">
                    <div
                        className="offers-list__view-switcher"
                        role="tablist"
                        aria-label="Offer catalogue view"
                    >
                        {VIEW_MODES.map(
                            ({
                                id,
                                label,
                                icon: Icon,
                            }) => (
                                <button
                                    key={id}
                                    type="button"
                                    className={`offers-list__view-button ${
                                        viewMode ===
                                        id
                                            ? "offers-list__view-button--active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setViewMode(
                                            id
                                        )
                                    }
                                    role="tab"
                                    aria-selected={
                                        viewMode ===
                                        id
                                    }
                                    title={`${label} view`}
                                >
                                    <Icon />

                                    <span>
                                        {
                                            label
                                        }
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* --------------------------------------------------
                KANBAN GROUPING
            -------------------------------------------------- */}

            {viewMode === "kanban" && (
                <div className="offers-list__kanban-toolbar">
                    <div className="offers-list__kanban-label">
                        <FiSliders />

                        <span>
                            Group by
                        </span>
                    </div>

                    <div className="offers-list__kanban-groups">
                        {KANBAN_GROUPS.map(
                            (group) => (
                                <button
                                    key={
                                        group.id
                                    }
                                    type="button"
                                    className={`offers-list__kanban-group ${
                                        kanbanGroupBy ===
                                        group.id
                                            ? "offers-list__kanban-group--active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setKanbanGroupBy(
                                            group.id
                                        )
                                    }
                                >
                                    {
                                        group.label
                                    }
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* --------------------------------------------------
                EMPTY STATE
            -------------------------------------------------- */}

            {isEmpty && (
                <div className="offers-list__empty">
                    <div className="offers-list__empty-icon">
                        <FiGrid />
                    </div>

                    <div>
                        <strong>
                            No active offers found
                        </strong>

                        <span>
                            Try changing your
                            filters or create
                            a new offer.
                        </span>
                    </div>
                </div>
            )}

            {/* --------------------------------------------------
                GRID VIEW
            -------------------------------------------------- */}

            {viewMode === "grid" &&
                activeOffers.length > 0 && (
                    <div className="offers-list__grid">
                        {activeOffers.map(
                            (
                                offer,
                                index
                            ) =>
                                renderOffer(
                                    offer,
                                    index,
                                    "grid"
                                )
                        )}
                    </div>
                )}

            {/* --------------------------------------------------
                LIST VIEW
            -------------------------------------------------- */}

            {viewMode === "list" &&
                activeOffers.length > 0 && (
                    <div className="offers-list__list">
                        {activeOffers.map(
                            (
                                offer,
                                index
                            ) =>
                                renderOffer(
                                    offer,
                                    index,
                                    "list"
                                )
                        )}
                    </div>
                )}

            {/* --------------------------------------------------
                KANBAN VIEW
            -------------------------------------------------- */}

            {viewMode === "kanban" &&
                activeOffers.length > 0 && (
                    <>
                        {attentionIsEmpty ? (
                            <div className="offers-list__empty">
                                <div className="offers-list__empty-icon">
                                    <FiSliders />
                                </div>

                                <div>
                                    <strong>
                                        Nothing needs attention
                                    </strong>

                                    <span>
                                        There are no active
                                        offers currently
                                        requiring review
                                        or changes.
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="offers-list__kanban">
                                {groupedOffers.map(
                                    (
                                        group
                                    ) => (
                                        <section
                                            key={
                                                group.id
                                            }
                                            className="offers-list__kanban-column"
                                        >
                                            <header
                                                className="offers-list__kanban-column-header"
                                                style={{
                                                    background:
                                                        group
                                                            .accent
                                                            .surface,
                                                    borderColor:
                                                        group
                                                            .accent
                                                            .border,
                                                }}
                                            >
                                                <div>
                                                    <span
                                                        className="offers-list__kanban-column-label"
                                                        style={{
                                                            color:
                                                                group
                                                                    .accent
                                                                    .accent,
                                                        }}
                                                    >
                                                        {kanbanGroupBy ===
                                                        "attention"
                                                            ? "ATTENTION"
                                                            : kanbanGroupBy ===
                                                              "destination"
                                                            ? "DESTINATION"
                                                            : "CATEGORY"}
                                                    </span>

                                                    <h4>
                                                        {
                                                            group.name
                                                        }
                                                    </h4>
                                                </div>

                                                <span className="offers-list__kanban-column-count">
                                                    {
                                                        group
                                                            .offers
                                                            .length
                                                    }
                                                </span>
                                            </header>

                                            <div className="offers-list__kanban-column-body">
                                                {group.offers.map(
                                                    (
                                                        offer,
                                                        index
                                                    ) =>
                                                        renderOffer(
                                                            offer,
                                                            index,
                                                            "kanban"
                                                        )
                                                )}
                                            </div>
                                        </section>
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}
        </section>
    );
}

export default OffersList;