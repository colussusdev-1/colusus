
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineGlobeAlt,
    HiOutlineRefresh,
} from "react-icons/hi";

import opportunityService
    from "../../../../services/opportunity.service";

import {
    getCountryFlag,
} from "../countries";

import "./RecommendedOpportunities.css";


const normalize = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
};


const formatLabel = (value) => {
    return String(value || "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase(),
        );
};


const getOpportunityId = (opportunity) => {
    return (
        opportunity?._id ||
        opportunity?.id ||
        opportunity?.legacyId ||
        null
    );
};


const getTitle = (opportunity) => {
    return (
        opportunity?.title ||
        opportunity?.name ||
        "Migration pathway"
    );
};


const getCategory = (opportunity) => {
    return (
        opportunity?.category ||
        opportunity?.type ||
        "Migration pathway"
    );
};


const getCountry = (opportunity) => {
    return (
        opportunity?.countryName ||
        opportunity?.destinationCountry ||
        opportunity?.country ||
        opportunity?.location ||
        "Destination"
    );
};


const getCountrySlug = (opportunity) => {
    return (
        opportunity?.countrySlug ||
        opportunity?.country?.slug ||
        null
    );
};


const getOpportunitySlug = (opportunity) => {
    return opportunity?.slug || null;
};


const getDemand = (opportunity) => {
    return opportunity?.demand || null;
};


const getSuccessRate = (opportunity) => {
    const value = opportunity?.successRate;

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return value;
};


/*
 * Keep the process deliberately short.
 *
 * The recommendation card is for discovery,
 * not for displaying the complete pathway.
 *
 * The full process belongs on OpportunityDetails.
 */
const getProcessSteps = (opportunity) => {
    if (!Array.isArray(opportunity?.steps)) {
        return [];
    }

    return opportunity.steps
        .map((step) => {
            if (typeof step === "string") {
                return step.trim();
            }

            return (
                step?.title ||
                step?.name ||
                ""
            ).trim();
        })
        .filter(Boolean)
        .slice(0, 4);
};


const getProcessPreview = (opportunity) => {
    const steps = getProcessSteps(opportunity);

    if (!steps.length) {
        return null;
    }

    return steps.join(" → ");
};


const scoreOpportunity = (
    opportunity,
    activeApplication,
) => {
    if (!opportunity) return -Infinity;

    let score = 0;

    if (opportunity?.featured) {
        score += 25;
    }

    score +=
        Number(
            opportunity?.opportunityScore || 0,
        ) * 0.2;

    score +=
        Number(
            opportunity?.successRate || 0,
        ) * 0.1;

    if (!activeApplication) {
        return score;
    }

    const currentOpportunity =
        activeApplication?.opportunity;

    if (!currentOpportunity) {
        return score;
    }

    const currentCategory = normalize(
        currentOpportunity?.category ||
        currentOpportunity?.type,
    );

    const opportunityCategory = normalize(
        opportunity?.category ||
        opportunity?.type,
    );

    if (
        currentCategory &&
        opportunityCategory &&
        currentCategory === opportunityCategory
    ) {
        score += 45;
    }

    const currentCountry = normalize(
        activeApplication?.destinationCountry ||
        currentOpportunity?.countryName,
    );

    const opportunityCountry = normalize(
        opportunity?.countryName ||
        opportunity?.destinationCountry,
    );

    if (
        currentCountry &&
        opportunityCountry &&
        currentCountry === opportunityCountry
    ) {
        score += 15;
    }

    return score;
};


