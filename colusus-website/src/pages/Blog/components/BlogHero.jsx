
import {
    ArrowUpRight,
    Sparkles,
} from "lucide-react";

import journeyGlobe from "../../../assets/images/colusus-journey-globe.png";

import "./BlogHero.css";

const BlogHero = () => {
    const marqueeItems = [
        {
            text: "Migration stories",
            active: true,
        },
        {
            text: "Opportunities",
        },
        {
            text: "Country guides",
        },
        {
            text: "Visa & eligibility",
        },
        {
            text: "Study & work",
        },
        {
            text: "Real journeys",
        },
    ];

    return (
        <section
            className="blog-hero"
            aria-labelledby="blog-hero-title"
        >
            <div className="blog-hero__marquee">
                <div className="blog-hero__marquee-track">
                    {[
                        ...marqueeItems,
                        ...marqueeItems,
                    ].map(
                        (
                            item,
                            index,
                        ) => (
                            <div
                                className="blog-hero__marquee-item"
                                key={`${item.text}-${index}`}
                            >
                                {item.active && (
                                    <span
                                        className="blog-hero__marquee-dot"
                                        aria-hidden="true"
                                    />
                                )}

                                <span>
                                    {item.text}
                                </span>

                                {!item.active && (
                                    <ArrowUpRight
                                        size={13}
                                        strokeWidth={
                                            1.8
                                        }
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                        ),
                    )}
                </div>
            </div>

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

            <div className="blog-hero__inner">
                <div className="blog-hero__topline">
                    <div className="blog-hero__identity">
                        <span className="blog-hero__journal">
                            <Sparkles
                                size={13}
                                strokeWidth={1.8}
                            />

                            <span>
                                Colossus Journal
                            </span>
                        </span>

                        <span
                            className="blog-hero__separator"
                            aria-hidden="true"
                        />

                        <span>
                            Migration intelligence
                        </span>
                    </div>

                    <span className="blog-hero__edition">
                        Stories · Guides · Insights
                    </span>
                </div>

                <div className="blog-hero__content">
                    <div className="blog-hero__copy">
                        <span className="blog-hero__eyebrow">
                            The Colossus Journal
                        </span>

                        <h1
                            id="blog-hero-title"
                            className="blog-hero__title"
                        >
                            The world is
                            <span>
                                bigger than home.
                            </span>
                        </h1>
                    </div>

                    <div className="blog-hero__intro">
                        <p>
                            Migration knowledge,
                            opportunities and real
                            stories for people
                            planning what comes next.
                        </p>

                        <span className="blog-hero__scroll">
                            Explore the stories

                            <ArrowUpRight
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogHero;
