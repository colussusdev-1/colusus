import {
    FiArchive,
    FiCheckCircle,
    FiLayers,
    FiStar,
} from "react-icons/fi";

import "./OffersStats.css";

function OffersStats({ stats }) {
    const inactive = Number(stats?.inactive) || 0;

    /*
     * The backend total may include deactivated records.
     * For the catalogue metric, inactive offers must not
     * contribute to the active total.
     */
    const activeTotal = Math.max(
        (Number(stats?.total) || 0) - inactive,
        0
    );

    const published = Number(
        stats?.published
    ) || 0;

    const featured = Number(
        stats?.featured
    ) || 0;

    const items = [
        {
            key: "total",
            label: "Active offers",
            value: activeTotal,
            icon: FiLayers,
            tone: "total",
            note: "In catalogue",
        },
        {
            key: "published",
            label: "Published",
            value: published,
            icon: FiCheckCircle,
            tone: "published",
            note: "Visible publicly",
        },
        {
            key: "featured",
            label: "Featured",
            value: featured,
            icon: FiStar,
            tone: "featured",
            note: "Priority placement",
        },
        {
            key: "inactive",
            label: "Inactive",
            value: inactive,
            icon: FiArchive,
            tone: "inactive",
            note: "Not in catalogue",
        },
    ];

    return (
        <section
            className="offers-stats"
            aria-label="Offers summary"
        >
            <div className="offers-stats__inner">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <article
                            key={item.key}
                            className={`offers-stat offers-stat--${item.tone}`}
                        >
                            <div className="offers-stat__accent" />

                            <div className="offers-stat__icon">
                                <Icon />
                            </div>

                            <div className="offers-stat__content">
                                <div className="offers-stat__label-row">
                                    <span className="offers-stat__label">
                                        {item.label}
                                    </span>

                                    {item.key ===
                                        "published" && (
                                            <span
                                                className="offers-stat__live"
                                                title="Currently published"
                                                aria-label="Currently published"
                                            />
                                        )}
                                </div>

                                <strong className="offers-stat__value">
                                    {item.value}
                                </strong>

                                <span className="offers-stat__note">
                                    {item.note}
                                </span>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default OffersStats;