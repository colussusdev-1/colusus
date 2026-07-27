import "./Hero.css";

import { FiSearch } from "react-icons/fi";

const Hero = () => {

    return (

        <section className="blog-hero">

            <div className="blog-hero-container">

                <span className="blog-badge">

                    Migration & Global Opportunities

                </span>

                <h1 className="blog-title">

                    Insights, Guides & Global Updates

                </h1>

                <p className="blog-description">

                    Explore immigration updates, career advice,
                    international business opportunities and travel
                    insights from our experts.

                </p>

                <div className="blog-search">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search articles..."
                    />

                </div>

            </div>

        </section>

    );

};

export default Hero;