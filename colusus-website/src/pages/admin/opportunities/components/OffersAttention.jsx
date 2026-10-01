import { useEffect, useMemo, useState } from "react";
import {
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiEdit3,
} from "react-icons/fi";

import {
    getCountryName,
    getOpportunityCategory,
    getOpportunityId,
    getOpportunityTitle,
} from "../utils/offer.helpers";

import "./OffersAttention.css";

const MAX_VISIBLE = 4;
const ROTATION_INTERVAL = 3200;

function OffersAttention({
    offers = [],
    onEdit,
    onView,
}) {
    const attentionOffers = useMemo(
        () =>
            offers.filter(
                (offer) => offer?.active === false
            ),
        [offers]
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        if (
            attentionOffers.length === 0 ||
            attentionOffers.length <= MAX_VISIBLE
        ) {
            setActiveIndex(0);
        }

        if (
            activeIndex >= attentionOffers.length
        ) {
            setActiveIndex(0);
        }
    }, [
        attentionOffers.length,
        activeIndex,
    ]);

    useEffect(() => {
        if (
            attentionOffers.length <= MAX_VISIBLE
        ) {
            return;
        }

        const interval = window.setInterval(() => {
            setTransitioning(true);

            window.setTimeout(() => {
                setActiveIndex((current) => {
                    const next = current + 1;

                    return next >=
                        attentionOffers.length
                        ? 0
                        : next;
                });

                setTransitioning(false);
            }, 240);
        }, ROTATION_INTERVAL);

        return () => {
            window.clearInterval(interval);
        };
    }, [attentionOffers.length]);

    const visibleOffers = useMemo(() => {
        if (
            attentionOffers.length <=
            MAX_VISIBLE
        ) {
            return attentionOffers;
        }

        return Array.from(
            { length: MAX_VISIBLE },
            (_, offset) =>
                attentionOffers[
                (activeIndex + offset) %
                attentionOffers.length
                ]
        );
    }, [
        attentionOffers,
        activeIndex,
    ]);

    if (attentionOffers.length === 0) {
        return (
            <section className="offers-attention offers-attention--clear">
                <div className="offers-attention__header">
                    <div>
                        <span className="offers-attention__eyebrow">
                            OPERATIONS
                        </span>

                        <h2 className="offers-attention__title">
                            Needs attention
                        </h2>
                    </div>

                    <span className="offers-attention__clear-state">
                        <FiCheckCircle />
                        All clear
                    </span>
                </div>

                <p className="offers-attention__empty">
                    No inactive offers require
                    attention.
                </p>
            </section>
        );
    }

    return (
        <section className="offers-attention">
            <div className="offers-attention__header">
                <div>
                    <span className="offers-attention__eyebrow">
                        OPERATIONS
                    </span>

                    <div className="offers-attention__title-row">
                        <h2 className="offers-attention__title">
                            Needs attention
                        </h2>

                        <span className="offers-attention__count">
                            {attentionOffers.length}
                        </span>
                    </div>
                </div>

                {attentionOffers.length >
                    MAX_VISIBLE && (
                        <span className="offers-attention__rotation">
                            Updating
                        </span>
                    )}
            </div>

            <div className="offers-attention__viewport">
                <div
                    className={`offers-attention__items ${transitioning
                            ? "offers-attention__items--out"
                            : ""
                        }`}
                >
                    {visibleOffers.map(
                        (offer, index) => {
                            const title =
                                getOpportunityTitle(
                                    offer
                                );

                            const country =
                                getCountryName(
                                    offer
                                );

                            const category =
                                getOpportunityCategory(
                                    offer
                                );

                            return (
                                <article
                                    key={`${getOpportunityId(
                                        offer
                                    )}-${index}`}
                                    className="offers-attention__item"
                                >
                                    <div className="offers-attention__status">
                                        <span className="offers-attention__status-mark">
                                            <FiClock />
                                        </span>

                                        <span>
                                            Inactive
                                        </span>
                                    </div>

                                    <div className="offers-attention__details">
                                        <h3>
                                            {title}
                                        </h3>

                                        <div className="offers-attention__meta">
                                            <span>
                                                {
                                                    country
                                                }
                                            </span>

                                            {category &&
                                                category !==
                                                "Uncategorized" && (
                                                    <>
                                                        <span>
                                                            /
                                                        </span>

                                                        <span>
                                                            {
                                                                category
                                                            }
                                                        </span>
                                                    </>
                                                )}
                                        </div>
                                    </div>

                                    <div className="offers-attention__actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onEdit?.(
                                                    offer
                                                )
                                            }
                                            aria-label={`Edit ${title}`}
                                            title="Edit offer"
                                        >
                                            <FiEdit3 />
                                            <span>
                                                Edit
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onView?.(
                                                    offer
                                                )
                                            }
                                            aria-label={`View ${title}`}
                                            title="View offer"
                                        >
                                            <FiArrowRight />
                                        </button>
                                    </div>
                                </article>
                            );
                        }
                    )}
                </div>
            </div>
        </section>
    );
}

export default OffersAttention;