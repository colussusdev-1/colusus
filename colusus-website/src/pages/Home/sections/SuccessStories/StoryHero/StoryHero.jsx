import {
    HiArrowRight,
    HiOutlinePlay,
    HiOutlineBadgeCheck,
    HiOutlineGlobeAlt
} from "react-icons/hi";

import { Link } from "react-router-dom";

import "./StoryHero.css";


const StoryHero = ({
    story,
    onWatch
}) => {

    if (!story) {
        return null;
    }


    /* =====================================================
       STORY THUMBNAIL
    ===================================================== */

    const thumbnail =
        story.thumbnail ||
        story.videoThumbnail ||
        story.image ||
        story.cover ||
        story.poster;


    /* =====================================================
       STORY INFORMATION
    ===================================================== */

    const clientName =
        story.name ||
        "Featured Client";


    const country =
        story.country ||
        "Canada";


    const pathway =
        story.pathway ||
        story.type ||
        "Migration Journey";


    const duration =
        story.duration ||
        "2:45";


    const description =
        story.description ||
        "Discover how our clients achieved their migration goals with the right guidance and support.";


    return (

        <section className="success-stories-hero">


            {/* =================================================
                ATMOSPHERE
            ================================================= */}

            <div
                className="success-stories-hero-atmosphere"
                aria-hidden="true"
            >

                <span
                    className="
                        success-stories-hero-glow
                        success-stories-hero-glow-one
                    "
                />

                <span
                    className="
                        success-stories-hero-glow
                        success-stories-hero-glow-two
                    "
                />

                <span
                    className="
                        success-stories-hero-orbit
                        success-stories-hero-orbit-one
                    "
                />

                <span
                    className="
                        success-stories-hero-orbit
                        success-stories-hero-orbit-two
                    "
                />

                <span className="success-stories-hero-plane">
                    ✈
                </span>

            </div>


            {/* =================================================
                HERO INNER
            ================================================= */}

            <div className="success-stories-hero-inner">


                {/* =================================================
                    LEFT CONTENT
                ================================================= */}

                <div className="success-stories-hero-content">


                    <div className="success-stories-hero-eyebrow">

                        <span className="success-stories-hero-eyebrow-icon">

                            <HiOutlineBadgeCheck />

                        </span>

                        <span>
                            Success Stories
                        </span>

                    </div>


                    <h1 className="success-stories-hero-title">

                        <span>
                            Real People.
                        </span>

                        <span className="success-stories-hero-title-blue">
                            Real Migration.
                        </span>

                        <span>
                            Real Results.
                        </span>

                    </h1>


                    <p className="success-stories-hero-description">

                        Every journey is unique, but the outcome is
                        life-changing. See how our clients achieved
                        their dreams with the right guidance and support.

                    </p>


                    <div className="success-stories-hero-actions">

                        <button
                            type="button"
                            className="success-stories-hero-primary"
                            onClick={() => onWatch(story)}
                        >

                            <span className="success-stories-hero-primary-icon">
                                <HiOutlinePlay />
                            </span>

                            <span>
                                Watch All Stories
                            </span>

                        </button>


                        <Link
                            to="/consultation"
                            className="success-stories-hero-secondary"
                        >

                            <span>
                                Book Consultation
                            </span>

                            <HiArrowRight />

                        </Link>

                    </div>


                    {/* TRUST */}

                    <div className="success-stories-hero-trust">


                        <div className="success-stories-hero-trust-card">

                            <span className="success-stories-hero-trust-icon">
                                <HiOutlineGlobeAlt />
                            </span>

                            <span className="success-stories-hero-trust-divider" />

                            <span className="success-stories-hero-trust-copy">

                                <strong>
                                    18+
                                </strong>

                                <small>
                                    Countries
                                </small>

                            </span>

                        </div>


                        <div className="success-stories-hero-trust-card">

                            <span className="success-stories-hero-trust-icon">
                                <HiOutlineBadgeCheck />
                            </span>

                            <span className="success-stories-hero-trust-divider" />

                            <span className="success-stories-hero-trust-copy">

                                <strong>
                                    Verified
                                </strong>

                                <small>
                                    Client Stories
                                </small>

                            </span>

                        </div>


                        <div className="success-stories-hero-trust-card">

                            <span className="success-stories-hero-trust-icon">
                                <HiOutlinePlay />
                            </span>

                            <span className="success-stories-hero-trust-divider" />

                            <span className="success-stories-hero-trust-copy">

                                <strong>
                                    Real
                                </strong>

                                <small>
                                    Experiences
                                </small>

                            </span>

                        </div>


                    </div>

                </div>


                {/* =================================================
                    FEATURED VIDEO
                ================================================= */}

                <div className="success-stories-hero-featured">

                    <div className="success-stories-hero-video">


                        <div className="success-stories-hero-video-media">

                            {
                                thumbnail ? (

                                    <img
                                        src={thumbnail}
                                        alt={`${clientName} success story`}
                                        className="success-stories-hero-video-image"
                                    />

                                ) : (

                                    <div className="success-stories-hero-video-placeholder">

                                        <HiOutlinePlay />

                                    </div>

                                )
                            }


                            <div className="success-stories-hero-video-overlay" />


                            <div className="success-stories-hero-featured-label">

                                <HiOutlineBadgeCheck />

                                <span>
                                    Featured Story
                                </span>

                            </div>


                            <div className="success-stories-hero-duration">

                                {duration}

                            </div>


                            <button
                                type="button"
                                className="success-stories-hero-play"
                                onClick={() => onWatch(story)}
                                aria-label={`Watch ${clientName} success story`}
                            >

                                <HiOutlinePlay />

                            </button>


                            <div className="success-stories-hero-approved">

                                <span />

                                Approved

                            </div>

                        </div>


                        {/* STORY DETAILS */}

                        <div className="success-stories-hero-story-details">


                            <div className="success-stories-hero-story-main">

                                <h2>
                                    {clientName}
                                </h2>


                                <div className="success-stories-hero-story-meta">

                                    <span className="success-stories-hero-country">
                                        🇨🇦
                                    </span>

                                    <span>
                                        {country}
                                    </span>

                                </div>


                                <p>
                                    {pathway}
                                </p>

                            </div>


                            <div className="success-stories-hero-story-result">

                                <span className="success-stories-hero-quote">
                                    “
                                </span>

                                <p>
                                    {description}
                                </p>

                            </div>


                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};


export default StoryHero;