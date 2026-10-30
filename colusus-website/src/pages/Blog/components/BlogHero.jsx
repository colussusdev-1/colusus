import { ArrowUpRight } from "lucide-react";

import journeyGlobe from "../../../assets/images/colusus-journey-globe.png";

import "./BlogHero.css";


const BlogHero = () => {

    const marqueeItems = [
        "Migration stories",
        "Opportunities",
        "Country guides",
        "Visa & eligibility",
        "Study & work",
        "Real journeys",
    ];


    return (

        <section
            className="blog-hero"
            aria-labelledby="blog-hero-title"
        >

            {/* =================================================
                MOVING TOPIC STRIP
            ================================================= */}

            <div className="blog-hero__marquee">

                <div className="blog-hero__marquee-track">

                    {[
                        ...marqueeItems,
                        ...marqueeItems,
                    ].map((item, index) => (

                        <div
                            className="blog-hero__marquee-item"
                            key={`${item}-${index}`}
                        >

                            <span>
                                {item}
                            </span>

                            <span
                                className="blog-hero__marquee-dot"
                                aria-hidden="true"
                            />

                        </div>

                    ))}

                </div>

            </div>


            {/* =================================================
                BACKGROUND SCENE
            ================================================= */}

            <div
                className="blog-hero__scene"
                aria-hidden="true"
            >

                <div className="blog-hero__glow blog-hero__glow--one" />

                <div className="blog-hero__glow blog-hero__glow--two" />

                <div className="blog-hero__glow blog-hero__glow--three" />


                <img
                    src={journeyGlobe}
                    alt=""
                    className="blog-hero__globe"
                    loading="eager"
                    decoding="async"
                />


                <div className="blog-hero__scene-wash" />

                <div className="blog-hero__flight-line" />

            </div>



            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="blog-hero__inner">


                {/* TOP BAR */}

                <div className="blog-hero__topline">

                    <span className="blog-hero__journal">
                        Colossus Journal
                    </span>


                    <span className="blog-hero__edition">
                        Stories · Guides · Insights
                    </span>

                </div>



                {/* HERO CONTENT */}

                <div className="blog-hero__content">


                    <div className="blog-hero__copy">

                        <h1
                            id="blog-hero-title"
                            className="blog-hero__title"
                        >

                            The world is

                            <span>
                                bigger than home.
                            </span>

                        </h1>


                        <div className="blog-hero__title-line" />

                    </div>



                    <div className="blog-hero__intro">

                        <p>

                            Discover international opportunities,
                            understand migration pathways and learn
                            from real journeys. Everything you need
                            to make more informed decisions about
                            your next chapter.

                        </p>


                        <a
                            href="#blog-content"
                            className="blog-hero__scroll"
                        >

                            <span>
                                Explore the stories
                            </span>

                            <ArrowUpRight
                                size={17}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                        </a>

                    </div>


                </div>


                {/* BOTTOM INFORMATION */}

                <div className="blog-hero__bottom">

                    <span>
                        Knowledge for your next move.
                    </span>

                    <span>
                        Connecting African talent to global opportunities.
                    </span>

                </div>


            </div>

        </section>

    );

};


export default BlogHero;