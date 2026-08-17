import "./SuccessStories.css";

import {
    HiOutlineArrowRight,
    HiOutlineLocationMarker,
    HiOutlineCheckCircle,
    HiOutlineChatAlt2,
} from "react-icons/hi";

import { Link } from "react-router-dom";

import successStory01Image from "../../../../assets/images/success-stories/success-story-01.png";
import successStory02Image from "../../../../assets/images/success-stories/success-story-02.png";
import successStory03Image from "../../../../assets/images/success-stories/success-story-03.png";


const stories = [

    {
        id: "01",

        name: "David O.",

        country: "Canada PR",

        location: "Canada",

        outcome: "Express Entry Approval",

        category: "PERMANENT RESIDENCE",

        text:
            "I had no idea where to start. They guided my profile, improved my eligibility, and I got invited within months.",

        image: successStory01Image,

        accent: "blue",
    },


    {
        id: "02",

        name: "Aisha K.",

        country: "UK Work Visa",

        location: "United Kingdom",

        outcome: "Skilled Worker Visa",

        category: "WORK VISA",

        text:
            "The process was smooth and clear. My application was structured perfectly and approved without delays.",

        image: successStory02Image,

        accent: "purple",
    },


    {
        id: "03",

        name: "Michael T.",

        country: "Germany",

        location: "Germany",

        outcome: "Job Seeker Visa",

        category: "CAREER MOBILITY",

        text:
            "I was struggling alone before. Their support helped me secure interviews and relocation approval.",

        image: successStory03Image,

        accent: "cyan",
    },

];


const SuccessStories = () => {

    return (

        <section
            className="ss"
            aria-labelledby="success-stories-title"
        >

            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div
                className="ss__background"
                aria-hidden="true"
            >

                <div className="ss__background-glow ss__background-glow--one"></div>

                <div className="ss__background-glow ss__background-glow--two"></div>

                <div className="ss__background-grid"></div>

            </div>



            <div className="container ss__container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="ss__header">

                    <span className="ss__tag">

                        <span className="ss__tag-dot"></span>

                        SUCCESS STORIES

                    </span>


                    <h2 id="success-stories-title">

                        Real People.

                        <span>
                            Real Results.
                        </span>

                    </h2>


                    <p>

                        These are clients who successfully completed
                        their immigration journey with our guidance.

                    </p>

                </header>



                {/* =================================================
                    TRUST STRIP
                ================================================= */}

                <div className="ss__trust">

                    <div className="ss__trust-item">

                        <HiOutlineCheckCircle />

                        <span>
                            Verified client journeys
                        </span>

                    </div>


                    <div className="ss__trust-divider"></div>


                    <div className="ss__trust-item">

                        <HiOutlineCheckCircle />

                        <span>
                            Professional guidance
                        </span>

                    </div>


                    <div className="ss__trust-divider"></div>


                    <div className="ss__trust-item">

                        <HiOutlineCheckCircle />

                        <span>
                            Global destinations
                        </span>

                    </div>

                </div>



                {/* =================================================
                    STORY CARDS
                ================================================= */}

                <div className="ss__grid">


                    {stories.map((story, index) => (

                        <article
                            key={story.id}
                            className={`ss__card ss__card--${story.accent}`}
                            style={{
                                "--story-index": index,
                            }}
                        >


                            {/* =================================================
                                CARD ATMOSPHERE
                            ================================================= */}

                            <div
                                className="ss__card-background"
                                aria-hidden="true"
                            >

                                <div className="ss__card-grid"></div>

                                <div className="ss__card-light"></div>

                            </div>



                            {/* =================================================
                                TOP RIGHT IMAGE
                            ================================================= */}

                            <div className="ss__visual">

                                <div className="ss__visual-image">

                                    <img
                                        src={story.image}
                                        alt=""
                                        loading={
                                            index === 0
                                                ? "eager"
                                                : "lazy"
                                        }
                                    />

                                </div>


                                <div className="ss__visual-glow"></div>


                                <span className="ss__visual-number">

                                    {story.id}

                                </span>

                            </div>



                            {/* =================================================
                                CARD TOP
                            ================================================= */}

                            <div className="ss__card-top">


                                <span className="ss__category">

                                    {story.category}

                                </span>


                                <div className="ss__destination">

                                    <HiOutlineLocationMarker />

                                    {story.location}

                                </div>


                            </div>



                            {/* =================================================
                                CLIENT
                            ================================================= */}

                            <div className="ss__identity">


                                <div className="ss__avatar">

                                    {story.name
                                        .split(" ")
                                        .map(part => part[0])
                                        .join("")
                                    }

                                </div>


                                <div className="ss__identity-info">

                                    <h3>
                                        {story.name}
                                    </h3>

                                    <span>
                                        {story.country}
                                    </span>

                                </div>


                                <div className="ss__verified">

                                    <HiOutlineCheckCircle />

                                </div>


                            </div>



                            {/* =================================================
                                OUTCOME
                            ================================================= */}

                            <div className="ss__outcome">

                                <span className="ss__outcome-line"></span>

                                <span>
                                    {story.outcome}
                                </span>

                            </div>



                            {/* =================================================
                                QUOTE
                            ================================================= */}

                            <div className="ss__quote">

                                <HiOutlineChatAlt2 />

                                <p>
                                    “{story.text}”
                                </p>

                            </div>



                            {/* =================================================
                                CARD FOOTER
                            ================================================= */}

                            <div className="ss__card-footer">

                                <div>

                                    <span className="ss__footer-label">
                                        SUCCESS STORY
                                    </span>

                                    <span className="ss__footer-status">
                                        Journey completed
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="ss__read-more"
                                    aria-label={`View ${story.name}'s success story`}
                                >

                                    <HiOutlineArrowRight />

                                </button>

                            </div>



                            {/* =================================================
                                CARD ACCENT
                            ================================================= */}

                            <div
                                className="ss__card-accent"
                                aria-hidden="true"
                            ></div>


                        </article>

                    ))}


                </div>



                {/* =================================================
                    CTA
                ================================================= */}

                <div className="ss__cta">


                    <div className="ss__cta-content">

                        <span className="ss__cta-label">

                            YOUR STORY COULD BE NEXT

                        </span>


                        <h3>

                            Ready to start your

                            <span>
                                global journey?
                            </span>

                        </h3>


                        <p>

                            Take the first step and discover
                            which pathway could be right for you.

                        </p>

                    </div>



                    <Link
                        to="/free-assessment"
                        className="ss__cta-button"
                    >

                        Start Your Assessment

                        <HiOutlineArrowRight />

                    </Link>


                </div>


            </div>



            <div
                className="ss__bottom-fade"
                aria-hidden="true"
            ></div>

        </section>

    );

};


export default SuccessStories;