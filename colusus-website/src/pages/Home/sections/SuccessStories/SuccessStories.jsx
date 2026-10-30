import React from "react";
import { ArrowRight, Play, Quote } from "lucide-react";
import { Link } from "react-router-dom";

import "./SuccessStories.css";

const SuccessStories = () => {
    const videoId = "N8mIZQsjj18";

    return (
        <section className="success-stories">

            <div className="success-stories-container">

                {/* HEADER */}
                <div className="success-header">

                    <div className="success-header-content">

                        <span className="success-label">
                            REAL PEOPLE. REAL EXPERIENCES.
                        </span>

                        <h2>
                            Every Journey
                            <br />
                            Has a <span>Story.</span>
                        </h2>

                    </div>

                    <div className="success-header-description">

                        <p>
                            Every international journey is unique.
                            Hear directly from people sharing their
                            experiences and the journeys that brought
                            them closer to new opportunities.
                        </p>

                    </div>

                </div>


                {/* VIDEO EXPERIENCE */}
                <div className="success-video-layout">

                    {/* VIDEO */}
                    <div className="success-video-frame">

                        <div className="success-video-top">

                            <span className="success-video-indicator">
                                <span></span>
                                CLIENT EXPERIENCES
                            </span>

                            <span className="success-video-duration">
                                COLOSSUS STORIES
                            </span>

                        </div>


                        <div className="success-video-player">

                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                                title="Colossus Client Testimonials"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />

                        </div>

                    </div>


                    {/* STORY INFORMATION */}
                    <div className="success-video-information">

                        <div className="success-quote-icon">
                            <Quote size={28} />
                        </div>

                        <span className="success-information-label">
                            THE PEOPLE BEHIND THE JOURNEYS
                        </span>

                        <h3>
                            Different People.
                            <br />
                            Different Journeys.
                            <br />
                            <span>Shared Experiences.</span>
                        </h3>

                        <p>
                            Behind every application is a person with
                            a dream, an ambition and a story worth
                            telling.

                            Discover the experiences of people who
                            have connected with Colossus as they share
                            their perspectives in their own words.
                        </p>

                        <div className="success-information-divider"></div>

                        <div className="success-information-bottom">

                            <div>
                                <strong>Watch their stories</strong>
                                <span>
                                    One video. Multiple voices. Real experiences.
                                </span>
                            </div>

                            <a
                                href={`https://www.youtube.com/watch?v=${videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Watch video on YouTube"
                            >
                                <ArrowRight size={20} />
                            </a>

                        </div>

                    </div>

                </div>


                {/* BOTTOM CTA */}
                <div className="success-bottom-cta">

                    <div>

                        <h3>
                            Your story could be next.
                        </h3>

                        <p>
                            Let's explore the opportunities available
                            for your next chapter.
                        </p>

                    </div>

                    <Link
                        to="/contact"
                        className="success-cta-button"
                    >
                        Start Your Journey
                        <ArrowRight size={18} />
                    </Link>

                </div>

            </div>

        </section>
    );
};

export default SuccessStories;