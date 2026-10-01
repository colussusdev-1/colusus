
import {
    FiArrowUpRight,
    FiBriefcase,
    FiEdit3,
    FiMapPin,
    FiStar,
} from "react-icons/fi";

import {
    getCountryName,
    getOpportunityCategory,
    getOpportunityId,
    getOpportunityImage,
    getOpportunityLocation,
    getOpportunityTitle,
    getOpportunityType,
    formatSalary,
} from "../utils/offer.helpers";

import "./OffersFeatured.css";

function OffersFeatured({
    offers = [],
    onEdit,
    onView,
    onToggleFeatured,
    actionLoading = "",
}) {
    return (
        <section className="offers-featured">
            <div className="offers-featured__header">
                <div>
                    <span className="offers-featured__eyebrow">
                        PRIORITY CATALOGUE
                    </span>

                    <div className="offers-featured__title-row">
                        <h2 className="offers-featured__title">
                            Featured offers
                        </h2>

                        <span className="offers-featured__count">
                            {offers.length}
                        </span>
                    </div>

                    <p className="offers-featured__description">
                        Priority offers currently promoted across the
                        migration catalogue.
                    </p>
                </div>

                <div className="offers-featured__icon">
                    <FiStar />
                </div>
            </div>

            {offers.length === 0 ? (
                <div className="offers-featured__empty">
                    <div className="offers-featured__empty-icon">
                        <FiStar />
                    </div>

                    <div>
                        <strong>No featured offers</strong>

                        <span>
                            Mark an offer as featured to surface it here.
                        </span>
                    </div>
                </div>
            ) : (
                <div className="offers-featured__list">
                    {offers.map((offer) => {
                        const id = getOpportunityId(offer);
                        const title = getOpportunityTitle(offer);
                        const country = getCountryName(offer);
                        const category = getOpportunityCategory(offer);
                        const type = getOpportunityType(offer);
                        const location = getOpportunityLocation(offer);
                        const salary = formatSalary(offer?.salary);
                        const image = getOpportunityImage(offer);
                        const active = offer?.active !== false;

                        const loading =
                            actionLoading === `featured:${id}`;

                        return (
                            <article
                                key={id || title}
                                className="offers-featured__item"
                            >
                                {/* IMAGE */}
                                <div className="offers-featured__media">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt=""
                                            loading="lazy"
                                        />
                                    ) : (
                                        <FiStar />
                                    )}
                                </div>

                                {/* MAIN INFORMATION */}
                                <div className="offers-featured__content">
                                    <div className="offers-featured__topline">
                                        <div className="offers-featured__identity">
                                            <span className="offers-featured__country">
                                                {country}
                                            </span>

                                            {category &&
                                                category !==
                                                "Uncategorized" && (
                                                    <>
                                                        <span className="offers-featured__separator">
                                                            ·
                                                        </span>

                                                        <span className="offers-featured__category">
                                                            {category}
                                                        </span>
                                                    </>
                                                )}
                                        </div>

                                        <div className="offers-featured__status-row">
                                            <span
                                                className={`offers-featured__status ${active
                                                        ? "offers-featured__status--active"
                                                        : "offers-featured__status--inactive"
                                                    }`}
                                            >
                                                <span className="offers-featured__status-dot" />
                                                {active
                                                    ? "Published"
                                                    : "Inactive"}
                                            </span>

                                            <span className="offers-featured__featured-status">
                                                <FiStar />
                                                Featured
                                            </span>
                                        </div>
                                    </div>

                                    <div className="offers-featured__mainline">
                                        <h3 className="offers-featured__name">
                                            {title}
                                        </h3>

                                        <div className="offers-featured__details">
                                            {type &&
                                                type !== "—" && (
                                                    <span className="offers-featured__detail">
                                                        <FiBriefcase />
                                                        <span>{type}</span>
                                                    </span>
                                                )}

                                            {location &&
                                                location !== "—" && (
                                                    <span className="offers-featured__detail">
                                                        <FiMapPin />
                                                        <span>
                                                            {location}
                                                        </span>
                                                    </span>
                                                )}

                                            {salary &&
                                                salary !== "—" && (
                                                    <span className="offers-featured__detail offers-featured__detail--salary">
                                                        {salary}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="offers-featured__actions">
                                    <button
                                        type="button"
                                        className="offers-featured__action"
                                        onClick={() => onEdit?.(offer)}
                                        aria-label={`Edit ${title}`}
                                        title="Edit offer"
                                    >
                                        <FiEdit3 />
                                    </button>

                                    <button
                                        type="button"
                                        className="offers-featured__action"
                                        onClick={() => onView?.(offer)}
                                        aria-label={`View ${title}`}
                                        title="View public offer"
                                    >
                                        <FiArrowUpRight />
                                    </button>

                                    <button
                                        type="button"
                                        className="offers-featured__action offers-featured__action--featured"
                                        onClick={() =>
                                            onToggleFeatured?.(offer)
                                        }
                                        disabled={loading}
                                        aria-label={`Remove ${title} from featured`}
                                        title="Remove from featured"
                                    >
                                        <FiStar />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default OffersFeatured;
