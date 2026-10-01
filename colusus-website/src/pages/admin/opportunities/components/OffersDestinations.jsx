
import { useEffect, useMemo, useState } from "react";
import {
    FiArrowRight,
    FiMapPin,
    FiPause,
    FiPlay,
    FiSearch,
} from "react-icons/fi";

import "./OffersDestinations.css";

const MAX_VISIBLE = 4;
const ROTATION_INTERVAL = 5000;

const DESTINATION_ACCENTS = [
    {
        background:
            "linear-gradient(135deg, #eef6ff 0%, #dcecff 100%)",
        color: "#3974b8",
    },
    {
        background:
            "linear-gradient(135deg, #f1f8f4 0%, #dff0e6 100%)",
        color: "#438563",
    },
    {
        background:
            "linear-gradient(135deg, #fff6ed 0%, #f9e5cf 100%)",
        color: "#b87335",
    },
    {
        background:
            "linear-gradient(135deg, #f5f1fb 0%, #e8def6 100%)",
        color: "#7653a6",
    },
    {
        background:
            "linear-gradient(135deg, #eef8f8 0%, #d9eeee 100%)",
        color: "#438888",
    },
    {
        background:
            "linear-gradient(135deg, #fff1f3 0%, #f7dfe4 100%)",
        color: "#ad5868",
    },
];

