import "./Hero.css";

import {
    FiArrowRight,
    FiDownload,
    FiFileText,
    FiBriefcase
} from "react-icons/fi";

const Hero = () => {

    return (

        <section className="shop-hero">

            <div className="shop-hero-gradient"></div>

            <div className="shop-hero-container">

                {/* LEFT */}

                <div className="shop-hero-content">

                    <span className="shop-badge">

                        Digital Resources Marketplace

                    </span>

                    <h1>

                        Resources For
                        Global Success

                    </h1>

                    <p>

                        Immigration guides, CV templates,
                        relocation resources and business
                        toolkits designed for international growth.

                    </p>

                    <div className="shop-actions">

                        <button className="shop-primary-btn">

                            Explore Store

                            <FiArrowRight />

                        </button>

                        <button className="shop-secondary-btn">

                            Bundles

                        </button>

                    </div>

                    <div className="shop-stats">

                        <div>

                            <strong>120+</strong>

                            <span>Resources</span>

                        </div>

                        <div>

                            <strong>8.5k+</strong>

                            <span>Downloads</span>

                        </div>

                        <div>

                            <strong>4.9★</strong>

                            <span>Rating</span>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="shop-preview">

                    <div className="resource-card">

                        <FiFileText />

                        <div>

                            <h4>

                                Canada Guide

                            </h4>

                            <span>

                                Immigration

                            </span>

                        </div>

                    </div>

                    <div className="resource-card">

                        <FiBriefcase />

                        <div>

                            <h4>

                                CV Templates

                            </h4>

                            <span>

                                Career

                            </span>

                        </div>

                    </div>

                    <div className="resource-card">

                        <FiDownload />

                        <div>

                            <h4>

                                Relocation Kit

                            </h4>

                            <span>

                                Bundle

                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

};

export default Hero;