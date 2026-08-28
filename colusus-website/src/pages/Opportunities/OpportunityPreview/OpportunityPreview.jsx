import { useEffect } from "react";
import { createPortal } from "react-dom";

import {
    HiOutlineX,
    HiOutlineBriefcase,
    HiOutlineClock,
    HiOutlineShieldCheck,
    HiOutlineLocationMarker,
    HiOutlineCheckCircle,
    HiOutlineCurrencyDollar,
    HiOutlineArrowRight,
} from "react-icons/hi";

import "./OpportunityPreview.css";


const OpportunityPreview = ({
    opportunity,
    country,
    onClose,
    onStartApplication,
}) => {

    /* ==========================================================
       SAFETY
    ========================================================== */

    if (!opportunity) {
        return null;
    }


    /* ==========================================================
       BODY SCROLL LOCK
    ========================================================== */

    useEffect(() => {

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, []);


    /* ==========================================================
       ESCAPE KEY
    ========================================================== */

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape") {
                onClose();
            }

        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [onClose]);


    /* ==========================================================
       OPPORTUNITY DATA
    ========================================================== */

    const {
        title,
        description,
        image,
        icon,
        location,
        type,
        duration,
        salary,
        demand,
        category,

        highlights = [],
        benefits = [],
        positions = [],
        requirements = [],
        documents = [],
        steps = [],

        pricing,
        paymentPlan = [],
        terms = [],

    } = opportunity;


    const hasPricing =
        Boolean(pricing?.total);


    /* ==========================================================
       PORTAL ROOT
    ========================================================== */

    const modalRoot =
        document.getElementById("modal-root");


    if (!modalRoot) {
        return null;
    }


    /* ==========================================================
       MODAL
    ========================================================== */

    const modal = (

        <div
            className="opportunity-preview"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} pathway preview`}
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            {/* ==================================================
                MODAL SHELL
            ================================================== */}

            <div
                className="opportunity-preview__shell"
                onMouseDown={(event) => {
                    event.stopPropagation();
                }}
            >


                {/* ==================================================
                    CLOSE BUTTON
                ================================================== */}

                <button
                    type="button"
                    className="opportunity-preview__close"
                    onClick={onClose}
                    aria-label="Close pathway preview"
                >

                    <HiOutlineX />

                </button>


                {/* ==================================================
                    LEFT VISUAL
                ================================================== */}

                <aside
                    className="opportunity-preview__visual"
                >

                    {image ? (

                        <img
                            src={image}
                            alt={title}
                            className="opportunity-preview__visual-image"
                        />

                    ) : (

                        <div
                            className="opportunity-preview__visual-fallback"
                        >
                            {icon || country?.flag || "🌍"}
                        </div>

                    )}


                    <div
                        className="opportunity-preview__visual-overlay"
                    />


                    {/* VISUAL TOP */}

                    <div
                        className="opportunity-preview__visual-top"
                    >

                        <div
                            className="opportunity-preview__country"
                        >

                            <span
                                className="opportunity-preview__country-flag"
                            >
                                {country?.flag || "🌍"}
                            </span>

                            <span>
                                {country?.name || "Destination"}
                            </span>

                        </div>


                        {category && (

                            <div
                                className="opportunity-preview__category"
                            >
                                {category}
                            </div>

                        )}

                    </div>


                    {/* VISUAL CONTENT */}

                    <div
                        className="opportunity-preview__visual-content"
                    >

                        <div
                            className="opportunity-preview__visual-eyebrow"
                        >

                            <span>
                                ✨
                            </span>

                            Colossus Pathway

                        </div>


                        <h1>
                            {title}
                        </h1>


                        {location && (

                            <div
                                className="opportunity-preview__visual-location"
                            >

                                <HiOutlineLocationMarker />

                                <span>
                                    {location}
                                </span>

                            </div>

                        )}

                    </div>

                </aside>


                {/* ==================================================
                    RIGHT CONTENT
                ================================================== */}

                <section
                    className="opportunity-preview__content"
                >


                    {/* ==================================================
                        INTRO
                    ================================================== */}

                    <div
                        className="opportunity-preview__intro"
                    >

                        <div>

                            <span
                                className="opportunity-preview__section-label"
                            >
                                Pathway Overview
                            </span>


                            <p
                                className="opportunity-preview__intro-description"
                            >
                                {description ||
                                    "Explore the details, requirements and application process for this migration pathway."}
                            </p>

                        </div>


                        {demand && (

                            <div
                                className="opportunity-preview__demand"
                            >

                                <span>
                                    Demand
                                </span>

                                <strong>
                                    {demand}
                                </strong>

                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        STATS
                    ================================================== */}

                    <div
                        className="opportunity-preview__stats"
                    >

                        <div
                            className="opportunity-preview__stat"
                        >

                            <span
                                className="opportunity-preview__stat-icon"
                            >
                                <HiOutlineBriefcase />
                            </span>

                            <div>

                                <small>
                                    Pathway Type
                                </small>

                                <strong>
                                    {type ||
                                        "Migration Pathway"}
                                </strong>

                            </div>

                        </div>


                        <div
                            className="opportunity-preview__stat"
                        >

                            <span
                                className="opportunity-preview__stat-icon"
                            >
                                <HiOutlineClock />
                            </span>

                            <div>

                                <small>
                                    Processing
                                </small>

                                <strong>
                                    {duration || "Varies"}
                                </strong>

                            </div>

                        </div>


                        <div
                            className="opportunity-preview__stat"
                        >

                            <span
                                className="opportunity-preview__stat-icon"
                            >
                                <HiOutlineShieldCheck />
                            </span>

                            <div>

                                <small>
                                    Expected Earnings
                                </small>

                                <strong>
                                    {salary ||
                                        "Contact migration agent"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        HIGHLIGHTS
                    ================================================== */}

                    {highlights.length > 0 && (

                        <div
                            className="opportunity-preview__section"
                        >

                            <div
                                className="opportunity-preview__section-heading"
                            >

                                <h4>
                                    What this pathway offers
                                </h4>

                                <span>
                                    Key Benefits
                                </span>

                            </div>


                            <div
                                className="opportunity-preview__highlights"
                            >

                                {highlights.map(
                                    (item, index) => (

                                        <div
                                            className="opportunity-preview__highlight"
                                            key={`${item}-${index}`}
                                        >

                                            <HiOutlineCheckCircle />

                                            <span>
                                                {item}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        POSITIONS
                    ================================================== */}

                    {positions.length > 0 && (

                        <div
                            className="opportunity-preview__section"
                        >

                            <div
                                className="opportunity-preview__section-heading"
                            >

                                <h4>
                                    Available Positions
                                </h4>

                                <span>
                                    Employment
                                </span>

                            </div>


                            <div
                                className="opportunity-preview__positions"
                            >

                                {positions.map(
                                    (position, index) => {

                                        const roles =
                                            position.roles ||
                                            [];

                                        return (

                                            <div
                                                className="opportunity-preview__position"
                                                key={index}
                                            >

                                                <div
                                                    className="opportunity-preview__position-heading"
                                                >

                                                    <strong>
                                                        {
                                                            position.sector ||
                                                            position.title ||
                                                            "Available Position"
                                                        }
                                                    </strong>


                                                    {position.salary && (

                                                        <span>
                                                            {position.salary}
                                                        </span>

                                                    )}

                                                </div>


                                                {roles.length > 0 && (

                                                    <div
                                                        className="opportunity-preview__role-list"
                                                    >

                                                        {roles.map(
                                                            (
                                                                role,
                                                                roleIndex
                                                            ) => (

                                                                <span
                                                                    key={roleIndex}
                                                                >
                                                                    {role}
                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                )}


                                                {position.description && (

                                                    <p>
                                                        {
                                                            position.description
                                                        }
                                                    </p>

                                                )}

                                                {position.notes?.length > 0 && (

                                                    <p>
                                                        {position.notes.join(
                                                            " • "
                                                        )}
                                                    </p>

                                                )}

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        BENEFITS
                    ================================================== */}

                    {benefits.length > 0 && (

                        <div
                            className="opportunity-preview__benefits"
                        >

                            <div>

                                <HiOutlineShieldCheck />

                                <span>
                                    Included Benefits
                                </span>

                            </div>


                            <div
                                className="opportunity-preview__benefit-list"
                            >

                                {benefits.map(
                                    (benefit, index) => (

                                        <span
                                            key={`${benefit}-${index}`}
                                        >

                                            <HiOutlineCheckCircle />

                                            {benefit}

                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        REQUIREMENTS
                    ================================================== */}

                    {requirements.length > 0 && (

                        <div
                            className="opportunity-preview__section"
                        >

                            <div
                                className="opportunity-preview__section-heading"
                            >

                                <h4>
                                    Requirements
                                </h4>

                            </div>


                            <div
                                className="opportunity-preview__list"
                            >

                                {requirements.map(
                                    (item, index) => (

                                        <div
                                            className="opportunity-preview__list-item"
                                            key={`${item}-${index}`}
                                        >

                                            <span
                                                className="opportunity-preview__list-number"
                                            >
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            <span>
                                                {item}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        DOCUMENTS
                    ================================================== */}

                    {documents.length > 0 && (

                        <div
                            className="opportunity-preview__section"
                        >

                            <div
                                className="opportunity-preview__section-heading"
                            >

                                <h4>
                                    Required Documents
                                </h4>

                                <span>
                                    Preparation
                                </span>

                            </div>


                            <div
                                className="opportunity-preview__list"
                            >

                                {documents.map(
                                    (item, index) => (

                                        <div
                                            className="opportunity-preview__list-item"
                                            key={`${item}-${index}`}
                                        >

                                            <HiOutlineCheckCircle />

                                            <span>
                                                {item}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        WORK CONDITIONS
                    ================================================== */}

                    {opportunity.workConditions && (

                        <div
                            className="opportunity-preview__section"
                        >

                            <div
                                className="opportunity-preview__section-heading"
                            >

                                <h4>
                                    Work Conditions
                                </h4>

                            </div>


                            <div
                                className="opportunity-preview__list"
                            >

                                {Array.isArray(
                                    opportunity.workConditions
                                )

                                    ? opportunity.workConditions.map(
                                        (
                                            condition,
                                            index
                                        ) => (

                                            <div
                                                className="opportunity-preview__list-item"
                                                key={index}
                                            >

                                                <HiOutlineCheckCircle />

                                                <span>
                                                    {condition}
                                                </span>

                                            </div>

                                        )
                                    )

                                    : Object.entries(
                                        opportunity.workConditions
                                    ).map(
                                        (
                                            [
                                                key,
                                                value
                                            ],
                                            index
                                        ) => (

                                            <div
                                                className="opportunity-preview__list-item"
                                                key={index}
                                            >

                                                <HiOutlineCheckCircle />

                                                <span>
                                                    <strong>
                                                        {key}:
                                                    </strong>{" "}
                                                    {value}
                                                </span>

                                            </div>

                                        )
                                    )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        STEPS
                    ================================================== */}

                    {steps.length > 0 && (

                        <div
                            className="opportunity-preview__section"
                        >

                            <div
                                className="opportunity-preview__section-heading"
                            >

                                <h4>
                                    How the pathway works
                                </h4>

                                <span>
                                    Application Journey
                                </span>

                            </div>


                            <div
                                className="opportunity-preview__steps"
                            >

                                {steps.map(
                                    (step, index) => (

                                        <div
                                            className="opportunity-preview__step"
                                            key={index}
                                        >

                                            <span
                                                className="opportunity-preview__step-number"
                                            >
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>


                                            <div>

                                                <strong>
                                                    {step.title}
                                                </strong>

                                                <p>
                                                    {
                                                        step.description
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        PRICING
                    ================================================== */}

                    <div
                        className="opportunity-preview__pricing"
                    >

                        <div
                            className="opportunity-preview__pricing-header"
                        >

                            <div>

                                <span
                                    className="opportunity-preview__section-label"
                                >
                                    Investment
                                </span>

                                <h2>
                                    Pathway Pricing
                                </h2>

                            </div>


                            <div
                                className="opportunity-preview__pricing-icon"
                            >

                                <HiOutlineCurrencyDollar />

                            </div>

                        </div>


                        {hasPricing ? (

                            <>

                                {/* TOTAL */}

                                <div
                                    className="opportunity-preview__price"
                                >

                                    <span>
                                        Total Pathway Cost
                                    </span>


                                    <strong>
                                        {pricing.total}
                                    </strong>


                                    {pricing.currency && (

                                        <small>
                                            {pricing.currency}
                                        </small>

                                    )}

                                </div>


                                {/* PAYMENT PLAN */}

                                {paymentPlan.length > 0 && (

                                    <div
                                        className="opportunity-preview__payment-plan"
                                    >

                                        <div
                                            className="opportunity-preview__payment-heading"
                                        >

                                            <HiOutlineCurrencyDollar />

                                            <span>
                                                Payment Structure
                                            </span>

                                        </div>


                                        <div
                                            className="opportunity-preview__payment-list"
                                        >

                                            {paymentPlan.map(
                                                (
                                                    payment,
                                                    index
                                                ) => (

                                                    <div
                                                        className="opportunity-preview__payment"
                                                        key={index}
                                                    >

                                                        <span
                                                            className="opportunity-preview__payment-number"
                                                        >
                                                            {index + 1}
                                                        </span>


                                                        <div>

                                                            <span>
                                                                {
                                                                    payment.stage
                                                                }
                                                            </span>

                                                            <strong>
                                                                {
                                                                    payment.amount
                                                                }
                                                            </strong>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* INCLUDED */}

                                {pricing.includes?.length > 0 && (

                                    <div
                                        className="opportunity-preview__pricing-includes"
                                    >

                                        <span>
                                            Included in this price
                                        </span>


                                        <div>

                                            {pricing.includes.map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <span
                                                        key={index}
                                                    >

                                                        <HiOutlineCheckCircle />

                                                        {item}

                                                    </span>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                            </>

                        ) : (

                            /* NO PRICE FALLBACK */

                            <div
                                className="opportunity-preview__price-fallback"
                            >

                                <span
                                    className="opportunity-preview__price-fallback-icon"
                                >
                                    <HiOutlineCurrencyDollar />
                                </span>


                                <div>

                                    <strong>
                                        Pricing available on request
                                    </strong>


                                    <p>
                                        Pricing for this pathway
                                        has not been published.
                                        Speak with a Colossus migration
                                        agent to confirm the current
                                        pathway cost, payment structure
                                        and applicable processing fees.
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        TERMS
                    ================================================== */}

                    {terms.length > 0 && (

                        <div
                            className="opportunity-preview__section"
                        >

                            <div
                                className="opportunity-preview__section-heading"
                            >

                                <h4>
                                    Important Information
                                </h4>

                            </div>


                            <div
                                className="opportunity-preview__list"
                            >

                                {terms.map(
                                    (term, index) => (

                                        <div
                                            className="opportunity-preview__list-item"
                                            key={`${term}-${index}`}
                                        >

                                            <HiOutlineCheckCircle />

                                            <span>
                                                {term}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        FINAL CTA
                    ================================================== */}

                    <div
                        className="opportunity-preview__cta"
                    >

                        <div
                            className="opportunity-preview__cta-copy"
                        >

                            <strong>
                                Ready to start?
                            </strong>

                            <span>
                                Begin your application for this
                                specific migration pathway.
                            </span>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                onStartApplication(
                                    opportunity
                                )
                            }
                        >

                            Begin Application

                            <HiOutlineArrowRight />

                        </button>

                    </div>


                    {/* EXTRA BOTTOM SPACE */}

                    <div
                        className="opportunity-preview__bottom-space"
                    />

                </section>

            </div>

        </div>

    );


    return createPortal(
        modal,
        modalRoot
    );

};


export default OpportunityPreview;