function OffersDestinations({
    destinations = [],
    onView,
}) {
    const [search, setSearch] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoScroll, setAutoScroll] = useState(true);
    const [transitioning, setTransitioning] = useState(false);

    const filteredDestinations = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return destinations;
        }

        return destinations.filter((destination) =>
            String(destination?.name || "")
                .toLowerCase()
                .includes(query)
        );
    }, [destinations, search]);

    useEffect(() => {
        setActiveIndex(0);
    }, [search]);

    useEffect(() => {
        if (
            filteredDestinations.length === 0 ||
            filteredDestinations.length <= MAX_VISIBLE ||
            !autoScroll
        ) {
            setActiveIndex(0);
            return;
        }

        if (
            activeIndex >= filteredDestinations.length
        ) {
            setActiveIndex(0);
        }
    }, [
        filteredDestinations.length,
        activeIndex,
        autoScroll,
    ]);

    useEffect(() => {
        if (
            !autoScroll ||
            filteredDestinations.length <= MAX_VISIBLE
        ) {
            return undefined;
        }

        const interval = window.setInterval(() => {
            setTransitioning(true);

            window.setTimeout(() => {
                setActiveIndex((current) => {
                    const next = current + 1;

                    return next >= filteredDestinations.length
                        ? 0
                        : next;
                });

                setTransitioning(false);
            }, 280);
        }, ROTATION_INTERVAL);

        return () => {
            window.clearInterval(interval);
        };
    }, [
        autoScroll,
        filteredDestinations.length,
    ]);

    const visibleDestinations = useMemo(() => {
        if (
            filteredDestinations.length <= MAX_VISIBLE
        ) {
            return filteredDestinations;
        }

        if (!autoScroll) {
            return filteredDestinations;
        }

        return Array.from(
            { length: MAX_VISIBLE },
            (_, offset) =>
                filteredDestinations[
                (activeIndex + offset) %
                filteredDestinations.length
                ]
        );
    }, [
        filteredDestinations,
        activeIndex,
        autoScroll,
    ]);

    const canRotate =
        filteredDestinations.length > MAX_VISIBLE;

    const handleToggleAutoScroll = () => {
        setAutoScroll((current) => !current);
        setTransitioning(false);
    };

    if (destinations.length === 0) {
        return (
            <section className="offers-destinations">
                <div className="offers-destinations__header">
                    <div>
                        <span className="offers-destinations__eyebrow">
                            DESTINATIONS
                        </span>

                        <h2 className="offers-destinations__title">
                            Offer coverage
                        </h2>
                    </div>
                </div>

                <div className="offers-destinations__empty">
                    <FiMapPin />

                    <span>
                        No destination data available.
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section className="offers-destinations">
            <div className="offers-destinations__header">
                <div>
                    <span className="offers-destinations__eyebrow">
                        DESTINATIONS
                    </span>

                    <h2 className="offers-destinations__title">
                        Offer coverage
                    </h2>

                    <p className="offers-destinations__description">
                        Catalogue distribution across migration destinations.
                    </p>
                </div>

                <div className="offers-destinations__header-meta">
                    <span className="offers-destinations__total">
                        {filteredDestinations.length}{" "}
                        {filteredDestinations.length === 1
                            ? "destination"
                            : "destinations"}
                    </span>

                    {canRotate && (
                        <button
                            type="button"
                            className={`offers-destinations__auto ${autoScroll
                                    ? "offers-destinations__auto--active"
                                    : ""
                                }`}
                            onClick={
                                handleToggleAutoScroll
                            }
                            title={
                                autoScroll
                                    ? "Pause automatic scrolling"
                                    : "Resume automatic scrolling"
                            }
                        >
                            {autoScroll ? (
                                <FiPause />
                            ) : (
                                <FiPlay />
                            )}

                            <span>
                                {autoScroll
                                    ? "Auto"
                                    : "Paused"}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <div className="offers-destinations__controls">
                <div className="offers-destinations__search">
                    <FiSearch />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search destination"
                        aria-label="Search destinations"
                    />

                    {search && (
                        <button
                            type="button"
                            className="offers-destinations__search-clear"
                            onClick={() => setSearch("")}
                            aria-label="Clear destination search"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {filteredDestinations.length === 0 ? (
                <div className="offers-destinations__no-results">
                    <FiMapPin />

                    <div>
                        <strong>
                            No destinations found
                        </strong>

                        <span>
                            Try a different country name.
                        </span>
                    </div>
                </div>
            ) : (
                <div
                    className={`offers-destinations__viewport ${!autoScroll ||
                            !canRotate
                            ? "offers-destinations__viewport--manual"
                            : ""
                        }`}
                >
                    <div
                        className={`offers-destinations__items ${transitioning
                                ? "offers-destinations__items--out"
                                : ""
                            }`}
                    >
                        {visibleDestinations.map(
                            (
                                destination,
                                index
                            ) => {
                                const published =
                                    Number(
                                        destination?.published ||
                                        0
                                    );

                                const featured =
                                    Number(
                                        destination?.featured ||
                                        0
                                    );

                                const total =
                                    Number(
                                        destination?.total ||
                                        0
                                    );

                                const inactive =
                                    Math.max(
                                        total -
                                        published,
                                        0
                                    );

                                const accent =
                                    DESTINATION_ACCENTS[
                                    index %
                                    DESTINATION_ACCENTS.length
                                    ];

                                return (
                                    <article
                                        key={`${destination.name}-${index}`}
                                        className="offers-destination"
                                    >
                                        <div
                                            className="offers-destination__accent"
                                            style={{
                                                background:
                                                    accent.background,
                                                color:
                                                    accent.color,
                                            }}
                                        >
                                            <FiMapPin />
                                        </div>

                                        <div className="offers-destination__content">
                                            <div className="offers-destination__identity">
                                                <h3>
                                                    {
                                                        destination.name
                                                    }
                                                </h3>

                                                <span>
                                                    {
                                                        total
                                                    }{" "}
                                                    {total ===
                                                        1
                                                        ? "offer"
                                                        : "offers"}
                                                </span>
                                            </div>

                                            <div className="offers-destination__metrics">
                                                <span>
                                                    <strong>
                                                        {
                                                            published
                                                        }
                                                    </strong>{" "}
                                                    published
                                                </span>

                                                <span>
                                                    <strong>
                                                        {
                                                            featured
                                                        }
                                                    </strong>{" "}
                                                    featured
                                                </span>

                                                {inactive >
                                                    0 && (
                                                        <span>
                                                            <strong>
                                                                {
                                                                    inactive
                                                                }
                                                            </strong>{" "}
                                                            inactive
                                                        </span>
                                                    )}
                                            </div>
                                        </div>

                                        {onView && (
                                            <button
                                                type="button"
                                                className="offers-destination__view"
                                                onClick={() =>
                                                    onView(
                                                        destination
                                                    )
                                                }
                                                aria-label={`View ${destination.name} offers`}
                                                title={`View ${destination.name} offers`}
                                            >
                                                <FiArrowRight />
                                            </button>
                                        )}
                                    </article>
                                );
                            }
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default OffersDestinations;