const RecommendedOpportunities = ({
    activeApplication = null,
}) => {
    const navigate = useNavigate();

    const [
        opportunities,
        setOpportunities,
    ] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [rotation, setRotation] =
        useState(0);


    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await opportunityService.getOpportunities();

                if (!mounted) {
                    return;
                }

                setOpportunities(
                    Array.isArray(data)
                        ? data
                        : [],
                );
            } catch (err) {
                console.error(
                    "FAILED TO LOAD RECOMMENDED OPPORTUNITIES:",
                    err,
                );

                if (mounted) {
                    setError(
                        err?.response?.data?.message ||
                        "Unable to load recommended opportunities.",
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);


    const recommendations = useMemo(() => {
        const currentId =
            getOpportunityId(
                activeApplication?.opportunity,
            );

        const candidates =
            opportunities.filter(
                (opportunity) => {
                    const id =
                        getOpportunityId(
                            opportunity,
                        );

                    if (
                        currentId &&
                        id === currentId
                    ) {
                        return false;
                    }

                    return (
                        opportunity?.active !== false
                    );
                },
            );

        const ranked =
            [...candidates].sort(
                (a, b) => {
                    const scoreA =
                        scoreOpportunity(
                            a,
                            activeApplication,
                        );

                    const scoreB =
                        scoreOpportunity(
                            b,
                            activeApplication,
                        );

                    if (
                        scoreA !== scoreB
                    ) {
                        return (
                            scoreB -
                            scoreA
                        );
                    }

                    return (
                        Number(
                            b?.opportunityScore ||
                            0,
                        ) -
                        Number(
                            a?.opportunityScore ||
                            0,
                        )
                    );
                },
            );

        if (!ranked.length) {
            return [];
        }

        const offset =
            rotation % ranked.length;

        const rotated = [
            ...ranked.slice(offset),
            ...ranked.slice(0, offset),
        ];

        return rotated.slice(0, 3);
    }, [
        opportunities,
        activeApplication,
        rotation,
    ]);


    const handleRotate = () => {
        setRotation(
            (current) =>
                current + 1,
        );
    };


    const handleOpportunity = (
        opportunity,
    ) => {
        if (!opportunity) {
            return;
        }

        const countrySlug =
            getCountrySlug(
                opportunity,
            );

        const opportunitySlug =
            getOpportunitySlug(
                opportunity,
            );

        if (
            countrySlug &&
            opportunitySlug
        ) {
            navigate(
                `/opportunities/${countrySlug}/${opportunitySlug}`,
            );

            return;
        }

        console.warn(
            "Opportunity is missing countrySlug or slug:",
            opportunity,
        );
    };


    const handleEligibility = () => {
        navigate(
            "/portal/assessment",
        );
    };


    if (loading) {
        return (
            <section
                className="recommended-opportunities"
                aria-label="Recommended migration opportunities"
            >
                <div className="recommended-header">
                    <div>
                        <span className="section-eyebrow">
                            RECOMMENDED FOR YOU
                        </span>

                        <h2>
                            Migration opportunities
                        </h2>

                        <p>
                            Finding pathways that may be relevant
                            to your journey.
                        </p>
                    </div>
                </div>

                <div className="recommended-loading-grid">
                    {[1, 2, 3].map(
                        (item) => (
                            <div
                                key={item}
                                className="recommended-skeleton"
                            />
                        ),
                    )}
                </div>
            </section>
        );
    }


    if (
        error ||
        !recommendations.length
    ) {
        return (
            <section
                className="recommended-opportunities"
                aria-label="Migration opportunities"
            >
                <div className="recommended-header">
                    <div>
                        <span className="section-eyebrow">
                            EXPLORE
                        </span>

                        <h2>
                            Migration opportunities
                        </h2>

                        <p>
                            Discover available migration
                            pathways and opportunities.
                        </p>
                    </div>
                </div>

                <div className="recommended-empty">
                    <HiOutlineGlobeAlt />

                    <div>
                        <strong>
                            Explore available pathways
                        </strong>

                        <span>
                            Find a migration opportunity that
                            matches your plans.
                        </span>
                    </div>
                </div>
            </section>
        );
    }


    return (
        <section
            className="recommended-opportunities"
            aria-label="Recommended migration opportunities"
        >
            <div className="recommended-header">
                <div>
                    <span className="section-eyebrow">
                        RECOMMENDED FOR YOU
                    </span>

                    <h2>
                        Migration opportunities
                    </h2>

                    <p>
                        Pathways that may be relevant to
                        your migration goals.
                    </p>
                </div>

                <button
                    type="button"
                    className="recommended-refresh-button"
                    onClick={handleRotate}
                    title="Show different opportunities"
                    aria-label="Show different opportunities"
                >
                    <HiOutlineRefresh />
                </button>
            </div>


            <div className="recommended-grid">
                {recommendations.map(
                    (opportunity) => {
                        const id =
                            getOpportunityId(
                                opportunity,
                            );

                        const title =
                            getTitle(
                                opportunity,
                            );

                        const category =
                            getCategory(
                                opportunity,
                            );

                        const country =
                            getCountry(
                                opportunity,
                            );

                        const flag =
                            getCountryFlag(
                                country,
                            );

                        const demand =
                            getDemand(
                                opportunity,
                            );

                        const successRate =
                            getSuccessRate(
                                opportunity,
                            );

                        const process =
                            getProcessPreview(
                                opportunity,
                            );

                        return (
                            <article
                                key={
                                    id ||
                                    `${title}-${country}`
                                }
                                className="recommended-card"
                            >
                                <div className="recommended-card-top">
                                    <div className="recommended-country">
                                        <div className="recommended-flag">
                                            {flag ? (
                                                <img
                                                    src={flag}
                                                    alt=""
                                                />
                                            ) : (
                                                <HiOutlineGlobeAlt />
                                            )}
                                        </div>

                                        <div>
                                            <span>
                                                DESTINATION
                                            </span>

                                            <strong>
                                                {country}
                                            </strong>
                                        </div>
                                    </div>

                                    {opportunity?.featured && (
                                        <span className="recommended-featured">
                                            Featured
                                        </span>
                                    )}
                                </div>


                                <div className="recommended-card-content">
                                    <span className="recommended-category">
                                        {formatLabel(
                                            category,
                                        )}
                                    </span>

                                    <h3>
                                        {title}
                                    </h3>

                                    <p>
                                        {opportunity?.description ||
                                            "Explore this migration pathway and see whether it fits your plans."}
                                    </p>

                                    {process && (
                                        <div className="recommended-process">
                                            <span className="recommended-process-label">
                                                PROCESS
                                            </span>

                                            <span className="recommended-process-value">
                                                {process}
                                            </span>
                                        </div>
                                    )}
                                </div>


                                <div className="recommended-card-facts">
                                    {demand && (
                                        <span>
                                            <HiOutlineCheckCircle />

                                            {formatLabel(
                                                String(
                                                    demand,
                                                ),
                                            )}
                                        </span>
                                    )}

                                    {opportunity?.duration && (
                                        <span>
                                            <HiOutlineClock />

                                            {opportunity.duration}
                                        </span>
                                    )}

                                    {successRate !== null && (
                                        <span>
                                            {successRate}% success
                                        </span>
                                    )}
                                </div>


                                <button
                                    type="button"
                                    className="recommended-card-link"
                                    onClick={() =>
                                        handleOpportunity(
                                            opportunity,
                                        )
                                    }
                                >
                                    View pathway

                                    <HiOutlineArrowRight />
                                </button>
                            </article>
                        );
                    },
                )}
            </div>


            <div className="recommended-eligibility">
                <div className="recommended-eligibility-copy">
                    <div className="recommended-eligibility-icon">
                        <HiOutlineCheckCircle />
                    </div>

                    <div>
                        <strong>
                            Not sure which pathway is right for you?
                        </strong>

                        <span>
                            Check your eligibility and discover
                            pathways that may match your profile.
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="recommended-eligibility-button"
                    onClick={
                        handleEligibility
                    }
                >
                    Check your eligibility

                    <HiOutlineArrowRight />
                </button>
            </div>
        </section>
    );
};


export default RecommendedOpportunities;